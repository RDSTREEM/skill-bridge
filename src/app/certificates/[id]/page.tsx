"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function CertificatePage({
  params,
}: {
  params: { id: string };
}) {
  // Replace 'any' with a more specific type. If you have a Certificate type, use it. Otherwise, use 'object | null'.
  const [cert, setCert] = useState<object | null>(null); // Replace 'object' with 'Certificate' if available
  const [svg, setSvg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCert() {
      try {
        const certSnap = await getDoc(doc(db, "certificates", params.id));
        if (!certSnap.exists()) {
          setError("Certificate not found");
          setLoading(false);
          return;
        }
        const certData = certSnap.data();
        setCert(certData);
        // Fetch SVG template from public folder
        const res = await fetch("/certificate-template.svg");
        const svgTemplate = await res.text();
        const svgString = svgTemplate
          .replace("{{name}}", certData.username || certData.email)
          .replace(
            "{{extra}}",
            certData.challengeTitle || certData.status || "",
          )
          .replace("{{status}}", certData.status || "Beginner")
          .replace("{{applied}}", certData.challengesApplied?.toString() || "0")
          .replace(
            "{{accepted}}",
            certData.challengesAccepted?.toString() || "0",
          )
          .replace(
            "{{completed}}",
            certData.challengesCompleted?.toString() || "0",
          );
        setSvg(svgString);
      } catch (e: unknown) {
        let errorMessage = "Failed to load certificate";
        if (
          e &&
          typeof e === "object" &&
          "message" in e &&
          typeof (e as { message?: unknown }).message === "string"
        ) {
          errorMessage = (e as { message: string }).message;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    fetchCert();
  }, [params.id]);

  if (loading)
    return <div className="py-10 text-center">Loading certificate...</div>;
  if (error)
    return <div className="py-10 text-center text-red-600">{error}</div>;
  if (!cert || !svg) return null;
  return (
    <div className="flex flex-col items-center py-10">
      <h1 className="text-2xl font-bold mb-6">Your Certificate</h1>
      <div className="bg-white rounded-xl shadow-xl overflow-auto">
        <div
          dangerouslySetInnerHTML={{ __html: svg }}
          style={{ width: 800, height: 600 }}
        />
      </div>
    </div>
  );
}
