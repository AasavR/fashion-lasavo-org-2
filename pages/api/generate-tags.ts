import type { NextApiRequest, NextApiResponse } from 'next'
import db from '../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method !== 'POST') return res.status(405).end()
  const { title, description, productId } = req.body || {}
  if(!title && !description) return res.status(400).send('title/description required')
  const gemKey = process.env.GEMINI_KEY
  try{
    let tags = []
    if(gemKey){
      // This is a placeholder call shape to Gemini; adapt as needed to your Gemini API.
      const prompt = `Generate 6 comma-separated tags for: ${title} -- ${description}`
      const r = await fetch('https://api.labs.google.com/v1/generate', { method:'POST', headers: { 'Authorization': 'Bearer '+gemKey, 'Content-Type':'application/json' }, body: JSON.stringify({ prompt }) })
      const j = await r.json()
      // naive extraction
      if(j?.candidates?.length) tags = (j.candidates[0].content || '').split(/[,\n]+/).map(s=>s.trim()).filter(Boolean).slice(0,6)
      else tags = [title].filter(Boolean)
    } else {
      const words = ((title||'')+' '+(description||'')).toLowerCase().split(/\W+/).filter(Boolean)
      const freq = {}
      for(const w of words){ freq[w] = (freq[w]||0)+1 }
      tags = Object.keys(freq).sort((a,b)=>freq[b]-freq[a]).slice(0,6)
    }
    if(productId){
      await db.query('UPDATE products SET tags = $1 WHERE id = $2', [tags, productId])
    }
    return res.status(200).json({ ok:true, tags })
  }catch(e){
    console.error(e)
    return res.status(500).json({ ok:false, error: e.message })
  }
}
