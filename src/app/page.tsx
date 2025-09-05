'use client';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function Home() {
const { user, loading } = useAuth();
const router = useRouter();


useEffect(() => {
if (loading) return;
router.replace(user ? '/dashboard' : '/login');
}, [user, loading, router]);


return null;
}