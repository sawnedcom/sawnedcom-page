// src/app/templates/[slug]/page.tsx
// This is a Server Component. Do not add 'use client'.

import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import TemplateDetailClient from "@/components/templates/TemplateDetailClient";

// Template item type definition
// PENTING: Properti yang bisa NULL dari database harus ditandai dengan `| null`
interface TemplateItem {
  id: string; // Pastikan ini juga ada di page.tsx
  name: string;
  description: string;
  image_url: string;
  type: "free" | "premium";
  download_url: string | null; // Harus string | null
  gumroad_url: string | null; // Harus string | null
  lynkid_url: string | null; // Harus string | null
  payhip_url: string | null; // Harus string | null
  live_demo_url: string | null; // Harus string | null
  price: number | null; // Harus number | null
  features: string[] | null;
  tags: string[]; // Ubah ke string[] (tidak null) agar match dengan TemplateItemProps
  slug: string;
  created_at?: string; // Jika ada di DB
  updated_at?: string | null; // Jika ada di DB
}

// Update interface untuk Next.js 15
interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generates dynamic metadata for SEO and sharing
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Await the params Promise
  const resolvedParams = await params;
  const { data: item } = await supabase.from("templates").select("name, description, image_url").eq("slug", resolvedParams.slug).single();

  if (!item) {
    return {
      title: "Template Not Found - Sawnedcom",
      description: "The requested template could not be found.",
    };
  }

  // Pastikan `process.env.NEXT_PUBLIC_SITE_URL` sudah terdefinisi di Vercel
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sawnedcom.vercel.app"; // Fallback URL

  return {
    title: `${item.name} - Sawnedcom Template`,
    description: item.description,
    openGraph: {
      images: item.image_url ? [item.image_url] : [],
      // Tambahkan URL lengkap untuk Open Graph
      url: `${siteUrl}/templates/${resolvedParams.slug}`,
      type: "website",
    },
    // Tambahkan Twitter Card jika diinginkan
    twitter: {
      card: "summary_large_image",
      title: `${item.name} - Sawnedcom Template`,
      description: item.description,
      images: item.image_url ? [item.image_url] : [],
    },
  };
}

// Renders the template detail page
export default async function TemplateDetailPage({ params }: PageProps) {
  // Await the params Promise
  const resolvedParams = await params;

  // Ambil semua kolom yang didefinisikan di TemplateItem
  const { data: item, error } = await supabase.from("templates").select("*").eq("slug", resolvedParams.slug).single();

  if (error || !item) {
    console.error("Failed to fetch template:", error);
    notFound();
  }

  // Pastikan tags ada, jika tidak berikan array kosong
  const itemWithTags: TemplateItem = {
    ...item,
    tags: Array.isArray(item.tags) ? item.tags : [], // Pastikan tags selalu array
  };

  // PENTING: Lakukan type assertion ke TemplateItem
  return <TemplateDetailClient item={itemWithTags} />;
}
