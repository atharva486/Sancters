// src/app/layout.js
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Sancters Employee Productivity",
  description: "Track productivity, tasks, mood, and recognition.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {/* 🔹 Top Navigation */}
        <header className="bg-white shadow-md sticky top-0 z-50">
          <nav className="container mx-auto flex items-center justify-between p-4">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold text-blue-600">
              Sancters
            </Link>

            {/* Menu */}
            <div className="flex space-x-6">
              <Link href="/" className="hover:text-blue-600">
                Dashboard
              </Link>
              <Link href="/employee" className="hover:text-blue-600">
                Employee
              </Link>
              <Link href="/manager" className="hover:text-blue-600">
                Manager
              </Link>
              <Link href="/settings" className="hover:text-blue-600">
                Settings
              </Link>
            </div>
          </nav>
        </header>

        {/* 🔹 Main Content */}
        <main className="container">{children}</main>

        {/* 🔹 Footer */}
        <footer className="bg-gray-100 text-center text-sm py-4">
          © {new Date().getFullYear()} Sancters — Productivity with Trust
        </footer>
      </body>
    </html>
  );
}
