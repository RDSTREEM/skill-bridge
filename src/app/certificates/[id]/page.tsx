"use client";
import { useEffect, useState } from "react";
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function CertificatePage({ params }: { params: { id: string } }) {
  const [cert, setCert] = useState<any>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCert() {
      try {
        const certSnap = await getDoc(doc(db, 'certificates', params.id));
        if (!certSnap.exists()) {
          setError('Certificate not found');
          setLoading(false);
          return;
        }
        const certData = certSnap.data();
        setCert(certData);
        // Fetch SVG template from public folder
        const res = await fetch('/certificate-template.svg');
        const svgTemplate = await res.text();
        const svgString = svgTemplate
          .replace('{{name}}', certData.username || certData.email)
          .replace('{{extra}}', certData.challengeTitle || certData.status || '')
          .replace('{{status}}', certData.status || 'Beginner')
          .replace('{{applied}}', certData.challengesApplied?.toString() || '0')
          .replace('{{accepted}}', certData.challengesAccepted?.toString() || '0')
          .replace('{{completed}}', certData.challengesCompleted?.toString() || '0');
        setSvg(svgString);
      } catch (e: any) {
        setError(e.message || 'Failed to load certificate');
      } finally {
        setLoading(false);
      }
    }
    fetchCert();
  }, [params.id]);

  if (loading) return <div className="py-10 text-center">Loading certificate...</div>;
  if (error) return <div className="py-10 text-center text-red-600">{error}</div>;
  if (!cert || !svg) return null;
  return (
    <div className="flex flex-col items-center py-10">
      <h1 className="text-2xl font-bold mb-6">Your Certificate</h1>
      <div className="bg-white rounded-xl shadow-xl overflow-auto">
        <div dangerouslySetInnerHTML={{ __html: svg }} style={{ width: 800, height: 600 }} />
      </div>
    </div>
  );
}
