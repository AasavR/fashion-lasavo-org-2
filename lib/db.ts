import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://user:pass@localhost:5432/lasavo'
})

export async function query(text: string, params?: any[]) {
  const res = await pool.query(text, params)
  return res
}

export default pool
