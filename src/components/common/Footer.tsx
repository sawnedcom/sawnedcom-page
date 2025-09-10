// src/components/common/Footer.tsx
// Premium footer dengan animasi canggih dan efek visual yang menawan

"use client";

import React from "react";
import Link from "next/link";
import { Link2, ArrowUp } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-gray-300 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Static Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-ping" style={{ left: "20%", top: "10%" }}></div>
        <div className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-ping" style={{ left: "80%", top: "20%", animationDelay: "1s" }}></div>
        <div className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-ping" style={{ left: "60%", top: "80%", animationDelay: "2s" }}></div>
        <div className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-ping" style={{ left: "30%", top: "60%", animationDelay: "0.5s" }}></div>
        <div className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-ping" style={{ left: "90%", top: "70%", animationDelay: "1.5s" }}></div>
        <div className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-ping" style={{ left: "10%", top: "90%", animationDelay: "2.5s" }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <Link
              href="/"
              className="inline-block font-bold text-[#f34e3f] bg-clip-text hover:scale-105 transition-transform duration-300 text-3xl sm:text-4xl md:text-5xl break-words"
              style={{
                textShadow: `
                  0 0 4px #f34e3f,
                  0 0 8px rgba(243, 78, 63, 0.6)
                `,
              }}>
              sawnedcom
            </Link>

            <p className="text-gray-400 text-lg leading-relaxed max-w-md">Crafting digital experiences that inspire and innovate, transforming ideas into stunning realities through premium development and design</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-white relative">Quick Links</h3>
            <nav className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/portfolio", label: "Portfolio" },
                { href: "/templates", label: "Templates" },
                { href: "/tutorials", label: "Tutorials" },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="block text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 group">
                  <span className="relative">
                    {item.label}
                    <span className="absolute left-0 bottom-0 w-0 h-px bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-white relative">Services</h3>
            <div className="space-y-3 cursor-text">
              {["Mobile Apps", "UI/UX Design", "Web Development", "Software Development", "Game Development"].map((service) => (
                <div key={service} className="text-gray-400 hover:text-white transition-colors">
                  {service}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-gradient-to-r from-slate-950 via-gray-900 to-slate-950 px-4">
              <div className="w-16 h-px bg-gradient-to-r from-blue-400 to-purple-500"></div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          {/* Social Media */}
          <div className="flex items-center gap-6">
            <span className="text-gray-500 text-sm font-medium">Follow me:</span>
            <div className="flex gap-4">
              {[
                {
                  icon: <Link2 size={24} />,
                  href: "/socials",
                  color: "hover:shadow-gray-800",
                },
              ].map((social, index) => (
                <Link key={index} href={social.href} className={`group relative p-3 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600 text-gray-400 hover:text-white transition-all duration-500 hover:scale-110 hover:shadow-xl ${social.color}`}>
                  <div className="relative z-10">{social.icon}</div>
                  <div className="absolute inset-0 rounded-xl transition-all duration-500"></div>
                </Link>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-6">
            <p className="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-300">
              &copy; {currentYear} <span className="font-semibold text-white">Sawnedcom</span>. All rights reserved.
            </p>

            {/* Back to Top Button */}
            <button onClick={scrollToTop} className="group cursor-pointer p-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 hover:border-blue-400 text-gray-400 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-110" aria-label="Back to top">
              <ArrowUp size={18} className="group-hover:-translate-y-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Premium Badge */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-xs text-gray-400 font-medium">Crafted with La Passion</span>
          </div>
        </div>
      </div>

      {/* Bottom Glow Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
    </footer>
  );
};

export default Footer;
