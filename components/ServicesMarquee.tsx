"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const SERVICES = [
  "Motion Design",
  "Interactive Web",
  "Brand Identity",
  "Art Direction",
];

export default function ServicesMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion()) return;

    let x = 0;
    let velocity = 0;
    let copyWidth = track.scrollWidth / 2;

    const measure = () => {
      copyWidth = track.scrollWidth / 2;
    };
    const settle = window.setTimeout(measure, 600);
    window.addEventListener("resize", measure);

    // Capture scroll velocity to speed up / reverse the marquee.
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        velocity = self.getVelocity();
      },
    });

    const base = 55; // px/s baseline drift

    const tick = (_t: number, delta: number) => {
      const dt = delta / 1000;
      x -= base * dt; // constant drift left
      x -= velocity * 0.00045 * dt * 60; // scroll velocity influence
      velocity *= 0.9; // decay
      // x only decreases, so a modulo wraps it seamlessly into (-copyWidth, 0]
      if (copyWidth > 0) x = x % copyWidth;
      track.style.transform = `translate3d(${x}px,0,0)`;
    };
    gsap.ticker.add(tick);

    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("resize", measure);
      gsap.ticker.remove(tick);
      st.kill();
    };
  }, []);

  const items = [...SERVICES, ...SERVICES];

  return (
    <section className="overflow-hidden border-y border-border py-8 md:py-12">
      <div
        ref={trackRef}
        className="flex w-max whitespace-nowrap will-change-transform"
      >
        {items.map((s, i) => (
          <span key={i} className="flex items-center">
            <span className="font-display text-6xl font-medium tracking-tight text-offwhite md:text-8xl">
              {s}
            </span>
            <span className="mx-8 text-4xl text-accent md:mx-14 md:text-6xl">
              ✳
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
