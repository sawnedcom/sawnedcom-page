// src/utils/motion.ts
// Animation variants for Framer Motion with proper TypeScript types

import { Variants } from "framer-motion";

type Direction = "up" | "down" | "left" | "right";
type TransitionType = "tween" | "spring" | "keyframes" | "inertia";

export const staggerContainer = (staggerChildren?: number, delayChildren?: number): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: staggerChildren || 0.1,
      delayChildren: delayChildren || 0.1,
    },
  },
});

export const fadeIn = (direction: Direction, type: TransitionType, delay: number, duration: number): Variants => ({
  hidden: {
    x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
    y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
    opacity: 0,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type: type,
      delay: delay,
      duration: duration,
      ease: "easeOut",
    },
  },
});
