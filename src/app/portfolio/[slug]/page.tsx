// src/app/portfolio/[slug]/page.tsx
// Premium Portfolio Detail Page (Server Component)

import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import PortfolioDetailClient from "@/components/portfolio/PortfolioDetailClient";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  live_url?: string;
  github_url?: string;
  technologies: string[];
  slug: string;
  created_at: string;
  updated_at: string;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data: item } = await supabase.from("portfolio").select("title, description, image_url, technologies").eq("slug", params.slug).single();

  if (!item) {
    return {
      title: "Project Not Found - Sawnedcom",
      description: "The project you're looking for doesn't exist.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${item.title} | Sawnedcom Portfolio`,
    description: item.description,
    keywords: [...item.technologies, "portfolio", "web development", "projects"],
    openGraph: {
      title: `${item.title} | Sawnedcom Portfolio`,
      description: item.description,
      images: item.image_url
        ? [
            {
              url: item.image_url,
              width: 1200,
              height: 630,
              alt: item.title,
            },
          ]
        : [],
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/portfolio/${params.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${item.title} | Sawnedcom Portfolio`,
      description: item.description,
      images: item.image_url ? [item.image_url] : [],
    },
  };
}

export default async function PortfolioDetailPage({ params }: { params: { slug: string } }) {
  const { data: item, error } = await supabase.from("portfolio").select("*").eq("slug", params.slug).single();

  if (error || !item) {
    console.error("Error fetching portfolio item:", error);
    notFound();
  }

  // Fetch related projects
  const { data: relatedItems } = await supabase.from("portfolio").select("id, title, image_url, slug, technologies").neq("id", item.id).limit(3).order("created_at", { ascending: false });

  return <PortfolioDetailClient item={item as PortfolioItem} relatedItems={relatedItems || []} />;
}
