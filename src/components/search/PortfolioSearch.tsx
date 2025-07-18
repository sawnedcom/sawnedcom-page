// src/components/search/PortfolioSearch.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";

const PortfolioSearch: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const initialSearchQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-12">
      <div className="relative group">
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-300 ${isFocused ? "opacity-20 dark:opacity-30" : ""}`}></div>

        <input type="text" placeholder="Search projects by name..." value={searchQuery} onChange={handleChange} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} className="w-full px-6 py-4 pr-14 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-lg transition-all duration-300 group-hover:shadow-md" />

        <button type="submit" className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 ${searchQuery || isFocused ? "text-blue-600 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-900/30" : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"}`} aria-label="Search">
          <Search size={24} className="transition-transform duration-200 group-hover:scale-110" />
        </button>
      </div>
    </form>
  );
};

export default PortfolioSearch;
