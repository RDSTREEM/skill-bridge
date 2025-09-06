import { useState } from 'react';
import { createChallenge } from '@/services/challengeService';
import { useAuth } from '@/lib/auth-context';
import { Button } from './ui/Button';

export default function MentorChallengeForm({ onCreated }: { onCreated?: () => void }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!user) throw new Error('Not authenticated');
      await createChallenge({
        title,
        description,
        imageUrl,
        mentorId: user.uid,
      });
      setTitle('');
      setDescription('');
      setImageUrl('');
      if (onCreated) onCreated();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-2">Create New Challenge</h3>
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <textarea
        className="w-full border rounded px-3 py-2"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
      />
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Image URL"
        value={imageUrl}
        onChange={e => setImageUrl(e.target.value)}
        required
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={loading}>{loading ? 'Posting...' : 'Post Challenge'}</Button>
    </form>
  );
}
