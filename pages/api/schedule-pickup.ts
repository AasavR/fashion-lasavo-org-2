import type { NextApiRequest, NextApiResponse } from 'next'
import { Queue } from 'bullmq'
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method !== 'POST') return res.status(405).end()
  const { lat, lng, productId, userId } = req.body || {}
  if(!lat || !lng) return res.status(400).send('lat/lng required')
  try{
    const queue = new Queue('schedule-pickup', { connection: { url: REDIS_URL } })
    const job = await queue.add('schedule', { lat, lng, productId, userId })
    return res.status(200).json({ ok:true, jobId: job.id })
  }catch(e){
    console.error(e)
    return res.status(500).json({ ok:false, error: e.message })
  }
}
