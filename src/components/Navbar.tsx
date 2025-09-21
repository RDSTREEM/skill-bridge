"use client";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ProfileDropdown } from "./ProfileDropdown";

export function Navbar() {
  const { user } = useAuth();
  return (
    <header className="border-b bg-white">
      <div className="max-w-5xl mx-auto p-3 flex items-center justify-between">
        <Link href="/" className="font-bold">
          Skill Bridge
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/challenges" className="hover:underline">
            Challenges
          </Link>
          {user && (
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
          )}
          <Link href="/admin" className="hover:underline">
            Admin
          </Link>
          {user ? (
            <ProfileDropdown />
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 rounded bg-gray-900 text-white"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
