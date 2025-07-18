// src/app/about/page.tsx
"use client";
import { Briefcase, Code, Wrench, Rocket, Palette, Cpu, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/utils/motion";
import Image from "next/image";

export default function AboutPage() {
  const skills = [
    {
      icon: <Code className="text-blue-500" size={24} />,
      title: "Frontend Development",
      items: ["React.js, Next.js (App Router)", "HTML5, CSS3, JavaScript (ES6+)", "Tailwind CSS, Styled-components", "Responsive Design, Mobile-First"],
    },
    {
      icon: <Cpu className="text-purple-500" size={24} />,
      title: "Backend & Databases",
      items: ["Node.js, Express.js", "Supabase (PostgreSQL), Firebase", "RESTful APIs, Authentication", "Serverless Functions"],
    },
    {
      icon: <Smartphone className="text-green-500" size={24} />,
      title: "Mobile & Software",
      items: ["React Native (basic)", "Flutter (exploring)", "Cross-platform app logic", "Modern software tooling"],
    },
    {
      icon: <Palette className="text-amber-500" size={24} />,
      title: "Others",
      items: ["Git & GitHub", "UI/UX Principles", "SEO Best Practices", "Performance Optimization"],
    },
  ];

  const experiences = [
    {
      title: "Freelance Full-Stack Developer",
      period: "2022 - Present",
      icon: <Rocket className="text-blue-500" size={20} />,
      items: ["Built and maintained websites, mobile apps, and internal software tools", "Focused on scalability, user experience, and cross-platform compatibility", "Collaborated with startups and creators to launch digital products"],
    },
    {
      title: "Content Creator",
      period: "2023 - Present",
      icon: <Briefcase className="text-purple-500" size={20} />,
      items: ["Created tutorials and videos on web and app development", "Educated developers on modern stacks like Next.js, Tailwind CSS"],
    },
  ];

  const tools = ["VS Code", "Figma", "Git & GitHub", "Postman", "Vercel", "Netlify"];

  return (
    <motion.main variants={staggerContainer(0.1, 0.2)} initial="hidden" animate="show" className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Hero Section */}
        <motion.section variants={fadeIn("up", "spring", 0.2, 1)} className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6">About Me</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Passionate digital builder crafting elegant and impactful solutions across the web, mobile, and software platforms.</p>
        </motion.section>

        {/* Profile Card */}
        <motion.section variants={fadeIn("up", "spring", 0.4, 1)} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10 mb-20 border border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-opacity-80 flex flex-col md:flex-row items-center gap-10 hover:shadow-2xl transition-shadow duration-500">
          <div className="relative group flex-shrink-0">
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-blue-500 shadow-2xl relative">
              <Image
                src="/images/logo.jpg" 
                alt="Sawnedcom Profile"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
            </div>
            <div className="absolute -inset-4 rounded-full border-2 border-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Sawnedcom</h2>
            <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-lg font-medium mb-6">Web, Mobile & Software Developer</div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">I specialize in creating high-quality digital products—websites, mobile applications, and software tools—that combine performance, accessibility, and outstanding user experience.</p>
          </div>
        </motion.section>

        {/* Skills Section */}
        <motion.section variants={fadeIn("up", "spring", 0.6, 1)} className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
            <Code className="text-blue-500" size={32} />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">My Skills</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <motion.div key={index} variants={fadeIn("up", "spring", index * 0.2 + 0.4, 1)} whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  {skill.icon}
                  <h3 className="text-2xl font-semibold">{skill.title}</h3>
                </div>
                <ul className="space-y-3">
                  {skill.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                      <span className="text-blue-500 dark:text-blue-400 mt-1">•</span>
                      {item}
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
            <Briefcase className="text-blue-500" size={32} />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Experience</span>
          </h2>
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <motion.div key={index} variants={fadeIn("up", "spring", index * 0.2 + 0.6, 1)} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  {exp.icon}
                  <h3 className="text-2xl font-semibold">{exp.title}</h3>
                </div>
                <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-4">{exp.period}</div>
                <ul className="space-y-2">
                  {exp.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                      <span className="text-blue-500 dark:text-blue-400 mt-1">•</span>
                      {item}
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
            <Wrench className="text-blue-500" size={32} />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Favorite Tools</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {tools.map((tool, index) => (
              <motion.span key={index} variants={fadeIn("up", "spring", index * 0.1 + 0.8, 1)} whileHover={{ scale: 1.05 }} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-5 py-2.5 rounded-full text-lg font-medium shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300">
                {tool}
              </motion.span>
            ))}
          </div>
        </motion.section>
      </div>
    </motion.main>
  );
}
