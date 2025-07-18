// src/components/common/Footer.tsx
// Komponen footer premium dengan animasi dan layout responsif

import React from "react";
import Link from "next/link";
import { Github, Youtube, Instagram } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="flex flex-col items-center">
          {/* Animated Logo */}
          <Link href="/" className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-300 hover:to-purple-400 transition-all duration-500 mb-8">
            Sawnedcom
          </Link>

          {/* Navigation Links with Hover Effects */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8">
            {[
              { href: "/about", label: "About" },
              { href: "/portfolio", label: "Portfolio" },
              { href: "/templates", label: "Templates" },
              { href: "/tutorials", label: "Tutorials" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="relative text-lg font-medium text-gray-400 hover:text-white transition-colors duration-300 group">
                {item.label}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Social Icons with Glow Effect */}
          <div className="flex justify-center space-x-8 mb-10">
            {[
              { icon: <Github size={28} />, href: "https://github.com/sawnedcom" },
              { icon: <Instagram size={28} />, href: "https://instagram.com/sawnedcom.off" },
              { icon: <Youtube size={28} />, href: "https://www.youtube.com/@sawnedcom.official" },
            ].map((social, index) => (
              <a key={index} href={social.href} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                {social.icon}
              </a>
            ))}
          </div>

          {/* Copyright with subtle animation */}
          <p className="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-300">&copy; {currentYear} Sawnedcom. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
