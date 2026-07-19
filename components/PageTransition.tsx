"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.76, 0, 0.24, 1] as const;

/**
 * Full-screen "wipe" on every route entry: two stacked panels roll up off the
 * screen (coral, then dark) revealing the freshly-mounted page, which fades in
 * as they clear. Keying on the pathname re-runs it on each navigation.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <motion.div
        key={`wipe-a-${pathname}`}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[97] bg-accent"
        style={{ transformOrigin: "top" }}
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.6, ease }}
      />
      <motion.div
        key={`wipe-b-${pathname}`}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[96] bg-bg"
        style={{ transformOrigin: "top" }}
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.6, ease, delay: 0.12 }}
      />
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.45, ease }}
      >
        {children}
      </motion.div>
    </>
  );
}
