// src/app/portfolio/[slug]/page.tsx
// Premium Portfolio Detail Page (Server Component)

import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import PortfolioDetailClient from "@/components/portfolio/PortfolioDetailClient";

// Pastikan interface ini sesuai dengan skema database 'portfolio'
// PENTING: Properti yang bisa NULL dari database harus ditandai dengan `| null`
interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  live_url: string | null; // Diperbaiki: Bisa string atau null
  github_url: string | null; // Diperbaiki: Bisa string atau null
  technologies: string[];
  slug: string;
  created_at: string;
  updated_at: string | null; // Diperbaiki: Bisa string atau null jika di database
}

// generateMetadata: Menerima params sebagai objek langsung
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

  // Pastikan `process.env.NEXT_PUBLIC_SITE_URL` sudah terdefinisi di Vercel
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sawnedcom.vercel.app"; // Fallback URL

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
      url: `${siteUrl}/portfolio/${params.slug}`, // Gunakan siteUrl
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

// PortfolioDetailPage: Menerima params sebagai objek langsung
export default async function PortfolioDetailPage({ params }: { params: { slug: string } }) {
  const { data: item, error } = await supabase.from("portfolio").select("*").eq("slug", params.slug).single();

  if (error || !item) {
    console.error("Error fetching portfolio item:", error);
    notFound();
  }

  // Fetch related projects
  const { data: relatedItems, error: relatedError } = await supabase.from("portfolio").select("id, title, image_url, slug, technologies").neq("id", item.id).limit(3).order("created_at", { ascending: false });

  // Handle error for related items if necessary, though it might not block the page render
  if (relatedError) {
    console.error("Error fetching related portfolio items:", relatedError);
  }

  // PENTING: Lakukan type assertion ke PortfolioItem[] untuk relatedItems
  return <PortfolioDetailClient item={item as PortfolioItem} relatedItems={(relatedItems as PortfolioItem[]) || []} />;
}
