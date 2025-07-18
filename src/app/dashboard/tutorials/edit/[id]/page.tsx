// src/app/dashboard/tutorials/edit/[id]/page.tsx
// Premium Tutorial Editing Page
import { createServerComponentClient } from "@/lib/supabaseClient";
import { redirect, notFound } from "next/navigation";
import BlogPostForm from "@/components/dashboard/BlogPostForm";
import { cookies } from "next/headers";
import { updateBlogPost, BlogPostItem } from "@/app/dashboard/tutorials/actions";
import { PostgrestError } from "@supabase/supabase-js";

interface EditTutorialPageProps {
  params: {
    id: string;
  };
}

export default async function EditTutorialPage({ params }: EditTutorialPageProps) {
  const supabase = createServerComponentClient(cookies());
  const postId = params.id;

  // Authentication check
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (!session || sessionError) {
    console.error("EditTutorialPage: No active session found or error:", sessionError);
    redirect("/login");
  }

  // Admin verification
  const { data: profile, error: profileError } = await supabase.from("profiles").select("is_admin").eq("id", session.user.id).single();

  if (profileError || !profile || !profile.is_admin) {
    console.error("EditTutorialPage: User is not admin or profile not found:", profileError);
    redirect("/");
  }

  // Fetch blog post data
  const { data: blogPost, error: fetchError } = (await supabase.from("blog_posts").select("*").eq("id", postId).single()) as { data: BlogPostItem | null; error: PostgrestError | null };

  if (fetchError || !blogPost) {
    console.error(`Error fetching blog post with ID ${postId}:`, fetchError);
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-12 font-poppins">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-4">Edit Tutorial</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Editing: <span className="font-medium text-gray-800 dark:text-gray-200">{blogPost.title}</span>
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <BlogPostForm initialData={blogPost} onSubmitAction={updateBlogPost} />
        </div>

        {/* Status Info (optional) */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg p-4">
          <p className="text-blue-800 dark:text-blue-200 text-center">Remember to save your changes before leaving this page</p>
        </div>
      </div>
    </main>
  );
}
