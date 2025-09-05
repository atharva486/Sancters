"use client";

import { useState, useEffect } from "react";
import { db } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";

export default function EmployeePage() {
  const [tasks, setTasks] = useState([]);
  const [mood, setMood] = useState(null);

  // Fetch tasks (dummy fetch from Firestore "tasks" collection)
  useEffect(() => {
    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(data);
    };
    fetchTasks();
  }, []);

  // Mood check-in handler
  const handleMoodCheckin = (selectedMood) => {
    setMood(selectedMood);
    // TODO: save to Firestore "moods" collection
    console.log("Mood logged:", selectedMood);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-slate-900 text-white p-6">
        <h2 className="text-xl font-bold mb-6">Employee Panel</h2>
        <nav className="space-y-3">
          <a href="/employee" className="block hover:text-emerald-400">Dashboard</a>
          <a href="/tasks" className="block hover:text-emerald-400">My Tasks</a>
          <a href="/shoutouts" className="block hover:text-emerald-400">Shout-outs</a>
          <a href="/mood" className="block hover:text-emerald-400">Mood Check</a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Welcome back 👋</h1>

        {/* Today’s Focus */}
        <section className="mb-6 p-4 bg-white shadow rounded-xl">
          <h2 className="font-semibold text-lg mb-3">Today’s Focus</h2>
          {tasks.length > 0 ? (
            <ul className="space-y-2">
              {tasks.slice(0, 3).map((task) => (
                <li
                  key={task.id}
                  className="p-3 border rounded-lg flex justify-between items-center"
                >
                  <span>{task.title}</span>
                  <span className="text-sm text-gray-500">
                    {task.status || "Pending"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No tasks assigned yet.</p>
          )}
        </section>

        {/* Mood Check-in */}
        <section className="mb-6 p-4 bg-white shadow rounded-xl">
          <h2 className="font-semibold text-lg mb-3">Mood Check-in</h2>
          <div className="flex space-x-4 text-2xl">
            {["🙂", "😐", "🙁"].map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleMoodCheckin(emoji)}
                className={`p-2 rounded-lg ${
                  mood === emoji ? "bg-emerald-100" : "bg-slate-100"
                } hover:scale-110 transition`}
              >
                {emoji}
              </button>
            ))}
          </div>
          {mood && (
            <p className="mt-2 text-sm text-gray-600">You checked in as {mood}</p>
          )}
        </section>

        {/* Progress Snapshot */}
        <section className="p-4 bg-white shadow rounded-xl">
          <h2 className="font-semibold text-lg mb-3">Progress Snapshot</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-slate-100 rounded-lg">
              <p className="text-2xl font-bold text-emerald-600">
                {tasks.filter((t) => t.status === "in-progress").length}
              </p>
              <p className="text-sm text-gray-500">In Progress</p>
            </div>
            <div className="p-3 bg-slate-100 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {tasks.filter((t) => t.status === "completed").length}
              </p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
            <div className="p-3 bg-slate-100 rounded-lg">
              <p className="text-2xl font-bold text-red-600">
                {tasks.filter((t) => t.status === "pending").length}
              </p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>
        </section>
      </main>

      {/* Right Sidebar */}
      <aside className="hidden lg:block w-72 bg-white border-l p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Insights</h2>
        <div className="space-y-4">
          <div className="p-3 bg-emerald-50 rounded-lg">
            <p className="font-medium">Streak</p>
            <p className="text-sm text-gray-600">4 days consistent progress 🔥</p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="font-medium">Deadline Alert</p>
            <p className="text-sm text-gray-600">Task “UI Revamp” due tomorrow</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="font-medium">Encouragement</p>
            <p className="text-sm text-gray-600">You’re 70% done with weekly goals 🎯</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
