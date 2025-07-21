// src/components/home/HeroSection.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Briefcase } from "lucide-react";

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full py-24 md:py-36 lg:py-44 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 text-white overflow-hidden rounded-b-[3rem] shadow-2xl">
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent"></div>
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-400/10 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-400/10 rounded-full filter blur-3xl animate-blob animation-delay-3000"></div>
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-indigo-400/10 rounded-full filter blur-3xl animate-blob animation-delay-6000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
        {/* Hero Content */}
        <div className="flex-1 max-w-2xl text-center lg:text-left">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm text-white/80 text-sm font-medium rounded-full border border-white/10">
              <Briefcase className="w-4 h-4 mr-2" />
              Full-stack Developer
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-400">Sawnedcom</span> <br />
            Digital Solutions
          </h1>

          <p className="text-xl md:text-xl opacity-90 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">Creating innovative, high-performance web/app/software experiences with cutting-edge technologies and user-centric design.</p>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <Link href="/portfolio" className="group inline-flex items-center justify-center px-8 py-4 bg-white text-blue-700 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-50">
              <span>View Portfolio</span>
              <ArrowRight className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Hero Image from public folder */}
        <div className="relative flex-shrink-0 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-spin-slow opacity-20 z-0"></div>
          <div className="relative rounded-full border-4 border-white/30 shadow-2xl overflow-hidden z-10">
            <Image
              src="/images/logo.jpg"
              alt="Hero Image"
              width={384} // ukuran sama dengan lg:w-96
              height={384}
              className="rounded-full object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(10%, -15%) scale(1.05);
          }
          50% {
            transform: translate(-5%, 5%) scale(0.95);
          }
          75% {
            transform: translate(-10%, 10%) scale(1.03);
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-blob {
          animation: blob 12s ease-in-out infinite;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-6000 {
          animation-delay: 6s;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
