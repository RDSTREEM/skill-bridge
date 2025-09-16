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
    const { name, id } = req.query;
    let challengeDoc = null;
    if (id) {
      const docSnap = await db.collection('challenges').doc(id as string).get();
      if (!docSnap.exists) return res.status(404).json({ error: 'Challenge not found' });
      challengeDoc = docSnap.data();
    } else if (name) {
      const snap = await db.collection('challenges').where('title', '==', name).get();
      if (snap.empty) return res.status(404).json({ error: 'Challenge not found' });
      challengeDoc = snap.docs[0].data();
    } else {
      return res.status(400).json({ error: 'Missing challenge id or name' });
    }
    res.status(200).json({
      title: challengeDoc.title,
      submissionDeadline: challengeDoc.submissionDeadline,
      rules: challengeDoc.description,
      prizes: challengeDoc.prizes || '',
      faq: challengeDoc.faq || [],
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
