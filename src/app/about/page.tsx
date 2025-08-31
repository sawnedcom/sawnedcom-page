// src/app/about/page.tsx
"use client";
import { Briefcase, Code, Wrench, Rocket, Cpu, Smartphone, Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/utils/motion";
import Image from "next/image";

export default function AboutPage() {
  const skills = [
    {
      icon: <Code className="text-blue-500" size={24} />,
      title: "Web Development",
      items: ["React.js, Next.js (App Router)", "HTML5, CSS3, JavaScript (ES6+)", "Tailwind CSS, Styled-components", "Responsive & SEO-Friendly Design"],
    },
    {
      icon: <Smartphone className="text-green-500" size={24} />,
      title: "Mobile Development",
      items: ["Flutter", "Cross-platform architecture", "Performance optimization for mobile"],
    },
    {
      icon: <Cpu className="text-orange-500" size={24} />,
      title: "Software Development",
      items: ["Rust (system-level & backend)", "Desktop tooling & automation", "Supabase (PostgreSQL), Firebase", "REST APIs & Authentication"],
    },
    {
      icon: <Gamepad2 className="text-pink-500" size={24} />,
      title: "Game Development",
      items: ["Unity (C# basics)", "Godot (exploring)", "2D game prototyping", "Game design principles"],
    },
  ];

  const experiences = [
    {
      title: "Freelance Full-Stack & App Developer",
      period: "2020 - Present",
      icon: <Rocket className="text-blue-500" size={20} />,
      items: ["Built and maintained websites, mobile apps, and desktop software", "Developed small-scale games for prototypes and learning", "Focused on scalability, UX, and cross-platform compatibility"],
    },
    {
      title: "Content Creator",
      period: "2025 - Present",
      icon: <Briefcase className="text-purple-500" size={20} />,
      items: ["Created tutorials and videos on web, mobile, and game dev", "Educated developers on modern stacks and creative coding"],
    },
  ];

  const tools = ["VS Code", "Unity", "Figma", "Android Studio"];

  return (
    <motion.main variants={staggerContainer(0.1, 0.2)} initial="hidden" animate="show" className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 py-16 md:py-20 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Hero Section */}
        <motion.section variants={fadeIn("up", "spring", 0.2, 1)} className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text mb-6">About Me</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Passionate developer crafting impactful digital products across <span className="font-semibold text-white">web, mobile, software, and games</span>. My mission is to merge technology and creativity into meaningful experiences.
          </p>
        </motion.section>

        {/* Profile Card */}
        <motion.section variants={fadeIn("up", "spring", 0.4, 1)} className="bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 mb-20 border border-gray-700/50 flex flex-col md:flex-row items-center gap-10 hover:shadow-blue-500/10 transition-all duration-500">
          <div className="relative group flex-shrink-0">
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-gradient-to-r from-blue-500 to-purple-500 shadow-2xl relative">
              <Image src="/images/logo.jpg" alt="Sawnedcom Profile" fill className="object-cover transition-transform duration-700 group-hover:scale-110" priority />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-500"></div>
            </div>
            <div className="absolute -inset-4 rounded-full border-2 border-blue-400/50 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none animate-pulse"></div>
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r text-[#f34e3f] bg-clip-text ">Sawnedcom</h2>
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 text-blue-300 rounded-full text-lg font-medium mb-6">Web, Mobile, Software & Game Developer</div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              I build high-quality digital products ranging from
              <span className="font-semibold"> websites</span> and
              <span className="font-semibold"> mobile apps</span> to
              <span className="font-semibold"> software tools</span> and
              <span className="font-semibold"> games</span>, combining performance, creativity, and outstanding user experience.
            </p>
          </div>
        </motion.section>

        {/* Skills Section */}
        <motion.section variants={fadeIn("up", "spring", 0.6, 1)} className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <Code className="text-blue-400" size={32} />
            <span className="bg-gradient-to-r bg-clip-text ">My Skills</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {skills.map((skill, index) => (
              <motion.div key={index} variants={fadeIn("up", "spring", index * 0.2 + 0.4, 1)} whileHover={{ y: -5 }} className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-700/50 hover:border-gray-600/50 hover:shadow-blue-500/10 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  {skill.icon}
                  <h3 className="text-2xl font-semibold text-white">{skill.title}</h3>
                </div>
                <ul className="space-y-3">
                  {skill.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <span className="text-blue-400 mt-1 text-lg">•</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Experience Section */}
        <motion.section variants={fadeIn("up", "spring", 0.8, 1)} className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <Briefcase className="text-blue-400" size={32} />
            <span className="bg-clip-text">Experience</span>
          </h2>
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <motion.div key={index} variants={fadeIn("up", "spring", index * 0.2 + 0.6, 1)} className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-700/50 hover:border-gray-600/50 hover:shadow-blue-500/10 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  {exp.icon}
                  <h3 className="text-2xl font-semibold text-white">{exp.title}</h3>
                </div>
                <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 text-blue-300 rounded-full text-sm font-medium mb-6">{exp.period}</div>
                <ul className="space-y-3">
                  {exp.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <span className="text-blue-400 mt-1 text-lg">•</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Tools Section */}
        <motion.section variants={fadeIn("up", "spring", 1, 1)}>
          <h2 className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <Wrench className="text-blue-400" size={32} />
            <span className="bg-clip-text">Favorite Tools</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {tools.map((tool, index) => (
              <motion.span key={index} variants={fadeIn("up", "spring", index * 0.1 + 0.8, 1)} whileHover={{ scale: 1.05 }} className="bg-gray-800/50 backdrop-blur-xl text-gray-200 px-6 py-3 rounded-2xl text-lg font-medium shadow-lg hover:shadow-blue-500/20 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                {tool}
              </motion.span>
            ))}
          </div>
        </motion.section>
      </div>
    </motion.main>
  );
}
