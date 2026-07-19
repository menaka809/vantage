"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import Magnetic from "./Magnetic";
import { useCursorHover } from "./Cursor";
import { useLenis } from "./SmoothScroll";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "Studio", href: "#studio" },
];

const overlay: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.4, staggerChildren: 0.08, delayChildren: 0.15 },
  },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};
const item: Variants = {
  hidden: { y: 40, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function Nav() {
  const link = useCursorHover("link");
  const { scrollTo } = useLenis();
  const [menuOpen, setMenuOpen] = useState(false);

  const jump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollTo(id, { offset: 0 });
  };

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1 }}
        className="fixed inset-x-0 top-0 z-[80] flex items-center justify-between px-6 py-5 mix-blend-difference md:px-10"
      >
        <Magnetic>
          <Link
            href="/"
            {...link}
            onClick={() => setMenuOpen(false)}
            className="font-display text-xl font-semibold tracking-tight text-offwhite"
          >
            Vantage<span className="text-accent">.</span>
          </Link>
        </Magnetic>

        <nav className="flex items-center gap-8 md:gap-10">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={jump(l.href)}
              {...link}
              className="relative hidden text-sm text-offwhite after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-all after:duration-500 hover:after:w-full md:block"
            >
              {l.label}
            </a>
          ))}
          <Magnetic>
            <Link
              href="/contact"
              {...link}
              onClick={() => setMenuOpen(false)}
              className="relative hidden text-sm text-offwhite after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-all after:duration-500 hover:after:w-full md:block"
            >
              Contact
            </Link>
          </Magnetic>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="relative flex h-5 w-7 flex-col justify-center gap-1.5 md:hidden"
          >
            <span
              className={`block h-px w-full bg-offwhite transition-all duration-300 ${
                menuOpen ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-full bg-offwhite transition-all duration-300 ${
                menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </nav>
      </motion.header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={overlay}
            initial="hidden"
            animate="show"
            exit="exit"
            data-lenis-prevent
            className="fixed inset-0 z-[75] flex flex-col justify-between bg-bg px-6 pb-10 pt-28 md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {[...LINKS, { label: "Contact", href: "/contact" }].map((l) => {
                const isRoute = l.href.startsWith("/");
                return (
                  <div key={l.href} className="overflow-hidden">
                    <motion.div variants={item}>
                      {isRoute ? (
                        <Link
                          href={l.href}
                          onClick={() => setMenuOpen(false)}
                          className="block font-display text-6xl font-semibold tracking-tight text-offwhite transition-colors active:text-accent"
                        >
                          {l.label}
                        </Link>
                      ) : (
                        <a
                          href={l.href}
                          onClick={jump(l.href)}
                          className="block font-display text-6xl font-semibold tracking-tight text-offwhite transition-colors active:text-accent"
                        >
                          {l.label}
                        </a>
                      )}
                    </motion.div>
                  </div>
                );
              })}
            </nav>

            <motion.div
              variants={item}
              className="flex flex-col gap-1 text-sm text-muted"
            >
              <a href="mailto:hello@vantage.studio" className="text-offwhite">
                hello@vantage.studio
              </a>
              <span>London · Berlin — Worldwide</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
