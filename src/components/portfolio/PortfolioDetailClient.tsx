// src/components/portfolio/PortfolioDetailClient.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github, ArrowLeft, Calendar, Clock, Eye, Share2, Zap, Code2, Palette, Star } from "lucide-react";

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
  featured?: boolean; // Tambahan untuk featured badge
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
  const [imageLoading, setImageLoading] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      setShareOpen(true);
      setTimeout(() => setShareOpen(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.05),transparent_50%)]"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-20 relative z-10">
        {/* Enhanced Navigation */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <Link href="/portfolio" className="inline-flex items-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 group px-6 py-3 rounded-full shadow-lg hover:shadow-xl border border-white/20 dark:border-slate-700/50">
              <ArrowLeft size={20} className="mr-3 transition-transform duration-300 group-hover:-translate-x-1" />
              <span className="font-medium">Back to Portfolio</span>
            </Link>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button onClick={handleShare} className="relative p-3 cursor-pointer bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-full transition-all duration-300 border border-white/20 dark:border-slate-700/50">
                <Share2 size={20} />
                {shareOpen && <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-1 rounded-full">Link copied!</div>}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Project Header */}
        <div className="text-center mb-20">
          {/* Featured Badge */}
          {item.featured && (
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-6 shadow-lg">
              <Star size={16} fill="currentColor" />
              <span>Featured Project</span>
            </div>
          )}

          <h1 className="text-3xl md:text-3xl lg:text-5xl font-bold mb-8 bg-clip-text text-light leading-tight">{item.title}</h1>

          {/* Project Meta */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
            {formatDate(item.created_at) && (
              <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-600 dark:text-gray-400 border border-white/20 dark:border-slate-700/50">
                <Calendar size={16} />
                <span>Created {formatDate(item.created_at)}</span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-600 dark:text-gray-400 border border-white/20 dark:border-slate-700/50">
              <Eye size={16} />
              <span>Public Project</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-600 dark:text-gray-400 border border-white/20 dark:border-slate-700/50">
              <Clock size={16} />
              <span>Active</span>
            </div>
          </div>

          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 mx-auto rounded-full"></div>
        </div>

        {/* Enhanced Main Project Image */}
        <div className="relative w-full h-96 md:h-[40rem] bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 rounded-3xl overflow-hidden mb-16 shadow-2xl border border-white/20 dark:border-slate-700/50 group">
          {/* Loading Skeleton */}
          {imageLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-slate-600 dark:via-slate-700 dark:to-slate-600 animate-pulse">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-800 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            </div>
          )}

          <Image src={item.image_url || "/placeholder-project-large.jpg"} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw" priority onLoad={handleImageLoad} />

          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Floating Action Buttons on Image */}
          <div className="absolute bottom-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
            {item.live_url && (
              <a href={item.live_url} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-full transition-all duration-200 transform hover:scale-110 shadow-lg">
                <ExternalLink size={20} />
              </a>
            )}
            {item.github_url && (
              <a href={item.github_url} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-full transition-all duration-200 transform hover:scale-110 shadow-lg">
                <Github size={20} />
              </a>
            )}
          </div>
        </div>

        {/* Enhanced Content Section */}
        <div className="grid lg:grid-cols-3 gap-12 mb-20">
          {/* Main Description */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Project Overview</h2>
              </div>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{item.description}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Technologies */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Technologies</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {item.technologies.map((tech, index) => (
                  <span key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full dark:from-blue-950/50 dark:to-indigo-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-900/30 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 transition-all duration-200 transform hover:scale-105">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Links */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quick Links</h3>
              </div>
              <div className="space-y-4">
                {item.live_url && (
                  <a href={item.live_url} target="_blank" rel="noopener noreferrer" className="flex items-center w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                    <ExternalLink size={20} className="mr-3" />
                    <span>View Live Project</span>
                  </a>
                )}
                {item.github_url && (
                  <a href={item.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center w-full px-6 py-4 bg-gray-800 dark:bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-900 dark:hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                    <Github size={20} className="mr-3" />
                    <span>View Source Code</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Related Projects */}
        {relatedItems.length > 0 && (
          <div className="mt-24">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-300 dark:to-gray-500 mb-6">Related Projects</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>

            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedItems.map((project) => (
                  <Link key={project.id} href={`/portfolio/${project.slug}`} className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-slate-700/50 hover:-translate-y-2">
                    <div className="relative h-48 w-full bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
                      <Image src={project.image_url || "/placeholder-project.jpg"} alt={project.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-gray-800 dark:text-gray-200 font-semibold px-6 py-3 rounded-full shadow-lg">
                          <Eye className="inline mr-2 w-4 h-4" />
                          View Project
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">{project.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span key={tech} className="bg-gray-100 dark:bg-slate-700 text-xs font-medium px-3 py-1 rounded-full text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-600">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && <span className="bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-medium px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900/30">+{project.technologies.length - 3} more</span>}
                      </div>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 -z-10"></div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default PortfolioDetailClient;
