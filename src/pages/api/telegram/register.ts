import type { NextApiRequest, NextApiResponse } from "next";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, cert, getApps } from "firebase-admin/app";
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
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { telegram_id, username, first_name, last_name } = req.body;
    if (!telegram_id)
      return res.status(400).json({ error: "Missing telegram_id" });
    // Find user by telegram username or create a new field in user profile
    const usersRef = db.collection("users");
    const snap = await usersRef.where("username", "==", username).get();
    if (!snap.empty) {
      const userDoc = snap.docs[0];
      await userDoc.ref.update({
        telegram_id,
        telegram_first_name: first_name,
        telegram_last_name: last_name,
      });
    }
    return res.status(200).json({ success: true });
  } catch (error: unknown) {
    return res
      .status(500)
      .json({
        error:
          typeof error === "object" && error !== null && "message" in error
            ? (error as { message: string }).message
            : String(error),
      });
  }
}
