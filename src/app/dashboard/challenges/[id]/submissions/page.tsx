import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';

interface Submission {
  id: string;
  userId: string;
  username?: string;
}

export default async function SubmissionsPage({ params }: { params: { id: string } }) {
  // Fetch all submissions for this challenge
  const q = query(collection(db, 'submissions'), where('challengeId', '==', params.id));
  const snap = await getDocs(q);
  const submissions: Submission[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Submissions</h1>
      {submissions.length === 0 ? (
        <p className="text-gray-500">No submissions yet.</p>
      ) : (
        <ul className="space-y-4">
          {submissions.map(sub => (
            <li key={sub.id} className="border rounded-lg p-4 bg-white shadow flex items-center justify-between">
              <span className="font-semibold">{sub.username ? sub.username : 'Unknown'}</span>
              <Link
                href={`/dashboard/challenges/${params.id}/submissions/${sub.id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                View Submission
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link href="/dashboard" className="inline-block mt-8 px-6 py-2 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary/90 transition">Back to Dashboard</Link>
    </div>
  );
}
