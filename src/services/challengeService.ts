import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  arrayUnion,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Challenge } from "@/types/challenge";
import { incrementCertificateStat } from "./certificateService";

export async function createChallenge(
  challenge: Omit<Challenge, "id" | "createdAt" | "applicants"> & {
    mentorId: string;
  },
) {
  const docRef = await addDoc(collection(db, "challenges"), {
    ...challenge,
    createdAt: Date.now(),
    applicants: [],
  });
  return docRef.id;
}

export async function applyToChallenge(challengeId: string, userId: string) {
  const challengeRef = doc(db, "challenges", challengeId);
  await updateDoc(challengeRef, {
    applicants: arrayUnion(userId),
  });
  await incrementCertificateStat(userId, "challengesApplied");
}

export async function getChallenge(
  challengeId: string,
): Promise<Challenge | null> {
  const docSnap = await getDoc(doc(db, "challenges", challengeId));
  return docSnap.exists()
    ? ({ id: docSnap.id, ...docSnap.data() } as Challenge)
    : null;
}

export async function getMentorChallenges(
  mentorId: string,
): Promise<Challenge[]> {
  const q = query(
    collection(db, "challenges"),
    where("mentorId", "==", mentorId),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Challenge);
}
