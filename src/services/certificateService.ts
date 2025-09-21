import { db } from "@/lib/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

export async function incrementCertificateStat(
  userId: string,
  stat: "challengesApplied" | "challengesAccepted" | "challengesCompleted",
) {
  const certRef = doc(db, "certificates", `main-${userId}`);
  await updateDoc(certRef, {
    [stat]: increment(1),
  });
}
