// src/components/templates/TemplateDetailClient.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, ExternalLink, Gem, ArrowLeft, ChevronDown, Shield, Zap, Heart, Share2, Calendar, Tag, Package, Eye, Clock } from "lucide-react";

interface TemplateItemProps {
  id: string;
  name: string;
  description: string;
  image_url: string;
  type: "free" | "premium";
  download_url: string | null;
  gumroad_url: string | null;
  lynkid_url: string | null;
  payhip_url: string | null;
  live_demo_url: string | null;
  price: number | null;
  features: string[] | null;
  tags: string[];
  slug: string;
  created_at?: string;
  updated_at?: string | null;
}

const TemplateDetailClient: React.FC<{ item: TemplateItemProps }> = ({ item }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
          title: item.name,
          text: item.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareOpen(true);
      setTimeout(() => setShareOpen(false), 2000);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getPurchaseOptions = () => {
    const options = [];

    if (item.gumroad_url) {
      options.push({
        name: "Gumroad",
        url: item.gumroad_url,
        icon: "🛒",
        description: "Buy on Gumroad",
      });
    }

    if (item.lynkid_url) {
      options.push({
        name: "Lynkid",
        url: item.lynkid_url,
        icon: "🔗",
        description: "Buy on Lynkid",
      });
    }

    if (item.payhip_url) {
      options.push({
        name: "Payhip",
        url: item.payhip_url,
        icon: "💳",
        description: "Buy on Payhip",
      });
    }

    return options;
  };

  const purchaseOptions = getPurchaseOptions();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-900 dark:via-gray-950 dark:to-slate-950 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(71,85,105,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_30%,rgba(71,85,105,0.05),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(55,65,81,0.06),transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_70%,rgba(55,65,81,0.04),transparent_50%)]"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-20 relative z-10">
        {/* Enhanced Navigation */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <Link href="/templates" className="inline-flex items-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:text-slate-600 dark:hover:text-slate-200 transition-all duration-300 group px-6 py-3 rounded-full shadow-lg hover:shadow-xl border border-white/20 dark:border-slate-700/50">
              <ArrowLeft size={20} className="mr-3 transition-transform duration-300 group-hover:-translate-x-1" />
              <span className="font-medium">Back to Templates</span>
            </Link>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button onClick={() => setIsLiked(!isLiked)} className={`p-3 rounded-full transition-all duration-300 ${isLiked ? "bg-red-500 text-white shadow-lg shadow-red-500/25" : "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"} border border-white/20 dark:border-slate-700/50`}>
                <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
              </button>

              <button onClick={handleShare} className="relative p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-400 hover:text-slate-500 dark:hover:text-slate-300 rounded-full transition-all duration-300 border border-white/20 dark:border-slate-700/50">
                <Share2 size={20} />
                {shareOpen && <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-1 rounded-full">Link copied!</div>}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Template Header */}
        <div className="text-center mb-20">
          {/* Template Type Badge */}
          {item.type === "premium" && (
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold mb-6 shadow-lg">
              <Gem size={16} fill="currentColor" />
              <span>Premium Template</span>
            </div>
          )}

          {item.type === "free" && (
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-2 rounded-full text-sm font-bold mb-6 shadow-lg">
              <Shield size={16} fill="currentColor" />
              <span>Free Template</span>
            </div>
          )}

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-slate-600 via-gray-800 to-slate-700 dark:from-slate-300 dark:via-gray-100 dark:to-slate-200 leading-tight">{item.name}</h1>

          {/* Template Meta */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
            {formatDate(item.created_at) && (
              <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-600 dark:text-gray-400 border border-white/20 dark:border-slate-700/50">
                <Calendar size={16} />
                <span>Created {formatDate(item.created_at)}</span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-600 dark:text-gray-400 border border-white/20 dark:border-slate-700/50">
              <Eye size={16} />
              <span>Public Template</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-600 dark:text-gray-400 border border-white/20 dark:border-slate-700/50">
              <Clock size={16} />
              <span>Available</span>
            </div>
          </div>

          <div className="w-32 h-1 bg-gradient-to-r from-slate-500 via-gray-600 to-slate-600 mx-auto rounded-full"></div>
        </div>

        {/* Enhanced Main Template Image */}
        <div className="relative w-full h-96 md:h-[40rem] bg-gradient-to-br from-gray-100 via-slate-50 to-gray-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 rounded-3xl overflow-hidden mb-16 shadow-2xl border border-white/20 dark:border-slate-700/50 group">
          {/* Loading Skeleton */}
          {imageLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-slate-600 dark:via-slate-700 dark:to-slate-600 animate-pulse">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 border-4 border-slate-200 dark:border-slate-800 border-t-slate-500 rounded-full animate-spin"></div>
              </div>
            </div>
          )}

          <Image src={item.image_url || "/placeholder-template-large.jpg"} alt={item.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw" priority onLoad={handleImageLoad} />

          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Floating Action Buttons on Image */}
          <div className="absolute bottom-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
            {item.live_demo_url && (
              <a href={item.live_demo_url} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-all duration-200 transform hover:scale-110 shadow-lg">
                <ExternalLink size={20} />
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
                <div className="p-2 bg-gradient-to-r from-slate-600 to-gray-700 rounded-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Template Overview</h2>
              </div>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-line">{item.description}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Display */}
            {item.type === "premium" && item.price !== null && (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg">
                    <Gem className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pricing</h3>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">${item.price.toLocaleString()}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">One-time payment</div>
                </div>
              </div>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-slate-500 to-gray-600 rounded-lg">
                    <Tag className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Tools</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {item.tags.map((tag, index) => (
                    <span key={index} className="bg-gradient-to-r from-slate-50 to-gray-50 text-slate-700 text-sm font-semibold px-4 py-2 rounded-full dark:from-slate-950/50 dark:to-gray-950/50 dark:text-slate-300 border border-slate-200 dark:border-slate-900/30 hover:from-slate-100 hover:to-gray-100 dark:hover:from-slate-900/50 dark:hover:to-gray-900/50 transition-all duration-200 transform hover:scale-105">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {item.features && item.features.length > 0 && (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Features</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {item.features.map((feature, index) => (
                    <span key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full dark:from-blue-950/50 dark:to-indigo-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-900/30 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 transition-all duration-200 transform hover:scale-105">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-300 dark:to-gray-500 mb-4">Get This Template</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-slate-500 to-gray-600 mx-auto rounded-full"></div>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {item.live_demo_url && (
              <a href={item.live_demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center px-8 py-4 bg-slate-800 dark:bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-900 dark:hover:bg-slate-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                <ExternalLink size={20} className="mr-3" />
                <span>View Live Demo</span>
              </a>
            )}

            {item.type === "free" && item.download_url && (
              <a href={item.download_url} target="_blank" rel="noopener noreferrer" className="flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                <Download size={20} className="mr-3" />
                <span>Download Free</span>
              </a>
            )}

            {item.type === "premium" && purchaseOptions.length > 0 && (
              <div className="relative" ref={dropdownRef}>
                {purchaseOptions.length === 1 ? (
                  <a href={purchaseOptions[0].url} target="_blank" rel="noopener noreferrer" className="flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                    <Gem size={20} className="mr-3" />
                    <span>Get This Template</span>
                  </a>
                ) : (
                  <>
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                      <Gem size={20} className="mr-3" />
                      <span>Get This Template</span>
                      <ChevronDown size={20} className={`ml-2 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute bottom-full left-0 right-0 mt-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 dark:border-slate-700/50 z-10 overflow-hidden">
                        {purchaseOptions.map((option, index) => (
                          <a key={index} href={option.url} target="_blank" rel="noopener noreferrer" className="flex items-center px-6 py-4 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-all duration-200 border-b border-gray-100 dark:border-slate-600 last:border-b-0 group" onClick={() => setIsDropdownOpen(false)}>
                            <span className="text-2xl mr-3 group-hover:scale-110 transition-transform duration-200">{option.icon}</span>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-200">{option.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{option.description}</div>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default TemplateDetailClient;
