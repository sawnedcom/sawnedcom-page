// src/components/templates/TemplateCard.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, ExternalLink, Gem, ArrowRight } from "lucide-react";

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

interface TemplateCardProps {
  item: TemplateItem;
  className?: string;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ item, className }) => {
  return (
    <div className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700/50 hover:border-green-200 dark:hover:border-green-900/50 flex flex-col h-full ${className}`}>
      {/* Image with hover effect */}
      <div className="relative w-full h-56 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
        <Link href={`/templates/${item.slug}`} className="block h-full">
          <Image
            src={item.image_url || "/placeholder-template.jpg"}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-template.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
            <span className="inline-flex items-center text-white font-medium">
              View Details <ArrowRight className="ml-2 w-4 h-4" />
            </span>
          </div>
        </Link>

        {/* Premium/Free badge */}
        <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold shadow-md ${item.is_free ? "bg-green-500 text-white" : "bg-gradient-to-r from-yellow-500 to-amber-600 text-white"}`}>{item.is_free ? "Free" : "Premium"}</span>
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          <Link href={`/templates/${item.slug}`} className="hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 after:absolute after:inset-0">
            {item.name}
          </Link>
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 flex-grow">{item.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {item.tags.slice(0, 4).map((tag, index) => (
            <span key={index} className="bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full dark:bg-green-900/30 dark:text-green-300 border border-green-100 dark:border-green-900/50">
              {tag}
            </span>
          ))}
        </div>

        {/* Price */}
        {!item.is_free && (
          <div className="mb-4">
            <span className="text-xl font-bold text-gray-900 dark:text-white">${item.price.toLocaleString()}</span>
            {item.price > 0 && <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">(one-time payment)</span>}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700/50">
          <div className="flex justify-between items-center">
            {item.live_demo_url && (
              <a href={item.live_demo_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <ExternalLink size={16} className="mr-2" />
                Live Demo
              </a>
            )}

            <div className="flex gap-2">
              {item.is_free && item.download_url ? (
                <a href={item.download_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-all duration-200 shadow hover:shadow-md">
                  <Download size={16} className="mr-2" />
                  Download
                </a>
              ) : item.gumroad_url ? (
                <a href={item.gumroad_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-sm font-medium rounded-lg hover:from-yellow-600 hover:to-amber-700 transition-all duration-200 shadow hover:shadow-md">
                  <Gem size={16} className="mr-2" />
                  Get Template
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
