import { useState } from "react";
import { createChallenge } from "@/services/challengeService";
import { useAuth } from "@/lib/auth-context";
import { Button } from "./ui/Button";

export default function MentorChallengeForm({
  onCreated,
}: {
  onCreated?: () => void;
}) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [acceptEmail, setAcceptEmail] = useState("");
  const [rejectEmail, setRejectEmail] = useState("");
  const [submissionStart, setSubmissionStart] = useState("");
  const [submissionDeadline, setSubmissionDeadline] = useState("");
  const [telegram, setTelegram] = useState("");
  const [faq, setFaq] = useState<{ question: string; answer: string }[]>([]);
  const [association, setAssociation] = useState("");
  const [difficulty, setDifficulty] = useState<
    "beginner" | "intermediate" | "experienced"
  >("beginner");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!user) throw new Error("Not authenticated");
      await createChallenge({
        title,
        description,
        imageUrl,
        mentorId: user.uid,
        acceptEmail,
        rejectEmail,
        submissionStart: submissionStart
          ? new Date(submissionStart).getTime()
          : undefined,
        submissionDeadline: submissionDeadline
          ? new Date(submissionDeadline).getTime()
          : undefined,
        telegram,
        faq,
        association,
        difficulty,
      });
      setTitle("");
      setDescription("");
      setImageUrl("");
      setAcceptEmail("");
      setRejectEmail("");
      setTelegram("");
      setFaq([]);
      setAssociation("");
      setDifficulty("beginner");
      if (onCreated) onCreated();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-xl shadow"
    >
      <h3 className="text-lg font-bold mb-2">Create New Challenge</h3>
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Association / School / Company Name"
        value={association}
        onChange={(e) => setAssociation(e.target.value)}
        required
      />
      <div>
        <label className="block font-medium mb-1">Difficulty Level</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as any)}
          required
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="experienced">Experienced</option>
        </select>
      </div>
      <textarea
        className="w-full border rounded px-3 py-2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Mentor Telegram Account (required)"
        value={telegram}
        onChange={(e) => setTelegram(e.target.value)}
        required
      />
      <div className="mb-4">
        <label className="block font-medium mb-1">Challenge FAQ (Q&A)</label>
        {faq.map((item, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              className="flex-1 border rounded px-2 py-1"
              placeholder="Question"
              value={item.question}
              onChange={(e) =>
                setFaq((faq) =>
                  faq.map((q, idx) =>
                    idx === i ? { ...q, question: e.target.value } : q,
                  ),
                )
              }
              required
            />
            <input
              className="flex-1 border rounded px-2 py-1"
              placeholder="Answer"
              value={item.answer}
              onChange={(e) =>
                setFaq((faq) =>
                  faq.map((q, idx) =>
                    idx === i ? { ...q, answer: e.target.value } : q,
                  ),
                )
              }
              required
            />
            <button
              type="button"
              onClick={() => setFaq((faq) => faq.filter((_, idx) => idx !== i))}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setFaq([...faq, { question: "", answer: "" }])}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Add Q&A
        </button>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">
            Submission Start
          </label>
          <input
            type="datetime-local"
            className="w-full border rounded px-3 py-2"
            value={submissionStart}
            onChange={(e) => setSubmissionStart(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">
            Submission Deadline
          </label>
          <input
            type="datetime-local"
            className="w-full border rounded px-3 py-2"
            value={submissionDeadline}
            onChange={(e) => setSubmissionDeadline(e.target.value)}
          />
        </div>
      </div>
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        required
      />
      <textarea
        className="w-full border rounded px-3 py-2"
        placeholder="Custom acceptance email (optional)"
        value={acceptEmail}
        onChange={(e) => setAcceptEmail(e.target.value)}
        rows={3}
      />
      <textarea
        className="w-full border rounded px-3 py-2"
        placeholder="Custom rejection email (optional)"
        value={rejectEmail}
        onChange={(e) => setRejectEmail(e.target.value)}
        rows={3}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Posting..." : "Post Challenge"}
      </Button>
    </form>
  );
}
