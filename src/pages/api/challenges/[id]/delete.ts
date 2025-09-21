import type { NextApiRequest, NextApiResponse } from "next";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";

if (!getApps().length) {
  const serviceAccount = JSON.parse(
    fs.readFileSync(
      process.env.FIREBASE_SERVICE_ACCOUNT_PATH as string,
      "utf8",
    ),
  );
  initializeApp({
    credential: cert(serviceAccount),
  });
}
const db = getFirestore();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { id: challengeId } = req.query;
    if (!challengeId) {
      return res.status(400).json({ error: "Missing challengeId in URL" });
    }
    await db
      .collection("challenges")
      .doc(challengeId as string)
      .delete();
    return res.status(200).json({ success: true });
  } catch (error: unknown) {
    let errorMessage = "Unknown error";
    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof (error as { message?: unknown }).message === "string"
    ) {
      errorMessage = (error as { message: string }).message;
    }
    return res.status(500).json({ error: errorMessage });
  }
}
