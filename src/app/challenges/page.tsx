'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import Link from 'next/link';


interface Challenge { id: string; title: string; description: string; level?: string; }


import { Navbar } from '@/components/Navbar';

export default function ChallengesPage() {
	const [list, setList] = useState<Challenge[]>([]);
	const [search, setSearch] = useState('');
	const filtered = list.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

	useEffect(() => {
		const q = query(collection(db, 'challenges'), orderBy('createdAt','desc'));
		return onSnapshot(q, snap => setList(snap.docs.map(d=>({ id: d.id, ...(d.data() as any) }))));
	}, []);

	return (
		<>
			<Navbar />
			<div>
				<h1 className="text-2xl font-bold">Browse Challenges</h1>
				<input
					className="mt-4 mb-6 w-full max-w-md border rounded px-3 py-2"
					placeholder="Search by challenge name..."
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
				<div className="mt-2 grid gap-4 md:grid-cols-2">
					{filtered.map(c => (
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