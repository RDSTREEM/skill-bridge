import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore();

export async function incrementCertificateStatAdmin(
  userId: string,
  stat: "challengesApplied" | "challengesAccepted" | "challengesCompleted",
) {
  const certRef = db.collection("certificates").doc(`main-${userId}`);
  await certRef.update({
    [stat]: (await certRef.get()).get(stat) + 1 || 1,
  });
}

// Default export handler for Next.js API route compliance
export default function handler(req: unknown, res: unknown) {
  (res as import("next").NextApiResponse)
    .status(200)
    .json({ message: "adminStat API route is working." });
}
