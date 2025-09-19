'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import Link from 'next/link';
import { ChallengeCard } from '@/components/challenge-card';


interface Challenge {
	id: string;
	title: string;
	description: string;
	imageUrl?: string;
	association: string;
	difficulty: 'beginner' | 'intermediate' | 'experienced';
	submissionDeadline?: number;
}


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
				<div className="mt-2 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
								{filtered.map(c => (
									<ChallengeCard
										key={c.id}
										challenge={{
											id: c.id,
											title: c.title,
											slug: c.id, // Use id as slug for detail page
											shortDescription: c.description,
											difficulty: c.difficulty === 'beginner' ? 'Beginner' : c.difficulty === 'intermediate' ? 'Intermediate' : 'Advanced',
											estimatedHours: 0,
											tags: [],
											organization: c.association,
										}}
										variant="default"
										showLoginNote={false}
									/>
								))}
				</div>
			</div>
		</>
	);
}