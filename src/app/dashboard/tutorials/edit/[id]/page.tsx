// src/app/dashboard/templates/edit/[id]/page.tsx
// Premium Template Editing Interface

import { createServerComponentClient } from "@/lib/supabaseClient";
import { redirect, notFound } from "next/navigation";
import TemplateForm from "@/components/dashboard/TemplateForm";
import { cookies } from "next/headers";
import { updateTemplate } from "@/app/dashboard/templates/actions"; // Mengambil updateTemplate dari actions.ts
import { PostgrestError } from "@supabase/supabase-js";

// Pastikan definisi TemplateItem ini LENGKAP dan SAMA dengan yang di actions.ts dan TemplateForm.tsx
interface TemplateItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  live_demo_url: string | null;
  download_url: string | null;
  gumroad_url: string | null;
  lynkid_url: string | null; // Pastikan ini ada
  payhip_url: string | null; // Pastikan ini ada
  created_at: string; // Pastikan ini ada (tipe biasanya string untuk timestamp)
  tags: string[];
  price: number;
  is_free: boolean;
  is_published: boolean;
  type: string;
}

export default async function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  // Await params untuk mendapatkan nilai ID yang sebenarnya
  const { id: templateId } = await params;

  const supabase = createServerComponentClient(cookies());

  // Authentication verification
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (!session || sessionError) {
    console.error("EditTemplatePage: No active session found or error:", sessionError);
    redirect("/login");
  }

  // Admin privileges check
  const { data: profile, error: profileError } = await supabase.from("profiles").select("is_admin").eq("id", session.user.id).single();

  if (profileError || !profile || !profile.is_admin) {
    console.error("EditTemplatePage: User is not admin or profile not found:", profileError);
    redirect("/");
  }

  // Fetch template data
  const { data: template, error: fetchError } = (await supabase.from("templates").select("*").eq("id", templateId).single()) as { data: TemplateItem | null; error: PostgrestError | null };

  if (fetchError || !template) {
    console.error(`Error fetching template with ID ${templateId}:`, fetchError);
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-12 font-poppins">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600 mb-4">Edit Template</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Editing: <span className="font-semibold text-gray-800 dark:text-gray-200">{template.name}</span>
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <TemplateForm initialData={template} onSubmitAction={updateTemplate} />
        </div>

        {/* Status Information */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg p-4 text-center">
          <p className="text-blue-800 dark:text-blue-200">Changes will be reflected immediately after saving</p>
        </div>
      </div>
    </main>
  );
}
