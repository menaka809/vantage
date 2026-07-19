"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/** Pulls its child toward the cursor — the Cuberto-style magnetic effect. */
export default function Magnetic({
  children,
  strength = 0.4,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const cfg = { stiffness: 200, damping: 15, mass: 0.4 };
  const sx = useSpring(x, cfg);
  const sy = useSpring(y, cfg);

  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={move}
      onMouseLeave={reset}
      style={{ x: reduced ? 0 : sx, y: reduced ? 0 : sy }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
