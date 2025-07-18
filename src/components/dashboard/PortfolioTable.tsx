// src/components/dashboard/PortfolioTable.tsx
"use client"; // Ini adalah Client Component

import React, { useState, useEffect } from "react"; // Import useEffect
import Link from "next/link";
import { Loader2, Trash2, Edit2, CheckCircle, XCircle, Eye, PlusCircle } from "lucide-react"; // Menambahkan ikon ExternalLink, Github, PlusCircle
import { useRouter } from "next/navigation";

// Definisi interface untuk item portfolio (sama seperti di page.tsx)
interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url: string; // Pastikan ini ada untuk thumbnail
  live_url?: string | null; // Opsional: Tambahkan jika ingin menampilkan
  github_url?: string | null; // Opsional: Tambahkan jika ingin menampilkan
  technologies: string[];
  created_at: string;
  is_published: boolean;
}

// Props untuk komponen ini, akan menerima daftar item dan fungsi delete dari Server Component
interface PortfolioTableProps {
  portfolioItems: PortfolioItem[];
  // Fungsi delete akan menjadi Server Action yang diteruskan dari Server Component
  deletePortfolioItem: (id: string) => Promise<{ success: boolean; message: string }>;
}

const PortfolioTable: React.FC<PortfolioTableProps> = ({ portfolioItems, deletePortfolioItem }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState<string | null>(null);
  const [isDeletingSpecificItem, setIsDeletingSpecificItem] = useState<string | null>(null); // State untuk melacak item yang sedang dihapus

  // Fungsi untuk menampilkan modal konfirmasi
  const handleDeleteClick = (id: string) => {
    setItemToDeleteId(id);
    setShowConfirmModal(true);
  };

  // Fungsi untuk menutup modal konfirmasi
  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setItemToDeleteId(null);
    setMessage(null); // Hapus pesan jika dibatalkan
  };

  // Fungsi untuk mengkonfirmasi dan melakukan penghapusan
  const handleConfirmDelete = async () => {
    if (!itemToDeleteId) return;

    setLoading(true);
    setIsDeletingSpecificItem(itemToDeleteId); // Set item yang sedang dihapus
    setMessage(null); // Hapus pesan sebelumnya
    setShowConfirmModal(false); // Tutup modal saat proses dimulai

    try {
      // Panggil Server Action yang diteruskan sebagai prop
      const result = await deletePortfolioItem(itemToDeleteId);

      if (result.success) {
        setMessage({ type: "success", text: result.message });
        // Refresh router untuk memuat ulang data setelah penghapusan
        // Delay refresh agar pesan sukses terlihat
        setTimeout(() => {
          router.refresh();
          setMessage(null); // Hapus pesan setelah refresh
        }, 1500);
      } else {
        setMessage({ type: "error", text: result.message });
      }
      // Menggunakan `unknown` dan type guard untuk error handling yang lebih baik
    } catch (error: unknown) {
      console.error("Error deleting portfolio item:", error);
      setMessage({ type: "error", text: `Terjadi kesalahan saat menghapus: ${error instanceof Error ? error.message : "Unknown error"}` });
    } finally {
      setLoading(false);
      setItemToDeleteId(null);
      setIsDeletingSpecificItem(null); // Reset item yang sedang dihapus
      // Pesan dihapus setelah refresh oleh setTimeout di success case
      // Jika error, pesan akan tetap terlihat hingga user berinteraksi atau timeout default 5 detik (yang dihapus di sini)
    }
  };

  // Effect untuk mencegah scrolling body saat modal terbuka
  useEffect(() => {
    if (showConfirmModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = ""; // Pastikan dibersihkan saat komponen di-unmount
    };
  }, [showConfirmModal]);

  return (
    <>
      <div className="bg-gray-800 dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          {" "}
          {/* Tambahkan ini untuk responsive */}
          <table className="min-w-full divide-y divide-gray-700 dark:divide-gray-800">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Portfolio Name
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider hidden md:table-cell">
                  Created At
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 dark:bg-gray-900 divide-y divide-gray-700 dark:divide-gray-800">
              {portfolioItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 whitespace-nowrap text-center text-base">
                    <div className="flex flex-col items-center justify-center">
                      <Eye size={48} className="mb-4 text-gray-500 dark:text-gray-600" />
                      <p className="text-gray-400 dark:text-gray-500 text-lg font-medium mb-2">Belum ada item portofolio.</p>
                      <Link href="/dashboard/portfolio/new" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200">
                        <PlusCircle size={20} className="mr-2" /> Tambahkan Proyek Pertama Anda!
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                portfolioItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors duration-150 ease-in-out">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-100">{item.title}</div>
                      <div className="text-xs text-gray-400 mt-1">{item.slug}</div> {/* Added slug for more info */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors duration-200 ${item.is_published ? "bg-green-700 text-green-100" : "bg-red-700 text-red-100"}`}>
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors duration-200 ${
                            item.is_published
                              ? "bg-green-700 text-green-100" // Darker green for dark mode bg
                              : "bg-red-700 text-red-100" // Darker red for dark mode bg
                          }`}>
                          {item.is_published ? "Published" : "Draft"}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden md:table-cell">{new Date(item.created_at).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-4">
                        {" "}
                        {/* Increased space-x */}
                        {item.live_url && (
                          <Link href={`/portfolio/${item.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200 group" title="Lihat Demo Live">
                            <Eye size={18} className="mr-1 group-hover:scale-110 transition-transform" /> <span className="hidden sm:inline">Lihat</span>
                          </Link>
                        )}
                        <Link href={`/dashboard/portfolio/edit/${item.id}`} className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-200 group" title="Edit Portofolio">
                          <Edit2 size={18} className="mr-1 group-hover:scale-110 transition-transform" /> <span className="hidden sm:inline">Edit</span>
                        </Link>
                        <button onClick={() => handleDeleteClick(item.id)} disabled={loading && isDeletingSpecificItem === item.id} className="inline-flex items-center text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 group" title="Hapus Portofolio">
                          {loading && isDeletingSpecificItem === item.id ? <Loader2 size={18} className="animate-spin mr-1" /> : <Trash2 size={18} className="mr-1 group-hover:scale-110 transition-transform" />} <span className="hidden sm:inline">Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pesan Status (Sukses/Error) */}
      {message && (
        <div className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-xl flex items-center space-x-3 transform transition-all duration-300 ease-out z-50 animate-slideInFromRight ${message.type === "success" ? "bg-green-700 text-green-100" : "bg-red-700 text-red-100"}`}>
          {message.type === "success" ? <CheckCircle size={20} className="flex-shrink-0" /> : <XCircle size={20} className="flex-shrink-0" />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div
            className="bg-gray-900 text-gray-100 p-8 rounded-xl shadow-2xl border border-gray-700 text-center max-w-sm w-full animate-zoomIn"
            onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam modal menutupnya
          >
            <Trash2 size={48} className="text-red-500 mx-auto mb-6 animate-bounceOnce" /> {/* Animasi bounce ikon */}
            <h3 className="text-2xl font-bold mb-3">Konfirmasi Penghapusan</h3>
            <p className="mb-8 text-gray-300 leading-relaxed">
              Anda yakin ingin menghapus item portofolio &quot;<strong className="text-blue-300">{portfolioItems.find((p) => p.id === itemToDeleteId)?.title || "ini"}</strong>&quot; secara permanen?
              <br />
              <span className="text-sm text-red-300 font-medium">Tindakan ini tidak dapat dibatalkan.</span>
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={handleCancelDelete} className="flex-1 px-6 py-3 border border-gray-600 rounded-lg text-gray-200 bg-gray-700 hover:bg-gray-600 transition-colors duration-200 font-semibold">
                Batal
              </button>
              <button onClick={handleConfirmDelete} disabled={loading} className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center">
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin mr-2" /> Menghapus...
                  </>
                ) : (
                  "Ya, Hapus Permanen"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Satu-satunya blok styled-jsx untuk semua keyframes */}
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
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes zoomIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes bounceOnce {
          0%,
          100% {
            transform: translateY(0);
          }
          20% {
            transform: translateY(-10px);
          }
          40% {
            transform: translateY(0);
          }
          60% {
            transform: translateY(-5px);
          }
          80% {
            transform: translateY(0);
          }
        }

        /* Class untuk animasi */
        .animate-slideInFromRight {
          animation: slideInFromRight 0.5s forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-zoomIn {
          animation: zoomIn 0.3s ease-out forwards;
        }
        .animate-bounceOnce {
          animation: bounceOnce 0.8s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default PortfolioTable;
