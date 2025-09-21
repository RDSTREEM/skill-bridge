import type { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { sendDecisionEmail } from '@/services/emailService';
// Increment challengesAccepted in certificate if accepted
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
  const { id: challengeId } = req.query;
    const { studentId, decision } = req.body; // decision: 'accepted' | 'rejected'
    if (!challengeId) {
      return res.status(400).json({ error: 'Missing challengeId in URL' });
    }
    if (!studentId) {
      return res.status(400).json({ error: 'Missing studentId in body' });
    }
    if (!decision) {
      return res.status(400).json({ error: 'Missing decision in body' });
    }
    // Get challenge and student email
    const challengeSnap = await db.collection('challenges').doc(challengeId as string).get();
    if (!challengeSnap.exists) return res.status(404).json({ error: 'Challenge not found' });
    const challenge = challengeSnap.data();
    const userSnap = await db.collection('users').doc(studentId).get();
    if (!userSnap.exists) return res.status(404).json({ error: 'User not found' });
    const user = userSnap.data();
    // Update challenge doc with decision
    await db.collection('challenges').doc(challengeId as string).update({
      [`applicantsStatus.${studentId}`]: decision,
    });
    if (decision === 'accepted') {
      const certRef = db.collection('certificates').doc(`main-${studentId}`);
      const certSnap = await certRef.get();
      if (certSnap.exists) {
        const prev = certSnap.data()?.challengesAccepted || 0;
        await certRef.update({ challengesAccepted: prev + 1 });
      }
    }
    // Send email
    let customText = undefined;
    if (challenge && decision === 'accepted') {
      if (challenge.acceptEmail) {
        customText = challenge.acceptEmail;
      } else {
        customText = `Congratulations! You have been accepted to the challenge: ${challenge.title}.`;
      }
      if (challenge.telegram) {
        customText += `\n\nJoin the challenge group here: ${challenge.telegram}`;
      }
    } else if (challenge && decision === 'rejected' && challenge.rejectEmail) {
      customText = challenge.rejectEmail;
    }
    await sendDecisionEmail({
      to: user?.email ?? '',
      challengeTitle: challenge?.title ?? '',
      decision,
      customText,
    });
    return res.status(200).json({ success: true });
  } catch (error: unknown) {
    let errorMessage = 'Unknown error';
    if (error && typeof error === 'object' && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
      errorMessage = (error as { message: string }).message;
    }
    return res.status(500).json({ error: errorMessage });
  }
}
