// src/app/dashboard/templates/actions.ts
"use server";

import { createServerComponentClient } from "@/lib/supabaseClient";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { StorageError } from "@supabase/storage-js";

interface TemplateItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  live_demo_url: string | null;
  download_url: string | null;
  gumroad_url: string | null;
  // --- TAMBAHKAN INI ---
  lynkid_url: string | null; // Pastikan ini ada dan tipe datanya benar
  payhip_url: string | null; // Pastikan ini ada dan tipe datanya benar
  // --- AKHIR TAMBAHAN ---
  tags: string[];
  price: number; // Ini akan diasumsikan dalam USD
  is_free: boolean;
  is_published: boolean;
  type: string;
  created_at: string; // Pastikan ini ada dan tipe datanya benar
}

// Helper function to upload image to Supabase Storage
async function uploadImageToStorage(file: File): Promise<{ url: string | null; error: string | null }> {
  const supabase = createServerComponentClient(cookies());
  const fileExtension = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const filePath = fileName;

  try {
    const { error: uploadError } = await supabase.storage.from("images").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return { url: null, error: `Failed to upload image: ${uploadError.message}` };
    }

    const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(filePath);

    if (publicUrlData) {
      return { url: publicUrlData.publicUrl, error: null };
    } else {
      return { url: null, error: "Failed to get public image URL." };
    }
  } catch (e: unknown) {
    const error = e as StorageError;
    console.error("Unexpected error during image upload:", error);
    return { url: null, error: `Unexpected upload error: ${error.message || "Unknown error"}` };
  }
}

// Server Action to create new template
export async function createTemplate(data: Omit<TemplateItem, "id" | "created_at" | "image_url">, _id?: string, imageFile?: File | null) {
  const supabase = createServerComponentClient(cookies());

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) {
    console.error("createTemplate: User not authenticated.", userError);
    return { success: false, message: "Not authenticated." };
  }

  const { data: profile, error: profileError } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();

  if (profileError || !profile || !profile.is_admin) {
    console.error("createTemplate: User is not admin.", profileError);
    return { success: false, message: "Access denied. You are not admin." };
  }

  // --- START: VALIDASI HARGA DI SISI SERVER (UNTUK USD) - Perubahan Baru ---
  const { price } = data;
  if (typeof price !== "number" || isNaN(price) || price < 0 || price > 1000000 || (price.toFixed(2) !== price.toString() && price % 1 !== 0)) {
    // Sesuaikan batas atas (misal 1.000.000 USD) dan pastikan 2 angka desimal
    // (price.toFixed(2) !== price.toString() && price % 1 !== 0) mengecek apakah ada lebih dari 2 desimal
    // jika bukan bilangan bulat.
    console.error("createTemplate: Invalid price value.", price);
    return { success: false, message: "Invalid price. Price must be a number between $0.00 and $1,000,000.00 with up to two decimal places." };
  }
  // --- END: VALIDASI HARGA ---

  let imageUrl: string | null = null;
  if (imageFile) {
    const { url, error: uploadError } = await uploadImageToStorage(imageFile);
    if (uploadError) {
      return { success: false, message: `Image upload failed: ${uploadError}` };
    }
    imageUrl = url;
  } else {
    return { success: false, message: "Template image is required." };
  }

  const dataToInsert = { ...data, image_url: imageUrl };

  const { error: insertError } = await supabase.from("templates").insert(dataToInsert);

  if (insertError) {
    console.error("createTemplate: Error inserting template:", insertError);
    return { success: false, message: `Failed to insert template: ${insertError.message}` };
  }

  return { success: true, message: "Template successfully created!" };
}

// Server Action to update template
export async function updateTemplate(data: Omit<TemplateItem, "id" | "created_at" | "image_url">, id?: string, imageFile?: File | null) {
  const supabase = createServerComponentClient(cookies());

  if (!id) {
    console.error("updateTemplate: Missing template ID.");
    return { success: false, message: "Template ID not found for update." };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) {
    console.error("updateTemplate: User not authenticated.", userError);
    return { success: false, message: "Not authenticated." };
  }

  const { data: profile, error: profileError } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();

  if (profileError || !profile || !profile.is_admin) {
    console.error("updateTemplate: User is not admin.", profileError);
    return { success: false, message: "Access denied. You are not admin." };
  }

  // --- START: VALIDASI HARGA DI SISI SERVER (UNTUK USD) - Perubahan Baru ---
  const { price } = data;
  if (typeof price !== "number" || isNaN(price) || price < 0 || price > 1000000 || (price.toFixed(2) !== price.toString() && price % 1 !== 0)) {
    console.error("updateTemplate: Invalid price value.", price);
    return { success: false, message: "Invalid price. Price must be a number between $0.00 and $1,000,000.00 with up to two decimal places." };
  }
  // --- END: VALIDASI HARGA ---

  let finalImageUrl: string | null = null;

  if (imageFile) {
    const { url, error: uploadError } = await uploadImageToStorage(imageFile);
    if (uploadError) {
      return { success: false, message: `Failed to upload new image: ${uploadError}` };
    }
    finalImageUrl = url;
  } else {
    const { data: existingTemplate, error: fetchError } = await supabase.from("templates").select("image_url").eq("id", id).single();
    if (fetchError) {
      console.error("Error fetching template for existing image:", fetchError);
    }
    finalImageUrl = existingTemplate?.image_url || null;
  }

  const dataToUpdate = { ...data, image_url: finalImageUrl };

  const { error: updateError } = await supabase.from("templates").update(dataToUpdate).eq("id", id);

  if (updateError) {
    console.error("updateTemplate: Error updating template:", updateError);
    return { success: false, message: `Failed to update template: ${updateError.message}` };
  }

  return { success: true, message: "Template successfully updated!" };
}

// Server Action to delete template (tidak ada perubahan terkait mata uang di sini)
export async function deleteTemplate(id: string) {
  const supabase = createServerComponentClient(cookies());

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) {
    console.error("deleteTemplate: User not authenticated.", userError);
    return { success: false, message: "Not authenticated." };
  }

  const { data: profile, error: profileError } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();

  if (profileError || !profile || !profile.is_admin) {
    console.error("deleteTemplate: User is not admin.", profileError);
    return { success: false, message: "Access denied. You are not admin." };
  }

  const { data: templateToDelete, error: fetchError } = await supabase.from("templates").select("image_url").eq("id", id).single();

  if (fetchError) {
    console.error("Error fetching template image for deletion:", fetchError);
  }

  if (templateToDelete?.image_url) {
    try {
      const url = new URL(templateToDelete.image_url);
      const pathSegments = url.pathname.split("/");
      const fileName = pathSegments[pathSegments.length - 1];
      const filePath = fileName;

      const { error: deleteStorageError } = await supabase.storage.from("images").remove([filePath]);

      if (deleteStorageError) {
        console.error("Error deleting image from storage:", deleteStorageError);
      }
    } catch (e) {
      console.error("Error parsing image URL or deleting from storage:", e);
    }
  }

  const { error: deleteError } = await supabase.from("templates").delete().eq("id", id);

  if (deleteError) {
    console.error("deleteTemplate: Error deleting template:", deleteError);
    return { success: false, message: `Failed to delete template: ${deleteError.message}` };
  }

  return { success: true, message: "Template successfully deleted!" };
}
