export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg hover:shadow-2xl transition-shadow duration-300 ${className ?? ''}`}
    >
      {children}
    </div>
  );
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`p-6 sm:p-8 ${className ?? ''}`}>
      {children}
    </div>
  );
}
