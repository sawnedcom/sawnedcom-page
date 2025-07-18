// src/app/templates/[slug]/page.tsx
// This is a Server Component. Do not add 'use client'.

import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import TemplateDetailClient from "@/components/templates/TemplateDetailClient";

// Template item type definition
interface TemplateItem {
  id: string;
  name: string;
  description: string;
  image_url: string;
  type: "free" | "premium";
  download_url?: string;
  gumroad_url?: string;
  live_demo_url?: string;
  price?: number;
  features: string[] | null;
  slug: string;
}

// Generates dynamic metadata for SEO and sharing
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data: item } = await supabase.from("templates").select("name, description, image_url").eq("slug", params.slug).single();

  if (!item) {
    return {
      title: "Template Not Found - Sawnedcom",
      description: "The requested template could not be found.",
    };
  }

  return {
    title: `${item.name} - Sawnedcom Template`,
    description: item.description,
    openGraph: {
      images: item.image_url ? [item.image_url] : [],
    },
  };
}

// Renders the template detail page
export default async function TemplateDetailPage({ params }: { params: { slug: string } }) {
  const { data: item, error } = await supabase.from("templates").select("*").eq("slug", params.slug).single();

  if (error || !item) {
    console.error("Failed to fetch template:", error);
    notFound();
  }

  return <TemplateDetailClient item={item as TemplateItem} />;
}
