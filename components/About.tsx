"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import { useCursor } from "./Cursor";

type Member = {
  name: string;
  role: string;
  location: string;
  img: string;
  bio: string;
  specialties: string[];
  projects: string[];
};

const TEAM: Member[] = [
  {
    name: "Mara Voss",
    role: "Creative Director",
    location: "London",
    img: "https://i.pravatar.cc/720?img=47",
    bio: "Fifteen years directing brand and film work for names you already know. Mara sets the creative bar for every project — and refuses to lower it.",
    specialties: ["Art Direction", "Brand Strategy", "Film"],
    projects: ["Halo", "Orbit"],
  },
  {
    name: "Kofi Mensah",
    role: "Motion Lead",
    location: "Berlin",
    img: "https://i.pravatar.cc/720?img=12",
    bio: "Animator turned director. Kofi builds the systems that make our motion feel weighted, physical, and impossible to look away from.",
    specialties: ["3D & Motion", "Sound Design", "Direction"],
    projects: ["Drift", "Nova"],
  },
  {
    name: "Lena Ortiz",
    role: "Interactive Director",
    location: "London",
    img: "https://i.pravatar.cc/720?img=45",
    bio: "Lena bridges design and engineering, prototyping the reactive, physical interfaces the studio has become known for.",
    specialties: ["WebGL", "Interaction", "Prototyping"],
    projects: ["Nova", "Halo"],
  },
  {
    name: "Ivo Novak",
    role: "Design Technologist",
    location: "Berlin",
    img: "https://i.pravatar.cc/720?img=33",
    bio: "The one who ships. Ivo turns wild creative directions into performant, production-grade builds without dropping a frame.",
    specialties: ["Front-end", "Performance", "Shaders"],
    projects: ["Drift", "Orbit"],
  },
];

export default function About() {
  const { setVariant, setLabel } = useCursor();
  const [open, setOpen] = useState<Member | null>(null);

  const enter = () => {
    setVariant("view");
    setLabel("Profile");
  };
  const leave = () => {
    setVariant("default");
    setLabel("");
  };

  return (
    <section className="px-6 py-20 sm:py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-10 flex flex-col gap-4 border-b border-border pb-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-sm uppercase tracking-widest text-muted">
            The people
          </h2>
          <p className="max-w-xs text-sm text-muted sm:text-right">
            A small, senior team of directors, animators, and engineers.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-6">
          {TEAM.map((m) => (
            <button
              key={m.name}
              onMouseEnter={enter}
              onMouseLeave={leave}
              onClick={() => {
                leave();
                setOpen(m);
              }}
              className="group text-left"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.img}
                  alt={m.name}
                  loading="lazy"
                  className="h-full w-full object-cover grayscale transition-all duration-700 ease-out will-change-transform group-hover:grayscale-0 group-hover:[transform:scale(1.08)_skewY(-1.2deg)]"
                />
                <div className="pointer-events-none absolute inset-0 bg-accent opacity-0 mix-blend-color transition-opacity duration-500 group-hover:opacity-25" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent" />
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
                  <span className="font-display text-2xl font-semibold leading-none text-offwhite md:text-3xl">
                    {m.name.split(" ")[0]}
                  </span>
                  <ArrowUpRight className="h-5 w-5 -translate-x-1 translate-y-1 text-accent opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <p className="text-sm text-offwhite">{m.name}</p>
                <p className="hidden text-xs text-muted sm:block">{m.role}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Profile showcase */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[85] flex items-center justify-center bg-bg/85 p-4 backdrop-blur-md sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 24 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative grid max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl border border-border bg-surface md:grid-cols-[0.9fr_1.1fr]"
            >
              <div className="relative min-h-[220px] overflow-hidden md:min-h-[420px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={open.img}
                  alt={open.name}
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface/60 to-transparent" />
              </div>

              <div className="flex flex-col justify-center overflow-y-auto p-8 md:p-10">
                <span className="text-xs uppercase tracking-widest text-accent">
                  {open.role} · {open.location}
                </span>
                <h3 className="mt-3 font-display text-4xl font-semibold tracking-tight text-offwhite md:text-5xl">
                  {open.name}
                </h3>
                <p className="mt-5 text-sm leading-relaxed text-muted">
                  {open.bio}
                </p>

                <div className="mt-7">
                  <p className="mb-3 text-xs uppercase tracking-widest text-muted">
                    Specialties
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {open.specialties.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-border px-3 py-1.5 text-xs text-offwhite"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-7">
                  <p className="mb-3 text-xs uppercase tracking-widest text-muted">
                    Selected work
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {open.projects.map((p) => (
                      <span
                        key={p}
                        className="font-display text-2xl font-medium text-offwhite"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex gap-5 border-t border-border pt-6 text-xs uppercase tracking-widest text-muted">
                  <a href="#" className="transition-colors hover:text-accent">
                    LinkedIn
                  </a>
                  <a href="#" className="transition-colors hover:text-accent">
                    Instagram
                  </a>
                </div>
              </div>

              <button
                onClick={() => setOpen(null)}
                onMouseEnter={() => setVariant("link")}
                onMouseLeave={() => setVariant("default")}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg/50 text-offwhite backdrop-blur transition-colors hover:border-accent"
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
