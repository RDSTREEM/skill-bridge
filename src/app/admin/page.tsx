'use client';
import { collection, onSnapshot, query, where, doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db, functions } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { useAuth } from '@/lib/auth-context';


interface Submission { id: string; userId: string; challengeId: string; latestFileUrl: string; status: string; }


export default function AdminPage() {
const { token } = useAuth();
const [subs, setSubs] = useState<Submission[]>([]);


useEffect(() => {
if (!token?.claims?.role || token.claims.role !== 'admin') return;
const q = query(collection(db, 'submissions'), where('status', 'in', ['submitted','needs_revision']));
return onSnapshot(q, snap => setSubs(snap.docs.map(d=>({ id: d.id, ...(d.data() as any) }))));
}, [token]);


const setStatus = async (id: string, status: 'approved' | 'needs_revision') => {
await updateDoc(doc(db, 'submissions', id), { status, updatedAt: serverTimestamp() });
if (status === 'approved') {
const approveFn = httpsCallable(functions, 'generateCertificateForSubmission');
const sub = await getDoc(doc(db, 'submissions', id));
await approveFn({ submissionId: id, userId: (sub.data() as any).userId, challengeId: (sub.data() as any).challengeId });
alert('Approved and certificate requested.');
}
};


if (!token?.claims?.role || token.claims.role !== 'admin') return <p>Admins only.</p>;


return (
<div>
<h1 className="text-2xl font-bold">Admin Review</h1>
<div className="mt-6 grid gap-4">
{subs.map(s => (
<div key={s.id} className="rounded-xl border p-4 bg-white">
<p><span className="font-medium">Submission:</span> {s.id}</p>
<p><span className="font-medium">Challenge:</span> {s.challengeId}</p>
<a className="underline" href={s.latestFileUrl} target="_blank">View file</a>
<div className="mt-3 flex gap-2">
<button onClick={()=>setStatus(s.id, 'approved')} className="px-3 py-2 rounded bg-green-600 text-white">Approve</button>
<button onClick={()=>setStatus(s.id, 'needs_revision')} className="px-3 py-2 rounded bg-yellow-500 text-black">Needs Revision</button>
</div>
</div>
))}
</div>
</div>
);
}