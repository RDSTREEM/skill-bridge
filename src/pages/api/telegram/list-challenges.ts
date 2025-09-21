import type { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import fs from 'fs';

if (!getApps().length) {
  const serviceAccount = JSON.parse(
    fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH as string, 'utf8')
  );
  initializeApp({
    credential: cert(serviceAccount),
  });
}
const db = getFirestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const snap = await db.collection('challenges').get();
    const challenges = snap.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title,
    }));
    res.status(200).json({ challenges });
  } catch (error: unknown) {
    return res.status(500).json({ error: typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : String(error) });
  }
}
