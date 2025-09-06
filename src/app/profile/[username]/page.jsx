"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { db } from "@/firebase/config";
import { getDoc, setDoc, doc } from "firebase/firestore";

export default function ProfilePage() {
  const { username } = useParams();
  
  const router = useRouter();

  const [platformHandles, setPlatformHandles] = useState({
    codeforces: "",
    codechef: "",
  });

  const [connectedAccounts, setConnectedAccounts] = useState({
    codeforces: "",
    codechef: "",
  });

  const [platformStats, setPlatformStats] = useState({
    codeforces: "",
    codechef: "",
  });
  async function getUserHandlesFromDB(username) {
  const userDoc = await getDoc(doc(db, "users", username));
  if (!userDoc.exists()) return {};
  const data = userDoc.data();
  return {
    codeforces: data.codeforces || "",
    codechef: data.codechef || "",
  };
}   
async function saveUserHandleToDB(username, platform, handle) {
  const userRef = doc(db, "users", username);
  console.log(userRef);
  await setDoc(userRef, {
    [platform]: handle
  }, { merge: true });
}
  useEffect(() => {
    async function fetchDBHandles() {
      const dbHandles = await getUserHandlesFromDB(username);
      setConnectedAccounts({
        codeforces: dbHandles.codeforces || null,
        codechef: dbHandles.codechef || null,
      });
    }
    fetchDBHandles();
  }, [username]);

  const handleAddPlatform = async (platform) => {
    if (platformHandles[platform].trim() === "") return;

    const handle = platformHandles[platform].trim();

    await saveUserHandleToDB(username, platform, handle);

    setConnectedAccounts((prev) => ({
      ...prev,
      [platform]: handle,
    }));
    setPlatformHandles((prev) => ({
      ...prev,
      [platform]: "",
    }));
  };

  function handleSignOut() {
    router.push('/login');
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (connectedAccounts.codeforces) {
          const cfAPI = await fetch(
            `https://codeforces.com/api/user.info?handles=${connectedAccounts.codeforces}`
          );
          const cfData = await cfAPI.json();
          setPlatformStats((prev) => ({
            ...prev,
            codeforces: {
              rating: cfData.result[0]?.rating || "-",
              highestRating: cfData.result[0]?.maxRating || "-",
              problemsSolved: "-",
            },
          }));
        }

        if (connectedAccounts.codechef) {
          const username = connectedAccounts.codechef;
          const ccAPI = await fetch(`/api/codechef/${username}`);
          const ccData = await ccAPI.json();
          setPlatformStats((prev) => ({
            ...prev,
            codechef: {
              rating: ccData.rating || "-",
              highestRating: ccData.highestRating || "-",
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, [connectedAccounts]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-8 flex gap-6">
      <div className="w-80 bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-6">
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Coding Platforms</h2>
          {["codeforces", "codechef"].map((platform) => (
            <div key={platform} className="mb-3">
              <p className="capitalize font-medium">{platform}</p>
              {connectedAccounts[platform] ? (
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span>{connectedAccounts[platform]}</span>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() =>
                      setConnectedAccounts((prev) => ({
                        ...prev,
                        [platform]: null,
                      }))
                    }
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter your username"
                    className="flex-1 border p-1 rounded"
                    value={platformHandles[platform]}
                    onChange={(e) =>
                      setPlatformHandles((prev) => ({
                        ...prev,
                        [platform]: e.target.value,
                      }))
                    }
                  />
                  <button
                    className="bg-indigo-500 text-white px-3 rounded hover:bg-indigo-600 transition"
                    onClick={() => handleAddPlatform(platform)}
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={handleSignOut}
          className="mt-auto bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
        >
          Sign Out
        </button>
      </div>
      <div className="flex-1 bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome, {username}!</h1>
        <p className="text-gray-500 mb-6">Your connected coding accounts and stats:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(connectedAccounts).map(([platform, handle]) => (
            <div key={platform} className="p-4 bg-indigo-50 rounded">
              <h3 className="capitalize font-semibold">{platform}</h3>
              {handle ? (
                <>
                  <p>Connected: {handle}</p>
                  <p>Rating: {platformStats[platform]?.rating || "-"}</p>
                  <p>
                    Highest Rating: {platformStats[platform]?.highestRating || "-"}
                  </p>
                </>
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
