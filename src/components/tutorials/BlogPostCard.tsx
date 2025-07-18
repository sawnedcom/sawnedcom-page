// src/components/tutorials/BlogPostCard.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User } from "lucide-react";

interface BlogPostItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url?: string;
  created_at: string;
  author: string;
  tags: string[];
  is_published: boolean;
  slug: string;
}

interface BlogPostCardProps {
  post: BlogPostItem;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const publishDate = new Date(post.created_at).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link href={`/tutorials/${post.slug}`} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500/50">
        {/* Image with hover effect */}
        <div className="relative w-full h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
          {post.image_url ? (
            <Image src={post.image_url} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
              <span className="text-white text-xl font-bold">{post.title.charAt(0)}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
            <span className="text-white font-medium">Read Tutorial</span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{post.title}</h3>

          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <div className="flex items-center">
              <User size={16} className="mr-2 text-purple-500 dark:text-purple-400" />
              {post.author}
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-2 text-pink-500 dark:text-pink-400" />
              {publishDate}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700/50">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs font-medium px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800/50">
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-3 py-1 rounded-full">+{post.tags.length - 3}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogPostCard;
