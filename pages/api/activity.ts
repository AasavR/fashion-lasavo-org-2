import type { NextApiRequest, NextApiResponse } from 'next'
import db from '../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method !== 'POST') return res.status(405).end()
  const { userId, type, payload } = req.body || {}
  if(!type || !payload) return res.status(400).send('type and payload required')
  try{
    await db.query('INSERT INTO activities (user_id, type, payload) VALUES ($1,$2,$3)', [userId || null, type, payload])
    return res.status(200).json({ ok:true })
  }catch(e){
    console.error(e)
    return res.status(500).json({ ok:false, error: e.message })
  }
}
