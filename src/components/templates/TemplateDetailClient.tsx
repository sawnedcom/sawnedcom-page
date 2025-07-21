// src/components/templates/TemplateDetailClient.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, ExternalLink, Gem, ArrowLeft, ChevronDown } from "lucide-react";

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
  tags: string[]; // <-- TAMBAHKAN INI UNTUK MENERIMA DATA TAGS
  slug: string;
  created_at?: string;
  updated_at?: string | null;
}

const TemplateDetailClient: React.FC<{ item: TemplateItemProps }> = ({ item }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // console.log("Template Item received in TemplateDetailClient:", item);
  // console.log("Features array:", item.features);
  // console.log("Tags array:", item.tags); // <-- TAMBAHKAN LOG INI UNTUK DEBUGGING TAGS

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
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Back Button */}
        <div className="mb-12">
          <Link href="/templates" className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-all duration-300 group">
            <ArrowLeft size={20} className="mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Templates
          </Link>
        </div>

        {/* Template Header */}
        <div className="text-center mb-16">
          <h1 className="text-2xl md:text-5xl pb-1 lg:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400">{item.name}</h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full mb-8"></div>
        </div>

        {/* Main Template Image */}
        <div className="relative w-full h-96 md:h-[32rem] bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden mb-12 shadow-xl border border-gray-200 dark:border-gray-700">
          <Image src={item.image_url || "/placeholder-template-large.jpg"} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw" priority />
          {/* Template Type Badge */}
          <span className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${item.type === "premium" ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white" : "bg-green-500 text-white"}`}>{item.type === "premium" ? "Premium Template" : "Free Template"}</span>
        </div>

        {/* Template Description */}
        <div className="prose prose-lg dark:prose-invert max-w-3xl mx-auto mb-12">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item.description}</p>
        </div>

        {/* Tags List (BARU DITAMBAHKAN) */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {" "}
            {/* Adjusted margin-bottom for spacing */}
            {item.tags.map((tag, index) => (
              <span key={index} className="bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800 shadow-sm">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Features List (Sudah ada) */}
        {item.features && item.features.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {item.features.map((feature, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-sm">
                {feature}
              </span>
            ))}
          </div>
        )}

        {/* Price Display (for premium templates) */}
        {item.type === "premium" && item.price !== null && (
          <div className="text-center mb-12">
            <div className="inline-block bg-white dark:bg-gray-800 px-8 py-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">${item.price.toLocaleString()}</span>
              <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">One-time payment</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-6 mb-20">
          {item.live_demo_url && (
            <a href={item.live_demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center px-8 py-4 bg-gray-800 text-white font-medium rounded-xl hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl dark:bg-gray-700 dark:hover:bg-gray-600">
              <ExternalLink size={20} className="mr-3" />
              Live Demo
            </a>
          )}

          {item.type === "free" && item.download_url && (
            <a href={item.download_url} target="_blank" rel="noopener noreferrer" className="flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl">
              <Download size={20} className="mr-3" />
              Download Free
            </a>
          )}

          {item.type === "premium" && purchaseOptions.length > 0 && (
            <div className="relative" ref={dropdownRef}>
              {purchaseOptions.length === 1 ? (
                <a href={purchaseOptions[0].url} target="_blank" rel="noopener noreferrer" className="flex items-center px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-medium rounded-xl hover:from-yellow-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <Gem size={20} className="mr-3" />
                  Get This Template
                </a>
              ) : (
                <>
                  <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-medium rounded-xl hover:from-yellow-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <Gem size={20} className="mr-3" />
                    Get This Template
                    <ChevronDown size={20} className={`ml-2 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-10 overflow-hidden">
                      {purchaseOptions.map((option, index) => (
                        <a key={index} href={option.url} target="_blank" rel="noopener noreferrer" className="flex items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 border-b border-gray-100 dark:border-gray-600 last:border-b-0" onClick={() => setIsDropdownOpen(false)}>
                          <span className="text-2xl mr-3">{option.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white">{option.name}</div>
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
    </main>
  );
};

export default TemplateDetailClient;
