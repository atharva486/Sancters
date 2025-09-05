// src/app/page.js
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
      {/* Hero Section */}
      <section>
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600">
          Welcome to <span className="text-gray-800">Sancters</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
          Track productivity, reduce workplace toxicity, ensure fair recognition,
          and build a culture of trust. 🚀
        </p>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-6">
        <Link
          href="/employee"
          target="_blank"
          rel="noopener norefrrer"
        className="bg-white shadow-md rounded-2xl p-6 transition transform hover:-translate-y-1 hover:shadow-lg"
        >
          <h2 className="text-xl font-semibold text-blue-600">Employee</h2>
          <p className="text-gray-600 mt-2">
            View tasks, log moods, and celebrate progress.
          </p>
        </Link>

        <Link
          href="/manager"
        className="bg-white shadow-md rounded-2xl p-6 transition transform hover:-translate-y-1 hover:shadow-lg"
        >
          <h2 className="text-xl font-semibold text-blue-600">Manager</h2>
          <p className="text-gray-600 mt-2">
            Monitor team performance and gain insights.
          </p>
        </Link>

        <Link
          href="/settings"
        className="bg-white shadow-md rounded-2xl p-6 transition transform hover:-translate-y-1 hover:shadow-lg"
        >
          <h2 className="text-xl font-semibold text-blue-600">Settings</h2>
          <p className="text-gray-600 mt-2">
            Customize notifications, preferences, and privacy.
          </p>
        </Link>
      </section>

      {/* Footer Note */}
      <footer className="text-gray-500 text-sm mt-10">
        Built with ❤️ using Next.js + TailwindCSS
      </footer>
    </div>
  );
}
