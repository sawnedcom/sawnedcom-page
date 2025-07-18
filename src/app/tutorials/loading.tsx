// src/app/portfolio/loading.tsx
// Premium Loading Component for Portfolio Page

import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-16 font-poppins">
      <div className="text-center">
        {/* Animated Spinner with Gradient */}
        <div className="relative inline-block mb-8">
          <Loader2 size={72} className="animate-spin text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600" />
          <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900/30 border-t-transparent animate-spin"></div>
        </div>

        {/* Loading Text */}
        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">Loading Tutorials</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md mx-auto">Welcome to our tutorials</p>
      </div>
    </div>
  );
}
