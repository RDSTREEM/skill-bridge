'use client';
import { useState } from 'react';
import { UserCircle } from 'lucide-react';
import jsPDF from 'jspdf';

export default function MyCertificatesPage() {
  const user = {
    displayName: 'John Doe',
    email: 'john@example.com',
    photoURL: ''
  };

  const [certs] = useState<any[]>([
    {
      id: '1',
      challengeTitle: 'SkillBridge Certificate',
      description: 'Awarded for completing the SkillBridge challenge.',
      status: 'Completed',
      issuedAt: { seconds: Math.floor(Date.now() / 1000) }
    }
  ]);

  const [openModal, setOpenModal] = useState(false);
  const [activeCert, setActiveCert] = useState<any>(null);

  const handleDownload = () => {
    if (!activeCert) return;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'px', format: [800, 600] });

    // Background
    doc.setFillColor(40, 40, 60);
    doc.rect(0, 0, 800, 600, 'F');

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(36);
    doc.setTextColor(255, 255, 255);
    doc.text(activeCert.challengeTitle, 400, 100, { align: 'center' });

    // User Name
    doc.setFontSize(24);
    doc.text(user.displayName, 400, 200, { align: 'center' });

    // Description
    doc.setFontSize(18);
    doc.setTextColor(200, 200, 200);
    doc.text(activeCert.description, 400, 280, { align: 'center', maxWidth: 700 });

    // Issued Date
    const date = activeCert.issuedAt
      ? new Date(activeCert.issuedAt.seconds * 1000).toLocaleDateString()
      : new Date().toLocaleDateString();
    doc.setFontSize(16);
    doc.text(`Issued on: ${date}`, 400, 360, { align: 'center' });

    doc.save(`${activeCert.challengeTitle}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-6 py-12">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        
        {/* Profile Section */}
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
            {user.photoURL ? (
              <img src={user.photoURL} alt="User avatar" className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <UserCircle className="w-16 h-16 text-white/80" />
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">{user.displayName}</h1>
          <p className="text-gray-300 text-sm mt-1">{user.email}</p>
        </div>

        {/* Certificates Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-8">My Certificates</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {certs.map(cert => (
              <div
                key={cert.id}
                className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-6 flex flex-col gap-4 hover:scale-[1.02] hover:bg-white/20 transition cursor-pointer"
                onClick={() => { setActiveCert(cert); setOpenModal(true); }}
              >
                <h3 className="font-semibold text-xl text-white">{cert.challengeTitle}</h3>
                <p className="text-sm text-gray-300 mt-1">
                  Issued on: {new Date(cert.issuedAt.seconds * 1000).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-400">{cert.description}</p>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                  cert.status === 'Completed' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                }`}>{cert.status}</span>
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
