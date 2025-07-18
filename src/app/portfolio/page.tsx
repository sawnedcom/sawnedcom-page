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

// Update the interface to match Next.js 15 requirements
interface PageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PortfolioPage({ searchParams }: PageProps) {
  const supabase = createServerComponentClient(cookies());

  // Await the searchParams Promise
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
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">My Portfolio</h1>
          <p className="text-red-500 dark:text-red-400 text-lg">Failed to load portfolio. Please try again later.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">My Portfolio</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">A showcase of my best work and projects. I&apos;m always excited to learn and experiment with new technologies!</p>
        </div>

        {/* Search Component */}
        <div className="max-w-2xl mx-auto mb-12">
          <PortfolioSearch />
        </div>

        {/* Portfolio Content */}
        {portfolioItems && portfolioItems.length === 0 && searchQuery ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400">No portfolio items found for &quot;{searchQuery}&quot;</p>
          </div>
        ) : portfolioItems && portfolioItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400">No portfolio items available yet.</p>
          </div>
        ) : (
          <PortfolioGrid>
            {portfolioItems?.map((item: PortfolioItem) => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </PortfolioGrid>
        )}
      </div>
    </main>
  );
}
