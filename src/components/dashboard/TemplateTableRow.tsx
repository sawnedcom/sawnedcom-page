// src/components/dashboard/TemplateTableRow.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2, Loader2, CheckCircle, XCircle, Edit3, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteTemplate } from "@/app/dashboard/templates/actions";
import ReactDOM from "react-dom"; // Import ReactDOM for portals

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
  tags: string[];
  price: number;
  is_free: boolean;
  is_published: boolean;
  type: string;
}

interface TemplateTableRowProps {
  item: TemplateItem;
}

const TemplateTableRow: React.FC<TemplateTableRowProps> = ({ item }) => {
  const router = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setMessage(null); // Clear previous messages

    try {
      const result = await deleteTemplate(item.id);

      if (result.success) {
        setMessage({ type: "success", text: result.message });
        setTimeout(() => {
          setShowConfirmModal(false); // Close modal
          router.refresh(); // Then refresh the list
          setMessage(null); // Clear success message after refresh
        }, 1500); // Show success message for 1.5 seconds
      } else {
        setMessage({ type: "error", text: result.message });
        setLoading(false); // Stop loading on error
      }
    } catch (error: unknown) {
      setMessage({ type: "error", text: `Terjadi kesalahan: ${error instanceof Error ? error.message : "Unknown error"}` });
      setLoading(false); // Stop loading on catch error
    }
  };

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (showConfirmModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = ""; // Cleanup on unmount
    };
  }, [showConfirmModal]);

  return (
    <>
      {/* Table Row - Ini adalah satu-satunya elemen yang akan dirender di dalam <tbody> */}
      <tr className="bg-gray-800 hover:bg-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 transition-colors duration-200 ease-in-out border-b border-gray-700 dark:border-gray-800">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-100">{item.name}</div>
          <div className="text-xs text-gray-400 mt-1">{item.slug}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-100 capitalize">{item.type}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors duration-200 ${item.is_published ? "bg-green-700 text-green-100" : "bg-red-700 text-red-100"}`}>{item.is_published ? "Published" : "Draft"}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end space-x-4">
            {item.slug && (
              <Link href={`/templates/${item.slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors duration-200 inline-flex items-center group" title="Lihat Demo Live">
                <Eye size={16} className="group-hover:scale-110 transition-transform duration-200" />
                <span className="hidden sm:inline ml-1">Lihat</span>
              </Link>
            )}
            <Link href={`/dashboard/templates/edit/${item.id}`} className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 inline-flex items-center group" title="Edit Template">
              <Edit3 size={16} className="group-hover:scale-110 transition-transform duration-200" />
              <span className="hidden sm:inline ml-1">Edit</span>
            </Link>
            <button onClick={() => setShowConfirmModal(true)} className="text-red-400 hover:text-red-300 transition-colors duration-200 inline-flex items-center group disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading} title="Hapus Template">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} className="group-hover:scale-110 transition-transform duration-200" />}
              <span className="hidden sm:inline ml-1">Hapus</span>
            </button>
          </div>
        </td>
      </tr>

      {/* Gunakan React Portal untuk Toast Notification */}
      {message &&
        ReactDOM.createPortal(
          <div className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-xl flex items-center space-x-3 transform transition-all duration-300 ease-out z-50 animate-slideInFromRight ${message.type === "success" ? "bg-green-700 text-green-100" : "bg-red-700 text-red-100"}`}>
            {message.type === "success" ? <CheckCircle size={20} className="flex-shrink-0" /> : <XCircle size={20} className="flex-shrink-0" />}
            <span className="font-medium">{message.text}</span>
          </div>,
          document.body // Render di luar hierarki komponen, langsung di body
        )}

      {/* Gunakan React Portal untuk Modal Konfirmasi Hapus */}
      {showConfirmModal &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={() => !loading && setShowConfirmModal(false)}>
            <div className="bg-gray-900 text-gray-100 p-8 rounded-xl shadow-2xl max-w-sm w-full text-center transform scale-95 opacity-0 animate-scaleIn" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-2xl font-bold text-red-400 mb-4 flex items-center justify-center">
                <Trash2 size={28} className="mr-3" /> Konfirmasi Penghapusan
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Apakah Anda yakin ingin menghapus template &quot;
                <strong className="text-blue-300">{item.name}</strong>&quot;?
                <br />
                <span className="text-sm text-red-300 font-medium">Tindakan ini tidak dapat dibatalkan.</span>
              </p>
              {message && (
                <div className={`flex items-center justify-center p-3 rounded-md mb-4 text-sm font-medium ${message.type === "success" ? "bg-green-800 text-green-100" : "bg-red-800 text-red-100"}`}>
                  {message.type === "success" ? <CheckCircle size={18} className="mr-2" /> : <XCircle size={18} className="mr-2" />}
                  {message.text}
                </div>
              )}
              <div className="flex justify-center gap-4 mt-6">
                <button onClick={() => !loading && setShowConfirmModal(false)} className="px-6 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md" disabled={loading}>
                  Batal
                </button>
                <button onClick={handleDelete} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md flex items-center justify-center" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" /> Menghapus...
                    </>
                  ) : (
                    "Hapus Sekarang"
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body // Render di luar hierarki komponen, langsung di body
        )}

      {/* Styled-jsx for modal and toast animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
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
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
        .animate-slideInFromRight {
          animation: slideInFromRight 0.5s forwards;
        }
      `}</style>
    </>
  );
};

export default TemplateTableRow;
