/**
 * Animation Utilities
 * Framer Motion animation variants and helpers
 */

import { Variants } from 'framer-motion';

/**
 * Fade in animation
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * Slide in from left
 */
export const slideInLeft: Variants = {
  hidden: { x: -100, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0 },
};

/**
 * Slide in from right
 */
export const slideInRight: Variants = {
  hidden: { x: 100, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: 100, opacity: 0 },
};

/**
 * Scale in animation
 */
export const scaleIn: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  exit: { scale: 0, opacity: 0 },
};

/**
 * Attack animation (shake)
 */
export const attackShake: Variants = {
  initial: { x: 0 },
  shake: {
    x: [-5, 5, -5, 5, 0],
    transition: { duration: 0.5 },
  },
};

/**
 * Hit effect (scale pulse)
 */
export const hitPulse: Variants = {
  initial: { scale: 1 },
  hit: {
    scale: [1, 1.1, 1],
    transition: { duration: 0.3 },
  },
};

/**
 * Victory animation
 */
export const victory: Variants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
};

/**
 * Stagger children animation
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * Spring transition
 */
export const springTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

/**
 * Smooth transition
 */
export const smoothTransition = {
  duration: 0.3,
  ease: 'easeInOut',
};
