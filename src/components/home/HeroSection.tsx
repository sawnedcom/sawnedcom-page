// src/components/home/HeroSection.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Briefcase } from "lucide-react";

const HeroSection: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative w-full py-24 md:py-36 lg:py-44 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white overflow-hidden shadow-2xl">
      {/* Fancy Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Dynamic radial gradient following mouse */}
        <div
          className="absolute inset-0 opacity-30 transition-all duration-1000"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59,130,246,0.15) 0%, transparent 50%)`,
          }}></div>

        {/* Animated blobs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-[32rem] h-[32rem] bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-blob animation-delay-8000"></div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400/60 rounded-full animate-ping"></div>
          <div className="absolute top-40 right-32 w-3 h-3 bg-purple-400/60 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 left-40 w-1 h-1 bg-cyan-400/60 rounded-full animate-ping"></div>
          <div className="absolute bottom-20 right-20 w-2 h-2 bg-pink-400/60 rounded-full animate-pulse"></div>
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}></div>
      </div>

      {/* HERO CONTENT (TIDAK DIUBAH) */}
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
            <span className="bg-clip-text bg-gradient-to-r text-[#f34e3f]">Sawnedcom</span> <br />
            Digital Solutions
          </h1>

          <p className="text-xl md:text-xl opacity-90 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">Crafting innovative and high performance software, web, mobile and game experiences using cutting edge technologies with a focus on user centered design</p>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <Link href="/portfolio" className="group inline-flex items-center justify-center px-8 py-4 bg-white text-blue-700 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-50">
              <span>more information</span>
              <ArrowRight className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative flex-shrink-0 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r animate-spin-slow opacity-20 z-0"></div>
          <div className="relative rounded-4xl shadow-2xl overflow-hidden z-10">
            <Image src="/images/logo-3d.png" alt="Hero Image" width={384} height={384} className="rounded-full object-cover" priority />
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
            transform: translate(10%, -15%) scale(1.1);
          }
          50% {
            transform: translate(-5%, 5%) scale(0.9);
          }
          75% {
            transform: translate(-10%, 10%) scale(1.05);
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
          animation: blob 18s ease-in-out infinite;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-8000 {
          animation-delay: 8s;
        }
        .animate-spin-slow {
          animation: spin-slow 25s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
