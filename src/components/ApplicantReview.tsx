import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "./ui/button";

interface Props {
  challengeId: string;
  applicants: string[];
  applicantsEssay?: Record<string, string>;
  applicantsStatus?: Record<string, "accepted" | "rejected" | "pending">;
  onDecision: (studentId: string, decision: "accepted" | "rejected") => void;
}

export default function ApplicantReview({
  applicants,
  applicantsEssay,
  applicantsStatus,
  onDecision,
}: Omit<Props, "challengeId">) {
  const [users, setUsers] = useState<
    Record<string, { email: string; displayName?: string }>
  >({});
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      const result: Record<string, { email: string; displayName?: string }> =
        {};
      for (const uid of applicants) {
        const snap = await getDoc(doc(db, "users", uid));
        if (snap.exists()) {
          const d = snap.data();
          result[uid] = { email: d.email, displayName: d.displayName };
        }
      }
      setUsers(result);
    }
    if (applicants.length) fetchUsers();
  }, [applicants]);

  if (!applicants.length)
    return <p className="text-sm text-gray-500">No applicants yet.</p>;

  return (
    <div className="flex gap-6 mt-4">
      <div className="w-48 border-r pr-4">
        <div className="font-semibold mb-2">Applicants</div>
        <ul className="space-y-2">
          {applicants.map((uid) => (
            <li key={uid}>
              <button
                className={`w-full text-left px-2 py-1 rounded ${selected === uid ? "bg-blue-100 font-bold" : "hover:bg-gray-100"}`}
                onClick={() => setSelected(uid)}
              >
                {users[uid]?.displayName || users[uid]?.email || uid}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1">
        {selected ? (
          <div className="border rounded p-4 bg-gray-50">
            <div className="font-semibold text-lg mb-1">
              {users[selected]?.displayName ||
                users[selected]?.email ||
                selected}
            </div>
            <div className="text-xs text-gray-500 mb-2">
              {users[selected]?.email}
            </div>
            <div className="mb-2">
              <span className="font-medium">Essay:</span>{" "}
              <span className="italic">{applicantsEssay?.[selected]}</span>
            </div>
            <div className="flex gap-2 items-center mt-2">
              <span className="text-xs">
                Status: <b>{applicantsStatus?.[selected] || "pending"}</b>
              </span>
              <Button
                onClick={() => onDecision(selected, "accepted")}
                disabled={applicantsStatus?.[selected] === "accepted"}
              >
                Accept
              </Button>
              <Button
                onClick={() => onDecision(selected, "rejected")}
                disabled={applicantsStatus?.[selected] === "rejected"}
              >
                Reject
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">
            Select an applicant to review their essay.
          </div>
        )}
      </div>
    </div>
  );
}
