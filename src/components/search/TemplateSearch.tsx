// src/components/search/TemplateSearch.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X, Sparkles } from "lucide-react";

const TemplateSearch: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const initialSearchQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsTyping(true);

    // Clear typing indicator after user stops typing
    const timer = setTimeout(() => setIsTyping(false), 500);
    return () => clearTimeout(timer);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentParams = new URLSearchParams(searchParams.toString());

    if (searchQuery) {
      currentParams.set("q", searchQuery);
    } else {
      currentParams.delete("q");
    }

    router.push(`${pathname}?${currentParams.toString()}`);
  };

  const clearSearch = () => {
    setSearchQuery("");
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("q");
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Main Search Form */}
      <form onSubmit={handleSubmit} className="relative group mb-6">
        {/* Background Glow Effect */}
        <div className={`absolute -inset-1 rounded-full bg-gradient-to-r from-slate-500 via-gray-500 to-slate-600 opacity-0 blur-sm transition-all duration-500 ${isFocused || searchQuery ? "opacity-30" : "group-hover:opacity-20"}`}></div>

        {/* Search Input Container */}
        <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
          {/* Search Icon */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search size={22} className={`transition-all duration-300 ${isFocused || searchQuery ? "text-slate-600 dark:text-slate-400" : "text-gray-400 dark:text-gray-500"}`} />
          </div>

          {/* Input Field */}
          <input type="text" placeholder="Search templates by name. . ." value={searchQuery} onChange={handleChange} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} className="w-full pl-16 pr-24 py-5 bg-transparent rounded-full text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-lg font-medium focus:outline-none transition-all duration-300" />

          {/* Action Buttons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Clear Button */}
            {searchQuery && (
              <button type="button" onClick={clearSearch} className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all duration-200" aria-label="Clear search">
                <X size={18} />
              </button>
            )}

            {/* Search Button */}
            <button type="submit" className={`p-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${searchQuery || isFocused ? "bg-gradient-to-r from-slate-600 to-gray-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-slate-600 hover:to-gray-600 hover:text-white"}`} aria-label="Search templates">
              <Search size={20} />
            </button>
          </div>

          {/* Typing Indicator */}
          {isTyping && (
            <div className="absolute right-28 top-1/2 -translate-y-1/2">
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-1 h-1 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Search Status */}
        {searchQuery && (
          <div className="absolute -bottom-8 left-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Sparkles size={14} className="text-slate-500" />
            <span>
              Searching for: <span className="font-medium text-slate-600 dark:text-slate-400">{`"${searchQuery}"`}</span>
            </span>
          </div>
        )}
      </form>

      {/* Advanced Search Hint */}
      {!searchQuery && (
        <div className="mt-8 text-center animate-fadeIn" style={{ animationDelay: "0.2s" }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 backdrop-blur-sm rounded-full text-xs text-gray-500 dark:text-gray-400 border border-slate-200/50 dark:border-slate-700/30">
            <Sparkles size={12} className="text-slate-400" />
            <span>Try searching for the title</span>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TemplateSearch;
