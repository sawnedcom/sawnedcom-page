// src/components/home/AboutSectionHome.tsx
// Premium about section dengan animasi + full responsive

"use client";

import React from "react";
import Link from "next/link";
import { Code, Smartphone, GamepadIcon, Puzzle, Award } from "lucide-react";
import { motion } from "framer-motion";

const AboutSectionHome: React.FC = () => {
  const skills = [
    { icon: <Code size={22} />, label: "Web Development", color: "bg-slate-600 text-slate-100" },
    { icon: <Smartphone size={22} />, label: "Mobile Apps", color: "bg-slate-600 text-slate-100" },
    { icon: <GamepadIcon size={22} />, label: "Game Development", color: "bg-slate-600 text-slate-100" },
    { icon: <Puzzle size={22} />, label: "Software Development", color: "bg-slate-600 text-slate-100" },
  ];

  return (
    <section className="relative py-16 sm:py-20 md:py-28 bg-slate-800 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-40 sm:w-56 md:w-72 h-40 sm:h-56 md:h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-56 sm:w-72 md:w-96 h-56 sm:h-72 md:h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }} // posisi awal
        whileInView={{ opacity: 1, y: 0 }} // animasi pas element masuk layar
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }} // sekali saja, aktif kalau 30% sudah kelihatan
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3  text-[#67C090] text-sm font-medium rounded-full mb-4 ">
              <span>About Me</span>
              <div className="w-2 h-2 bg-[#67C090] rounded-full animate-pulse"></div>
            </div>
            <h2 className="text-2xl sm:text-5xl md:text-6xl font-semibold text-[#67C090] mb-4 sm:mb-6 leading-tight">
              Digital <span className="text-white"> Professional</span>
            </h2>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-14 md:gap-16 items-center mb-16 sm:mb-20">
            {/* Left */}
            <div className="space-y-6 sm:space-y-8">
              <p className="text-justify text-base sm:text-lg md:text-xl leading-relaxed text-gray-300">
                As a <span className="font-semibold text-[#67C090]">Full-Stack Developer</span> with over 5 years of experience, I specialize in creating modern applications that push the boundaries of what’s possible.
              </p>
              <p className="text-justify text-base sm:text-lg leading-relaxed text-gray-300">
                I craft <span className="font-semibold text-[#67C090]">web, mobile, software, and game applications</span> that are not just functional, but extraordinary. Every project is built with <span className="font-semibold text-[#67C090]">responsive design, high performance</span> and an obsessive focus on user experience.
              </p>

              {/* Skills */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {skills.map((skill, i) => (
                  <div key={i} className="group p-3 sm:p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20">
                    <div className={`inline-flex p-2 sm:p-3 rounded-lg bg-gradient-to-r ${skill.color} mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300`}>{skill.icon}</div>
                    <h3 className="font-semibold text-white text-xs sm:text-sm">{skill.label}</h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="space-y-6 sm:space-y-8">
              <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 backdrop-blur-sm">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 rounded-full bg-slate-600">
                    <Award size={20} className="sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">Premium Quality</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">Guaranteed Excellence</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">Every project is delivered with meticulous attention to detail, cutting-edge technology, and a commitment to exceeding expectations.</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="inline-flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex items-center justify-center">
                <Link href="/portfolio" className="relative group overflow-hidden px-6 sm:px-8 py-3 sm:py-4 border-2 border-[#67C090] text-[#67C090] hover:text-white text-base sm:text-lg font-semibold rounded-lg transition-all duration-300 hover:border-[#67C090] hover:scale-105">
                  {/* Background animasi */}
                  <span className="absolute inset-0 bg-[#67C090] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out"></span>

                  {/* Konten button */}
                  <div className="relative flex items-center justify-center">
                    <span>More Journey</span>
                  </div>
                </Link>
              </div>

              <Link href="/portfolio" className="relative group overflow-hidden px-6 sm:px-8 py-3 sm:py-4 border-2 border-[#67C090] text-[#67C090] text-base sm:text-lg font-semibold rounded-lg transition-all duration-300 hover:border-[#67C090] hover:scale-105">
                <div className="flex items-center justify-center">
                  <span>View Portfolio</span>
                  <div className="ml-2 sm:ml-3 w-4 sm:w-5 h-4 sm:h-5 rounded-full border-2 border-current group-hover:rotate-180 transition-transform duration-500"></div>
                </div>
              </Link>
            </div>

            {/* Trust */}
            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 opacity-60 text-xs sm:text-sm">
              <div className="hidden sm:block w-px h-4 bg-gray-600"></div>
              <div className="text-gray-400">5+ years of excellence</div>
              <div className="hidden sm:block w-px h-4 bg-gray-600"></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
    </section>
  );
};

export default AboutSectionHome;
