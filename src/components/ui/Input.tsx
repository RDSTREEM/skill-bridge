import { InputHTMLAttributes } from 'react';
export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
return <input {...props} className={`w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring ${props.className ?? ''}`} />;
}