'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import Link from 'next/link';


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
							<div key={c.id} className="rounded-2xl shadow-xl border border-gray-200 bg-gradient-to-br from-white via-blue-50 to-yellow-50 p-0 flex flex-col hover:scale-[1.02] transition-transform">
								{c.imageUrl && (
									<img src={c.imageUrl} alt={c.title} className="w-full h-40 object-cover rounded-t-2xl" />
								)}
								<div className="p-5 flex flex-col flex-1">
									<div className="flex items-center justify-between mb-2">
										<span className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-700">{c.association}</span>
														<span className={`text-xs font-bold px-2 py-1 rounded ${
															c.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
															c.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
															c.difficulty === 'experienced' ? 'bg-red-100 text-red-700' :
															'bg-gray-200 text-gray-600'
														}`}>
															{c.difficulty
																? c.difficulty.charAt(0).toUpperCase() + c.difficulty.slice(1)
																: 'Unknown'}
														</span>
									</div>
									<h3 className="font-semibold text-lg mb-1 text-primary">{c.title}</h3>
									<p className="text-sm text-gray-700 mb-2 line-clamp-3">{c.description}</p>
									{c.submissionDeadline && (
										<div className="text-xs text-gray-500 mb-2">Deadline: {new Date(c.submissionDeadline).toLocaleDateString()}</div>
									)}
									<div className="mt-auto flex justify-end">
										<Link href={`/challenges/${c.id}`} className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold shadow hover:from-blue-700 hover:to-green-600 transition-all">
											Apply to this challenge
										</Link>
									</div>
								</div>
							</div>
						))}
					</div>
			</div>
		</>
	);
}