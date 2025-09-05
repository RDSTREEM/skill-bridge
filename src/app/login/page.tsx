'use client';
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


export default function LoginPage() {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [mode, setMode] = useState<'login' | 'signup'>('login');
const [error, setError] = useState<string | null>(null);


const submit = async (e: React.FormEvent) => {
e.preventDefault();
setError(null);
try {
if (mode === 'login') {
await signInWithEmailAndPassword(auth, email, password);
} else {
await createUserWithEmailAndPassword(auth, email, password);
}
} catch (err: any) {
setError(err.message);
}
};


return (
<div className="grid place-items-center mt-16">
<Card className="w-full max-w-md p-6 space-y-4">
<h1 className="text-2xl font-bold text-center">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
<form onSubmit={submit} className="space-y-3">
<Input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
<Input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
{error && <p className="text-sm text-red-600">{error}</p>}
<Button type="submit" className="w-full">{mode === 'login' ? 'Log in' : 'Sign up'}</Button>
</form>
<p className="text-center text-sm">
{mode === 'login' ? (
<>No account? <button className="underline" onClick={()=>setMode('signup')}>Sign up</button></>
) : (
<>Already have an account? <button className="underline" onClick={()=>setMode('login')}>Log in</button></>
)}
</p>
</Card>
</div>
);
}