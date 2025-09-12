'use client';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { getUserProfile } from '@/services/userService';
import type { UserProfile } from '@/types/user';

interface Submission { id: string; challengeId: string; status: string; feedback?: string; latestFileUrl?: string; }
interface Certificate { id: string; userId: string; challengeId: string; url: string; createdAt: any; }

import { Navbar } from '@/components/Navbar';

export default function Dashboard() {
	const { user } = useAuth();
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [loadingProfile, setLoadingProfile] = useState(true);

	useEffect(() => {
		if (!user) return;
		getUserProfile(user.uid).then(p => {
			setProfile(p);
			setLoadingProfile(false);
		});
	}, [user]);

	if (!user) return <div>Please log in.</div>;
	if (loadingProfile) return <div>Loading profile...</div>;
	if (!profile) return <div>No profile found.</div>;

	return (
		<>
			<Navbar />
			<div className="space-y-8">
				<section>
					<h1 className="text-2xl font-bold">Welcome, {profile.displayName || profile.email}!</h1>
					<p className="text-lg">Role: {profile.role}</p>
				</section>
				{profile.role === 'student' ? <StudentDashboard user={user} /> : <MentorDashboard user={user} />}
			</div>
		</>
	);
}
 

function StudentDashboard({ user }: { user: any }) {
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
		<>
			<section>
				<h2 className="text-xl font-bold">Your Submissions</h2>
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
		</>
	);
}

import MentorChallengeForm from '@/components/MentorChallengeForm';
import { useEffect, useState } from 'react';
import { getMentorChallenges } from '@/services/challengeService';
import type { Challenge } from '@/types/challenge';
import ApplicantReview from '@/components/ApplicantReview';

function MentorDashboard({ user }: { user: any }) {
		const [challenges, setChallenges] = useState<Challenge[]>([]);
		useEffect(() => {
			if (!user) return;
			getMentorChallenges(user.uid).then(setChallenges);
		}, [user]);

		const handleDecision = async (challengeId: string, studentId: string, decision: 'accepted' | 'rejected') => {
			await fetch(`/api/challenges/${challengeId}/decision`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ studentId, decision }),
			});
			// Refresh challenges
			getMentorChallenges(user.uid).then(setChallenges);
		};

		const handleDelete = async (challengeId: string) => {
			if (!window.confirm('Are you sure you want to delete this challenge? This cannot be undone.')) return;
			await fetch(`/api/challenges/${challengeId}/delete`, { method: 'DELETE' });
			getMentorChallenges(user.uid).then(setChallenges);
		};

		return (
			<section>
				<h2 className="text-xl font-bold mb-4">Mentor Dashboard</h2>
				<MentorChallengeForm onCreated={() => getMentorChallenges(user.uid).then(setChallenges)} />
				<div className="mt-8">
					<h3 className="font-semibold mb-2">Your Challenges</h3>
					{challenges.length === 0 && <p className="text-gray-500">No challenges posted yet.</p>}
					<div className="grid gap-4">
						{challenges.map(c => (
							<div key={c.id} className="rounded-xl border p-4 bg-white">
								<img src={c.imageUrl} alt={c.title} className="w-full h-40 object-cover rounded mb-2" />
								<h4 className="font-bold text-lg">{c.title}</h4>
								<p className="text-gray-700 mb-2">{c.description}</p>
								<p className="text-xs text-gray-500">Applicants: {c.applicants?.length || 0}</p>
								<a
									href={`/dashboard/challenges/${c.id}/applicants`}
									className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
								>
									View Applicants
								</a>
								<button
									onClick={() => handleDelete(c.id!)}
									className="ml-2 mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
								>
									Delete
								</button>
							</div>
						))}
					</div>
				</div>
			</section>
		);
}