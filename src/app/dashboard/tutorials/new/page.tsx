// src/app/dashboard/tutorials/new/page.tsx
// Premium New Tutorial Creation Page

import { createServerComponentClient } from "@/lib/supabaseClient";
import { redirect } from "next/navigation";
import BlogPostForm from "@/components/dashboard/BlogPostForm";
import { cookies } from "next/headers";
import { createBlogPost } from "@/app/dashboard/tutorials/actions";
import { BlogPostItem } from "@/app/dashboard/tutorials/actions";

// Type-safe wrapper for createBlogPost to handle type mismatches
const createBlogPostWrapper = async (data: Omit<BlogPostItem, "id" | "image_url" | "created_at" | "updated_at">, id?: string, imageFile?: File | null) => {
  // Process data to match expected types
  const processedData = {
    ...data,
    tags: data.tags || [], // Convert undefined to empty array
    excerpt: data.excerpt ?? null, // Convert undefined to null
  };

  return createBlogPost(processedData, id, imageFile);
};

export default async function NewTutorialPage() {
  const supabase = createServerComponentClient(cookies());

  // Authentication check
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (!session || sessionError) {
    console.error("NewTutorialPage: No active session found or error:", sessionError);
    redirect("/login");
  }

  // Admin verification
  const { data: profile, error: profileError } = await supabase.from("profiles").select("is_admin").eq("id", session.user.id).single();

  if (profileError || !profile || !profile.is_admin) {
    console.error("NewTutorialPage: User is not admin or profile not found:", profileError);
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-12 font-poppins">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-4">Create New Tutorial</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Fill out the form below to create a new tutorial post</p>
        </div>

        {/* Form Container with Premium Styling */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <BlogPostForm onSubmitAction={createBlogPostWrapper} />
        </div>
      </div>
    </main>
  );
}
