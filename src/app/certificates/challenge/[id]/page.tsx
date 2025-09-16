import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import fs from 'fs/promises';

export default async function ChallengeCertificatePage({ params }: { params: { id: string } }) {
  const certSnap = await getDoc(doc(db, 'certificates', params.id));
  if (!certSnap.exists()) return notFound();
  const cert = certSnap.data() as any;

  // Load SVG template
  const svgTemplate = await fs.readFile(process.cwd() + '/public/certificate-challenge.svg', 'utf8');
  // Replace placeholders
  const svg = svgTemplate
    .replace('{{name}}', cert.username || cert.email)
    .replace('{{challenge}}', cert.challengeTitle || '')
    .replace('{{date}}', cert.createdAt ? new Date(cert.createdAt).toLocaleDateString() : '');

  return (
    <div className="flex flex-col items-center py-10">
      <h1 className="text-2xl font-bold mb-6">Challenge Completion Certificate</h1>
      <div className="bg-white rounded-xl shadow-xl overflow-auto">
        <div dangerouslySetInnerHTML={{ __html: svg }} style={{ width: 800, height: 600 }} />
      </div>
    </div>
  );
}
