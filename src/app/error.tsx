// src/app/error.tsx
"use client"; // This is a Client Component for handling runtime errors

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

// Props for the error boundary component
interface ErrorProps {
  error: Error;
  reset: () => void;
}

// Displays a graceful fallback UI when an error occurs
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Client-side error caught:", error);
    // You can send this error to a tracking service here (e.g. Sentry)
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-12 font-poppins text-center">
      <AlertTriangle size={80} className="text-yellow-500 mb-6" />
      <h1 className="text-5xl md:text-6xl font-bold mb-4">500</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-6">Internal Server Error</h2>
      <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-md">Sorry, something went wrong on our end. Please try again later.</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button onClick={() => reset()} className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300">
          Try Again
        </button>
        <Link href="/" className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 dark:text-blue-400 text-lg font-medium rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-300">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
