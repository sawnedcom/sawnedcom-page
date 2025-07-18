// src/components/portfolio/PortfolioDetailClient.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";

// PENTING: Interface ini HARUS SAMA PERSIS dengan `PortfolioItem` di `src/app/portfolio/[slug]/page.tsx`
// Pastikan semua properti yang bisa NULL dari database ditandai dengan `| null`.
interface PortfolioItemProps {
  id: string; // Tambahkan `id` di sini, karena `item` di page.tsx memiliki `id`
  title: string;
  description: string;
  image_url: string;
  live_url: string | null; // <-- UBAH INI: Pastikan bisa `null`
  github_url: string | null; // <-- UBAH INI: Pastikan bisa `null`
  technologies: string[];
  slug: string;
  // Jika `created_at` dan `updated_at` juga dikirim dari page.tsx, tambahkan di sini:
  created_at?: string; // Opsional jika tidak selalu ada, tapi di page.tsx sepertinya ada
  updated_at?: string | null; // Opsional dan bisa null
}

interface PortfolioItemCard {
  id: string;
  title: string;
  image_url: string;
  slug: string;
  technologies: string[];
  // relatedItems di page.tsx hanya select id, title, image_url, slug, technologies.
  // Jadi interface ini sudah cukup sesuai, asalkan tidak ada `null` yang datang dari kolom tersebut.
}

interface PortfolioDetailClientProps {
  item: PortfolioItemProps;
  relatedItems: PortfolioItemCard[];
}

const PortfolioDetailClient: React.FC<PortfolioDetailClientProps> = ({ item, relatedItems }) => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 py-16 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Back Button */}
        <div className="mb-12">
          <Link href="/portfolio" className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-all duration-300 group">
            <ArrowLeft size={20} className="mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Portfolio
          </Link>
        </div>

        {/* Project Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">{item.title}</h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-8"></div>
        </div>

        {/* Main Project Image */}
        <div className="relative w-full h-96 md:h-[32rem] bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden mb-12 shadow-xl border border-gray-200 dark:border-gray-700">
          <Image src={item.image_url || "/placeholder-project-large.jpg"} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw" priority />
        </div>

        {/* Project Description */}
        <div className="prose prose-lg dark:prose-invert max-w-3xl mx-auto mb-12">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item.description}</p>
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {item.technologies.map((tech, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-sm">
              {tech}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-6 mb-20">
          {item.live_url && ( // Ini akan bekerja dengan baik karena null dianggap falsy
            <a href={item.live_url} target="_blank" rel="noopener noreferrer" className="flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              <ExternalLink size={20} className="mr-3" />
              View Live Project
            </a>
          )}
          {item.github_url && ( // Ini juga akan bekerja dengan baik
            <a href={item.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center px-8 py-4 bg-gray-800 text-white font-medium rounded-xl hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl dark:bg-gray-700 dark:hover:bg-gray-600">
              <Github size={20} className="mr-3" />
              View on GitHub
            </a>
          )}
        </div>

        {/* Related Projects */}
        {relatedItems.length > 0 && (
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-300 dark:to-gray-500">Related Projects</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedItems.map((project) => (
                <Link key={project.id} href={`/portfolio/${project.slug}`} className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                  <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    <Image src={project.image_url || "/placeholder-project.jpg"} alt={project.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <span className="text-white font-medium">View Project</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{project.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span key={tech} className="bg-gray-100 dark:bg-gray-700 text-xs font-medium px-3 py-1 rounded-full text-gray-800 dark:text-gray-200">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default PortfolioDetailClient;
