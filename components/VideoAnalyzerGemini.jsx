'use client';
import { useEffect, useRef, useState } from 'react';
import { designerDNA } from '../lib/designerDNA';
import { initFirebase } from '../lib/firebaseClient';
import { addDoc, collection, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';

export default function VideoAnalyzerGemini() {
  const [apiKey, setApiKey] = useState('');
  const [userId, setUserId] = useState('anonymous');
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [outputHtml, setOutputHtml] = useState('');
  const [past, setPast] = useState([]);
  const videoRef = useRef(null);

  // Firebase (optional)
  const { db, auth } = initFirebase();
  useEffect(()=>{
    if (!auth) return;
    onAuthStateChanged(auth, async (user)=>{
      if (user) setUserId(user.uid);
      else await signInAnonymously(auth);
    });
  },[auth]);

  useEffect(()=>{
    if (!db) return;
    const col = collection(db, 'artifacts/default-app/public/data/darzy_analyses');
    return onSnapshot(col, (snap)=>{
      const arr = [];
      snap.forEach(doc=>arr.push({id:doc.id, ...doc.data()}));
      setPast(arr.sort((a,b)=> (b.timestamp?.seconds||0)-(a.timestamp?.seconds||0)));
    });
  },[db]);

  const handleFile = (f) => {
    setFile(f || null);
    if (f) {
      const url = URL.createObjectURL(f);
      if (videoRef.current) videoRef.current.src = url;
    }
  };

  const analyze = async () => {
    if (!file) return;
    if (!apiKey) { alert('Please enter your Gemini API key'); return; }
    if (file.size > 20 * 1024 * 1024) { alert('Please select a video under 20MB.'); return; }
    setBusy(true);
    try {
      const base64 = await new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.onload = ()=> resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const prompt = "Analyze the clothing items in this video. For each distinct item, identify its type (e.g., saree, dress, shirt), overall style (e.g., traditional, modern, casual, formal), main colors, fabric type, and any prominent patterns. Provide a brief overall description for each item. Respond in JSON with key 'analysis' as an array of objects having fields item, style, colors[], fabric, patterns[], description.";
      const payload = {
        contents: [{
          role: "user",
          parts: [{ text: prompt }, { inlineData: { mimeType: file.type, data: base64 } }]
        }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              analysis: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    item: { type: "STRING" },
                    style: { type: "STRING" },
                    colors: { type: "ARRAY", items: { type: "STRING" } },
                    fabric: { type: "STRING" },
                    patterns: { type: "ARRAY", items: { type: "STRING" } },
                    description: { type: "STRING" }
                  },
                  required: ["item","style","colors","fabric","patterns","description"]
                }
              }
            },
            required: ["analysis"]
          }
        }
      };
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      let jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!jsonText) throw new Error(result?.error?.message || "No response");
      let parsed;
      try { parsed = JSON.parse(jsonText); }
      catch(e){ parsed = { rawOutput: jsonText }; }
      if (parsed.analysis?.length) {
        const recs = designerDNA(parsed.analysis.map(a => ({
          item: a.item,
          colors: a.colors,
          fabric: a.fabric,
          style: a.style,
          estimatedLengthMeters: 1.1
        })));
        const html = parsed.analysis.map((a,i)=>`
          <div class='analysis-item bg-white/5 border border-white/10 rounded-xl p-4 my-2'>
            <h4 class='font-bold text-lg'>Item: ${a.item}</h4>
            <p><b>Style:</b> ${a.style}</p>
            <p><b>Colors:</b> ${(a.colors||[]).join(', ')}</p>
            <p><b>Fabric:</b> ${a.fabric}</p>
            <p><b>Patterns:</b> ${(a.patterns||[]).join(', ')}</p>
            <p><b>Description:</b> ${a.description}</p>
            <p><b>Designer DNA Suggestion:</b> ${recs[i]?.recommendedForm || ''}</p>
          </div>
        `).join('');
        setOutputHtml(html);
        if (db) {
          try {
            await addDoc(collection(db, 'artifacts/default-app/public/data/darzy_analyses'), {
              userId,
              analysis: parsed.analysis,
              timestamp: serverTimestamp()
            });
          } catch(e){ console.error('Firestore add error', e); }
        }
      } else {
        setOutputHtml(`<p class='text-gray-400'>Raw Output:</p><pre class='text-xs whitespace-pre-wrap'>${jsonText}</pre>`);
        if (db) {
          try {
            await addDoc(collection(db, 'artifacts/default-app/public/data/darzy_analyses'), {
              userId,
              rawOutput: jsonText,
              timestamp: serverTimestamp()
            });
          } catch(e){}
        }
      }
    } catch(e) {
      setOutputHtml(`<p class='text-red-400'>Error: ${e.message}</p>`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id="video" className="section py-14">
      <h2 className="text-3xl font-extrabold mb-4">Wardrobe Video Analysis</h2>
      <div className="card p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-white/70">Gemini API Key</label>
            <input type="password" className="w-full bg-transparent outline-none px-3 py-2 rounded-lg border border-white/10"
              placeholder="Enter your Gemini API key" value={apiKey} onChange={e=>setApiKey(e.target.value)} />
          </div>
          <div className="text-sm text-white/60">User ID: <span className="font-semibold">{userId}</span></div>
        </div>
        <div>
          <label className="text-sm text-white/70">Select Video (≤ 1 min, ≤ 20MB)</label>
          <input type="file" accept="video/*" className="block w-full text-sm mt-1"
            onChange={e=>handleFile(e.target.files?.[0])} />
        </div>
        <video ref={videoRef} controls className="w-full rounded-xl border border-white/10 max-h-80 object-contain" />
        <button disabled={!file || busy} onClick={analyze} className="btn btn-gold w-full">
          {busy ? 'Analyzing…' : 'Analyze Video'}
        </button>
        <div id="analysisOutput" className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{__html:outputHtml}} />
      </div>

      <div className="card p-6 mt-6">
        <h3 className="text-xl font-bold mb-3">Past Analyses</h3>
        {!db && <p className="text-white/50 text-sm mb-2">Connect Firebase by setting <code>NEXT_PUBLIC_FIREBASE_CONFIG</code> to enable history.</p>}
        {db && (past.length === 0 ? <p className="text-white/50">No past analyses found.</p> :
          <div className="space-y-3">
            {past.map(p=>(
              <div key={p.id} className="border border-white/10 rounded-lg p-3">
                <div className="text-xs text-white/50">{p.timestamp?.toDate?.().toString?.() || ''}</div>
                {p.analysis ? <div className="text-sm text-white/80">
                  {p.analysis.map((a,i)=>(
                    <div key={i} className="my-2">
                      <div className="font-semibold">Item: {a.item}</div>
                      <div>Style: {a.style} | Fabric: {a.fabric}</div>
                    </div>
                  ))}
                </div> : <pre className="text-xs whitespace-pre-wrap">{p.rawOutput}</pre>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
