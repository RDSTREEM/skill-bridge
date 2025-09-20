"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./button";
import {
  Home,
  BookOpen,
  User,
  Award,
  Settings,
  Menu,
  X,
  PowerOff,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/challenges", label: "Challenges", icon: BookOpen },
  { path: "/certificates", label: "Certificates", icon: Award },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const { user } = useAuth();

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="heading-sm text-foreground">Skill Bridge</span>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="focus-ring"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Ethiopian flag accent */}
        <div className="flag-pattern" />
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm">
          <nav className="flex flex-col space-y-2 p-4 pt-20">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-secondary ${
                    isActive(item.path)
                      ? "border-primary text-primary-foreground"
                      : "text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-4 border-t">
              {user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-secondary"
                >
                  <Settings className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-secondary"
                >
                  <User className="h-5 w-5" />
                  <span>Log In</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center space-y-1 rounded-lg px-2 py-2 text-xs font-medium transition-colors ${
                  isActive(item.path)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export function DesktopNav() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const { user } = useAuth();

  return (
    <header className="hidden md:block sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="heading-md text-foreground">Skill Bridge</div>
              <div className="text-xs text-muted-foreground">
                Micro-Internship Platform
              </div>
            </div>
          </Link>

          <nav className="flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <Button variant="outline" size="sm" asChild>
              {user ? (
                <Link href="/dashboard">
                  <Settings className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              ) : (
                <Link href="/login">
                  <User className="h-4 w-4 mr-2" />
                  Log In
                </Link>
              )}
            </Button>
          </nav>
        </div>
      </div>

      {/* Ethiopian flag accent */}
      <div className="flag-pattern" />
    </header>
  );
}
