"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import {
  createUserProfile,
  isUsernameTaken,
  createMainCertificate,
} from "@/services/userService";
import type { UserRole } from "@/types/user";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<UserRole>("student");
  const [username, setUsername] = useState("");
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const user = userCredential.user;
        if (!user.emailVerified) {
          setError(
            "Please verify your email before logging in. Check your inbox for the verification link.",
          );
          setLoading(false);
          return;
        }
        router.push("/dashboard");
      } else {
        // Username validation
        if (!username.trim()) {
          setError("Username is required.");
          setLoading(false);
          return;
        }
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
          setError(
            "Username must be 3-20 characters, letters, numbers, or underscores.",
          );
          setLoading(false);
          return;
        }
        if (await isUsernameTaken(username)) {
          setError("Username is already taken.");
          setLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const user = userCredential.user;
        await sendEmailVerification(user);
        // Create user profile in Firestore
        const profile = {
          uid: user.uid,
          email: user.email || "",
          displayName: user.displayName || "",
          username,
          role,
          createdAt: Date.now(),
        };
        await createUserProfile(profile);
        if (role === "student") {
          await createMainCertificate(profile);
        }
        setError(
          "A verification email has been sent. Please check your inbox and verify your email before logging in.",
        );
        setLoading(false);
        return;
      }
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof (err as { message?: unknown }).message === "string"
      ) {
        setError((err as { message: string }).message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid place-items-center mt-16">
      <Card className="w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <form onSubmit={submit} className="space-y-3">
          <input
            className="w-full border rounded px-2 py-2"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full border rounded px-2 py-2"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {mode === "signup" && (
            <>
              <input
                className="w-full border rounded px-2 py-2"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                maxLength={20}
              />
              <div>
                <label className="block mb-1 font-medium">I am a:</label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  required
                >
                  <option value="student">Student</option>
                  <option value="mentor">Mentor</option>
                </select>
              </div>
            </>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Log in"
                : "Sign up"}
          </Button>
          {mode === "signup" &&
            error &&
            error.includes("verification email") && (
              <p className="text-sm text-blue-600 text-center">
                After verifying your email, you can log in and will be
                redirected to your dashboard.
              </p>
            )}
        </form>
        <p className="text-center text-sm">
          {mode === "login" ? (
            <>
              No account?{" "}
              <button
                type="button"
                className="underline"
                onClick={() => setMode("signup")}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="underline"
                onClick={() => setMode("login")}
              >
                Log in
              </button>
            </>
          )}
        </p>
      </Card>
    </div>
  );
}
