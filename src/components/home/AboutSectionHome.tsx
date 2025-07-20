// src/components/home/AboutSectionHome.tsx
import React from "react";
import Link from "next/link";
import { User } from "lucide-react";

const AboutSectionHome: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Section Header */}
          <div className="mb-12">
            <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-4">About Me</span>
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-6 pb-2">Digital Professional</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto"></div>
          </div>

          {/* Content */}
          <div className="space-y-6 mb-12">
            <p className="text-lg md:text-xl leading-relaxed text-gray-700 dark:text-gray-300">
              As a <span className="font-semibold text-blue-600 dark:text-blue-400">Full-stack Developer</span> with over 5 years of experience, I specialize in building modern web/app/software applications that are <span className="font-semibold">responsive, high-performance</span>, and focused on user experience.
            </p>
          </div>

          {/* CTA Button */}
          <Link href="/about" className="inline-flex items-center px-4 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 group">
            <span>Learn More About Me</span>
            <User size={20} className="ml-3 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionHome;
