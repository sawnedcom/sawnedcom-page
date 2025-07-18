// src/app/login/page.tsx
"use client";

import React, { useState } from "react";
import { createClientComponentClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`Login failed: ${error.message}`);
    } else {
      setMessage("Login successful! Redirecting to dashboard...");
      router.push("/dashboard");
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(`Google login failed: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 font-poppins">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Admin Portal</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="your@email.com" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="cursor-pointer w-full flex items-center justify-center px-4 py-3 rounded-lg shadow-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
            ) : (
              <>
                <LogIn className="mr-2" size={20} /> Sign In
              </>
            )}
          </button>
        </form>

        {message && <p className={`text-center text-sm ${message.includes("failed") ? "text-red-500" : "text-green-500"}`}>{message}</p>}

        <div className="relative flex justify-center">
          <span className="relative z-10 px-2 bg-white dark:bg-gray-800 text-xs uppercase text-gray-500 dark:text-gray-400">Or continue with</span>
          <div className="absolute inset-x-0 top-1/2 h-px bg-gray-200 dark:bg-gray-700"></div>
        </div>

        <button onClick={handleGoogleSignIn} disabled={loading} className="cursor-pointer w-full flex items-center justify-center px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? (
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
          ) : (
            <>
              <svg className="mr-2" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.24 10.21V14.16H18.49C18.26 15.54 17.51 16.65 16.42 17.42C15.34 18.2 13.98 18.66 12.24 18.66C9.17 18.66 6.64 16.14 6.64 13.07C6.64 10 9.17 7.47 12.24 7.47C13.98 7.47 15.34 8.12 16.42 8.89L19.16 6.15C17.26 4.39 14.86 3.47 12.24 3.47C7.03 3.47 2.76 7.74 2.76 13.07C2.76 18.41 7.03 22.68 12.24 22.68C14.86 22.68 17.26 21.76 19.16 20.01C21.05 18.25 22.04 15.74 22.04 13.07C22.04 12.29 21.99 11.51 21.89 10.74H12.24V10.21Z" fill="#4285F4" />
              </svg>
              Sign in with Google
            </>
          )}
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">You can register with google</p>
      </div>
    </main>
  );
}
