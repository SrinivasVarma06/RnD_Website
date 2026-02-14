import React, { useState, useEffect } from "react";
import AdminPanel from "./AdminPanel";
import { adminLogin, adminVerify, adminLogout } from "../config/api";

export default function AdminGate() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // On mount, verify existing token
  useEffect(() => {
    adminVerify().then((valid) => {
      if (valid) setAuthorized(true);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await adminLogin(password);
      setAuthorized(true);
    } catch (err) {
      setError(err.message || "Invalid admin password");
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    setAuthorized(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Verifying session...</div>
      </div>
    );
  }

  if (authorized) {
    return <AdminPanel onLogout={handleLogout} />;
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

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            {error}
          </div>
        )}

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
