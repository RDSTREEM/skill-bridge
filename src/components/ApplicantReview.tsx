import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from './ui/Button';

interface Props {
  challengeId: string;
  applicants: string[];
  applicantsEssay?: Record<string, string>;
  applicantsStatus?: Record<string, 'accepted' | 'rejected' | 'pending'>;
  onDecision: (studentId: string, decision: 'accepted' | 'rejected') => void;
}

export default function ApplicantReview({ challengeId, applicants, applicantsEssay, applicantsStatus, onDecision }: Props) {
  const [users, setUsers] = useState<Record<string, { email: string; displayName?: string }> >({});

  useEffect(() => {
    async function fetchUsers() {
      const result: Record<string, { email: string; displayName?: string }> = {};
      for (const uid of applicants) {
        const snap = await getDoc(doc(db, 'users', uid));
        if (snap.exists()) {
          const d = snap.data();
          result[uid] = { email: d.email, displayName: d.displayName };
        }
      }
      setUsers(result);
    }
    if (applicants.length) fetchUsers();
  }, [applicants]);

  if (!applicants.length) return <p className="text-sm text-gray-500">No applicants yet.</p>;

  return (
    <div className="space-y-4 mt-4">
      {applicants.map(uid => (
        <div key={uid} className="border rounded p-3 bg-gray-50">
          <div className="font-semibold">{users[uid]?.displayName || users[uid]?.email || uid}</div>
          <div className="text-xs text-gray-500 mb-2">{users[uid]?.email}</div>
          <div className="mb-2"><span className="font-medium">Essay:</span> <span className="italic">{applicantsEssay?.[uid]}</span></div>
          <div className="flex gap-2 items-center">
            <span className="text-xs">Status: <b>{applicantsStatus?.[uid] || 'pending'}</b></span>
            <Button onClick={() => onDecision(uid, 'accepted')} disabled={applicantsStatus?.[uid] === 'accepted'}>Accept</Button>
            <Button onClick={() => onDecision(uid, 'rejected')} disabled={applicantsStatus?.[uid] === 'rejected'}>Reject</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
