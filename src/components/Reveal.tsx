"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Skip enter motion (e.g. hero already visible as the envelope expands) */
  immediate?: boolean;
  /**
   * When false, render static (used while a parent layout projection is active).
   * Flip to true after the envelope settles so whileInView can track scroll cleanly.
   */
  enabled?: boolean;
};

export function Reveal({
  children,
  className,
  delay = 0,
  immediate = false,
  enabled = true,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion || immediate) {
    return <div className={className}>{children}</div>;
  }

  // Avoid arming IntersectionObserver under a layout-projected parent
  if (!enabled) {
    return (
      <div className={className} style={{ opacity: 0 }}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 96 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 1.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
