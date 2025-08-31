// src/components/templates/TemplateCard.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, ArrowRight, Eye, Star, Calendar, Shield, Clock, ExternalLink } from "lucide-react";

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
  created_at?: string;
  featured?: boolean;
  downloads_count?: number;
}

interface TemplateCardProps {
  item: TemplateItem;
  className?: string;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ item, className }) => {
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
    <div className={`group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 dark:border-slate-700/50 hover:border-slate-300/50 dark:hover:border-slate-500/30 hover:-translate-y-2 flex flex-col h-full ${className}`}>
      {/* Premium/Free Badge */}
      <div className="absolute top-4 left-4 z-20">
        {item.is_free ? (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Shield size={12} fill="currentColor" />
            Free
          </div>
        ) : (
          <div className="bg-gradient-to-r from-slate-600 to-gray-700 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">Premium</div>
        )}
      </div>

      {/* Featured Badge */}
      {item.featured && (
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Star size={12} fill="currentColor" />
            Featured
          </div>
        </div>
      )}

      {/* Image Section with Advanced Effects */}
      <div className="relative w-full h-64 bg-gradient-to-br from-gray-100 via-slate-50 to-gray-100 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        <Link href={`/templates/${item.slug}`} className="block h-full">
          {/* Loading Skeleton */}
          {imageLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-slate-600 dark:via-slate-700 dark:to-slate-600 animate-pulse">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-800 border-t-slate-500 rounded-full animate-spin"></div>
              </div>
            </div>
          )}

          {/* Main Image */}
          <Image src={imageError ? "/placeholder-template.jpg" : item.image_url || "/placeholder-template.jpg"} alt={item.name} fill className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" onLoad={() => handleImageLoad()} onError={() => handleImageError()} />

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/20 to-gray-500/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

          {/* Hover Content */}
          <div className="absolute inset-0 flex flex-col justify-between p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
            {/* Top Actions */}
            <div className="flex justify-end gap-2 pointer-events-auto">
              {item.live_demo_url && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(item.live_demo_url ?? "", "_blank");
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
                View Template
                <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-4 flex flex-col flex-grow">
        {/* Header with Date */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 ration-200">
              <Link href={`/templates/${item.slug}`} className="after:absolute after:inset-0">
                {item.name}
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
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2 flex-grow">{item.description}</p>

        {/* Type and Downloads Info */}
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          {item.downloads_count && (
            <div className="flex items-center gap-1">
              <Download size={12} className="text-slate-500" />
              <span>{item.downloads_count.toLocaleString()} downloads</span>
            </div>
          )}
        </div>

        {/* Technologies/Tags with Enhanced Design + Premium/Free inline */}
        <div className="flex items-center justify-between">
          {/* Status */}
          <span className={`text-sm font-semibold ${item.is_free ? "text-emerald-500" : "text-yellow-500"}`}>{item.is_free ? "Free" : "Premium"}</span>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {item.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="bg-gradient-to-r from-slate-50 to-gray-50 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full dark:from-slate-950/50 dark:to-gray-950/50 dark:text-slate-300 border border-slate-100 dark:border-slate-900/30 hover:from-slate-100 hover:to-gray-100 dark:hover:from-slate-900/50 dark:hover:to-gray-900/50 transition-all duration-200 transform hover:scale-105">
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && <span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-600">+{item.tags.length - 3} more</span>}
          </div>
        </div>

        {/* Price Section */}
        {!item.is_free && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-gray-700 dark:from-slate-300 dark:to-gray-200 bg-clip-text text-transparent">${item.price.toLocaleString()}</span>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-700/50 px-2 py-1 rounded-full">
                <Clock size={12} />
                One-time
              </div>
            </div>
          </div>
        )}

        {/* Action Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-slate-700/50 mt-auto">
          <Link href={`/templates/${item.slug}`} className="inline-flex items-center text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-all duration-200 group/link">
            <span>View Details</span>
            <ArrowRight className="ml-2 w-4 h-4 transform group-hover/link:translate-x-1 transition-transform duration-200" />
          </Link>

          <div className="flex items-center gap-2">
            {/* Template Status Indicator */}
            <div className={`w-2 h-2 ${item.is_published ? "bg-emerald-500" : "bg-amber-500"} rounded-full animate-pulse`} title={item.is_published ? "Published" : "Coming Soon"}></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{item.is_published ? "Available" : "Soon"}</span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex gap-2 pt-2">
          {item.live_demo_url && (
            <a href={item.live_demo_url} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-all duration-200 shadow-sm hover:shadow-md">
              Demo
            </a>
          )}

          {item.is_free && item.download_url ? (
            <a href={item.download_url} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
              <Download size={16} className="mr-2" />
              Download
            </a>
          ) : item.gumroad_url ? (
            <a href={item.gumroad_url} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-slate-600 to-gray-600 text-white text-sm font-medium rounded-xl hover:from-slate-700 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
              Get Template
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
