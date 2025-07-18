// src/components/dashboard/BlogPostTable.tsx
// Premium Blog Post Management Table with Interactive Features

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, Edit2, CheckCircle, XCircle, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { BlogPostItem } from "@/app/dashboard/tutorials/actions";

interface BlogPostTableProps {
  blogPosts: BlogPostItem[];
  deleteBlogPost: (id: string) => Promise<{ success: boolean; message: string }>;
}

/**
 * BlogPostTable - Premium Data Table Component
 * Features: Sortable columns, responsive design, animated transitions
 */
const BlogPostTable: React.FC<BlogPostTableProps> = ({ blogPosts, deleteBlogPost }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof BlogPostItem; direction: "asc" | "desc" } | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Sorting functionality
  const sortedPosts = [...blogPosts].sort((a, b) => {
    if (!sortConfig) return 0;

    const key = sortConfig.key;
    const direction = sortConfig.direction;

    // Ambil nilai dari objek a dan b
    // Perbaiki: Gunakan union type 'string | number' daripada 'any'
    let valA: string | number = "";
    let valB: string | number = "";

    // Penanganan khusus untuk tipe data yang berbeda atau bisa null/undefined
    if (key === "is_published") {
      // Untuk boolean, false dianggap lebih kecil dari true.
      // Nilai null/undefined dianggap false untuk tujuan sorting.
      valA = (a[key] as boolean) ? 1 : 0; // Cast ke boolean karena TypeScript tidak yakin
      valB = (b[key] as boolean) ? 1 : 0; // Cast ke boolean
    } else if (key === "tags") {
      // Untuk array tags, konversi ke string untuk perbandingan.
      // Array null/undefined dianggap string kosong.
      valA = ((a[key] as string[]) || []).join(",");
      valB = ((b[key] as string[]) || []).join(",");
    } else if (key === "created_at" || key === "updated_at") {
      // Untuk tanggal dalam bentuk string, konversi ke timestamp untuk perbandingan numerik.
      // Tanggal null/undefined dianggap 0 (epoch) agar konsisten.
      valA = (a[key] as string) ? new Date(a[key] as string).getTime() : 0;
      valB = (b[key] as string) ? new Date(b[key] as string).getTime() : 0;
    } else {
      // Untuk tipe string atau numerik lainnya, pastikan bukan null/undefined.
      // Konversi null/undefined ke string kosong untuk perbandingan string yang konsisten.
      // Gunakan operator nullish coalescing (??) untuk memberikan nilai default
      valA = (a[key] ?? "") as string;
      valB = (b[key] ?? "") as string;
    }

    // Lakukan perbandingan
    if (valA < valB) {
      return direction === "asc" ? -1 : 1;
    }
    if (valA > valB) {
      return direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: keyof BlogPostItem) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleDeleteClick = (id: string) => {
    setItemToDeleteId(id);
    setShowConfirmModal(true);
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setItemToDeleteId(null);
    setMessage(null);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDeleteId) return;

    setLoading(true);
    setShowConfirmModal(false);

    try {
      const result = await deleteBlogPost(itemToDeleteId);
      if (result.success) {
        setMessage({ type: "success", text: result.message });
        router.refresh();
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
      setItemToDeleteId(null);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const toggleRowExpand = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider  transition-colors" onClick={() => requestSort("title")}>
                  <div className="flex items-center">Post Title</div>
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider transition-colors" onClick={() => requestSort("is_published")}>
                  <div className="flex items-center">
                    Status
                    {sortConfig?.key === "is_published" && (sortConfig.direction === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />)}
                  </div>
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {sortedPosts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center">
                    <div className="text-white flex flex-col items-center justify-center">
                      <p className="text-lg font-medium">No blog posts found</p>
                      <p className="text-sm mt-2">Create your first blog post to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedPosts.map((item) => (
                  <React.Fragment key={item.id}>
                    <tr className={` transition-colors ${expandedRow === item.id ? "" : ""}`} onClick={() => toggleRowExpand(item.id)}>
                      <td className="px-6 py-4">
                        <div className="whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-100">{item.title}</div>
                          <div className="text-xs text-gray-400 mt-1">{item.slug}</div> {/* Added slug for more info */}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${item.is_published ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"}`}>{item.is_published ? "Published" : "Draft"}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-4">
                          <Link href={`/tutorials/${item.slug}`} target="_blank" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors" onClick={(e) => e.stopPropagation()}>
                            <Eye size={18} className="inline-block" /> Lihat
                          </Link>
                          <Link href={`/dashboard/tutorials/edit/${item.id}`} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors" onClick={(e) => e.stopPropagation()}>
                            <Edit2 size={18} className="inline-block" /> Edit
                          </Link>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Pastikan item.id ada sebelum memanggil handleDeleteClick
                              if (item.id) {
                                handleDeleteClick(item.id);
                              } else {
                                console.error("Attempted to delete a blog post without an ID.");
                                setMessage({ type: "error", text: "Error: Blog post ID is missing." });
                              }
                            }}
                            disabled={loading}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading && itemToDeleteId === item.id ? <Loader2 size={18} className="animate-spin inline-block" /> : <Trash2 size={18} className="inline-block" />} Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast Notification */}
      {message && (
        <div className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-xl flex items-center space-x-3 animate-fade-in-up ${message.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
          {message.type === "success" ? <CheckCircle size={20} className="flex-shrink-0" /> : <XCircle size={20} className="flex-shrink-0" />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to delete this blog post? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button onClick={handleCancelDelete} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancel
              </button>
              <button onClick={handleConfirmDelete} disabled={loading} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]">
                {loading ? <Loader2 size={18} className="animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogPostTable;
