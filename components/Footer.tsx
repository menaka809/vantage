"use client";

import Link from "next/link";
import Magnetic from "./Magnetic";
import { useCursorHover } from "./Cursor";

export default function Footer() {
  const link = useCursorHover("link");

  return (
    <footer className="border-t border-border px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-[1500px]">
        <p className="mb-8 text-xs uppercase tracking-widest text-muted">
          Have something in mind?
        </p>
        <Magnetic strength={0.25}>
          <Link
            href="/contact"
            {...link}
            className="group inline-flex items-end gap-4 font-display text-[17vw] font-semibold leading-[0.85] tracking-tight text-offwhite transition-colors duration-300 hover:text-accent md:text-[12vw]"
          >
            Let&rsquo;s talk
            <span className="mb-[2vw] text-accent transition-transform duration-500 group-hover:translate-x-3">
              →
            </span>
          </Link>
        </Magnetic>

        <div className="mt-16 flex flex-col gap-6 border-t border-border pt-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {2026} Vantage Studio — We make brands move.</span>
          <div className="flex flex-wrap gap-6">
            <a {...link} href="#" className="transition-colors hover:text-offwhite">
              Instagram
            </a>
            <a {...link} href="#" className="transition-colors hover:text-offwhite">
              Behance
            </a>
            <a
              {...link}
              href="mailto:hello@vantage.studio"
              className="transition-colors hover:text-offwhite"
            >
              hello@vantage.studio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
