import type { NextApiRequest, NextApiResponse } from 'next'
import db from '../../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method !== 'POST') return res.status(405).end()
  const { phone } = req.body || {}
  if(!phone) return res.status(400).send('phone required')
  // Generate a 6-digit code
  const code = (Math.floor(100000 + Math.random()*900000)).toString()
  const expiresAt = new Date(Date.now() + 5*60*1000).toISOString() // 5 minutes
  try{
    await db.query(`INSERT INTO otps(phone, code, expires_at) VALUES($1,$2,$3) ON CONFLICT (phone) DO UPDATE SET code = EXCLUDED.code, expires_at = EXCLUDED.expires_at`, [phone, code, expiresAt])
    // In production, send code via Twilio or Firebase. For now log.
    console.log('OTP for', phone, code)
    return res.status(200).json({ ok:true, message: 'otp-sent (demo - delivered via server logs)' })
  }catch(e){
    console.error(e)
    return res.status(500).json({ ok:false, error: e.message })
  }
}
