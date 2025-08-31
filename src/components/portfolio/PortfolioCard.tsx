// src/components/portfolio/PortfolioCard.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ArrowRight, Eye, Star, Calendar, Zap } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  live_url?: string;
  github_url?: string;
  technologies: string[];
  slug: string;
  created_at?: string;
  featured?: boolean;
}

interface PortfolioCardProps {
  item: PortfolioItem;
  className?: string;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ item, className }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  // Format date if available
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div className={`group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 dark:border-slate-700/50 hover:border-blue-300/50 dark:hover:border-blue-500/30 hover:-translate-y-2 ${className}`}>
      {/* Featured Badge */}
      {item.featured && (
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Star size={12} fill="currentColor" />
            Featured
          </div>
        </div>
      )}

      {/* Image Section with Advanced Effects */}
      <div className="relative w-full h-64 bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        <Link href={`/portfolio/${item.slug}`} className="block h-full">
          {/* Loading Skeleton */}
          {imageLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-slate-600 dark:via-slate-700 dark:to-slate-600 animate-pulse">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            </div>
          )}

          {/* Main Image */}
          <Image src={imageError ? "/placeholder-project.jpg" : item.image_url || "/placeholder-project.jpg"} alt={item.title} fill className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" onLoad={handleImageLoad} onError={handleImageError} />

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

          {/* Hover Content */}
          <div className="absolute inset-0 flex flex-col justify-between p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
            {/* Top Actions */}
            <div className="flex justify-end gap-2 pointer-events-auto">
              {item.live_url && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(item.live_url, "_blank");
                  }}
                  className="p-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-white dark:hover:bg-slate-700 transition-all duration-200 transform hover:scale-110 shadow-lg"
                  aria-label="Live demo">
                  <ExternalLink size={18} />
                </button>
              )}
            </div>

            {/* Bottom CTA */}
            <div className="text-center">
              <div className="inline-flex items-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-gray-800 dark:text-gray-200 font-semibold px-6 py-3 rounded-full hover:bg-white dark:hover:bg-slate-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                <Eye className="mr-2 w-4 h-4" />
                View Project
                <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-4">
        {/* Header with Date */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
              <Link href={`/portfolio/${item.slug}`} className="after:absolute after:inset-0">
                {item.title}
              </Link>
            </h3>
          </div>
          {formatDate(item.created_at) && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-700/50 px-2 py-1 rounded-full">
              <Calendar size={12} />
              {formatDate(item.created_at)}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">{item.description}</p>

        {/* Technologies with Enhanced Design */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            <Zap size={12} className="text-blue-500" />
            <span>Technologies</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {item.technologies.slice(0, 4).map((tech, index) => (
              <span key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full dark:from-blue-950/50 dark:to-indigo-950/50 dark:text-blue-300 border border-blue-100 dark:border-blue-900/30 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 transition-all duration-200 transform hover:scale-105">
                {tech}
              </span>
            ))}
            {item.technologies.length > 4 && <span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-600">+{item.technologies.length - 4} more</span>}
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-slate-700/50">
          <Link href={`/portfolio/${item.slug}`} className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 group/link">
            <span>Explore Details</span>
            <ArrowRight className="ml-2 w-4 h-4 transform group-hover/link:translate-x-1 transition-transform duration-200" />
          </Link>

          <div className="flex items-center gap-2">
            {/* Project Status Indicator */}
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Active Project"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Live</span>
          </div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute -inset-1  rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 -z-10"></div>
    </div>
  );
};

export default PortfolioCard;
