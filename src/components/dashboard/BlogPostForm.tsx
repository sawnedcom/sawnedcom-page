// src/components/dashboard/BlogPostForm.tsx
// Premium Blog Post Editor with Rich Text capabilities

"use client";

import React, { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle, UploadCloud } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-700 animate-pulse rounded-lg"></div>,
});
import "react-quill-new/dist/quill.snow.css";

// ✅ Import the correct type from the shared source
import { BlogPostItem } from "@/app/dashboard/tutorials/actions";

interface BlogPostFormProps {
  initialData?: BlogPostItem;
  onSubmitAction: (data: Omit<BlogPostItem, "id" | "created_at" | "updated_at" | "image_url">, id?: string, imageFile?: File | null) => Promise<{ success: boolean; message: string }>;
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({ initialData, onSubmitAction }) => {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [author, setAuthor] = useState(initialData?.author || "Sawnedcom");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(initialData?.image_url || "");
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(", ") || "");
  const [isPublished, setIsPublished] = useState(initialData?.is_published || false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const quillModules = {
    toolbar: [[{ header: [1, 2, 3, false] }], ["bold", "italic", "underline", "strike"], [{ list: "ordered" }, { list: "bullet" }], ["link", "image"], ["clean"], [{ color: [] }, { background: [] }], [{ align: [] }], ["code-block"]],
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const tagsArray = tagsInput
      .split(",")
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag);

    try {
      const result = await onSubmitAction(
        {
          title,
          slug,
          content,
          excerpt: excerpt || null,
          author,
          tags: tagsArray,
          is_published: isPublished,
        },
        initialData?.id,
        selectedImageFile
      );

      if (result.success) {
        setMessage({ type: "success", text: result.message });
        if (!initialData) {
          setTitle("");
          setSlug("");
          setContent("");
          setExcerpt("");
          setAuthor("Sawnedcom");
          setSelectedImageFile(null);
          setImagePreviewUrl("");
          setTagsInput("");
          setIsPublished(false);
        }
        setTimeout(() => router.push("/dashboard/tutorials"), 2000);
      } else {
        setMessage({ type: "error", text: result.message });
      }
    } catch (error: unknown) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Post Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL Slug</label>
          <div className="flex items-center">
            <span className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-700">/tutorials/</span>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required className="flex-1 px-4 py-2 rounded-r-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="your-post-title" />
          </div>
        </div>

        {/* Content Editor */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
          <div className="rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
            <ReactQuill theme="snow" value={content} onChange={setContent} modules={quillModules} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" placeholder="Write your content here..." />
          </div>
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Excerpt (Summary)</label>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Brief summary for blog listings..." />
        </div>

        {/* Image Upload */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Featured Image</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedImageFile ? selectedImageFile.name : "Click to upload"}</p>
                </div>
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            </div>
          </div>

          {imagePreviewUrl && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
              <Image
                src={imagePreviewUrl}
                alt="Preview"
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://placehold.co/600x400?text=Image+Error";
                }}
              />
            </div>
          )}
        </div>

        {/* Author & Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Author</label>
            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags (comma separated)</label>
            <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="webdev, tutorial, nextjs" />
          </div>
        </div>

        {/* Publish Toggle */}
        <div className="flex items-center space-x-3">
          <div className="relative inline-block w-10 mr-2 align-middle select-none">
            <input type="checkbox" id="publishToggle" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="sr-only" />
            <label htmlFor="publishToggle" className={`block overflow-hidden h-6 rounded-full cursor-pointer ${isPublished ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-700"}`}>
              <span className={`block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform ${isPublished ? "translate-x-5" : "translate-x-0"}`} />
            </label>
          </div>
          <label htmlFor="publishToggle" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Publish Post
          </label>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`p-4 rounded-lg ${message.type === "success" ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200" : "bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200"}`}>
            <div className="flex items-center">
              {message.type === "success" ? <CheckCircle className="h-5 w-5 mr-2" /> : <XCircle className="h-5 w-5 mr-2" />}
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" disabled={loading || (!initialData && !selectedImageFile)} className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed">
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin mr-2 h-5 w-5" />
              Processing...
            </span>
          ) : initialData ? (
            "Update Post"
          ) : (
            "Create Post"
          )}
        </button>
      </form>
    </div>
  );
};

export default BlogPostForm;
