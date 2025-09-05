"use client";

import { useState, useEffect } from "react";
import { db } from "@/firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function ManagerPage() {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [newProject, setNewProject] = useState({ name: "", progress: 0 });
  const [assignment, setAssignment] = useState({ employeeId: "", projectId: "" });

  // Fetch Projects & Employees
  useEffect(() => {
    const fetchData = async () => {
      const projectSnapshot = await getDocs(collection(db, "projects"));
      setProjects(
        projectSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );

      const employeeSnapshot = await getDocs(collection(db, "employees"));
      setEmployees(
        employeeSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    fetchData();
  }, []);

  // Add new project
  const handleAddProject = async () => {
    if (!newProject.name) return;
    await addDoc(collection(db, "projects"), newProject);
    setNewProject({ name: "", progress: 0 });
    alert("✅ Project added successfully!");
  };

  // Assign project to employee
  const handleAssign = async () => {
    if (!assignment.employeeId || !assignment.projectId) return;

    const employeeRef = doc(db, "employees", assignment.employeeId);
    await updateDoc(employeeRef, {
      assignedProject: assignment.projectId,
    });

    alert("✅ Project assigned successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-slate-900 text-white p-6">
        <h2 className="text-xl font-bold mb-6">Manager Panel</h2>
        <nav className="space-y-3">
          <a href="/manager" className="block hover:text-emerald-400">
            Dashboard
          </a>
          <a href="/assign" className="block hover:text-emerald-400">
            Assign Projects
          </a>
          <a href="/progress" className="block hover:text-emerald-400">
            Employee Progress
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-6">Manager Dashboard 🚀</h1>

        {/* Project Overview */}
        <section className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Projects Overview</h2>
          {projects.length > 0 ? (
            <ul className="space-y-4">
              {projects.map((project) => (
                <li key={project.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{project.name}</span>
                    <span className="text-sm text-gray-500">
                      {project.progress || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-3 rounded-full ${
                        project.progress >= 80
                          ? "bg-green-500"
                          : project.progress >= 50
                          ? "bg-yellow-400"
                          : "bg-red-400"
                      }`}
                      style={{ width: `${project.progress || 0}% `}}
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No projects yet.</p>
          )}
        </section>

        {/* Add New Project */}
        <section className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Add New Project</h2>
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Project Name"
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
              className="flex-1 p-2 border rounded-lg"
            />
            <button
              onClick={handleAddProject}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
            >
              Add
            </button>
          </div>
        </section>

        {/* Assign Project */}
        <section className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Assign Project</h2>
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
            <select
              value={assignment.employeeId}
              onChange={(e) =>
                setAssignment({ ...assignment, employeeId: e.target.value })
              }
              className="flex-1 p-2 border rounded-lg"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>

            <select
              value={assignment.projectId}
              onChange={(e) =>
                setAssignment({ ...assignment, projectId: e.target.value })
              }
              className="flex-1 p-2 border rounded-lg"
            >
              <option value="">Select Project</option>
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleAssign}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Assign
            </button>
          </div>
        </section>

        {/* Employee Progress */}
        <section className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Employee Progress</h2>
          {employees.length > 0 ? (
            <ul className="space-y-4">
              {employees.map((emp) => (
                <li key={emp.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{emp.name}</span>
                    <span className="text-sm text-gray-500">
                      {emp.progress || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-3 rounded-full">
                    <div
                      className="h-3 bg-emerald-500 rounded-full"
                      style={{ width: `${emp.progress || 0}%` }}
                    />
                  </div>
                  <p className="text-xs mt-1 text-gray-500">
                    Assigned Project:{" "}
                    {projects.find((p) => p.id === emp.assignedProject)?.name ||
                      "None"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No employees yet.</p>
          )}
        </section>
      </main>
    </div>
  );
}