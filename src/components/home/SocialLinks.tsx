// src/components/home/NavigationButtons.tsx
"use client";

import { motion, Variants } from "framer-motion";
import { User, Briefcase, LayoutTemplate, BookOpen } from "lucide-react";
import Link from "next/link";

interface NavItem {
  name: string;
  icon: React.ReactNode;
  url: string;
  color: string;
  bgColor: string;
}

const NavigationItems: NavItem[] = [
  {
    name: "About",
    icon: <User className="text-white" size={20} />,
    url: "/about",
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/20",
  },
  {
    name: "Portfolio",
    icon: <Briefcase className="text-white" size={20} />,
    url: "/portfolio",
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
  },
  {
    name: "Templates",
    icon: <LayoutTemplate className="text-white" size={20} />,
    url: "/templates",
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-900/20",
  },
  {
    name: "Tutorials",
    icon: <BookOpen className="text-white" size={20} />,
    url: "/tutorials",
    color: "from-rose-500 to-rose-600",
    bgColor: "bg-rose-100 dark:bg-rose-900/20",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
  hover: {
    y: -5,
    scale: 1.03,
    transition: {
      type: "spring",
      stiffness: 300,
    },
  },
};

export function NavigationButtons() {
  return (
    <div className="max-w-md mx-auto p-6">
      <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        EXPLORE MY WORK
      </motion.h2>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-4">
        {NavigationItems.map((item, index) => (
          <motion.div key={index} variants={itemVariants} whileHover="hover">
            <Link
              href={item.url}
              className={`
                flex items-center justify-between p-5 rounded-xl 
                ${item.bgColor} backdrop-blur-sm 
                border border-gray-200 dark:border-gray-700 
                shadow-sm hover:shadow-md transition-all duration-300
                group
              `}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${item.color} shadow-md group-hover:shadow-lg transition-shadow`}>{item.icon}</div>
                <div>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 block">{item.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">View my {item.name.toLowerCase()}</span>
                </div>
              </div>
              <motion.div initial={{ x: 0 }} whileHover={{ x: 5 }} className="text-gray-400 dark:text-gray-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default NavigationButtons;
