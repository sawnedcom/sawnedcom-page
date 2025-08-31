// app/portfolio/page.tsx
import { createServerComponentClient } from "@/lib/supabaseClient";
import { cookies } from "next/headers";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import PortfolioCard from "@/components/portfolio/PortfolioCard";
import PortfolioSearch from "@/components/search/PortfolioSearch";
import { Metadata } from "next";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  live_url?: string;
  github_url?: string;
  technologies: string[];
  slug: string;
}

export const metadata: Metadata = {
  title: "Portfolio - Sawnedcom",
  description: "Explore the latest and greatest projects from Sawnedcom.",
};

interface PageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PortfolioPage({ searchParams }: PageProps) {
  const supabase = createServerComponentClient(cookies());

  const resolvedSearchParams = await searchParams;
  const searchQuery = (resolvedSearchParams?.q || "").toString().toLowerCase();

  let query = supabase.from("portfolio").select("*").order("created_at", { ascending: false });

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,technologies.cs.{${searchQuery}}`);
  }

  const { data: portfolioItems, error: fetchError } = await query;

  if (fetchError) {
    console.error("Error fetching portfolio:", fetchError);
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 opacity-50"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] max-w-[800px] h-[300px] sm:h-[400px] bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
          <div className="backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 rounded-3xl shadow-2xl p-6 sm:p-12 max-w-2xl mx-auto border border-white/20 dark:border-slate-700/50">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.882 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600 mb-6">My Portfolio</h1>
            <p className="text-red-600 dark:text-red-400 text-base sm:text-lg font-medium mb-4">Oops! Something went wrong</p>
            <p className="text-gray-600 dark:text-gray-400">Failed to load portfolio. Please try again later.</p>
            <button className="mt-6 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl">Retry Loading</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-[70%] max-w-[600px] h-[400px] sm:h-[600px] bg-gradient-to-l from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex flex-wrap justify-center items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 mb-8 border border-white/20 dark:border-slate-700/50 shadow-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Always Available</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-clip-text text-light leading-tight mb-8">Portfolios</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 px-2">A showcase of my best work and projects. I&apos;m always excited to learn and experiment with new technologies !</p>
          {/* Stats Cards */}
          <div className="grid place-items-center mt-10">
            <div className="bg-[#0f172a] text-center rounded-2xl shadow-lg px-10 py-6">
              <h1 className="text-3xl font-bold text-purple-500">1</h1>
              <p className="text-gray-300">Projects</p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-16 px-2">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/20 dark:border-slate-700/50 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">Find Your Interest</h2>
            <PortfolioSearch />
          </div>
        </div>

        {/* Portfolio Content */}
        {portfolioItems && portfolioItems.length === 0 && searchQuery ? (
          <div className="text-center py-20 px-2">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 sm:p-12 max-w-2xl mx-auto border border-white/20 dark:border-slate-700/50 shadow-lg">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">No Results Found</h3>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6">
                No portfolio items found for <span className="font-semibold text-orange-600 dark:text-orange-400 line-clamp-2 break-words">&quot;{searchQuery}&quot;</span>
              </p>
            </div>
          </div>
        ) : portfolioItems && portfolioItems.length === 0 ? (
          <div className="text-center py-20 px-2">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 sm:p-12 max-w-2xl mx-auto border border-white/20 dark:border-slate-700/50 shadow-lg">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Coming Soon</h3>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6">Exciting projects are in development. Check back soon for amazing work!</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl">Get Notified</button>
                <button className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 font-medium">View Resume</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 px-2">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent mb-4">Featured Projects</h2>
              <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-slate-500 to-gray-500 mx-auto rounded-full"></div>
            </div>

            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-4 sm:p-8 border border-white/20 dark:border-slate-700/50 shadow-lg">
              <PortfolioGrid>
                {portfolioItems?.map((item: PortfolioItem) => (
                  <PortfolioCard key={item.id} item={item} />
                ))}
              </PortfolioGrid>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
