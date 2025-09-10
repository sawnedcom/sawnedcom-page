"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import { Instagram, X, Youtube, Github, Dribbble, Linkedin, Music, ArrowUpRight } from "lucide-react";

// Subtle floating background elements
const FloatingElements = () => {
  const elements = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 15 + 20,
    delay: Math.random() * 10,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute rounded-full bg-white/5 blur-sm"
          style={{
            width: el.size,
            height: el.size,
            left: `${el.x}%`,
            top: `${el.y}%`,
          }}
          animate={{
            x: [0, 20, -20, 0],
            y: [0, -20, 20, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            delay: el.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Refined Social Link Component
interface SocialLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  delay?: number;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, label, icon, description, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 100);
    return () => clearTimeout(timer);
  }, [delay]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        ease: [0.21, 0.47, 0.32, 0.98],
        delay: delay * 0.1,
      }}
      style={{ transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}>
      {/* Main card */}
      <motion.a href={href} target="_blank" rel="noopener noreferrer" className="relative block" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
        <div className="relative p-6 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300 overflow-hidden">
          {/* Content */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className="p-2.5 rounded-lg bg-white/10 border border-white/10 text-white/80 group-hover:text-white group-hover:bg-white/15"
                animate={{
                  scale: isHovered ? 1.05 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                }}>
                {icon}
              </motion.div>

              <div>
                <h3 className="font-semibold text-white text-lg leading-tight">{label}</h3>
                <p className="text-white/60 text-sm mt-1 group-hover:text-white/80 transition-colors duration-300">{description}</p>
              </div>
            </div>

            <motion.div
              className="flex items-center gap-1 opacity-40 group-hover:opacity-100"
              initial={{ x: 10, opacity: 0 }}
              animate={{
                x: isHovered ? 0 : 10,
                opacity: isHovered ? 1 : 0.4,
              }}
              transition={{ duration: 0.3 }}>
              <ArrowUpRight size={18} className="text-white/60" />
            </motion.div>
          </div>
        </div>
      </motion.a>
    </motion.div>
  );
};

// Main Refined Component
const RefinedPremiumSocialShowcase = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const socialLinks = [
    {
      href: "https://instagram.com/sawnedcom.dev",
      label: "Instagram",
      icon: <Instagram className="w-5 h-5" />,
      description: "@sawnedcom.dev",
      delay: 1,
    },
    {
      href: "https://instagram.com/sawnedcom.dev.id",
      label: "Instagram 2",
      icon: <Instagram className="w-5 h-5" />,
      description: "@sawnedcom.dev.id",
      delay: 1,
    },
    {
      href: "https://youtube.com/@sawnedcom.official",
      label: "YouTube",
      icon: <Youtube className="w-5 h-5" />,
      description: "Video content & tutorials",
      delay: 2,
    },
    {
      href: "https://x.com/sawnedcom",
      label: "X",
      icon: <X className="w-5 h-5" />,
      description: "Thoughts & quick updates",
      delay: 3,
    },
    {
      href: "https://tiktok.com/@sawnedcom",
      label: "TikTok",
      icon: <Music className="w-5 h-5" />, // pakai Music untuk placeholder TikTok
      description: "Creative short videos",
      delay: 4,
    },
    {
      href: "https://github.com/sawnedcom",
      label: "GitHub",
      icon: <Github className="w-5 h-5" />,
      description: "Open source projects",
      delay: 5,
    },
    {
      href: "https://linkedin.com/in/sawnedcom",
      label: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      description: "Professional network",
      delay: 6,
    },
    {
      href: "https://dribbble.com/sawnedcom",
      label: "Dribbble",
      icon: <Dribbble className="w-5 h-5" />,
      description: "Design portfolio",
      delay: 7,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center pt-48 pb-36 p-4 relative overflow-hidden">
      {/* Subtle background effects */}
      <FloatingElements />

      {/* Main Content Container */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
          <h1 className="text-4xl md:text-6xl font-semibold text-white mb-6 tracking-tight">Connect & Collaborate</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed font-light">Discover my work across different platforms and let&apos;s build something remarkable together.</p>
        </motion.div>

        {/* Social Links Container */}
        <motion.div className="relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }}>
          {/* Glass Container */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
            {/* Social Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
              {socialLinks.map((link) => (
                <SocialLink key={link.label} {...link} />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RefinedPremiumSocialShowcase;
