import Image from "next/image";
("use client");
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  getDocs,
} from "firebase/firestore";
import Link from "next/link";
import { getUserProfile } from "@/services/userService";
import type { UserProfile } from "@/types/user";

interface Submission {
  id: string;
  challengeId: string;
  status: string;
  feedback?: string;
  latestFileUrl?: string;
}
interface Certificate {
  id: string;
  userId: string;
  challengeId: string;
  url: string;
  createdAt: string | number;
}

import { Badge } from "@/components/ui/badge";
import { Award, User, Users, FileText } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!user) return;
    getUserProfile(user.uid).then((p) => {
      setProfile(p);
      setLoadingProfile(false);
    });
  }, [user]);

  if (!user) return <div>Please log in.</div>;
  if (loadingProfile) return <div>Loading profile...</div>;
  if (!profile) return <div>No profile found.</div>;

  return (
    <>
      <div className="max-w-5xl mx-auto py-8 px-4 space-y-10">
        <section className="flex items-center gap-4 bg-gradient-to-r from-primary/10 to-accent-yellow/10 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/20">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1">
              Welcome, {profile.displayName || profile.email}!
            </h1>
            <Badge variant="secondary" className="capitalize">
              {profile.role}
            </Badge>
          </div>
        </section>
        {profile.role === "student" ? (
          <StudentDashboard user={user} />
        ) : (
          <MentorDashboard user={user} />
        )}
      </div>
    </>
  );
}

// ...existing code...

