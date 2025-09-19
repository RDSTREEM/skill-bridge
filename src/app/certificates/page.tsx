'use client';

import { useState, useEffect } from 'react';
import { UserCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';


export default function MyCertificatesPage() {
  const { user, loading } = useAuth();
  const [certs, setCerts] = useState<any[]>([]);
  const [profile, setProfile] = useState<{ displayName: string; email: string; photoURL?: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    // Fetch certificates for this user
    async function fetchCerts() {
      const q = query(collection(db, 'certificates'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setCerts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    fetchCerts();
    // Set profile info
    setProfile({
      displayName: user.displayName || user.email || 'User',
      email: user.email,
      photoURL: user.photoURL || '',
    });
  }, [user]);

  const [openModal, setOpenModal] = useState(false);
  const [activeCert, setActiveCert] = useState<any>(null);

  const handleDownload = () => {
    if (!activeCert || !profile) return;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'px', format: [800, 600] });
    // Background
    doc.setFillColor(40, 40, 60);
    doc.rect(0, 0, 800, 600, 'F');
    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(36);
    doc.setTextColor(255, 255, 255);
    doc.text(activeCert.challengeTitle || 'Certificate', 400, 100, { align: 'center' });
    // User Name
    doc.setFontSize(24);
    doc.text(profile.displayName, 400, 200, { align: 'center' });
    // Description
    doc.setFontSize(18);
    doc.setTextColor(200, 200, 200);
    doc.text(activeCert.description || '', 400, 280, { align: 'center', maxWidth: 700 });
    // Issued Date
    const date = activeCert.createdAt
      ? new Date(activeCert.createdAt).toLocaleDateString()
      : new Date().toLocaleDateString();
    doc.setFontSize(16);
    doc.text(`Issued on: ${date}`, 400, 360, { align: 'center' });
    doc.save(`${activeCert.challengeTitle || 'certificate'}.pdf`);
  };

  if (loading) return <div className="py-10 text-center text-white">Loading...</div>;
  if (!user) return <div className="py-10 text-center text-white">Please log in to view your certificates.</div>;
  if (!profile) return <div className="py-10 text-center text-white">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-6 py-12">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        {/* Profile Section */}
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
            {profile.photoURL ? (
              <img src={profile.photoURL} alt="User avatar" className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <UserCircle className="w-16 h-16 text-white/80" />
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">{profile.displayName}</h1>
          <p className="text-gray-300 text-sm mt-1">{profile.email}</p>
        </div>

        {/* Certificates Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-8">My Certificates</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {certs.length === 0 && <p className="text-gray-400">No certificates yet.</p>}
            {certs.map(cert => (
              <div
                key={cert.id}
                className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-6 flex flex-col gap-4 hover:scale-[1.02] hover:bg-white/20 transition cursor-pointer"
                onClick={() => { setActiveCert(cert); setOpenModal(true); }}
              >
                <h3 className="font-semibold text-xl text-white">{cert.challengeTitle || 'Certificate'}</h3>
                <p className="text-sm text-gray-300 mt-1">
                  Issued on: {cert.createdAt ? new Date(cert.createdAt).toLocaleDateString() : ''}
                </p>
                <p className="text-sm text-gray-400">{cert.description || ''}</p>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                  cert.status === 'Completed' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                }`}>{cert.status || 'Completed'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        {openModal && activeCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-3xl border border-white/20 rounded-3xl p-10 max-w-3xl w-full flex flex-col gap-6 items-center relative">
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">Certificate of Achievement</h2>
              <p className="text-gray-300">This certifies that</p>
              <p className="text-2xl font-semibold text-white">{user.displayName}</p>
              <p className="text-gray-300 mt-2">has successfully completed</p>
              <p className="text-xl font-medium text-white">{activeCert.challengeTitle}</p>
              <p className="text-gray-400 mt-4">Issued on: {new Date(activeCert.issuedAt.seconds * 1000).toLocaleDateString()}</p>

              <div className="flex gap-6 mt-6">
                <button
                  onClick={handleDownload}
                  className="px-6 py-2 rounded-xl bg-green-500 text-white font-semibold shadow-lg hover:bg-green-600 transition"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => setOpenModal(false)}
                  className="px-6 py-2 rounded-xl bg-red-500 text-white font-semibold shadow-lg hover:bg-red-600 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
