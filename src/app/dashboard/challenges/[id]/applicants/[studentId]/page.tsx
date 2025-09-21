"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ApplicantEssayPage({
  params,
}: {
  params: { id: string; studentId: string };
}) {
  const challengeId = params.id;
  const studentId = params.studentId;
  const [status, setStatus] = useState<string>("pending");
  const [loading, startTransition] = useTransition();
  const [student, setStudent] = useState<Record<string, unknown> | null>(null);
  const [mentor, setMentor] = useState<Record<string, unknown> | null>(null);
  const [essay, setEssay] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [completionRequested, setCompletionRequested] =
    useState<boolean>(false);
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const [canSubmitEssay, setCanSubmitEssay] = useState<boolean>(false);
  // Removed unused variable 'challenge'
  const router = useRouter();

  // Fetch data on mount
  useState(() => {
    (async () => {
      const challengeSnap = await getDoc(doc(db, "challenges", challengeId));
      const challenge = challengeSnap.exists() ? challengeSnap.data() : null;
      // setChallenge removed (challenge state no longer exists)
      setEssay(challenge?.applicantsEssay?.[studentId] || "");
      setStatus(challenge?.applicantsStatus?.[studentId] || "pending");
      setCompletionRequested(!!challenge?.completionRequested?.[studentId]);
      // Submission window logic
      const now = Date.now();
      // Show essay submission if accepted and within window, and no essay yet
      if (
        challenge?.applicantsStatus?.[studentId] === "accepted" &&
        !challenge?.applicantsEssay?.[studentId] &&
        challenge?.submissionStart &&
        challenge?.submissionDeadline &&
        now >= challenge.submissionStart &&
        now <= challenge.submissionDeadline
      ) {
        setCanSubmitEssay(true);
      } else {
        setCanSubmitEssay(false);
      }
      // Show work submission if accepted, essay submitted, and within window
      if (
        challenge?.applicantsStatus?.[studentId] === "accepted" &&
        challenge?.applicantsEssay?.[studentId] &&
        challenge?.submissionStart &&
        challenge?.submissionDeadline &&
        now >= challenge.submissionStart &&
        now <= challenge.submissionDeadline
      ) {
        setCanSubmit(true);
      } else {
        setCanSubmit(false);
      }
      if (challenge?.mentorId) {
        const mentorSnap = await getDoc(doc(db, "users", challenge.mentorId));
        setMentor(mentorSnap.exists() ? mentorSnap.data() : null);
      }
      const studentSnap = await getDoc(doc(db, "users", studentId));
      setStudent(studentSnap.exists() ? studentSnap.data() : null);
    })();
  });

  const handleSubmitEssay = () => {
    router.push(
      `/dashboard/challenges/${challengeId}/essay?studentId=${studentId}`,
    );
  };
  const handleSubmitWork = () => {
    router.push(
      `/dashboard/challenges/${challengeId}/submit?studentId=${studentId}`,
    );
  };
  const handleMarkComplete = () => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/challenges/${challengeId}/mark-complete?studentId=${studentId}`,
          {
            method: "POST",
          },
        );
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to request completion");
        } else {
          setCompletionRequested(true);
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
          setError("Failed to request completion");
        }
      }
    });
  };

  const handleDecision = (decision: "accepted" | "rejected") => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/challenges/${challengeId}/decision`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId, decision }),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to update status");
        } else {
          setStatus(decision);
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
          setError("Failed to update status");
        }
      }
    });
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Applicant Essay</h1>
      <div className="mb-4 p-4 border rounded bg-gray-50">
        <div className="font-semibold mb-2">
          {student
            ? `${student.username} (${student.email})`
            : `Student ID: ${studentId}`}
        </div>
        <div>
          <span className="font-medium">Essay:</span>{" "}
          <span className="italic">{essay}</span>
        </div>
        <div className="mt-2 text-xs">
          Status: <b>{status}</b>
        </div>
        {mentor && (
          <div className="mt-2 text-xs text-gray-600">
            By <span className="font-semibold">{String(mentor.username)}</span>
          </div>
        )}
        {error && <div className="text-red-600 text-xs mt-2">{error}</div>}
      </div>
      <div className="flex gap-4 mb-6">
        <Button
          onClick={() => handleDecision("accepted")}
          disabled={status === "accepted" || loading}
        >
          Accept
        </Button>
        <Button
          onClick={() => handleDecision("rejected")}
          disabled={status === "rejected" || loading}
        >
          Reject
        </Button>
        {canSubmitEssay && (
          <Button onClick={handleSubmitEssay} disabled={loading}>
            Submit Essay
          </Button>
        )}
        {canSubmit && (
          <Button onClick={handleSubmitWork} disabled={loading}>
            Submit Work
          </Button>
        )}
        {status === "accepted" &&
          !canSubmit &&
          !canSubmitEssay &&
          !completionRequested && (
            <Button onClick={handleMarkComplete} disabled={loading}>
              Mark as Complete
            </Button>
          )}
        {status === "accepted" && completionRequested && (
          <span className="text-green-600 font-semibold">
            Completion requested
          </span>
        )}
      </div>
      <Link href={`../`} className="text-blue-600">
        &larr; Back to Applicants
      </Link>
    </div>
  );
}
