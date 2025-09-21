import { db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { UserProfile } from "@/types/user";
import { Certificate } from "@/types/certificate";
export async function createMainCertificate(user: UserProfile) {
  const cert: Certificate = {
    id: `main-${user.uid}`,
    userId: user.uid,
    type: "main",
    createdAt: Date.now(),
    username: user.username,
    email: user.email,
    status: "Beginner",
    challengesCompleted: 0,
    challengesApplied: 0,
    challengesAccepted: 0,
  };
  await setDoc(doc(db, "certificates", cert.id), cert);
}

export async function isUsernameTaken(username: string): Promise<boolean> {
  const q = query(collection(db, "users"), where("username", "==", username));
  const snap = await getDocs(q);
  return !snap.empty;
}

export async function createUserProfile(profile: UserProfile) {
  await setDoc(doc(db, "users", profile.uid), profile);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docSnap = await getDoc(doc(db, "users", uid));
  return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
}
