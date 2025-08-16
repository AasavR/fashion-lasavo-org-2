'use client';
import { useState } from 'react';
import { designerDNA } from '../lib/designerDNA';

export default function AIStylist() {
  const [input, setInput] = useState('ivory silk lehenga for sangeet, 1.3m');
  const [ideas, setIdeas] = useState(null);
  const [loading, setLoading] = useState(false);

  const parse = (text) => {
    const lower = text.toLowerCase();
    const colors = [];
    ['ivory','gold','black','red','pink','blue','green','beige'].forEach(c=>{ if(lower.includes(c)) colors.push(c)});
    let fabric = lower.includes('silk') ? 'silk' : (lower.includes('cotton') ? 'cotton' : 'mixed');
    let length = 1.2;
    const m = lower.match(/(\d+(?:\.\d+)?)\s*m/);
    if (m) length = parseFloat(m[1]);
    const item = lower.includes('lehenga') ? 'lehenga' : (lower.includes('saree') ? 'saree' : 'dress');
    const style = lower.includes('traditional') ? 'traditional' : 'contemporary';
    return [{ item, colors, fabric, style, estimatedLengthMeters: length }];
  };

  const go = async () => {
    setLoading(true);
    const recs = designerDNA(parse(input));
    setIdeas(recs);
    setLoading(false);
  };

  return (
    <section id="ai" className="section py-14">
      <h2 className="text-3xl font-extrabold mb-4">AI Stylist</h2>
      <p className="text-white/70 mb-6">Describe your garment and occasion. Designer DNA™ suggests couture-grade upgrades.</p>
      <div className="card p-4 flex gap-3">
        <input className="flex-1 bg-transparent outline-none px-3 py-2 rounded-lg border border-white/10"
          value={input} onChange={e=>setInput(e.target.value)} placeholder="e.g., black cotton saree, modern reception, 0.9m remnant"/>
        <button onClick={go} className="btn btn-gold">{loading?'Thinking…':'Get Ideas'}</button>
      </div>
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {ideas && ideas.map((it)=>(
          <div key={it.id} className="card p-6">
            <h3 className="text-xl font-bold mb-2 capitalize">{it.baseItem} → {it.recommendedForm}</h3>
            <p className="text-white/80 mb-2">Palette: {it.palette.join(', ')} • Fabric: {it.fabric}</p>
            <ul className="list-disc ml-5 text-white/80">{it.detailing.map((d,i)=><li key={i}>{d}</li>)}</ul>
            <p className="text-white/60 mt-3 text-sm">Turnaround: {it.turnaroundDays} days</p>
          </div>
        ))}
      </div>
    </section>
  );
}
