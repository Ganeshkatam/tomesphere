"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminLogin } from "./actions";
import { Activity } from "lucide-react";

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await adminLogin(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      const redirectTo = searchParams.get("redirectTo") || "/";
      // Basic check to ensure it's a relative path for security
      const safeRedirect = redirectTo.startsWith("/") ? redirectTo : "/";
      router.push(safeRedirect);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 text-indigo-400">
            <Activity size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-50">TomeSphere Admin</h1>
          <p className="text-sm text-slate-400 mt-2">Sign in to access operational tools</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-slate-950 border border-slate-800 text-slate-50 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full bg-slate-950 border border-slate-800 text-slate-50 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all disabled:opacity-50 mt-4"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
