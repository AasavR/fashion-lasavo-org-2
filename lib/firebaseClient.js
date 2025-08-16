// Optional Firebase bootstrap — enable by setting NEXT_PUBLIC_FIREBASE_CONFIG to a JSON string.
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export function initFirebase() {
  try {
    const configStr = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;
    if (!configStr) return { db: null, auth: null };
    const config = JSON.parse(configStr);
    const app = getApps().length ? getApps()[0] : initializeApp(config);
    const db = getFirestore(app);
    const auth = getAuth(app);
    return { db, auth };
  } catch (e) {
    console.error('Firebase init error', e);
    return { db: null, auth: null };
  }
}
