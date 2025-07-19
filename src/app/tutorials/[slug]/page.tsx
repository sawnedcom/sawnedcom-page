// src/app/tutorials/[slug]/page.tsx
// This is a Server Component. Do not add 'use client'.

import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import BlogDetailClient from "@/components/tutorials/BlogDetailClient";

// Blog post type definition
// PENTING: Properti yang bisa NULL dari database harus ditandai dengan `| null`
interface BlogPostItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string | null; // <-- Diperbaiki: Bisa string atau null
  created_at: string;
  // Jika ada updated_at di database, tambahkan di sini juga
  updated_at?: string | null;
  author: string;
  tags: string[];
  is_published: boolean;
  slug: string;
}

// Update interface untuk Next.js 15
interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generates dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Await the params Promise
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const { data: item } = await supabase.from("blog_posts").select("title, excerpt, image_url").eq("slug", slug).single();

  if (!item) {
    return {
      title: "Post Not Found - Sawnedcom",
      description: "The blog post you are looking for does not exist.",
    };
  }

  // Pastikan `process.env.NEXT_PUBLIC_SITE_URL` sudah terdefinisi di Vercel
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sawnedcom.vercel.app"; // Fallback URL

  return {
    title: `${item.title} - Sawnedcom Blog`,
    description: item.excerpt,
    openGraph: {
      title: `${item.title} - Sawnedcom Blog`, // Lebih eksplisit
      description: item.excerpt,
      images: item.image_url ? [item.image_url] : [],
      url: `${siteUrl}/tutorials/${slug}`, // Tambahkan URL lengkap
      type: "article", // Tipe yang lebih tepat untuk blog post
    },
    twitter: {
      card: "summary_large_image",
      title: `${item.title} - Sawnedcom Blog`,
      description: item.excerpt,
      images: item.image_url ? [item.image_url] : [],
    },
  };
}

// Renders the blog post detail page
export default async function TutorialDetailPage({ params }: PageProps) {
  // Await the params Promise
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // Ambil semua kolom yang didefinisikan di BlogPostItem
  const { data: item, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("is_published", true).single();

  if (error || !item) {
    console.error("Failed to fetch blog post:", error);
    notFound();
  }

  // PENTING: Lakukan type assertion ke BlogPostItem
  return <BlogDetailClient item={item as BlogPostItem} />;
}
