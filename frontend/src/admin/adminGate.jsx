import React, { useState, useEffect } from "react";
import AdminPanel from "./AdminPanel";

export default function AdminGate() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const isAdmin = sessionStorage.getItem("admin_authenticated");
    if (isAdmin === "true") {
      setAuthorized(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_authenticated", "true");
      setAuthorized(true);
    } else {
      alert("Invalid admin password");
    }
  };

  if (authorized) {
    return <AdminPanel onLogout={() => setAuthorized(false)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Admin Access
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Authorized personnel only
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />

          <button
            type="submit"
            className="w-full mt-5 bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 rounded-lg transition"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
