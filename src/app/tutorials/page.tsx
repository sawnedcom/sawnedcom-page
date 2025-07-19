// src/app/tutorials/page.tsx
// Tutorials & Blog Page - Server Component
// This page displays a searchable, filterable list of published blog posts/tutorials.

import { supabase } from "@/lib/supabaseClient";
import { Metadata } from "next";
import BlogPostCard from "@/components/tutorials/BlogPostCard";
import TutorialSearch from "@/components/search/TutorialSearch";
import { PostgrestError } from "@supabase/supabase-js";

// Type definition for each tutorial/blog post
interface BlogPostItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url?: string;
  created_at: string;
  author: string;
  tags: string[];
  is_published: boolean;
  slug: string;
}

// SEO metadata
export const metadata: Metadata = {
  title: "Tutorials & Blog - Sawnedcom",
  description: "Explore tutorials, guides, and articles about web development from Sawnedcom.",
};

// Update interface untuk Next.js 15
interface PageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Main Server Component for tutorials page
export default async function TutorialsPage({ searchParams }: PageProps) {
  // Await the searchParams Promise
  const resolvedSearchParams = await searchParams;

  // Extract search query from URL
  const searchQuery = (resolvedSearchParams?.q || "").toString().toLowerCase();

  // Normalize selected tags into an array
  const selectedTags: string[] = resolvedSearchParams?.tag ? (Array.isArray(resolvedSearchParams.tag) ? resolvedSearchParams.tag : [resolvedSearchParams.tag]) : [];

  // Fetch all tags from published blog posts

  // Build initial query for published posts
  let query = supabase.from("blog_posts").select("*").eq("is_published", true).order("created_at", { ascending: false });

  // Apply search query filter (by title)
  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  // Apply tag filters (match all selected tags)
  if (selectedTags.length > 0) {
    query = query.contains("tags", selectedTags);
  }

  // Execute the query
  const { data, error } = await query;
  const blogPosts = data as BlogPostItem[] | null;
  const fetchError = error as PostgrestError | null;

  // Error state
  if (fetchError || !blogPosts) {
    console.error("Error fetching blog posts:", fetchError);
    return (
      <main className="min-h-screen bg-purple-50 dark:bg-purple-900/20 py-16 font-poppins">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 mb-6 pb-2">Tutorials & Blog</h1>
          <p className="text-red-500 dark:text-red-400 text-lg">Failed to load articles. Please try again later.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-purple-50 dark:bg-purple-900/20 py-16 font-poppins">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 mb-6 pb-2">Tutorials & Blog</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">Discover web development tutorials, tips, and insights written by Sawnedcom.</p>
        </div>

        {/* Search + Tag Filter */}
        <div className="flex flex-col items-center mb-12 gap-6">
          <TutorialSearch />
        </div>

        {/* Conditional Content Rendering */}
        {blogPosts.length === 0 && (searchQuery || selectedTags.length > 0) ? (
          <p className="text-center text-xl text-gray-700 dark:text-gray-300 mt-8">{`No tutorials found for "${searchQuery}" ${selectedTags.length > 0 ? `with tags "${selectedTags.join(", ")}"` : ""}.`}</p>
        ) : blogPosts.length === 0 ? (
          <p className="text-center text-xl text-gray-700 dark:text-gray-300 mt-8">No tutorials published yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
