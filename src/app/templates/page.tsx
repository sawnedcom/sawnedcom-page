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

export default async function TemplatesPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const supabase = createServerComponentClient(cookies());
  const searchQuery = (searchParams?.q || "").toString().toLowerCase();

  let query = supabase.from("templates").select("*").eq("is_published", true).order("created_at", { ascending: false });

  if (searchQuery) {
    query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`);
  }

  const { data: templates, error } = await query;

  return (
    <main className="min-h-screen bg-green-50 dark:bg-green-900/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16 pt-20">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600 mb-6">Premium Templates</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">High-quality, production-ready templates to accelerate your workflow.</p>
        </div>

        {/* Search Component */}
        <div className="max-w-2xl mx-auto mb-12">
          <TemplateSearch />
        </div>

        {/* Templates Content */}
        {error ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-red-500">Failed to load templates</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Please try again later</p>
          </div>
        ) : templates?.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold">{searchQuery ? `No templates found for "${searchQuery}"` : "No templates available yet."}</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">{searchQuery ? "Try a different search term." : "Check back soon for new templates."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template: Template) => (
              <div key={template.id} className="border border-green-200 dark:border-green-900/30 bg-white dark:bg-black/20 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300">
                <TemplateCard item={template} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
