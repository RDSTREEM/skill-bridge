import { ButtonHTMLAttributes } from 'react';

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                 text-white font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 
                 disabled:opacity-50 disabled:cursor-not-allowed ${props.className ?? ''}`}
    />
  );
}
