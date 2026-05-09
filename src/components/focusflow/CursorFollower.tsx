import { useEffect, useRef, useState } from "react";

export function CursorFollower() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const target = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);
    const move = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`;
      }
      const el = e.target as HTMLElement | null;
      const isInteractive = !!el?.closest("button, a, [role=button], input, textarea, select, label");
      setHovering(isInteractive);
    };
    let raf = 0;
    const loop = () => {
      ringPos.current.x += (target.current.x - ringPos.current.x) * 0.18;
      ringPos.current.y += (target.current.y - ringPos.current.y) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${ringPos.current.x - 22}px, ${ringPos.current.y - 22}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;
  return (
    <>
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-white mix-blend-difference"
        style={{ boxShadow: "0 0 12px oklch(0.7 0.25 300 / 0.9)" }}
      />
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-11 w-11 rounded-full border border-primary/60 transition-[width,height,opacity,background] duration-200"
        style={{
          background: hovering
            ? "radial-gradient(circle, oklch(0.7 0.25 300 / 0.35), transparent 70%)"
            : "radial-gradient(circle, oklch(0.7 0.25 300 / 0.12), transparent 70%)",
          boxShadow: hovering
            ? "0 0 40px oklch(0.7 0.25 300 / 0.7), 0 0 80px oklch(0.7 0.25 300 / 0.4)"
            : "0 0 18px oklch(0.7 0.25 300 / 0.35)",
          transform: "translate3d(-100px,-100px,0)",
        }}
      />
    </>
  );
}