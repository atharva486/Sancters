"use client";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white px-6">
      {/* Logo + Tagline */}
      <div className="text-center mb-10">
        <div className="flex justify-center items-center space-x-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
            S
          </div>
          <h1 className="text-xl font-semibold text-gray-800">
            Sancters
          </h1>
        </div>
        <p className="text-sm text-gray-500 mt-2">Productivity & Trust, Simplified</p>
      </div>

      {/* Headline */}
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 max-w-2xl text-center leading-tight">
        The fair work platform, for everyone
      </h2>
      <p className="mt-4 text-lg text-gray-600 text-center max-w-xl">
        Empower your team with tasks, recognition, and well-being — all in one simple, transparent platform.
      </p>

      {/* CTA */}
      <div className="mt-8">
        <Link
          href="/signup"
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:opacity-90 transition"
        >
          Get Started — It’s Free
        </Link>
      </div>

      
    </main>
  );
}
