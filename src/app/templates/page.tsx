// src/app/templates/page.tsx

import { createServerComponentClient } from "@/lib/supabaseClient";
import { cookies } from "next/headers";
import TemplateCard from "@/components/templates/TemplateCard";
import TemplateSearch from "@/components/search/TemplateSearch";
import { Metadata } from "next";

interface Template {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  live_demo_url: string | null;
  download_url: string | null;
  gumroad_url: string | null;
  tags: string[];
  price: number;
  is_free: boolean;
  is_published: boolean;
  type: string;
}

export const metadata: Metadata = {
  title: "Templates - Sawnedcom",
  description: "Discover premium, production-ready templates from Sawnedcom.",
};

interface PageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TemplatesPage({ searchParams }: PageProps) {
  const supabase = createServerComponentClient(cookies());

  const resolvedSearchParams = await searchParams;
  const searchQuery = (resolvedSearchParams?.q || "").toString().toLowerCase();

  let query = supabase.from("templates").select("*").eq("is_published", true).order("created_at", { ascending: false });

  if (searchQuery) {
    query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`);
  }

  const { data: templates, error } = await query;

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-900 dark:via-gray-950 dark:to-slate-950 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 opacity-30"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] max-w-[800px] h-[300px] sm:h-[400px] bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
          <div className="backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 rounded-3xl shadow-2xl p-6 sm:p-12 max-w-2xl mx-auto border border-white/20 dark:border-slate-700/50">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.882 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600 mb-6">Premium Templates</h1>
            <p className="text-red-600 dark:text-red-400 text-base sm:text-lg font-medium mb-4">Oops! Something went wrong</p>
            <p className="text-gray-600 dark:text-gray-400">Failed to load templates. Please try again later.</p>
            <button className="mt-6 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl">Retry Loading</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-900 dark:via-gray-950 dark:to-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 opacity-20"></div>

      <div className="absolute bottom-0 right-0 w-[70%] max-w-[600px] h-[400px] sm:h-[600px] bg-gradient-to-l from-gray-400/20 to-slate-400/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex flex-wrap justify-center items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 mb-8 border border-white/20 dark:border-slate-700/50 shadow-lg">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Best Collection</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-clip-text mb-8 leading-tight">Templates</h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 px-2">Production-ready templates crafted with precision and designed for modern workflows</p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mt-10">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm text-center rounded-2xl shadow-lg px-6 py-4 border border-white/20 dark:border-slate-700/50">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-gray-700 dark:from-slate-300 dark:to-gray-200 bg-clip-text text-transparent">{templates?.length || 0}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Templates</p>
            </div>
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm text-center rounded-2xl shadow-lg px-6 py-4 border border-white/20 dark:border-slate-700/50">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">{templates?.filter((t) => t.is_free).length || 0}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Free</p>
            </div>
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm text-center rounded-2xl shadow-lg px-6 py-4 border border-white/20 dark:border-slate-700/50">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">{templates?.filter((t) => !t.is_free).length || 0}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Premium</p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-16 px-2">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/20 dark:border-slate-700/50 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">Find Your Perfect Template</h2>
            <TemplateSearch />
          </div>
        </div>

        {/* Templates Content */}
        {templates?.length === 0 && searchQuery ? (
          <div className="text-center py-20 px-2">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 sm:p-12 max-w-2xl mx-auto border border-white/20 dark:border-slate-700/50 shadow-lg">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">No Results Found</h3>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6">
                No templates found for <span className="font-semibold text-amber-600 dark:text-amber-400 line-clamp-2 break-words">&quot;{searchQuery}&quot;</span>
              </p>
            </div>
          </div>
        ) : templates?.length === 0 ? (
          <div className="text-center py-20 px-2">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 sm:p-12 max-w-2xl mx-auto border border-white/20 dark:border-slate-700/50 shadow-lg">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-slate-500 to-gray-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Premium Templates Coming Soon</h3>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6">We&apos;re crafting exceptional templates for you. Check back soon for premium designs!</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-6 py-3 bg-gradient-to-r from-slate-600 to-gray-600 text-white rounded-full hover:from-slate-700 hover:to-gray-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl">Get Notified</button>
                <button className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 font-medium">Browse Portfolio</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 px-2">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent mb-4">Featured Templates</h2>
              <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-slate-500 to-gray-500 mx-auto rounded-full"></div>
            </div>

            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-4 sm:p-8 border border-white/20 dark:border-slate-700/50 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {templates?.map((template: Template) => (
                  <div key={template.id} className="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-white/30 dark:border-slate-700/50 overflow-hidden hover:-translate-y-1">
                    {/* Premium Badge */}
                    {!template.is_free && <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">Premium</div>}
                    {template.is_free && <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">Free</div>}
                    <TemplateCard item={template} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
