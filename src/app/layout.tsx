import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth-context';
import { Navbar } from '@/components/Navbar';


export const metadata: Metadata = {
title: 'Skill Bridge',
description: 'Simulated micro-internships for Ethiopian students',
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body className="min-h-screen bg-gray-50 text-gray-900">
<AuthProvider>
<Navbar />
<main className="max-w-5xl mx-auto p-4 md:p-6">{children}</main>
</AuthProvider>
</body>
</html>
);
}