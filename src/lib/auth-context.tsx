'use client';
import { onAuthStateChanged, User, getIdTokenResult, IdTokenResult } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebase';


interface Ctx { user: User | null; loading: boolean; token: IdTokenResult | null; }
const Ctx = createContext<Ctx>({ user: null, loading: true, token: null });


export function AuthProvider({ children }: { children: React.ReactNode }) {
const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState(true);
const [token, setToken] = useState<IdTokenResult | null>(null);


useEffect(() => {
return onAuthStateChanged(auth, async u => {
setUser(u);
if (u) setToken(await getIdTokenResult(u, true));
else setToken(null);
setLoading(false);
});
}, []);


return <Ctx.Provider value={{ user, loading, token }}>{children}</Ctx.Provider>;
}


export const useAuth = () => useContext(Ctx);