"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/firebase/config";
import { getDoc, setDoc, doc } from "firebase/firestore";
import { CheckCircle, AlertTriangle, PlusCircle, Trash2, LogOut } from "lucide-react";

// Circular progress component
function CircularProgress({ progress, size = 80, strokeWidth = 8, color }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  return (
    <svg width={size} height={size}>
      <circle
        stroke="#e5e7eb"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.5s ease" }}
      />
    </svg>
  );
}

export default function ProfilePage() {
  const { username } = useParams();
  const router = useRouter();

  const [cfHandle, setCfHandle] = useState("");
  const [cfInput, setCfInput] = useState("");
  const [ccHandle, setCcHandle] = useState("");
  const [ccInput, setCcInput] = useState("");

  const [cfStats, setCfStats] = useState({ rating: "-", highestRating: "-", solvedToday: 0 });
  const [ccStats, setCcStats] = useState({ rating: "-", highestRating: "-", solvedToday: 0, totalSolved: 0 });

  const [cfGoal, setCfGoal] = useState(0);
  const [ccGoal, setCcGoal] = useState(0);

  const [notifications, setNotifications] = useState([]);

  // Load handles from Firebase
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
      const infoRes = await fetch(`https://codeforces.com/api/user.info?handles=${cfHandle}`);
      const info = await infoRes.json();
      const user = info.result[0];
      const statusRes = await fetch(`https://codeforces.com/api/user.status?handle=${cfHandle}`);
      const status = await statusRes.json();
      const today = new Date().toISOString().slice(0, 10);
      const solvedToday = status.result.filter(
        s => s.verdict === "OK" && new Date(s.creationTimeSeconds * 1000).toISOString().slice(0, 10) === today
      ).length;
      setCfStats({ rating: user.rating || "-", highestRating: user.maxRating || "-", solvedToday });
    }
    fetchCF();
  }, [cfHandle]);

  // Fetch CodeChef stats
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

  const handleRemovePlatform = async (platform) => {
    await setDoc(doc(db, "users", username), { [platform]: "" }, { merge: true });
    if (platform === "codeforces") {
      setCfHandle("");
      setCfInput("");
      setCfStats({ rating: "-", highestRating: "-", solvedToday: 0 });
    } else {
      setCcHandle("");
      setCcInput("");
      setCcStats({ rating: "-", highestRating: "-", solvedToday: 0, totalSolved: 0 });
    }
  };

  // Notifications logic
  useEffect(() => {
    const notes = [];
    if (cfHandle && cfGoal > 0) {
      notes.push(
        cfStats.solvedToday >= cfGoal
          ? `✅ Codeforces: Goal Completed! 🎯`
          : `⚠️ Codeforces: ${cfGoal - cfStats.solvedToday} problems left today.`
      );
    }
    if (ccHandle && ccGoal > 0) {
      notes.push(
        ccStats.totalSolved >= ccGoal
          ? `✅ CodeChef: Goal Completed! 🎉`
          : `⚠️ CodeChef: ${ccGoal - ccStats.totalSolved} problems left today.`
      );
    }
    setNotifications(notes);
  }, [cfStats, ccStats, cfGoal, ccGoal, cfHandle, ccHandle]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 flex flex-col md:flex-row gap-6">
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-6">
        <h2 className="text-2xl font-bold mb-4">Your Coding Platforms</h2>
        {["codeforces", "codechef"].map((platform) => {
          const handle = platform === "codeforces" ? cfHandle : ccHandle;
          const input = platform === "codeforces" ? cfInput : ccInput;
          return (
            <div key={platform} className="mb-4">
              <p className="font-semibold capitalize mb-2">{platform}</p>
              {handle ? (
                <div className="flex items-center justify-between bg-green-50 p-2 rounded shadow hover:shadow-lg transition">
                  <span>{handle}</span>
                  <button className="text-red-500" onClick={() => handleRemovePlatform(platform)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => platform === "codeforces" ? setCfInput(e.target.value) : setCcInput(e.target.value)}
                    className="flex-1 border p-2 rounded"
                    placeholder={`Enter your ${platform} handle`}
                  />
                  <button
                    className="bg-indigo-500 text-white px-3 rounded hover:bg-indigo-600 transition flex items-center gap-1"
                    onClick={() => handleAddPlatform(platform, input)}
                  >
                    <PlusCircle size={16} /> Add
                  </button>
                </div>
              )}
            </div>
          );
        })}
        <button
          onClick={() => router.push("/login")}
          className="mt-auto bg-red-500 text-white py-2 rounded hover:bg-red-600 flex items-center justify-center gap-2"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>

      {/* Main Stats */}
      <div className="flex-1 flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Welcome, {username}!</h1>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="flex flex-col gap-2">
            {notifications.map((note, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border shadow flex items-center gap-2 ${
                  note.includes("✅") ? "bg-green-100 text-green-800 border-green-300" : "bg-yellow-100 text-yellow-800 border-yellow-300"
                }`}
              >
                {note.includes("✅") ? <CheckCircle /> : <AlertTriangle />}
                <span>{note}</span>
              </div>
            ))}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Codeforces Card */}
          <div className="bg-indigo-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition flex flex-col items-center gap-4">
            <h3 className="font-semibold text-xl flex items-center gap-2">Codeforces</h3>
            <p>Rating: {cfStats.rating}</p>
            <p>Highest: {cfStats.highestRating}</p>
            <CircularProgress
              progress={Math.min((cfStats.solvedToday / Math.max(cfGoal, 1)) * 100, 100)}
              color={cfStats.solvedToday >= cfGoal ? "#16a34a" : "#3b82f6"}
            />
            <label className="flex items-center gap-2">
              Daily Goal:
              <input type="number" value={cfGoal} onChange={e => setCfGoal(+e.target.value)} className="border px-2 rounded w-20"/>
            </label>
          </div>

          {/* CodeChef Card */}
          <div className="bg-orange-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition flex flex-col items-center gap-4">
            <h3 className="font-semibold text-xl flex items-center gap-2">CodeChef</h3>
            <p>Rating: {ccStats.rating}</p>
            <p>Highest: {ccStats.highestRating}</p>
            <p>Total Solved: {ccStats.totalSolved}</p>
            <CircularProgress
              progress={Math.min((ccStats.totalSolved / Math.max(ccGoal, 1)) * 100, 100)}
              color={ccStats.totalSolved >= ccGoal ? "#16a34a" : "#f97316"}
            />
            <label className="flex items-center gap-2">
              Daily Goal:
              <input type="number" value={ccGoal} onChange={e => setCcGoal(+e.target.value)} className="border px-2 rounded w-20"/>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
