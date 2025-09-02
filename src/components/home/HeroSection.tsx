// src/components/home/HeroSection.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full py-24 md:py-36 lg:py-44 bg-slate-900 text-white overflow-hidden shadow-2xl">
      {/* Fancy Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Dynamic radial gradient following mouse */}

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400/60 rounded-full animate-ping"></div>
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
      <div className="container pt-20 mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
        {/* Hero Content */}
        <div className="flex-1 max-w-2xl text-center lg:text-left">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white/80 text-sm font-medium rounded-full border border-white/10">
              Full-stack Developer
              <div className="w-2 h-2 bg-[#f34e3f] rounded-full animate-pulse"></div>
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl sm:text-4xl lg:text-6xl font-semibold leading-tight mb-6">
            <span className="bg-clip-text text-[#f34e3f]">Sawnedcom</span> <br />
            <span className="text-3xl md:text-6xl lg:text-6xl sm:text-4xl font-semibold">Digital Solutions</span>
          </h1>

          <p className="text-base md:text-xl opacity-90 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">Crafting innovative and high performance software, web, mobile and game experiences using cutting edge technologies with a focus on user centered design</p>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4">
            <Link href="/portfolio" className="relative group inline-flex items-center justify-center px-6 py-3 border-2 text-white text-lg font-normal rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
              {/* Gradient animasi */}
              <div className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>

              {/* Teks & icon */}
              <span className="relative z-10 flex items-center transition-colors duration-300 group-hover:text-black">
                More Info
                <ArrowRight className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative flex-shrink-0 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r animate-spin-slow opacity-20 z-0"></div>
          <div className="relative bg-slate-700/10 rounded-4xl shadow-2xl overflow-hidden z-10">
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
