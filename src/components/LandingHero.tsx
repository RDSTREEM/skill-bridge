import Link from "next/link";
import Image from "next/image";

export default function LandingHero() {
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 text-center p-8">
      <h1 className="text-5xl font-extrabold mb-4 text-blue-900 drop-shadow-lg">
        Skill-Bridge
      </h1>
      <p className="text-xl mb-8 text-gray-700 max-w-xl mx-auto">
        Connect with mentors, tackle real-world challenges, and build your
        portfolio. The bridge to your future starts here.
      </p>
      <div className="flex gap-4 justify-center">
        <Link href="/login">
          <button className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-lg shadow hover:bg-blue-700 transition">
            Sign Up / Login
          </button>
        </Link>
        <a
          href="#about"
          className="px-6 py-3 rounded-xl bg-white border border-blue-600 text-blue-600 font-semibold text-lg shadow hover:bg-blue-50 transition"
        >
          Learn More
        </a>
      </div>
      <Image
        src="/globe.svg"
        alt="Learning"
        width={256}
        height={256}
        className="w-64 mt-12 animate-float"
        unoptimized
      />
    </section>
  );
}
