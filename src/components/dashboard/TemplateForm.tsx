// src/components/dashboard/TemplateForm.tsx
"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle, UploadCloud } from "lucide-react";
import Image from "next/image";

// Definisi interface untuk item template
interface TemplateItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  live_demo_url: string | null;
  download_url: string | null;
  gumroad_url: string | null;
  lynkid_url: string | null;
  payhip_url: string | null;
  tags: string[];
  price: number; // Ini akan diasumsikan dalam USD
  is_free: boolean;
  is_published: boolean;
  type: string;
  created_at: string; // Tambahkan ini jika initialData bisa punya created_at
}

// Props untuk form
interface TemplateFormProps {
  initialData?: TemplateItem;
  onSubmitAction: (data: Omit<TemplateItem, "id" | "created_at" | "image_url">, id?: string, imageFile?: File | null) => Promise<{ success: boolean; message: string }>;
}

const TemplateForm: React.FC<TemplateFormProps> = ({ initialData, onSubmitAction }) => {
  const router = useRouter();

  // State untuk form
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(initialData?.description || "");

  // Image handling states
  const [existingImageUrl, setExistingImageUrl] = useState(initialData?.image_url || "");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(initialData?.image_url || "");

  const [liveDemoUrl, setLiveDemoUrl] = useState(initialData?.live_demo_url || "");
  const [downloadUrl, setDownloadUrl] = useState(initialData?.download_url || "");
  const [gumroadUrl, setGumroadUrl] = useState(initialData?.gumroad_url || "");
  const [lynkidUrl, setLynkidUrl] = useState(initialData?.lynkid_url || "");
  const [payhipUrl, setPayhipUrl] = useState(initialData?.payhip_url || "");
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(", ") || "");
  const [price, setPrice] = useState(initialData?.price || 0);
  const [isFree, setIsFree] = useState(initialData?.is_free || false);
  const [isPublished, setIsPublished] = useState(initialData?.is_published || false);
  const [type, setType] = useState(initialData?.type || "");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Effect untuk membersihkan URL objek pratinjau saat komponen unmount
  useEffect(() => {
    return () => {
      if (imagePreviewUrl && imagePreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  // Handler untuk perubahan input file
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImageFile(file);
      // Revoke previous blob URL if exists
      if (imagePreviewUrl && imagePreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      setImagePreviewUrl(URL.createObjectURL(file));
      setExistingImageUrl(""); // Clear existing URL if a new file is chosen
    } else {
      setSelectedImageFile(null);
      // Restore initial image if editing and no new file selected, otherwise clear
      setImagePreviewUrl(initialData?.image_url || "");
      setExistingImageUrl(initialData?.image_url || ""); // Ensure existing URL is restored
    }
  };

  // Fungsi untuk menangani submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const tagsArray = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    const templateType = isFree ? "free" : "premium";

    // --- START: Client-side validation for price ---
    if (!isFree) {
      if (typeof price !== "number" || isNaN(price) || price < 0 || price > 1000000) {
        setMessage({ type: "error", text: "Harga tidak valid. Harga harus berupa angka positif antara $0.00 dan $1,000,000.00." });
        setLoading(false);
        return;
      }
      const priceString = price.toString();
      if (priceString.includes(".") && priceString.split(".")[1].length > 2) {
        setMessage({ type: "error", text: "Harga tidak valid. Maksimal 2 angka desimal diperbolehkan." });
        setLoading(false);
        return;
      }
    }
    // --- END: Client-side validation for price ---

    const dataToSubmit: Omit<TemplateItem, "id" | "created_at" | "image_url"> = {
      name,
      slug,
      description,
      live_demo_url: liveDemoUrl || null,
      download_url: isFree ? downloadUrl || null : null,
      gumroad_url: !isFree ? gumroadUrl || null : null,
      lynkid_url: !isFree ? lynkidUrl || null : null,
      payhip_url: !isFree ? payhipUrl || null : null,
      tags: tagsArray,
      price: isFree ? 0 : price,
      is_free: isFree,
      is_published: isPublished,
      type: templateType,
    };

    try {
      const result = await onSubmitAction(dataToSubmit, initialData?.id, selectedImageFile);

      if (result.success) {
        setMessage({ type: "success", text: result.message });
        if (!initialData) {
          // Reset form fields only for new template creation
          setName("");
          setSlug("");
          setDescription("");
          setExistingImageUrl("");
          setSelectedImageFile(null);
          setImagePreviewUrl("");
          setLiveDemoUrl("");
          setDownloadUrl("");
          setGumroadUrl("");
          setLynkidUrl("");
          setPayhipUrl("");
          setTagsInput("");
          setPrice(0);
          setIsFree(false);
          setIsPublished(false);
          setType("");
        } else {
          // If editing and a new file was selected, update the existingImageUrl to the new preview
          if (selectedImageFile) {
            setExistingImageUrl(imagePreviewUrl);
          }
        }
        setTimeout(() => {
          router.push("/dashboard/templates");
        }, 2000);
      } else {
        setMessage({ type: "error", text: result.message });
      }
    } catch (error: unknown) {
      console.error("Error submitting template form:", error);
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
    <div className="bg-gray-800 dark:bg-gray-900 p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-700 dark:border-gray-750 max-w-3xl mx-auto my-8 text-gray-100">
      <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">{initialData ? "Edit Template" : "Tambah Template Baru"}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nama Template */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-200 mb-1">
            Nama Template <span className="text-red-400">*</span>
          </label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" placeholder="Nama menarik untuk template Anda" />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-semibold text-gray-200 mb-1">
            Slug (URL Friendly) <span className="text-red-400">*</span>
          </label>
          <input type="text" id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" placeholder="nama-template-anda-yang-unik" />
        </div>

        {/* Deskripsi */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-200 mb-1">
            Deskripsi <span className="text-red-400">*</span>
          </label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={5} className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-y" placeholder="Jelaskan fitur dan kegunaan template ini secara detail."></textarea>
        </div>

        {/* Input Upload Gambar */}
        <div className="border border-dashed border-gray-600 p-6 rounded-lg text-center bg-gray-700 hover:border-blue-500 transition-all duration-200">
          <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center justify-center">
            <UploadCloud size={48} className="text-blue-400 mb-3" />
            <span className="text-lg font-medium text-gray-100">{selectedImageFile ? selectedImageFile.name : "Pilih atau Seret Gambar Thumbnail di Sini"}</span>
            <span className="text-sm text-gray-400 mt-1">(PNG, JPG, JPEG - Maks 5MB)</span>
          </label>
          <input type="file" id="imageUpload" accept="image/*" onChange={handleImageChange} className="hidden" />

          {/* Pratinjau Gambar */}
          {(imagePreviewUrl || existingImageUrl) && (
            <div className="mt-6 flex flex-col items-center">
              <p className="text-sm font-medium text-gray-400 mb-3">Pratinjau Gambar:</p>
              <div className="relative w-64 h-40 border border-gray-600 rounded-lg overflow-hidden shadow-md">
                <Image
                  src={imagePreviewUrl || existingImageUrl}
                  alt="Image Preview"
                  fill
                  style={{ objectFit: "contain" }}
                  className="rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/256x160?text=Image+Load+Error";
                  }}
                />
              </div>
            </div>
          )}
          {!initialData && !selectedImageFile && !existingImageUrl && (
            <p className="text-sm text-red-400 mt-4">
              <XCircle size={16} className="inline-block mr-1" /> Gambar wajib diupload untuk template baru.
            </p>
          )}
        </div>

        {/* URL Demo (Opsional) */}
        <div>
          <label htmlFor="liveDemoUrl" className="block text-sm font-semibold text-gray-200 mb-1">
            URL Demo Live (Opsional)
          </label>
          <input type="url" id="liveDemoUrl" value={liveDemoUrl} onChange={(e) => setLiveDemoUrl(e.target.value)} className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" placeholder="https://demo.namadomain.com/template" />
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-semibold text-gray-200 mb-1">
            Tags/Framework (Pisahkan dengan koma)
          </label>
          <input type="text" id="tags" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" placeholder="HTML, CSS, JavaScript, Responsive, Blog" />
          <p className="mt-1 text-xs text-gray-400">Contoh: &quot;Website, Portofolio, E-commerce, Blog&quot;</p>
        </div>

        {/* Status Gratis & Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center p-3 bg-gray-700 rounded-lg border border-gray-600 shadow-sm">
            <input type="checkbox" id="isFree" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} className="h-5 w-5 text-blue-500 border-gray-500 rounded focus:ring-blue-500 cursor-pointer bg-gray-600" />
            <label htmlFor="isFree" className="ml-3 block text-base font-medium text-gray-100 cursor-pointer">
              Template Gratis
            </label>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-semibold text-gray-200 mb-1">
              Tipe Framework/Bahasa <span className="text-red-400">*</span>
            </label>
            <input type="text" id="type" value={type} onChange={(e) => setType(e.target.value)} required className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" placeholder="Contoh: HTML, React, Next.js, WordPress" />
          </div>
        </div>

        {/* Conditional Fields: Download URL / Price & Platform URLs */}
        {isFree ? (
          <div>
            <label htmlFor="downloadUrl" className="block text-sm font-semibold text-gray-200 mb-1">
              URL Download <span className="text-red-400">*</span>
            </label>
            <input type="url" id="downloadUrl" value={downloadUrl} onChange={(e) => setDownloadUrl(e.target.value)} required={isFree} className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" placeholder="https://drive.google.com/link-file-anda.zip" />
            <p className="mt-1 text-xs text-gray-400">Link langsung ke file zip template.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-semibold text-gray-200 mb-1">
                Harga (USD) <span className="text-red-400">*</span>
              </label>
              <input type="number" id="price" value={price} onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} required={!isFree} min="0" step="0.01" className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" placeholder="Cth: 19.99" />
            </div>

            {/* Platform URLs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="gumroadUrl" className="block text-sm font-semibold text-gray-200 mb-1">
                  URL Gumroad
                </label>
                <input type="url" id="gumroadUrl" value={gumroadUrl} onChange={(e) => setGumroadUrl(e.target.value)} className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" placeholder="https://yourgumroad.com/l/your-template" />
                <p className="mt-1 text-xs text-gray-400">Link produk Anda di Gumroad.</p>
              </div>

              <div>
                <label htmlFor="lynkidUrl" className="block text-sm font-semibold text-gray-200 mb-1">
                  URL Lynkid
                </label>
                <input type="url" id="lynkidUrl" value={lynkidUrl} onChange={(e) => setLynkidUrl(e.target.value)} className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" placeholder="https://lynkid.com/your-template" />
                <p className="mt-1 text-xs text-gray-400">Link produk Anda di Lynkid.</p>
              </div>

              <div>
                <label htmlFor="payhipUrl" className="block text-sm font-semibold text-gray-200 mb-1">
                  URL Payhip
                </label>
                <input type="url" id="payhipUrl" value={payhipUrl} onChange={(e) => setPayhipUrl(e.target.value)} className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" placeholder="https://payhip.com/b/your-template" />
                <p className="mt-1 text-xs text-gray-400">Link produk Anda di Payhip.</p>
              </div>
            </div>
          </div>
        )}

        {/* Status Publikasi */}
        <div className="flex items-center p-3 bg-gray-700 rounded-lg border border-gray-600 shadow-sm">
          <input type="checkbox" id="isPublished" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="h-5 w-5 text-blue-500 border-gray-500 rounded focus:ring-blue-500 cursor-pointer bg-gray-600" />
          <label htmlFor="isPublished" className="ml-3 block text-base font-medium text-gray-100 cursor-pointer">
            Publikasikan Template
          </label>
        </div>

        {/* Pesan Status (Animasi & Posisi Fixed) */}
        {message && (
          <div className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-xl flex items-center transform transition-all duration-300 ease-out z-50 animate-slideInFromRight ${message.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
            {message.type === "success" ? <CheckCircle size={24} className="mr-3" /> : <XCircle size={24} className="mr-3" />}
            <span className="font-semibold">{message.text}</span>
          </div>
        )}

        {/* Tombol Submit */}
        <button type="submit" disabled={loading} className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105">
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin mr-2" />
              Memproses...
            </>
          ) : initialData ? (
            "Perbarui Template"
          ) : (
            "Tambah Template"
          )}
        </button>
      </form>

      {/* Styled-jsx for animations */}
      <style jsx>{`
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideInFromRight {
          animation: slideInFromRight 0.5s forwards;
        }
      `}</style>
    </div>
  );
};

export default TemplateForm;
