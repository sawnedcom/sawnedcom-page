// src/app/dashboard/portfolio/new/page.tsx
// Premium Portfolio Creation Page

import { createServerComponentClient } from "@/lib/supabaseClient";
import { redirect } from "next/navigation";
import PortfolioForm from "@/components/dashboard/PortfolioForm";
import { cookies } from "next/headers";
import { createPortfolioItem } from "@/app/dashboard/portfolio/actions";

export default async function NewPortfolioPage() {
  const supabase = createServerComponentClient(cookies());

  // Authentication check
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (!session || sessionError) {
    console.error("NewPortfolioPage: No active session found or error:", sessionError);
    redirect("/login");
  }

  // Admin verification
  const { data: profile, error: profileError } = await supabase.from("profiles").select("is_admin").eq("id", session.user.id).single();

  if (profileError || !profile || !profile.is_admin) {
    console.error("NewPortfolioPage: User is not admin or profile not found:", profileError);
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-12 font-poppins">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">Add New Portfolio Item</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Showcase your best work with rich details and media</p>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <PortfolioForm onSubmitAction={createPortfolioItem} />
        </div>

        {/* Help Text */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg p-4 text-center">
          <p className="text-blue-800 dark:text-blue-200">Tip: Add high-quality images and detailed descriptions for best results</p>
        </div>
      </div>
    </main>
  );
}
