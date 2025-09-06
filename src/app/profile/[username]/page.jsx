"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/firebase/config";
import { getDoc, setDoc, doc } from "firebase/firestore";

export default function ProfilePage() {
  const { username } = useParams();
  const router = useRouter();

  // State for each platform, not nested, clean
  const [cfHandle, setCfHandle] = useState("");
  const [cfInput, setCfInput] = useState("");
  const [ccHandle, setCcHandle] = useState("");
  const [ccInput, setCcInput] = useState("");

const [notifications, setNotifications] = useState([]);


  const [cfStats, setCfStats] = useState({ rating: "-", highestRating: "-", solvedToday: 0 });
  const [ccStats, setCcStats] = useState({ rating: "-", highestRating: "-", solvedToday: 0, totalSolved: 0 });

  const [cfGoal, setCfGoal] = useState(0);
  const [ccGoal, setCcGoal] = useState(0);

  // Load platform handles on page load and when username changes
  useEffect(() => {
    async function fetchHandles() {
      const userDoc = await getDoc(doc(db, "users", username));
      if (!userDoc.exists()) return;
      const data = userDoc.data();
      setCfHandle(data.codeforces || "");
      setCfInput(data.codeforces || "");
      setCcHandle(data.codechef || "");
      setCcInput(data.codechef || "");
    }
    fetchHandles();
  }, [username]);

  // Fetch Codeforces stats
  useEffect(() => {
    async function fetchCF() {
      if (!cfHandle) return;
      // Info API
      const infoRes = await fetch(`https://codeforces.com/api/user.info?handles=${cfHandle}`);
      const info = await infoRes.json();
      const user = info.result[0];
      // Status API for today
      const statusRes = await fetch(`https://codeforces.com/api/user.status?handle=${cfHandle}`);
      const status = await statusRes.json();
      const today = new Date().toISOString().slice(0, 10);
      const solvedToday = status.result.filter(
        (s) => s.verdict === "OK" && new Date(s.creationTimeSeconds * 1000).toISOString().slice(0, 10) === today
      ).length;
      setCfStats({ rating: user.rating || "-", highestRating: user.maxRating || "-", solvedToday });
    }
    fetchCF();
  }, [cfHandle]);

  // Fetch CodeChef stats and track daily using your snapshot logic
useEffect(() => {
  async function fetchCC() {
    if (!ccHandle) return;
    const res = await fetch(`/api/codechef/${ccHandle}`);
    const data = await res.json();
    setCcStats({
      rating: data.rating || "-",
      highestRating: data.highestRating || "-",
      totalSolved: data.totalSolved || 0,
    });
  }
  fetchCC();
}, [ccHandle]);



  // Add or remove platform handle (and keep both handle & input in sync)
  const handleAddPlatform = async (platform, value) => {
    if (!value.trim()) return;
    await setDoc(doc(db, "users", username), { [platform]: value.trim() }, { merge: true });
    if (platform === "codeforces") {
      setCfHandle(value.trim());
      setCfInput(value.trim());
    } else if (platform === "codechef") {
      setCcHandle(value.trim());
      setCcInput(value.trim());
    }
  };

  // Remove: also remove from DB if desired
  const handleRemovePlatform = async (platform) => {
    await setDoc(doc(db, "users", username), { [platform]: "" }, { merge: true });
    if (platform === "codeforces") {
      setCfHandle("");
      setCfInput("");
      setCfStats({ rating: "-", highestRating: "-", solvedToday: 0 });
    } else if (platform === "codechef") {
      setCcHandle("");
      setCcInput("");
      setCcStats({ rating: "-", highestRating: "-", solvedToday: 0, totalSolved: 0 });
    }
  };


useEffect(() => {
  const notes = [];

  // Codeforces Goal Check
  if (cfHandle && cfGoal > 0) {
    if (cfStats.solvedToday < cfGoal) {
      notes.push(
        `🎯 Codeforces: You still need to solve ${cfGoal - cfStats.solvedToday} problems today!`
      );
    } else {
      notes.push(`✅ Codeforces: Daily goal completed! Great job 🚀`);
    }
  }

  // CodeChef Goal Check
  if (ccHandle && ccGoal > 0) {
    if (ccStats.totalSolved < ccGoal) {
      notes.push(
        `🎯 CodeChef: You still need ${ccGoal - ccStats.totalSolved} problems to hit your goal.`
      );
    } else {
      notes.push(`✅ CodeChef: Daily goal completed! 🎉`);
    }
  }

  setNotifications(notes);
}, [cfStats, ccStats, cfGoal, ccGoal, cfHandle, ccHandle]);



  return (
    <div className="min-h-screen bg-gray-100 p-6 flex gap-6">
      <div className="w-80 bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-6">
        <h2 className="text-xl font-semibold mb-2">Coding Platforms</h2>
        {/* Codeforces Section */}
        <div className="mb-6">
          <p className="capitalize font-medium">codeforces</p>
          {cfHandle ? (
            <div>
              <span>{cfHandle}</span>
              <button className="text-red-500 ml-2" onClick={() => handleRemovePlatform("codeforces")}>
                Remove
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter your username"
                className="flex-1 border p-1 rounded"
                onChange={(e) => setCfInput(e.target.value)}
                value={cfInput}
                autoComplete="off"
              />
              <button
                type="button"
                className="bg-indigo-500 text-white px-3 rounded"
                onClick={() => handleAddPlatform("codeforces", cfInput)}
              >
                Add
              </button>
            </div>
          )}
        </div>
        {/* CodeChef Section */}
        <div className="mb-6">
          <p className="capitalize font-medium">codechef</p>
          {ccHandle ? (
            <div>
              <span>{ccHandle}</span>
              <button className="text-red-500 ml-2" onClick={() => handleRemovePlatform("codechef")}>
                Remove
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter your username"
                className="flex-1 border p-1 rounded"
                onChange={(e) => setCcInput(e.target.value)}
                value={ccInput}
                autoComplete="off"
              />
              <button
                type="button"
                className="bg-indigo-500 text-white px-3 rounded"
                onClick={() => handleAddPlatform("codechef", ccInput)}
              >
                Add
              </button>
            </div>
          )}
        </div>
        <button
          onClick={() => router.push('/login')}
          className="mt-auto bg-red-500 text-white py-2 rounded"
        >
          Sign Out
        </button>
      </div>
      <div className="flex-1 bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome, {username}!</h1>

{/* 🔔 Notifications Banner */}
{notifications.length > 0 && (
  <div className="mb-6">
    {notifications.map((note, idx) => (
      <div
        key={idx}
        className={`p-4 mb-2 rounded-lg shadow-md ${
          note.includes("✅")
            ? "bg-green-100 text-green-800 border border-green-300"
            : "bg-yellow-100 text-yellow-800 border border-yellow-300"
        }`}
      >
        {note}
      </div>
    ))}
  </div>
)}


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Codeforces Stats */}
          <div className="p-4 bg-indigo-50 rounded">
            <h3 className="font-semibold mb-2">Codeforces</h3>
            {cfHandle && (
              <>
                <p>Rating: {cfStats.rating}</p>
                <p>Highest Rating: {cfStats.highestRating}</p>
                <p>Problems Solved Today: {cfStats.solvedToday}</p>
                <label>
                  Daily Goal:
                  <input
                    type="number"
                    className="border ml-2 px-1 w-20"
                    value={cfGoal}
                    onChange={e => setCfGoal(+e.target.value)}
                  />
                </label>
                <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                  <div
                    className={`h-4 rounded-full ${cfStats.solvedToday >= cfGoal ? "bg-green-500" : "bg-blue-500"}`}
                    style={{
                      width: `${Math.min(cfStats.solvedToday / Math.max(cfGoal, 1), 1) * 100}%`,
                    }}
                  />
                </div>
              </>
            )}
          </div>
          {/* CodeChef Stats */}
          <div className="p-4 bg-indigo-50 rounded">
  <h3 className="font-semibold mb-2">CodeChef</h3>
  {ccHandle && (
    <>
      <p>Current Rating: {ccStats.rating}</p>
      <p>Highest Rating: {ccStats.highestRating}</p>
      <p>Total Problems Solved: {ccStats.totalSolved}</p>
      <label>
        Daily Goal:
        <input
          type="number"
          className="border ml-2 px-1 w-20"
          value={ccGoal}
          onChange={e => setCcGoal(+e.target.value)}
        />
      </label>
      {/* Optional: you can hide progress bar if you don't want daily for CodeChef */}
      <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
        <div
          className="h-4 rounded-full bg-blue-500"
          style={{
            width: `${Math.min(ccStats.totalSolved / Math.max(ccGoal, 1), 1) * 100}%`,
          }}
        />
      </div>
    </>
  )}
</div>

        </div>
      </div>
    </div>
  );
}
