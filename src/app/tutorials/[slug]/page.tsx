// src/app/tutorials/[slug]/page.tsx
// This is a Server Component. Do not add 'use client'.

import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import BlogDetailClient from "@/components/tutorials/BlogDetailClient";

// Blog post type definition
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

// Generates dynamic metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;

  const { data: item } = await supabase.from("blog_posts").select("title, excerpt, image_url").eq("slug", slug).single();

  if (!item) {
    return {
      title: "Post Not Found - Sawnedcom",
      description: "The blog post you are looking for does not exist.",
    };
  }

  return {
    title: `${item.title} - Sawnedcom Blog`,
    description: item.excerpt,
    openGraph: {
      images: item.image_url ? [item.image_url] : [],
    },
  };
}

// Renders the blog post detail page
export default async function TutorialDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const { data: item, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("is_published", true).single();

  if (error || !item) {
    console.error("Failed to fetch blog post:", error);
    notFound();
  }

  return <BlogDetailClient item={item as BlogPostItem} />;
}
