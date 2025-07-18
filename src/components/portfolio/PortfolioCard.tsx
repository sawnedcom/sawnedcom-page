// src/components/portfolio/PortfolioCard.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github, ArrowRight } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  live_url?: string;
  github_url?: string;
  technologies: string[];
  slug: string;
}

interface PortfolioCardProps {
  item: PortfolioItem;
  className?: string;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ item, className }) => {
  return (
    <div className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-900/50 ${className}`}>
      {/* Image with hover effect */}
      <div className="relative w-full h-56 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
        <Link href={`/portfolio/${item.slug}`} className="block h-full">
          <Image
            src={item.image_url || "/placeholder-project.jpg"}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-project.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
            <span className="inline-flex items-center text-white font-medium">
              View Project <ArrowRight className="ml-2 w-4 h-4" />
            </span>
          </div>
        </Link>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Title and Description */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            <Link href={`/portfolio/${item.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 after:absolute after:inset-0">
              {item.title}
            </Link>
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{item.description}</p>
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-5">
          {item.technologies.map((tech, index) => (
            <span key={index} className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50">
              {tech}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700/50">
          <Link href={`/portfolio/${item.slug}`} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center">
            View details
            <ArrowRight className="ml-1 w-4 h-4" />
          </Link>

          <div className="flex gap-2">
            {item.github_url && (
              <a href={item.github_url} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all" aria-label="GitHub repository">
                <Github size={18} />
              </a>
            )}
            {item.live_url && (
              <a href={item.live_url} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all" aria-label="Live demo">
                <ExternalLink size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;
