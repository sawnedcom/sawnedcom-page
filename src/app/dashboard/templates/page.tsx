// src/app/dashboard/templates/page.tsx
// Premium Templates Management Dashboard

import { createServerComponentClient } from "@/lib/supabaseClient";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlusCircle, Search, Filter } from "lucide-react";
import { PostgrestError } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import TemplateTableRow from "@/components/dashboard/TemplateTableRow";

interface TemplateItem {
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

export default async function DashboardTemplatesPage() {
  const supabase = createServerComponentClient(cookies());

  // Authentication check
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (!session || sessionError) {
    console.error("DashboardTemplatesPage: No active session found or error:", sessionError);
    redirect("/login");
  }

  // Admin verification
  const { data: profile, error: profileError } = await supabase.from("profiles").select("is_admin").eq("id", session.user.id).single();

  if (profileError || !profile || !profile.is_admin) {
    console.error("DashboardTemplatesPage: User is not admin or profile not found:", profileError);
    redirect("/");
  }

  // Fetch template data
  const { data: templateItems, error: fetchError } = (await supabase.from("templates").select("*").order("created_at", { ascending: false })) as {
    data: TemplateItem[] | null;
    error: PostgrestError | null;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-12 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600 pb-2">Manage Templates</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Create and manage your website templates</p>
          </div>

          {/* Search and Create Button */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" placeholder="Search templates..." className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent" />
            </div>
            <Link href="/dashboard/templates/new" className="inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg shadow-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 group">
              <PlusCircle size={20} className="mr-2 group-hover:rotate-180 transition-transform duration-300" />
              <span>Create New</span>
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Filter size={18} className="text-gray-500 dark:text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Filter:</span>
          </div>
          <button className="px-4 py-2 text-sm font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">All Templates</button>
          <button className="px-4 py-2 text-sm font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">Published</button>
          <button className="px-4 py-2 text-sm font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">Free</button>
          <button className="px-4 py-2 text-sm font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">Premium</button>
        </div>

        {/* Content Area */}
        {fetchError ? (
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl p-6 text-center">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">Failed to load templates</h3>
            <p className="text-red-600 dark:text-red-400">Please try again later or contact support</p>
          </div>
        ) : templateItems && templateItems.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
                <PlusCircle size={40} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">No templates yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Start by creating your first template</p>
              <Link href="/dashboard/templates/new" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg shadow hover:from-green-700 hover:to-blue-700 transition-all duration-300">
                <PlusCircle size={20} className="mr-2" />
                Create First Template
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Template Name
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {templateItems?.map((item) => (
                  <TemplateTableRow key={item.id} item={item} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
