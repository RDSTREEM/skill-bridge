import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getUserProfile } from '@/services/userService';

// POST /api/challenges/[id]/submit
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const challengeId = params.id;
    const { studentId, evidence, links } = await req.json();
    if (!studentId || !evidence) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    // Fetch username for the student
    let username = studentId;
    try {
      const profile = await getUserProfile(studentId);
      if (profile && profile.username) username = profile.username;
    } catch {}
    // Store submission in 'submissions' collection with doc ID = studentId (one per student per challenge)
    const submissionRef = doc(db, 'submissions', `${challengeId}_${studentId}`);
    await setDoc(submissionRef, {
      challengeId,
      userId: studentId,
      username,
      evidence,
      links: links || [],
      status: 'submitted',
      createdAt: serverTimestamp(),
    });
    // Optionally: Notify mentor here (e.g., via email or notification system)
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Submission failed' }, { status: 500 });
  }
}
