// src/app/dashboard/portfolio/actions.ts
"use server"; // Ini menandakan seluruh file ini sebagai Server Action

import { createServerComponentClient } from "@/lib/supabaseClient";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { StorageError } from "@supabase/storage-js";

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url: string;
  live_url?: string | null;
  github_url?: string | null;
  technologies: string[];
  is_published: boolean;
}

// Helper function to upload image to Supabase Storage
async function uploadImageToStorage(file: File): Promise<{ url: string | null; error: string | null }> {
  const supabase = createServerComponentClient(cookies());
  const fileExtension = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const filePath = fileName;

  try {
    const { error: uploadError } = await supabase.storage.from("portimages").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return { url: null, error: `Failed to upload image: ${uploadError.message}` };
    }

    const { data: publicUrlData } = supabase.storage.from("portimages").getPublicUrl(filePath);

    if (publicUrlData) {
      return { url: publicUrlData.publicUrl, error: null };
    } else {
      return { url: null, error: "Failed to get public image URL." };
    }
  } catch (e: unknown) {
    const error = e as StorageError;
    console.error("Unexpected error during image upload:", error);
    return { url: null, error: `Unexpected error during image upload: ${error.message || "Unknown error"}` };
  }
}

// Server Action to create a new portfolio item
export async function createPortfolioItem(data: Omit<PortfolioItem, "id" | "image_url">, _id?: string, imageFile?: File | null) {
  const supabase = createServerComponentClient(cookies());

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) {
    console.error("createPortfolioItem: User not authenticated.", userError);
    return { success: false, message: "Not authenticated." };
  }

  const { data: profile, error: profileError } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();

  if (profileError || !profile || !profile.is_admin) {
    console.error("createPortfolioItem: User is not admin.", profileError);
    return { success: false, message: "Access denied. You are not admin." };
  }

  let imageUrl: string | null = null;
  if (imageFile) {
    const { url, error: uploadError } = await uploadImageToStorage(imageFile);
    if (uploadError) {
      return { success: false, message: `Image upload failed: ${uploadError}` };
    }
    imageUrl = url;
  } else {
    return { success: false, message: "Portfolio image is required." };
  }

  const dataWithImageUrl = { ...data, image_url: imageUrl };

  const { error: insertError } = await supabase.from("portfolio").insert(dataWithImageUrl);

  if (insertError) {
    console.error("createPortfolioItem: Error inserting portfolio item:", insertError);
    return { success: false, message: `Failed to create portfolio item: ${insertError.message}` };
  }

  return { success: true, message: "Portfolio item created successfully!" };
}

// Server Action to update an existing portfolio item
export async function updatePortfolioItem(data: Omit<PortfolioItem, "id" | "image_url">, id?: string, imageFile?: File | null) {
  const supabase = createServerComponentClient(cookies());

  if (!id) {
    console.error("updatePortfolioItem: Portfolio ID is missing.");
    return { success: false, message: "Portfolio ID not found for update." };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) {
    console.error("updatePortfolioItem: User not authenticated.", userError);
    return { success: false, message: "Not authenticated." };
  }

  const { data: profile, error: profileError } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();

  if (profileError || !profile || !profile.is_admin) {
    console.error("updatePortfolioItem: User is not admin.", profileError);
    return { success: false, message: "Access denied. You are not admin." };
  }

  let finalImageUrl: string | null = null;

  if (imageFile) {
    const { url, error: uploadError } = await uploadImageToStorage(imageFile);
    if (uploadError) {
      return { success: false, message: `Failed to upload new image: ${uploadError}` };
    }
    finalImageUrl = url;
  } else {
    const { data: existingItem, error: fetchError } = await supabase.from("portfolio").select("image_url").eq("id", id).single();

    if (fetchError) {
      console.error("Error fetching portfolio item image URL:", fetchError);
    }
    finalImageUrl = existingItem?.image_url || null;
  }

  const dataWithImageUrl = { ...data, image_url: finalImageUrl };

  const { error: updateError } = await supabase.from("portfolio").update(dataWithImageUrl).eq("id", id);

  if (updateError) {
    console.error("updatePortfolioItem: Error updating portfolio item:", updateError);
    return { success: false, message: `Failed to update portfolio item: ${updateError.message}` };
  }

  return { success: true, message: "Portfolio item updated successfully!" };
}

// Server Action to delete a portfolio item
export async function deletePortfolioItem(id: string) {
  const supabase = createServerComponentClient(cookies());

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) {
    console.error("deletePortfolioItem: User not authenticated.", userError);
    return { success: false, message: "Not authenticated." };
  }

  const { data: profile, error: profileError } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();

  if (profileError || !profile || !profile.is_admin) {
    console.error("deletePortfolioItem: User is not admin.", profileError);
    return { success: false, message: "Access denied. You are not admin." };
  }

  const { data: itemToDelete, error: fetchError } = await supabase.from("portfolio").select("image_url").eq("id", id).single();

  if (fetchError) {
    console.error("Error fetching portfolio item for image deletion:", fetchError);
  }

  if (itemToDelete?.image_url) {
    try {
      const url = new URL(itemToDelete.image_url);
      const pathSegments = url.pathname.split("/");
      const fileName = pathSegments[pathSegments.length - 1];
      const filePath = fileName;

      const { error: deleteStorageError } = await supabase.storage.from("portimages").remove([filePath]);

      if (deleteStorageError) {
        console.error("Error deleting image from storage:", deleteStorageError);
      }
    } catch (e) {
      console.error("Error parsing image URL or deleting image from storage:", e);
    }
  }

  const { error: deleteError } = await supabase.from("portfolio").delete().eq("id", id);

  if (deleteError) {
    console.error("deletePortfolioItem: Error deleting portfolio item:", deleteError);
    return { success: false, message: `Failed to delete portfolio item: ${deleteError.message}` };
  }

  return { success: true, message: "Portfolio item deleted successfully!" };
}
