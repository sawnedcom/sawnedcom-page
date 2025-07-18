// src/components/dashboard/PortfolioForm.tsx
"use client";

import React, { useState, ChangeEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle, UploadCloud, Link, GitBranch } from "lucide-react";
import Image from "next/image";

// Definisi interface untuk item portfolio
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

// Props untuk form
interface PortfolioFormProps {
  initialData?: PortfolioItem;
  onSubmitAction: (data: Omit<PortfolioItem, "id" | "image_url">, id?: string, imageFile?: File | null) => Promise<{ success: boolean; message: string }>;
}

const PortfolioForm: React.FC<PortfolioFormProps> = ({ initialData, onSubmitAction }) => {
  const router = useRouter();

  // State untuk form
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [existingImageUrl, setExistingImageUrl] = useState(initialData?.image_url || "");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(initialData?.image_url || "");

  const [liveUrl, setLiveUrl] = useState(initialData?.live_url || "");
  const [githubUrl, setGithubUrl] = useState(initialData?.github_url || "");
  const [technologiesInput, setTechnologiesInput] = useState(initialData?.technologies?.join(", ") || "");
  const [isPublished, setIsPublished] = useState(initialData?.is_published || false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Ref untuk input file agar bisa di-trigger secara programatis
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setExistingImageUrl("");
    } else {
      setSelectedImageFile(null);
      setImagePreviewUrl(initialData?.image_url || "");
      // Clear the file input visually as well
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const technologiesArray = technologiesInput
      .split(",")
      .map((tech) => tech.trim())
      .filter((tech) => tech !== "");

    const dataToSubmit: Omit<PortfolioItem, "id" | "image_url"> = {
      title,
      slug,
      description,
      live_url: liveUrl || null,
      github_url: githubUrl || null,
      technologies: technologiesArray,
      is_published: isPublished,
    };

    try {
      const result = await onSubmitAction(dataToSubmit, initialData?.id, selectedImageFile);

      if (result.success) {
        setMessage({ type: "success", text: result.message });
        if (!initialData) {
          setTitle("");
          setSlug("");
          setDescription("");
          setExistingImageUrl("");
          setSelectedImageFile(null);
          setImagePreviewUrl("");
          setLiveUrl("");
          setGithubUrl("");
          setTechnologiesInput("");
          setIsPublished(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } else {
          setExistingImageUrl(imagePreviewUrl);
          setSelectedImageFile(null); // Clear selected file after successful upload/update
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
        setTimeout(() => {
          router.push("/dashboard/portfolio");
        }, 2000);
      } else {
        setMessage({ type: "error", text: result.message });
      }
    } catch (error: unknown) {
      console.error("Error submitting portfolio form:", error);
      if (error instanceof Error) {
        setMessage({ type: "error", text: `Terjadi kesalahan: ${error.message}` });
      } else {
        setMessage({ type: "error", text: "Terjadi kesalahan tidak dikenal." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 lg:p-10 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl transform transition-all duration-300 hover:shadow-3xl">

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Judul Portfolio */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Judul Portofolio <span className="text-red-500">*</span>
            </label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Contoh: Aplikasi E-commerce Modern" className="w-full px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 shadow-sm" />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Slug (URL Ramah SEO) <span className="text-red-500">*</span>
            </label>
            <input type="text" id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="contoh-aplikasi-ecommerce-modern" className="w-full px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 shadow-sm" />
          </div>

          {/* Deskripsi */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Deskripsi Proyek <span className="text-red-500">*</span>
            </label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={6} placeholder="Jelaskan secara singkat dan menarik tentang proyek ini..." className="w-full px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 shadow-sm resize-y"></textarea>
          </div>

          {/* Input Unggah Gambar */}
          <div>
            <label htmlFor="imageUpload" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center">
                <UploadCloud size={20} className="mr-2 text-blue-500" /> Gambar Thumbnail {!initialData && <span className="text-red-500 ml-1">*</span>}
              </div>
            </label>
            <div className="flex flex-col items-center justify-center w-full px-5 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:border-blue-500 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200" onClick={() => fileInputRef.current?.click()}>
              <input type="file" id="imageUpload" accept="image/*" onChange={handleImageChange} className="hidden" ref={fileInputRef} />
              <UploadCloud size={48} className="text-gray-400 dark:text-gray-500 mb-3" />
              <p className="text-gray-600 dark:text-gray-400 mb-1">
                <span className="font-medium text-blue-600 dark:text-blue-400">Klik untuk mengunggah</span> atau seret & jatuhkan
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF hingga 5MB</p>
            </div>

            {/* Pratinjau Gambar */}
            {(imagePreviewUrl || existingImageUrl) && (
              <div className="mt-6 text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Pratinjau Gambar:</p>
                <div className="relative w-full max-w-xs h-48 mx-auto border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={imagePreviewUrl || existingImageUrl}
                    alt="Pratinjau Gambar Portofolio"
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/400x200?text=Image+Not+Available"; // Gambar placeholder yang lebih baik
                    }}
                  />
                </div>
              </div>
            )}
            {!initialData && !selectedImageFile && !existingImageUrl && <p className="text-sm text-red-500 dark:text-red-400 mt-3 text-center">Gambar wajib diunggah untuk item portofolio baru.</p>}
          </div>

          {/* URL Live & GitHub (Dikelompokkan) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="liveUrl" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Link size={16} className="inline-block mr-2 text-green-500" /> URL Live (Opsional)
              </label>
              <input type="url" id="liveUrl" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} placeholder="https://live-demo.example.com" className="w-full px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 shadow-sm" />
            </div>
            <div>
              <label htmlFor="githubUrl" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <GitBranch size={16} className="inline-block mr-2 text-purple-500" /> URL GitHub (Opsional)
              </label>
              <input type="url" id="githubUrl" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/your-repo" className="w-full px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 shadow-sm" />
            </div>
          </div>

          {/* Technologies */}
          <div>
            <label htmlFor="technologies" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Teknologi (Dipisahkan koma) <span className="text-red-500">*</span>
            </label>
            <input type="text" id="technologies" value={technologiesInput} onChange={(e) => setTechnologiesInput(e.target.value)} required placeholder="React, Next.js, Tailwind CSS, PostgreSQL" className="w-full px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 shadow-sm" />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Pisahkan setiap teknologi dengan koma, contoh: React, Node.js, Express</p>
          </div>

          {/* Status Publikasi */}
          <div className="flex items-center pt-2">
            <input type="checkbox" id="isPublished" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-blue-600 dark:checked:border-transparent transition-colors duration-200" />
            <label htmlFor="isPublished" className="ml-3 block text-base font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
              Publikasikan Portofolio ini
            </label>
          </div>

          {/* Pesan Status (Animasi & Ikon Lebih Baik) */}
          {message && (
            <div className={`flex items-center p-4 rounded-lg shadow-md transition-all duration-300 ease-in-out ${message.type === "success" ? "bg-green-50 border border-green-200 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200" : "bg-red-50 border border-red-200 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200"}`}>
              {message.type === "success" ? <CheckCircle size={22} className="mr-3 flex-shrink-0 text-green-600 dark:text-green-400" /> : <XCircle size={22} className="mr-3 flex-shrink-0 text-red-600 dark:text-red-400" />}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          {/* Tombol Submit */}
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-lg text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed disabled:from-blue-500 disabled:to-blue-600 transform hover:-translate-y-0.5">
            {loading ? (
              <>
                <Loader2 size={24} className="animate-spin mr-3" />
                Processing...
              </>
            ) : initialData ? (
              "Perbarui Portofolio"
            ) : (
              "Tambah Portofolio"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PortfolioForm;
