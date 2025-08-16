# Lasavo — AI Couture (B2C)

A Next.js 14 site with Tailwind, couture-inspired design, **Designer DNA™** engine,
and **mobile-friendly wardrobe video analysis** via Gemini API.

## Quick Start
```bash
npm install
npm run dev
# open http://localhost:3000
```

### Optional: Enable Firestore history
Set `NEXT_PUBLIC_FIREBASE_CONFIG` in `.env.local` to your Firebase web app JSON (single-line).

### Gemini API
The video analyzer runs **locally in the browser** (no server key). Users paste their own API key in the UI.

## Deploy
- **Vercel**: one-click import, set optional env `NEXT_PUBLIC_FIREBASE_CONFIG`.
- **Netlify**: build command `next build`, publish `./.next` (use Next plugin).

> Note: Designer DNA™ here is a heuristic demo. Replace with your production logic when ready.
