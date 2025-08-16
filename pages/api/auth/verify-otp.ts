import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import db from '../../../lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method !== 'POST') return res.status(405).end()
  const { phone, code } = req.body || {}
  if(!phone || !code) return res.status(400).send('phone and code required')
  try{
    const r = await db.query('SELECT code, expires_at FROM otps WHERE phone = $1', [phone])
    if(r.rowCount === 0) return res.status(401).send('no otp requested')
    const row = r.rows[0]
    if(new Date(row.expires_at) < new Date()) return res.status(401).send('otp expired')
    if(row.code !== code) return res.status(401).send('invalid code')
    // create or get user
    let userRes = await db.query('SELECT id, phone FROM users WHERE phone = $1', [phone])
    let user
    if(userRes.rowCount === 0){
      const ins = await db.query('INSERT INTO users (phone) VALUES ($1) RETURNING id, phone', [phone])
      user = ins.rows[0]
    } else {
      user = userRes.rows[0]
    }
    // sign JWT and set cookie
    const token = jwt.sign({ id: user.id, phone: user.phone }, JWT_SECRET, { expiresIn: '7d' })
    res.setHeader('Set-Cookie', `session=${token}; HttpOnly; Path=/; Max-Age=${7*24*3600}`)
    // delete used otp
    await db.query('DELETE FROM otps WHERE phone = $1', [phone])
    return res.status(200).json({ ok:true, user })
  }catch(e){
    console.error(e)
    return res.status(500).json({ ok:false, error: e.message })
  }
}
