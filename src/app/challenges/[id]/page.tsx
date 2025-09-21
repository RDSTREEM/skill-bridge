"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
// import { Navbar } from "@/components/Navbar";

export default function ChallengeDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<Record<string, unknown> | null>(
    null,
  );
  const [essay, setEssay] = useState("");
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, "challenges", id)).then((snap) => {
      if (snap.exists()) {
        setChallenge({ id: snap.id, ...snap.data() });
        if (
          user &&
          snap.data().applicantsEssay &&
          snap.data().applicantsEssay[user.uid]
        ) {
          setApplied(true);
        }
      }
      setLoading(false);
    });
  }, [id, user]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!user) {
      setError("You must be logged in to apply.");
      return;
    }
    if (!essay.trim()) {
      setError("Essay is required.");
      return;
    }
    try {
      const challengeRef = doc(db, "challenges", id);
      await updateDoc(challengeRef, {
        applicants: arrayUnion(user.uid),
        [`applicantsEssay.${user.uid}`]: essay,
      });
      setApplied(true);
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof (err as { message?: unknown }).message === "string"
      ) {
        setError((err as { message: string }).message);
      } else {
        setError("An error occurred");
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!challenge) return <div>Challenge not found.</div>;

  return (
    <>
      {/* <Navbar /> */}
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow mt-8">
        <h1 className="text-3xl font-bold mb-2">{String(challenge.title)}</h1>
        {/* If you want to use Next.js Image, uncomment below and import Image from 'next/image' */}
        <Image
          src={String(challenge.imageUrl)}
          alt={String(challenge.title)}
          width={800}
          height={224}
          className="w-full h-56 object-cover rounded mb-4"
        />
        <p className="mb-4 text-gray-700">{String(challenge.description)}</p>
        {applied ? (
          <div className="p-4 bg-green-50 rounded text-green-700 font-semibold">
            You have applied to this challenge.
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-4 mt-6">
            <label className="block font-medium">
              Why are you interested in this challenge? (Essay)
            </label>
            <textarea
              className="w-full border rounded px-3 py-2"
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              required
              rows={5}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit">Apply</Button>
          </form>
        )}
      </div>
    </>
  );
}
