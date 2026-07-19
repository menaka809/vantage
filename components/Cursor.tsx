"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type CursorVariant = "default" | "link" | "view" | "hidden";

type CursorCtx = {
  setVariant: (v: CursorVariant) => void;
  setLabel: (s: string) => void;
};

const Ctx = createContext<CursorCtx>({ setVariant: () => {}, setLabel: () => {} });
export const useCursor = () => useContext(Ctx);

/** Convenience: spread onto any element to make the cursor react on hover. */
export function useCursorHover(variant: CursorVariant, label = "") {
  const { setVariant, setLabel } = useCursor();
  return {
    onMouseEnter: () => {
      setVariant(variant);
      setLabel(label);
    },
    onMouseLeave: () => {
      setVariant("default");
      setLabel("");
    },
  };
}

const SIZES: Record<CursorVariant, number> = {
  default: 34,
  link: 58,
  view: 92,
  hidden: 0,
};

export default function CursorProvider({ children }: { children: ReactNode }) {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);
  const pressed = useRef(false);

  useEffect(() => {
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      document.documentElement.classList.remove("custom-cursor");
      return;
    }
    setEnabled(true);

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { ...target };
    const dot = { ...target };

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };
    const onDown = () => (pressed.current = true);
    const onUp = () => (pressed.current = false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    let raf = 0;
    const loop = () => {
      ring.x += (target.x - ring.x) * 0.16;
      ring.y += (target.y - ring.y) * 0.16;
      dot.x += (target.x - dot.x) * 0.4;
      dot.y += (target.y - dot.y) * 0.4;
      const s = pressed.current ? 0.82 : 1;
      if (ringRef.current)
        ringRef.current.style.transform = `translate3d(${ring.x}px,${ring.y}px,0) translate(-50%,-50%) scale(${s})`;
      if (dotRef.current)
        dotRef.current.style.transform = `translate3d(${dot.x}px,${dot.y}px,0) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  const size = SIZES[variant];
  const isSolid = variant === "view";
  const blend = variant === "default" || variant === "link";

  return (
    <Ctx.Provider value={{ setVariant, setLabel }}>
      {children}
      {enabled && (
        <>
          <div
            ref={ringRef}
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center rounded-full transition-[width,height,background-color,border-color,opacity] duration-300 ease-out"
            style={{
              width: size,
              height: size,
              opacity: variant === "hidden" ? 0 : 1,
              border: isSolid ? "none" : "1.5px solid rgba(237,234,227,0.6)",
              background: isSolid ? "var(--color-accent)" : "transparent",
              mixBlendMode: blend ? "difference" : "normal",
            }}
          >
            {variant === "view" && (
              <span className="text-[11px] font-medium uppercase tracking-wider text-bg">
                {label || "View"}
              </span>
            )}
          </div>
          <div
            ref={dotRef}
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-offwhite transition-opacity duration-200"
            style={{ opacity: variant === "default" ? 1 : 0, mixBlendMode: "difference" }}
          />
        </>
      )}
    </Ctx.Provider>
  );
}
