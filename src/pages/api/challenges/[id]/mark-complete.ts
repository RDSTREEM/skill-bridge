
import type { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { id: challengeId, studentId } = req.query;
    if (!challengeId || !studentId) {
      return res.status(400).json({ error: 'Missing challengeId or studentId in URL' });
    }
    // Mark submission as complete (create if missing)
    const submissionId = `${challengeId}_${studentId}`;
    const submissionRef = db.collection('submissions').doc(submissionId);
    const submissionSnap = await submissionRef.get();
    if (!submissionSnap.exists) {
      // Create the submission document with minimal info
      await submissionRef.set({
        id: submissionId,
        challengeId,
        userId: studentId,
        status: 'completed',
        completedAt: Date.now(),
        createdAt: Date.now(),
      });
    } else {
      await submissionRef.update({
        status: 'completed',
        completedAt: Date.now(),
      });
    }
    // Increment challengesCompleted in certificate
    const certRef = db.collection('certificates').doc(`main-${studentId}`);
    const certSnap = await certRef.get();
    if (certSnap.exists) {
      const prev = certSnap.data()?.challengesCompleted || 0;
      await certRef.update({ challengesCompleted: prev + 1 });
    }
  // Create a challenge completion certificate
    const challengeSnap = await db.collection('challenges').doc(challengeId as string).get();
    const challenge = challengeSnap.data();
    const userSnap = await db.collection('users').doc(studentId as string).get();
    const user = userSnap.data();
    const certId = `challenge-${challengeId}-${studentId}`;
    await db.collection('certificates').doc(certId).set({
      id: certId,
      userId: studentId,
      type: 'challenge',
      createdAt: Date.now(),
      username: user?.username || user?.email,
      email: user?.email,
      challengeId,
      challengeTitle: challenge?.title,
      status: 'Completed',
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