type ChallengeDoc = {
  id: string;
  title: string;
  applicantsStatus?: Record<string, string>;
};
function StudentDashboard({ user }: { user: { uid: string } }) {
  const [allChallenges, setAllChallenges] = useState<ChallengeDoc[]>([]);
  const [subs, setSubs] = useState<Submission[]>([]);
  const [certs, setCerts] = useState<Certificate[]>([]);

  useEffect(() => {
    if (!user) return;
    // Fetch all challenges
    async function fetchAllChallenges() {
      const q = query(collection(db, "challenges"));
      const snap = await getDocs(q);
      const challenges: ChallengeDoc[] = snap.docs.map((d) => {
        const data = d.data() as Omit<ChallengeDoc, "id">;
        return { ...data, id: d.id };
      });
      setAllChallenges(challenges);
    }
    fetchAllChallenges();
    // Submissions and certificates for feedback, file links, etc.
    const q1 = query(
      collection(db, "submissions"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );
    const unsub1 = onSnapshot(q1, (snap) =>
      setSubs(
        snap.docs.map((d) => {
          const data = d.data() as Omit<Submission, "id">;
          return { ...data, id: d.id };
        }),
      ),
    );
    const q2 = query(
      collection(db, "certificates"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );
    const unsub2 = onSnapshot(q2, (snap) =>
      setCerts(
        snap.docs.map((d) => {
          const data = d.data() as Omit<Certificate, "id">;
          return { ...data, id: d.id };
        }),
      ),
    );
    return () => {
      unsub1();
      unsub2();
    };
  }, [user]);

  // Show all submitted/completed challenges, using allChallenges for title lookup
  const submittedChallenges = subs
    .filter((sub) => sub.status === "submitted" || sub.status === "completed")
    .map((sub) => {
      return (
        allChallenges.find((c) => c.id === sub.challengeId) || {
          id: sub.challengeId,
          title: "Challenge",
          applicantsStatus: {},
        }
      );
    });
  // Only show as active if accepted/completed and not submitted/completed
  const activeChallenges = allChallenges.filter((c) => {
    const status = c.applicantsStatus?.[user.uid];
    if (!(status === "accepted" || status === "completed")) return false;
    const sub = subs.find((s) => s.challengeId === c.id);
    return !sub || (sub.status !== "submitted" && sub.status !== "completed");
  });

  return (
    <>
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" /> Active Challenges
        </h2>
        <div className="mt-4 grid md:grid-cols-2 gap-5">
          {activeChallenges.length === 0 && (
            <p className="text-sm text-gray-500 col-span-2">
              No active challenges. Browse{" "}
              <Link className="underline" href="/challenges">
                challenges
              </Link>
              .
            </p>
          )}
          {activeChallenges.map((c) => {
            const sub = subs.find((s) => s.challengeId === c.id);
            const status =
              c.applicantsStatus?.[user.uid] || sub?.status || "accepted";
            const badgeVariant =
              status === "accepted" || status === "completed"
                ? "default"
                : "secondary";
            return (
              <div
                key={c.id}
                className={`rounded-2xl border shadow-md p-5 flex flex-col gap-2 hover:shadow-lg transition-all ${status === "completed" ? "bg-gradient-to-r from-green-100 to-blue-50 border-green-400" : "bg-white"}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">Challenge:</span>
                  <Link
                    href={`/challenges/${c.id}`}
                    className="underline text-primary font-semibold"
                  >
                    {c.title}
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Status:</span>
                  <Badge variant={badgeVariant}>{status}</Badge>
                </div>
                <Link
                  href={`/dashboard/challenges/${c.id}/submit`}
                  className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg font-semibold text-center shadow hover:from-blue-600 hover:to-green-600 transition-all"
                >
                  Submit
                </Link>
                {sub?.feedback && (
                  <p className="text-sm text-muted-foreground">
                    Feedback: {sub.feedback}
                  </p>
                )}
                {sub?.latestFileUrl && (
                  <a
                    className="text-sm underline text-blue-600"
                    href={sub.latestFileUrl}
                    target="_blank"
                  >
                    View latest upload
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" /> Submitted Challenges
        </h2>
        <div className="mt-4 grid md:grid-cols-2 gap-5">
          {submittedChallenges.length === 0 && (
            <p className="text-sm text-gray-500 col-span-2">
              No submitted challenges yet.
            </p>
          )}
          {submittedChallenges.map((c) => {
            const sub = subs.find((s) => s.challengeId === c.id);
            const status =
              c.applicantsStatus?.[user.uid] || sub?.status || "submitted";
            const badgeVariant =
              status === "submitted" ? "default" : "secondary";
            return (
              <div
                key={c.id}
                className="rounded-2xl border shadow-md p-5 flex flex-col gap-2 hover:shadow-lg transition-all bg-gradient-to-r from-blue-100 to-green-50 border-blue-400"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">Challenge:</span>
                  <Link
                    href={`/challenges/${c.id}`}
                    className="underline text-primary font-semibold"
                  >
                    {c.title}
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Status:</span>
                  <Badge variant={badgeVariant}>{status}</Badge>
                </div>
                <Link
                  href={`/dashboard/challenges/${c.id}/submit`}
                  className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg font-semibold text-center shadow hover:from-blue-600 hover:to-green-600 transition-all"
                >
                  Update
                </Link>
                {sub?.feedback && (
                  <p className="text-sm text-muted-foreground">
                    Feedback: {sub.feedback}
                  </p>
                )}
                {sub?.latestFileUrl && (
                  <a
                    className="text-sm underline text-blue-600"
                    href={sub.latestFileUrl}
                    target="_blank"
                  >
                    View latest upload
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </section>
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" /> Certificates
          </h2>
          <Link
            href="/certificates"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold shadow hover:from-yellow-500 hover:to-yellow-700 transition-all"
          >
            Your Certificates
          </Link>
        </div>
        <div className="mt-4 grid md:grid-cols-2 gap-5">
          {certs.length === 0 && (
            <p className="text-sm text-gray-500 col-span-2">
              No certificates yet.
            </p>
          )}
          {certs.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border bg-gradient-to-r from-yellow-100 to-yellow-50 shadow-md p-5 flex flex-col gap-2 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">Challenge:</span>
                <Link
                  href={`/challenges/${c.challengeId}`}
                  className="underline text-primary font-semibold"
                >
                  {c.challengeId}
                </Link>
              </div>
              <Link
                className="text-sm underline text-blue-600 font-semibold"
                href={`/certificates/${c.id}`}
              >
                View Certificate
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

import MentorChallengeForm from "@/components/MentorChallengeForm";
import { useEffect, useState } from "react";
import { getMentorChallenges } from "@/services/challengeService";
import type { Challenge } from "@/types/challenge";

function MentorDashboard({ user }: { user: unknown }) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  useEffect(() => {
    if (!user || typeof user !== "object" || user === null || !("uid" in user))
      return;
    getMentorChallenges((user as { uid: string }).uid).then(setChallenges);
  }, [user]);

  // Removed unused handleDecision function

  const handleDelete = async (challengeId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this challenge? This cannot be undone.",
      )
    )
      return;
    await fetch(`/api/challenges/${challengeId}/delete`, { method: "DELETE" });
    if (user && typeof user === "object" && user !== null && "uid" in user) {
      getMentorChallenges((user as { uid: string }).uid).then(setChallenges);
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Users className="h-6 w-6 text-primary" /> Mentor Dashboard
      </h2>
      <div className="mb-8">
        <MentorChallengeForm
          onCreated={() => {
            if (
              user &&
              typeof user === "object" &&
              user !== null &&
              "uid" in user
            ) {
              getMentorChallenges((user as { uid: string }).uid).then(
                setChallenges,
              );
            }
          }}
        />
      </div>
      <div className="mt-8">
        <h3 className="font-semibold mb-4 text-lg">Your Challenges</h3>
        {challenges.length === 0 && (
          <p className="text-gray-500">No challenges posted yet.</p>
        )}
        <div className="grid md:grid-cols-2 gap-6">
          {challenges.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border bg-white shadow-md p-5 hover:shadow-lg transition-all flex flex-col gap-2"
            >
              <Image
                src={c.imageUrl || "/file.svg"}
                alt={c.title}
                width={400}
                height={160}
                className="w-full h-40 object-cover rounded-xl mb-2"
                unoptimized
              />
              <h4 className="font-bold text-lg mb-1">{c.title}</h4>
              <p className="text-gray-700 mb-2 line-clamp-3">{c.description}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Users className="h-4 w-4" /> Applicants:{" "}
                {c.applicants?.length || 0}
              </div>
              <div className="flex gap-2 mt-2">
                <a
                  href={`/dashboard/challenges/${c.id}/applicants`}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center"
                >
                  View Applicants
                </a>
                <a
                  href={`/dashboard/challenges/${c.id}/submissions`}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center"
                >
                  Submissions
                </a>
                <button
                  onClick={() => handleDelete(c.id!)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
