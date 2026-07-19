"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

type LenisCtx = {
  scrollTo: (t: string | number, o?: { offset?: number }) => void;
  lenis: () => Lenis | null;
};

const Ctx = createContext<LenisCtx>({ scrollTo: () => {}, lenis: () => null });
export const useLenis = () => useContext(Ctx);

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const ref = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      ScrollTrigger.refresh();
      return () => ScrollTrigger.getAll().forEach((t) => t.kill());
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    ref.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    const settle = window.setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      window.clearTimeout(settle);
      gsap.ticker.remove(raf);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      ref.current = null;
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const scrollTo: LenisCtx["scrollTo"] = (t, o) => {
    const l = ref.current;
    if (l) l.scrollTo(t, { offset: o?.offset ?? 0, duration: 1.3 });
    else if (typeof t === "string")
      document.querySelector(t)?.scrollIntoView({ behavior: "auto" });
  };

  return (
    <Ctx.Provider value={{ scrollTo, lenis: () => ref.current }}>
      {children}
    </Ctx.Provider>
  );
}
