// src/components/tutorials/BlogDetailClient.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag, User } from "lucide-react";

// PENTING: Interface ini HARUS SAMA PERSIS dengan `BlogPostItem` di `src/app/tutorials/[slug]/page.tsx`
// Pastikan `image_url` ditandai dengan `| null`.
interface BlogPostItemProps {
  id: string; // Tambahkan `id` agar konsisten dengan `page.tsx`
  title: string;
  content: string;
  excerpt: string; // `excerpt` juga ada di page.tsx, pastikan di sini juga
  image_url: string | null; // <-- Diperbaiki: Bisa string atau null
  created_at: string;
  updated_at?: string | null; // Tambahkan ini jika ada di database/page.tsx
  author: string;
  tags: string[];
  slug: string;
}

const BlogDetailClient: React.FC<{ item: BlogPostItemProps }> = ({ item }) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    // Perhatikan: new Date(null) akan menghasilkan Invalid Date.
    // Pastikan dateString selalu valid string sebelum diteruskan.
    // Dalam konteks ini, `created_at` seharusnya selalu ada dan bukan null.
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-12">
          <Link href="/tutorials" className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-all duration-300 group">
            <ArrowLeft size={20} className="mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Tutorials
          </Link>
        </div>

        {/* Blog Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">{item.title}</h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mb-8"></div>
        </div>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-3">
              <Calendar size={18} className="text-purple-600 dark:text-purple-400" />
            </div>
            <span>{formatDate(item.created_at)}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-full mr-3">
              <User size={18} className="text-pink-600 dark:text-pink-400" />
            </div>
            <span>{item.author}</span>
          </div>
        </div>

        {/* Featured Image */}
        {item.image_url && ( // <-- `item.image_url` akan dievaluasi true jika ada string, false jika null
          <div className="relative w-full h-64 md:h-80 lg:h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden mb-12 shadow-xl border border-gray-200 dark:border-gray-700">
            <Image src={item.image_url} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw" priority />
          </div>
        )}

        {/* Blog Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none mb-12">
          {/* Menggunakan `item.content` secara langsung, pastikan ini adalah HTML string yang aman */}
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.content }} />
        </article>

        {/* Tags */}
        <div className="flex flex-wrap items-center justify-center gap-4 border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mr-3">
              <Tag size={18} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="font-medium">Tags:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {item.tags.map((tag, index) => (
              <Link key={index} href={`/tutorials?tag=${tag.toLowerCase()}`} className="bg-indigo-100 text-indigo-800 text-sm font-medium px-4 py-2 rounded-full hover:bg-indigo-200 transition-colors duration-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50">
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default BlogDetailClient;
