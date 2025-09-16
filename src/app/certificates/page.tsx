'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Navbar } from '@/components/Navbar';

export default function MyCertificatesPage() {
  const { user } = useAuth();
  const [certs, setCerts] = useState<any[]>([]);
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'certificates'), where('userId', '==', user.uid));
    getDocs(q).then(snap => setCerts(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, [user]);
  if (!user) return <div>Please log in.</div>;
  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-6">My Certificates</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {certs.length === 0 && <p>No certificates yet.</p>}
          {certs.map(cert => (
            <div key={cert.id} className="rounded-xl border bg-white shadow p-5 flex flex-col gap-2">
              <div className="font-semibold text-lg">{cert.challengeTitle || 'SkillBridge Certificate'}</div>
              <div className="text-sm text-gray-600">Status: {cert.status || 'Beginner'}</div>
              <div className="flex gap-2 mt-2">
                <Link href={`/certificates/${cert.id}`} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center font-semibold">View Certificate</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
