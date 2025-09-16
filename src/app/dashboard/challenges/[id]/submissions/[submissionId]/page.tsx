import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

interface Submission {
  id: string;
  userId: string;
  username?: string;
  evidence: string;
  links: string[];
  status: string;
  createdAt: any;
}

export default async function SubmissionDetailPage({ params }: { params: { id: string; submissionId: string } }) {
  // Fetch the submission by ID
  const docRef = doc(db, 'submissions', params.submissionId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) {
    return <div className="max-w-xl mx-auto mt-10 text-center text-red-600">Submission not found.</div>;
  }
  const sub = { id: snap.id, ...(snap.data() as Submission) };
  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Submission by {sub.username ? sub.username : 'Unknown'}</h1>
      <div className="mb-4"><span className="font-medium">Evidence:</span> {sub.evidence}</div>
      {sub.links && sub.links.length > 0 && (
        <div className="mb-4">
          <span className="font-medium">Links:</span>
          <ul className="list-disc ml-6">
            {sub.links.map((l, i) => (
              <li key={i}><a href={l} className="underline text-blue-600" target="_blank" rel="noopener noreferrer">{l}</a></li>
            ))}
          </ul>
        </div>
      )}
      <div className="text-xs text-gray-400 mb-8">Status: {sub.status}</div>
      <Link href={`/dashboard/challenges/${params.id}/submissions`} className="inline-block px-6 py-2 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary/90 transition">Back to Submissions</Link>
    </div>
  );
}
