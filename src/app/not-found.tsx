// src/app/not-found.tsx
// Custom 404 Page - Server Component with enhanced UI/UX

import Link from "next/link";
import { Frown } from "lucide-react";

/**
 * NotFound - Premium 404 Error Page
 * Features: Dark/light mode, responsive design, smooth animations
 * No external dependencies - uses native Tailwind styling
 */
export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-50 py-12 px-4 font-sans text-center">
      <div className="animate-bounce-slow">
        <Frown size={96} className="text-rose-500/90 mb-8 mx-auto" strokeWidth={1.5} />
      </div>

      <div className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <h1 className="text-7xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-amber-500">404</h1>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Page Not Found</h2>
        </div>

        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">The page you&apos;re looking for doesn&apos;t exist or has been moved. Please check the URL or navigate back to home.</p>
      </div>

      <Link href="/" className="mt-10 px-8 py-4 text-lg font-medium rounded-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
        Return to Homepage
        <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
      </Link>
    </main>
  );
}
