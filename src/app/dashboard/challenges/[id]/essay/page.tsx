"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function EssaySubmissionPage({
  params,
}: {
  params: { id: string };
}) {
  const challengeId = params.id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = searchParams ? searchParams.get("studentId") : null;
  const [essay, setEssay] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/challenges/${challengeId}/essay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, essay }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Submission failed");
      } else {
        router.push(
          `/dashboard/challenges/${challengeId}/applicants/${studentId}`,
        );
      }
    } catch (e: unknown) {
      if (
        e &&
        typeof e === "object" &&
        "message" in e &&
        typeof (e as { message?: unknown }).message === "string"
      ) {
        setError((e as { message: string }).message);
      } else {
        setError("Submission failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Submit Your Application Essay</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Essay</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
            required
            rows={6}
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Submitting..." : "Submit Essay"}
        </Button>
      </form>
    </div>
  );
}
