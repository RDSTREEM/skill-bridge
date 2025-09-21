import type { NextApiRequest, NextApiResponse } from "next";
import { initializeApp, cert, getApps, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Challenge } from "@/types/challenge";
import fs from "fs";

// Initialize Firebase Admin with service account
let app: App;
if (!getApps().length) {
  const serviceAccount = JSON.parse(
    fs.readFileSync(
      process.env.FIREBASE_SERVICE_ACCOUNT_PATH as string,
      "utf8",
    ),
  );
  app = initializeApp({
    credential: cert(serviceAccount),
  });
} else {
  app = getApps()[0];
}
const db = getFirestore(app);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const {
      title,
      description,
      imageUrl,
      mentorId,
      acceptEmail,
      rejectEmail,
      submissionStart,
      submissionDeadline,
      telegram,
      faq,
    } = req.body;
    if (!title || !description || !imageUrl || !mentorId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const challenge: Omit<Challenge, "id" | "createdAt" | "applicants"> = {
      title,
      description,
      imageUrl,
      mentorId,
      acceptEmail: acceptEmail || "",
      rejectEmail: rejectEmail || "",
      submissionStart: submissionStart || null,
      submissionDeadline: submissionDeadline || null,
      telegram: telegram || "",
      faq: faq || [],
      association: req.body.association || "",
      difficulty: req.body.difficulty || "",
    };
    const docRef = await db.collection("challenges").add({
      ...challenge,
      createdAt: Date.now(),
      applicants: [],
    });
    return res.status(201).json({ id: docRef.id });
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
