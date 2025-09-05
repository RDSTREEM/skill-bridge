import { ButtonHTMLAttributes } from 'react';
export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
return <button {...props} className={`px-4 py-2 rounded-xl bg-blue-600 text-white disabled:opacity-50 ${props.className ?? ''}`}/>;
}