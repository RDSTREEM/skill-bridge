import { db } from '@/lib/firebase';
import { doc, getDoc, collection } from 'firebase/firestore';
import Link from 'next/link';

async function getUserProfiles(uids: string[]) {
  const users: Record<string, { username: string; email: string }> = {};
  for (const uid of uids) {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      const d = snap.data();
      users[uid] = { username: d.username, email: d.email };
    }
  }
  return users;
}

export default async function ApplicantsListPage({ params }: { params: { id: string } }) {
  const challengeId = params.id;
  const challengeSnap = await getDoc(doc(db, 'challenges', challengeId));
  const challenge = challengeSnap.exists() ? challengeSnap.data() : null;
  const applicants = challenge?.applicants || [];
  const users = applicants.length ? await getUserProfiles(applicants) : {};

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Applicants for Challenge</h1>
      <ul className="space-y-2">
        {applicants.length === 0 && <li className="text-gray-500">No applicants yet.</li>}
        {applicants.map((uid: string) => (
          <li key={uid}>
            <Link href={`./applicants/${uid}`} className="block p-3 border rounded hover:bg-gray-100">
              <div className="font-semibold">{users[uid]?.username || uid}</div>
              <div className="text-xs text-gray-500">{users[uid]?.email}</div>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/dashboard" className="text-blue-600 mt-6 inline-block">&larr; Back to Dashboard</Link>
    </div>
  );
}
