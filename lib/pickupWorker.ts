import { Worker } from 'bullmq'
import fetch from 'node-fetch'
import db from '../../lib/db'
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

const worker = new Worker('schedule-pickup', async job => {
  const { lat, lng, productId, userId } = job.data
  // Basic logic: if GOOGLE_MAPS_KEY present, call Places, else mock assignment
  const googleKey = process.env.GOOGLE_MAPS_KEY
  if(googleKey){
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=20000&keyword=delivery&key=${googleKey}`
    const r = await fetch(url)
    const j = await r.json()
    const candidate = (j.results||[])[0]
    if(candidate){
      // create pickups record
      await db.query('INSERT INTO pickups (product_id, user_id, scheduled_at, assigned_courier, status) VALUES ($1,$2,$3,$4,$5)', [productId || null, userId || null, new Date(), { name: candidate.name, place_id: candidate.place_id }, 'assigned'])
      return { assigned: candidate.name }
    }
  }
  // fallback mocked
  await db.query('INSERT INTO pickups (product_id, user_id, scheduled_at, assigned_courier, status) VALUES ($1,$2,$3,$4,$5)', [productId || null, userId || null, new Date(), { name: 'Mock Genie' }, 'assigned'])
  return { assigned: 'Mock Genie' }
}, { connection: { url: REDIS_URL } })

worker.on('completed', job => {
  console.log('job completed', job.id)
})
worker.on('failed', (job, err) => {
  console.error('job failed', job?.id, err)
})
