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
<main>{children}</main>
</AuthProvider>
</body>
</html>
);
}