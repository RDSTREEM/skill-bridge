import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";
import fs from "fs/promises";

export default async function ChallengeCertificatePage({
  params,
}: {
  params: { id: string };
}) {
  const certSnap = await getDoc(doc(db, "certificates", params.id));
  if (!certSnap.exists()) return notFound();
  const cert = certSnap.data() as Record<string, unknown>;

  // Type guards for cert properties
  const username =
    typeof cert.username === "string"
      ? cert.username
      : typeof cert.email === "string"
        ? cert.email
        : "";
  const challengeTitle =
    typeof cert.challengeTitle === "string" ? cert.challengeTitle : "";
  const createdAt = cert.createdAt
    ? new Date(cert.createdAt as string).toLocaleDateString()
    : "";

  // Load SVG template
  const svgTemplate = await fs.readFile(
    process.cwd() + "/public/certificate-challenge.svg",
    "utf8",
  );
  // Replace placeholders
  const svg = svgTemplate
    .replace("{{name}}", username)
    .replace("{{challenge}}", challengeTitle)
    .replace("{{date}}", createdAt);

  return (
    <div className="flex flex-col items-center py-10">
      <h1 className="text-2xl font-bold mb-6">
        Challenge Completion Certificate
      </h1>
      <div className="bg-white rounded-xl shadow-xl overflow-auto">
        <div
          dangerouslySetInnerHTML={{ __html: svg }}
          style={{ width: 800, height: 600 }}
        />
      </div>
    </div>
  );
}
