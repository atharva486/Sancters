// src/app/layout.js
import "./globals.css";
import Link from "next/link";
export const metadata = {
  title: "Produs Productivity",
  description: "Track productivity, tasks, and recognition.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {/* 🔹 Main Content */}
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
