"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLenis } from "./SmoothScroll";
import { useCursorHover } from "./Cursor";

const WORD = "VANTAGE";

// Deterministic pseudo-random (stable across SSR/client → no hydration drift).
const rand = (n: number) => {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
};

export default function KineticHero() {
  const reduced = useReducedMotion();
  const { scrollTo } = useLenis();
  const cta = useCursorHover("link");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);

  // Cursor-reactive distortion: letters near the pointer push away + scale up.
  useEffect(() => {
    if (
      reduced ||
      window.matchMedia("(pointer: coarse)").matches
    )
      return;

    const bases: { x: number; y: number }[] = [];
    const cur = lettersRef.current.map(() => ({ x: 0, y: 0, s: 1 }));

    const measure = () => {
      lettersRef.current.forEach((el, i) => {
        if (!el) return;
        bases[i] = {
          x: el.offsetLeft + el.offsetWidth / 2,
          y: el.offsetTop + el.offsetHeight / 2,
        };
      });
    };
    measure();
    const settle = window.setTimeout(measure, 600); // after font swap
    window.addEventListener("resize", measure);

    let mx = -9999;
    let my = -9999;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    const R = 220;
    const loop = () => {
      const h = headingRef.current;
      if (h) {
        const rect = h.getBoundingClientRect();
        lettersRef.current.forEach((el, i) => {
          const base = bases[i];
          if (!el || !base) return;
          const cx = rect.left + base.x;
          const cy = rect.top + base.y;
          const dx = mx - cx;
          const dy = my - cy;
          const f = Math.max(0, 1 - Math.hypot(dx, dy) / R);
          const tx = -dx * f * 0.35;
          const ty = -dy * f * 0.35;
          const ts = 1 + f * 0.42;
          const c = cur[i];
          c.x += (tx - c.x) * 0.18;
          c.y += (ty - c.y) * 0.18;
          c.s += (ts - c.s) * 0.18;
          el.style.transform = `translate(${c.x.toFixed(2)}px,${c.y.toFixed(
            2
          )}px) scale(${c.s.toFixed(3)})`;
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("resize", measure);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 md:px-10"
    >
      {/* Corner labels */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="pointer-events-none absolute inset-x-6 top-28 flex justify-between text-xs uppercase tracking-widest text-muted md:inset-x-10"
      >
        <span>Motion &amp; interactive studio</span>
        <span className="hidden text-right sm:block">Est. 2019 — Worldwide</span>
      </motion.div>

      <h1
        ref={headingRef}
        className="relative left-1/2 w-screen -translate-x-1/2 font-display font-semibold leading-[0.78] tracking-tight text-offwhite"
      >
        <span className="flex justify-center text-[17vw]">
          {WORD.split("").map((ch, i) => (
            <span key={i} className="inline-block">
              <motion.span
                className="inline-block"
                initial={{
                  x: (rand(i + 1) - 0.5) * 620,
                  y: (rand(i + 9) - 0.5) * 420,
                  rotate: (rand(i + 4) - 0.5) * 85,
                  opacity: 0,
                }}
                animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 58,
                  damping: 12,
                  delay: 0.4 + i * 0.05,
                }}
              >
                <span
                  ref={(el) => {
                    lettersRef.current[i] = el;
                  }}
                  className="kinetic-letter inline-block"
                >
                  {ch}
                </span>
              </motion.span>
            </span>
          ))}
        </span>
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="mt-10 flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end"
      >
        <p className="max-w-md font-display text-xl font-medium leading-[1.2] tracking-tight text-offwhite md:text-2xl">
          We make brands move.
          <span className="mt-1 block text-muted">
            Motion, interactive, and identity for the ambitious.
          </span>
        </p>
        <a
          href="#work"
          {...cta}
          onClick={(e) => {
            e.preventDefault();
            scrollTo("#work", { offset: 0 });
          }}
          className="group flex items-center gap-4"
        >
          <span className="text-xs uppercase tracking-widest text-muted transition-colors group-hover:text-offwhite">
            See the work
          </span>
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-offwhite transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-bg">
            <span className="transition-transform duration-300 group-hover:translate-y-0.5">
              ↓
            </span>
          </span>
        </a>
      </motion.div>
    </section>
  );
}
