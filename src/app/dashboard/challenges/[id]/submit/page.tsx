"use client";
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function ChallengeSubmitPage({ params }: { params: { id: string } }) {
  const challengeId = params.id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  // Prefer logged-in user ID, fallback to query param
  const studentId = user?.uid || searchParams.get('studentId');
  const [evidence, setEvidence] = useState('');
  const [links, setLinks] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLinkChange = (i: number, value: string) => {
    setLinks(links => links.map((l, idx) => (idx === i ? value : l)));
  };
  const addLink = () => setLinks([...links, '']);
  const removeLink = (i: number) => setLinks(links.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/challenges/${challengeId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, evidence, links: links.filter(l => l.trim()) }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Submission failed');
      } else {
        router.push(`/dashboard/challenges/${challengeId}/submit/success`);
      }
    } catch (e: any) {
      setError(e.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Submit Your Work</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Evidence (paragraph)</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={evidence}
            onChange={e => setEvidence(e.target.value)}
            required
            rows={5}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Links (optional)</label>
          {links.map((link, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                className="flex-1 border rounded px-3 py-2"
                placeholder="https://..."
                value={link}
                onChange={e => handleLinkChange(i, e.target.value)}
              />
              {links.length > 1 && (
                <Button type="button" onClick={() => removeLink(i)}>-</Button>
              )}
            </div>
          ))}
          <Button type="button" onClick={addLink}>Add Link</Button>
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </div>
  );
}
