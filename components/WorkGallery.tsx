"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import { useCursor } from "./Cursor";

type Project = {
  name: string;
  category: string;
  year: string;
  from: string;
  to: string;
  blurb: string;
};

const PROJECTS: Project[] = [
  {
    name: "Halo",
    category: "Fintech rebrand",
    year: "2024",
    from: "#FF4D2E",
    to: "#1a0f0c",
    blurb:
      "A ground-up identity and motion system for a challenger bank — warm, confident, and unmistakably human.",
  },
  {
    name: "Drift",
    category: "Product launch film",
    year: "2024",
    from: "#D9FF3D",
    to: "#12140a",
    blurb:
      "A 90-second launch film blending 3D product renders with kinetic type to make a hardware debut feel inevitable.",
  },
  {
    name: "Nova",
    category: "Interactive campaign",
    year: "2023",
    from: "#6E9BFF",
    to: "#0b1020",
    blurb:
      "A WebGL-driven microsite where every scroll bent light around the product — the campaign people played with, not watched.",
  },
  {
    name: "Orbit",
    category: "Identity system",
    year: "2023",
    from: "#EDEAE3",
    to: "#151515",
    blurb:
      "A flexible identity system built to move — a mark that reconfigures itself across every surface and screen.",
  },
];

export default function WorkGallery() {
  const { setVariant, setLabel } = useCursor();
  const [hovered, setHovered] = useState<number | null>(null);
  const [open, setOpen] = useState<Project | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Cursor-following preview image.
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const pos = { x: -9999, y: -9999 };
    const cur = { x: -9999, y: -9999 };
    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove);
    let raf = 0;
    const loop = () => {
      cur.x += (pos.x - cur.x) * 0.12;
      cur.y += (pos.y - cur.y) * 0.12;
      if (previewRef.current)
        previewRef.current.style.transform = `translate3d(${cur.x}px,${cur.y}px,0) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const enter = (i: number) => {
    setHovered(i);
    setVariant("view");
    setLabel("Open");
  };
  const leave = () => {
    setHovered(null);
    setVariant("default");
    setLabel("");
  };
  const active = hovered !== null ? PROJECTS[hovered] : null;

  return (
    <section id="work" className="px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-8 flex items-end justify-between border-b border-border pb-6">
          <h2 className="font-display text-sm uppercase tracking-widest text-muted">
            Selected work
          </h2>
          <span className="font-display text-sm text-muted">
            {String(PROJECTS.length).padStart(2, "0")} — projects
          </span>
        </div>

        <ul>
          {PROJECTS.map((p, i) => {
            const dim = hovered !== null && hovered !== i;
            return (
              <li key={p.name}>
                <button
                  onMouseEnter={() => enter(i)}
                  onMouseLeave={leave}
                  onClick={() => {
                    leave();
                    setOpen(p);
                  }}
                  className="group flex w-full items-center justify-between gap-6 border-b border-border py-6 text-left transition-opacity duration-500 md:py-9"
                  style={{ opacity: dim ? 0.35 : 1 }}
                >
                  <div className="flex items-baseline gap-3 sm:gap-4 md:gap-8">
                    <span className="font-display text-xs text-muted sm:text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-4xl font-medium tracking-tight text-offwhite transition-transform duration-500 ease-out group-hover:translate-x-2 group-hover:text-accent sm:text-6xl md:text-8xl">
                      {p.name}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-5 md:gap-14">
                    <div className="hidden text-right md:block">
                      <p className="text-[11px] uppercase tracking-widest text-muted transition-colors duration-500 group-hover:text-offwhite">
                        {p.category}
                      </p>
                      <p className="mt-1 font-display text-sm tabular-nums text-muted">
                        {p.year}
                      </p>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-offwhite transition-all duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-bg md:h-12 md:w-12">
                      <ArrowUpRight className="h-4 w-4 -rotate-45 transition-transform duration-500 group-hover:rotate-0 md:h-5 md:w-5" />
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Cursor-following preview */}
      <div
        ref={previewRef}
        className="pointer-events-none fixed left-0 top-0 z-40 hidden aspect-[4/3] w-[26vw] max-w-[380px] overflow-hidden rounded-lg lg:block"
        style={{
          opacity: active ? 1 : 0,
          transition: "opacity 0.4s ease, scale 0.4s ease",
          scale: active ? "1" : "0.8",
        }}
      >
        {active && (
          <div
            className="flex h-full w-full items-end p-5"
            style={{
              background: `linear-gradient(140deg, ${active.from}, ${active.to})`,
            }}
          >
            <span
              className="font-display text-6xl font-semibold leading-none"
              style={{ color: active.to, mixBlendMode: "overlay" }}
            >
              {active.name}
            </span>
          </div>
        )}
      </div>

      {/* Expand overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[85] flex items-center justify-center bg-bg/80 p-6 backdrop-blur-md"
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative grid w-full max-w-4xl overflow-hidden rounded-xl border border-border bg-surface md:grid-cols-2"
            >
              <div
                className="flex min-h-[240px] items-end p-8"
                style={{
                  background: `linear-gradient(140deg, ${open.from}, ${open.to})`,
                }}
              >
                <span
                  className="font-display text-7xl font-semibold leading-none md:text-8xl"
                  style={{ color: open.to, mixBlendMode: "overlay" }}
                >
                  {open.name}
                </span>
              </div>
              <div className="flex flex-col justify-center p-8">
                <span className="text-xs uppercase tracking-widest text-accent">
                  {open.category} · {open.year}
                </span>
                <h3 className="mt-3 font-display text-4xl font-medium tracking-tight text-offwhite">
                  {open.name}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {open.blurb}
                </p>
                <span className="mt-6 text-xs uppercase tracking-widest text-muted">
                  Full case study — in progress
                </span>
              </div>
              <button
                onClick={() => setOpen(null)}
                onMouseEnter={() => setVariant("link")}
                onMouseLeave={() => setVariant("default")}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg/40 text-offwhite transition-colors hover:border-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
