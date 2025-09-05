"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const router = useRouter();
  const [empId,setEmpId]=useState('');
  const [password,setPassword] = useState('');
  function check(e){
    e.preventDefault();
    console.log("Done");
    router.push('/signup');
  }
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.toptal.com/designers/subtlepatterns/patterns/memphis-mini.png')] opacity-10" />

      <div className="relative z-10 bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md text-center transform hover:scale-[1.01] transition">
        <div className="flex justify-center items-center space-x-2 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
            S
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">Sancters</h1>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-500 text-sm mb-6">You are free to go 🚀</p>

        <form className="space-y-4" onSubmit={check}>
          <input
            type="text"
            placeholder="Employee ID"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            required
            onChange={(e)=>{setEmpId(e.target.value)}}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            required
            onChange={(e)=>{setPassword(e.target.value)}}
          />
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:opacity-90 transition"
          >
            Log In
          </button>
        </form>


        <p className="mt-6 text-sm text-gray-600">
          Don’t have an account?{" "}
          <button className="text-blue-600 hover:underline" onClick={()=>{router.push('/signup')}}>Signup</button>
        </p>
      </div>
    </main>
  );
}