'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import Link from 'next/link';


interface Challenge { id: string; title: string; description: string; level?: string; }


import { Navbar } from '@/components/Navbar';

export default function ChallengesPage() {
	const [list, setList] = useState<Challenge[]>([]);

	useEffect(() => {
		const q = query(collection(db, 'challenges'), orderBy('createdAt','desc'));
		return onSnapshot(q, snap => setList(snap.docs.map(d=>({ id: d.id, ...(d.data() as any) }))));
	}, []);

	return (
		<>
			<Navbar />
			<div>
				<h1 className="text-2xl font-bold">Browse Challenges</h1>
				<div className="mt-6 grid gap-4 md:grid-cols-2">
					{list.map(c => (
						<Link key={c.id} href={`/challenges/${c.id}`} className="block rounded-xl border p-4 bg-white hover:shadow">
							<h3 className="font-semibold text-lg">{c.title}</h3>
							<p className="text-sm text-gray-700 line-clamp-3">{c.description}</p>
						</Link>
					))}
				</div>
			</div>
		</>
	);
}