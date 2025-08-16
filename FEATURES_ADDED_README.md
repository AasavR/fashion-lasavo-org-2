Production-hardening applied (scaffold).

Key changes:
- Postgres integration: lib/db.ts + migrations in db/migrations/init.sql
- OTP storage moved from /tmp file to `otps` Postgres table (send-otp -> otps insert)
- verify-otp now validates OTP from DB, creates user row, issues JWT cookie
- Activities persisted to `activities` table (pages/api/activity.ts)
- schedule-pickup enqueues BullMQ job; worker skeleton at lib/pickupWorker.ts
- generate-tags persists tags to products table when productId provided

Environment variables required:
- DATABASE_URL (Postgres connection string)
- JWT_SECRET
- REDIS_URL (for BullMQ workers)
- GOOGLE_MAPS_KEY (optional - for real Places lookup)
- GEMINI_KEY (optional - for real auto-tagging)

Run migrations:
$ export DATABASE_URL='postgres://user:pass@host:port/dbname'
$ npm run migrate

Run dev server:
$ npm install
$ npm run dev

Run worker (requires Redis):
$ npm run worker

Security notes:
- Replace placeholder Gemini API call with official client/shape.
- Use secure secrets manager for env vars in production.
- Enforce rate-limits on OTP and activity endpoints.

