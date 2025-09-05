"use client";
import React from 'react';
import Link from 'next/link';
import LoginPage from '../app/login/page';
import { useRouter } from 'next/navigation';
function Navbar() {
  const router = useRouter();
  function login(){
    router.push('/login');
  }
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
          <nav className="container mx-auto flex items-center justify-between p-4">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold text-blue-600">
              Produs
            </Link>

            {/* Menu */}
            <div className="flex space-x-6">
              <Link href="/" className="hover:text-blue-600">
                Dashboard
              </Link>
              <Link href='/employee' className="hover:text-blue-600">
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
  )
}

export default Navbar
