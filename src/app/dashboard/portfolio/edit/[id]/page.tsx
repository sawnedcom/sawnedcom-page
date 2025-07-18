// src/app/dashboard/portfolio/edit/[id]/page.tsx
// Premium Portfolio Editing Interface

import { createServerComponentClient } from "@/lib/supabaseClient";
import { redirect } from "next/navigation";
import PortfolioForm from "@/components/dashboard/PortfolioForm";
import { cookies } from "next/headers";
import { PostgrestError } from "@supabase/supabase-js";
import { updatePortfolioItem } from "@/app/dashboard/portfolio/actions";

// Tipe data portfolio item
interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url: string;
  live_url: string | null;
  github_url: string | null;
  technologies: string[];
  is_published: boolean;
}

export default async function EditPortfolioPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient(cookies());

  // Auth & admin check
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (!session || sessionError) {
    console.error("EditPortfolioPage: No active session found or error:", sessionError);
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase.from("profiles").select("is_admin").eq("id", session.user.id).single();

  if (profileError || !profile || !profile.is_admin) {
    console.error("EditPortfolioPage: User is not admin or profile not found:", profileError);
    redirect("/");
  }

  // Fetch portfolio item by ID
  const { data: portfolioItem, error: fetchError } = (await supabase.from("portfolio").select("*").eq("id", params.id).single()) as {
    data: PortfolioItem | null;
    error: PostgrestError | null;
  };

  if (fetchError || !portfolioItem) {
    console.error("Error fetching portfolio item for edit:", fetchError);
    redirect("/dashboard/portfolio");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-12 font-poppins">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">Edit Portfolio Item</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Editing: <span className="font-semibold text-gray-800 dark:text-gray-200">{portfolioItem.title}</span>
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <PortfolioForm initialData={portfolioItem} onSubmitAction={updatePortfolioItem} />
        </div>

        {/* Status Information */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg p-4 text-center">
          <p className="text-blue-800 dark:text-blue-200">Changes will be published immediately after saving</p>
        </div>
      </div>
    </main>
  );
}
