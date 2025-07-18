// src/app/dashboard/portfolio/page.tsx
// Premium Portfolio Management Dashboard

import { createServerComponentClient } from "@/lib/supabaseClient";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlusCircle, Search, Filter } from "lucide-react";
import { PostgrestError } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import PortfolioTable from "@/components/dashboard/PortfolioTable";
import { deletePortfolioItem } from "./actions";

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url: string;
  live_url?: string | null;
  github_url?: string | null;
  technologies: string[];
  created_at: string;
  is_published: boolean;
}

export default async function DashboardPortfolioPage() {
  const supabase = createServerComponentClient(cookies());

  // Authentication check
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) {
    console.error("DashboardPortfolioPage: User not authenticated or error verifying user:", userError);
    redirect("/login");
  }

  // Admin verification
  const { data: profile, error: profileError } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();

  if (profileError || !profile || !profile.is_admin) {
    console.error("DashboardPortfolioPage: User is not admin or profile not found:", profileError);
    redirect("/");
  }

  // Fetch portfolio data
  const { data: portfolioItems, error: fetchError } = (await supabase.from("portfolio").select("*").order("created_at", { ascending: false })) as {
    data: PortfolioItem[] | null;
    error: PostgrestError | null;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-12 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 pb-2">Manage Portfolio</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Showcase your best work and projects</p>
          </div>

          {/* Search and Create Button */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" placeholder="Search portfolio..." className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <Link href="/dashboard/portfolio/new" className="inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 group">
              <PlusCircle size={20} className="mr-2 group-hover:rotate-180 transition-transform duration-300" />
              <span>Add New</span>
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Filter size={18} className="text-gray-500 dark:text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Filter:</span>
          </div>
          <button className="px-4 py-2 text-sm font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">All Items</button>
          <button className="px-4 py-2 text-sm font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">Published</button>
          <button className="px-4 py-2 text-sm font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">Featured</button>
          <button className="px-4 py-2 text-sm font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">Recent</button>
        </div>

        {/* Content Area */}
        {fetchError ? (
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl p-6 text-center">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">Failed to load portfolio items</h3>
            <p className="text-red-600 dark:text-red-400">Please try again later or contact support</p>
          </div>
        ) : portfolioItems && portfolioItems.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
                <PlusCircle size={40} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">No portfolio items yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Start by adding your first portfolio item</p>
              <Link href="/dashboard/portfolio/new" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow hover:from-blue-700 hover:to-indigo-700 transition-all duration-300">
                <PlusCircle size={20} className="mr-2" />
                Add First Item
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <PortfolioTable portfolioItems={portfolioItems || []} deletePortfolioItem={deletePortfolioItem} />
          </div>
        )}
      </div>
    </main>
  );
}
