'use client';
import { useAuth } from '@/lib/auth-context';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import Link from 'next/link';


interface Submission { id: string; challengeId: string; status: string; feedback?: string; latestFileUrl?: string; }
interface Certificate { id: string; userId: string; challengeId: string; url: string; createdAt: any; }


export default function Dashboard() {
const { user } = useAuth();
const [subs, setSubs] = useState<Submission[]>([]);
const [certs, setCerts] = useState<Certificate[]>([]);


useEffect(() => {
if (!user) return;
const q1 = query(collection(db, 'submissions'), where('userId', '==', user.uid), orderBy('createdAt','desc'));
const unsub1 = onSnapshot(q1, snap => setSubs(snap.docs.map(d=>({ id: d.id, ...(d.data() as any) }))));


const q2 = query(collection(db, 'certificates'), where('userId', '==', user.uid), orderBy('createdAt','desc'));
const unsub2 = onSnapshot(q2, snap => setCerts(snap.docs.map(d=>({ id: d.id, ...(d.data() as any) }))));


return () => { unsub1(); unsub2(); };
}, [user]);


return (
<div className="space-y-8">
<section>
<h1 className="text-2xl font-bold">Your Submissions</h1>
<div className="mt-4 grid gap-3">
{subs.length === 0 && <p className="text-sm text-gray-500">No submissions yet. Browse <Link className="underline" href="/challenges">challenges</Link>.</p>}
{subs.map(s => (
<div key={s.id} className="rounded-xl border p-4 bg-white">
<p className="font-medium">Challenge: <Link href={`/challenges/${s.challengeId}`} className="underline">{s.challengeId}</Link></p>
<p className="text-sm">Status: <span className="font-semibold">{s.status}</span></p>
{s.feedback && <p className="text-sm text-gray-600">Feedback: {s.feedback}</p>}
{s.latestFileUrl && <a className="text-sm underline" href={s.latestFileUrl} target="_blank">View latest upload</a>}
</div>
))}
</div>
</section>


<section>
<h2 className="text-xl font-bold">Certificates</h2>
<div className="mt-4 grid gap-3">
{certs.length === 0 && <p className="text-sm text-gray-500">No certificates yet.</p>}
{certs.map(c => (
<div key={c.id} className="rounded-xl border p-4 bg-white">
<p className="font-medium">Challenge: <Link href={`/challenges/${c.challengeId}`} className="underline">{c.challengeId}</Link></p>
<a className="text-sm underline" href={c.url} target="_blank">Download certificate</a>
</div>
))}
</div>
</section>
</div>
);