// src/components/search/TemplateSearch.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";

const TemplateSearch: React.FC = () => {
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
        {/* Gradient background effect */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-blue-500 opacity-0 group-hover:opacity-15 dark:group-hover:opacity-20 transition-opacity duration-300 ${isFocused ? "opacity-15 dark:opacity-20" : ""}`}></div>

        <input type="text" placeholder="Search templates by name, tech or description..." value={searchQuery} onChange={handleChange} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} className="w-full px-6 py-4 pr-14 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-lg transition-all duration-300 group-hover:shadow-md" />

        <button type="submit" className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 ${searchQuery || isFocused ? "text-green-600 dark:text-green-400 bg-green-100/50 dark:bg-green-900/30" : "text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"}`} aria-label="Search templates">
          <Search size={24} className="transition-transform duration-200 group-hover:scale-110" />
        </button>
      </div>
    </form>
  );
};

export default TemplateSearch;
