// src/app/dashboard/tutorials/actions.ts
"use server";

import { createServerComponentClient } from "@/lib/supabaseClient";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { StorageError } from "@supabase/storage-js";
import { revalidatePath } from "next/cache";

export interface BlogPostItem {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  author: string;
  tags: string[];
  is_published: boolean;
}

// Helper function to upload image to Supabase Storage
async function uploadImageToStorage(file: File): Promise<{ url: string | null; error: string | null }> {
  const supabase = createServerComponentClient(cookies());
  const fileExtension = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const filePath = fileName;

  try {
    const { error: uploadError } = await supabase.storage.from("blogimages").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return { url: null, error: `Failed to upload image: ${uploadError.message}` };
    }

    const { data: publicUrlData } = supabase.storage.from("blogimages").getPublicUrl(filePath);

    if (publicUrlData) {
      return { url: publicUrlData.publicUrl, error: null };
    } else {
      return { url: null, error: "Failed to get public image URL." };
    }
  } catch (e: unknown) {
    const error = e as StorageError;
    console.error("Unexpected error during image upload:", error);
    return { url: null, error: `Unexpected error during upload: ${error.message || "Unknown error"}` };
  }
}

// Server action to create new blog post
export async function createBlogPost(data: Omit<BlogPostItem, "id" | "created_at" | "updated_at" | "image_url">, _id?: string, imageFile?: File | null) {
  const supabase = createServerComponentClient(cookies());

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) {
    console.error("Server Action (createBlogPost): User not authenticated.", userError);
    return { success: false, message: "Not authenticated." };
  }

  const { data: profile, error: profileError } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();

  if (profileError || !profile || !profile.is_admin) {
    console.error("Server Action (createBlogPost): User is not admin.", profileError);
    return { success: false, message: "Access denied. You are not an admin." };
  }

  let imageUrl: string | null = null;
  if (imageFile) {
    const { url, error: uploadError } = await uploadImageToStorage(imageFile);
    if (uploadError) {
      return { success: false, message: `Failed to upload image: ${uploadError}` };
    }
    imageUrl = url;
  } else {
    return { success: false, message: "Image is required." };
  }

  const dataToInsert = { ...data, image_url: imageUrl };

  const { error: insertError } = await supabase.from("blog_posts").insert(dataToInsert);

  if (insertError) {
    console.error("Server Action (createBlogPost): Error inserting blog post:", insertError);
    return { success: false, message: `Failed to create post: ${insertError.message}` };
  }

  revalidatePath("/tutorials");
  revalidatePath(`/tutorials/${data.slug}`);

  return { success: true, message: "Post successfully created!" };
}

// Server action to update blog post
export async function updateBlogPost(data: Omit<BlogPostItem, "id" | "created_at" | "updated_at" | "image_url">, id?: string, imageFile?: File | null) {
  const supabase = createServerComponentClient(cookies());

  if (!id) {
    console.error("Server Action (updateBlogPost): Blog post ID is missing for update operation.");
    return { success: false, message: "Post ID not found for update." };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) {
    console.error("Server Action (updateBlogPost): User not authenticated.", userError);
    return { success: false, message: "Not authenticated." };
  }

  const { data: profile, error: profileError } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();

  if (profileError || !profile || !profile.is_admin) {
    console.error("Server Action (updateBlogPost): User is not admin.", profileError);
    return { success: false, message: "Access denied. You are not an admin." };
  }

  let finalImageUrl: string | null = null;

  if (imageFile) {
    const { url, error: uploadError } = await uploadImageToStorage(imageFile);
    if (uploadError) {
      return { success: false, message: `Failed to upload new image: ${uploadError}` };
    }
    finalImageUrl = url;
  } else {
    const { data: existingPost, error: fetchError } = await supabase.from("blog_posts").select("image_url").eq("id", id).single();

    if (fetchError) {
      console.error("Error fetching existing blog post for image URL:", fetchError);
    }
    finalImageUrl = existingPost?.image_url || null;
  }

  const dataToUpdate = { ...data, image_url: finalImageUrl, updated_at: new Date().toISOString() };

  const { error: updateError } = await supabase.from("blog_posts").update(dataToUpdate).eq("id", id);

  if (updateError) {
    console.error("Server Action (updateBlogPost): Error updating blog post:", updateError);
    return { success: false, message: `Failed to update post: ${updateError.message}` };
  }

  revalidatePath("/tutorials");
  revalidatePath(`/tutorials/${data.slug}`);

  return { success: true, message: "Post successfully updated!" };
}

// Server action to delete blog post
export async function deleteBlogPost(id: string) {
  const supabase = createServerComponentClient(cookies());

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) {
    console.error("Server Action (deleteBlogPost): User not authenticated.", userError);
    return { success: false, message: "Not authenticated." };
  }

  const { data: profile, error: profileError } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();

  if (profileError || !profile || !profile.is_admin) {
    console.error("Server Action (deleteBlogPost): User is not admin.", profileError);
    return { success: false, message: "Access denied. You are not an admin." };
  }

  const { data: postToDelete, error: fetchError } = await supabase.from("blog_posts").select("image_url, slug").eq("id", id).single();

  if (fetchError) {
    console.error("Error fetching blog post image URL for deletion:", fetchError);
  }

  if (postToDelete?.image_url) {
    try {
      const url = new URL(postToDelete.image_url);
      const pathSegments = url.pathname.split("/");
      const fileName = pathSegments[pathSegments.length - 1];
      const filePath = fileName;

      const { error: deleteStorageError } = await supabase.storage.from("blogimages").remove([filePath]);

      if (deleteStorageError) {
        console.error("Error deleting image from storage:", deleteStorageError);
      }
    } catch (e) {
      console.error("Error parsing image URL or deleting from storage:", e);
    }
  }

  const { error: deleteError } = await supabase.from("blog_posts").delete().eq("id", id);

  if (deleteError) {
    console.error("Server Action (deleteBlogPost): Error deleting blog post:", deleteError);
    return { success: false, message: `Failed to delete post: ${deleteError.message}` };
  }

  revalidatePath("/tutorials");
  if (postToDelete?.slug) {
    revalidatePath(`/tutorials/${postToDelete.slug}`);
  }

  return { success: true, message: "Post successfully deleted!" };
}
