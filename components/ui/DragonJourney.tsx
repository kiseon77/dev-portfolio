"use client";

import { useEffect, useRef, useState } from "react";
import Dragon2_5D from "./Dragon2_5D";
import styles from "./DragonJourney.module.css";

const COUNT = 61;
const SIZE = 960;
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => n * n * (3 - 2 * n);

/** One viewport layer travels between two real layout anchors, then follows the card. */
export default function DragonJourney() {
  const layerRef = useRef<HTMLDivElement>(null);
  const flightRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [flightVisible, setFlightVisible] = useState(true);

  useEffect(() => {
    const hero = document.getElementById("dragon-hero");
    const landing = document.getElementById("dragon-landing");
    const layer = layerRef.current;
    const canvas = canvasRef.current;
    if (!hero || !landing || !layer || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const frames: (HTMLImageElement | undefined)[] = Array(COUNT);
    let disposed = false;
    let raf = 0;
    let last = 0;
    let progress = 0;
    let shown = true;
    let loaded = false;
    let drawnFrame = -1;

    function schedule() {
      if (!raf && !disposed && !document.hidden) raf = requestAnimationFrame(render);
    }

    function render(now: number) {
      raf = 0;
      if (!hero || !landing || !layer || !canvas || !ctx) return;
      const h = hero.getBoundingClientRect();
      const d = landing.getBoundingClientRect();
      // Finish when the card center reaches 62% of the viewport, including mobile.
      const heroTop = h.top + scrollY;
      const destinationY = d.top + scrollY + d.height / 2;
      const start = heroTop + h.height * 0.08;
      const end = Math.max(start + h.height * 0.45, destinationY - innerHeight * 0.62);
      const target = clamp((scrollY - start) / (end - start));
      const dt = Math.min(64, now - (last || now));
      last = now;
      progress = reduced.matches ? target : progress + (target - progress) * (1 - Math.exp(-dt / 75));
      if (Math.abs(target - progress) < 0.0001) progress = target;
      const p = ease(progress);
      const startSize = Math.min(h.width * 0.9, h.height * 0.94, 900);
      const endSize = Math.min(d.width, d.height);
      const size = startSize + (endSize - startSize) * p;
      const startX = h.left + h.width / 2;
      // Pin flight height during travel; after touchdown use the card's exact position.
      const startY = h.height * 0.48 + Math.max(0, h.top);
      const x = startX + (d.left + d.width / 2 - startX) * p;
      const y = startY + (d.top + d.height / 2 - startY) * p - Math.sin(p * Math.PI) * 28;
      layer.style.width = `${size}px`;
      layer.style.height = `${size}px`;
      layer.style.transform = `translate3d(${x - size / 2}px,${y - size / 2}px,0)`;
      layer.style.visibility = d.bottom < 0 ? "hidden" : "visible";

      const blend = loaded ? ease(clamp(progress / 0.22)) : 0;
      if (flightRef.current) flightRef.current.style.opacity = String(1 - blend);
      canvas.style.opacity = String(blend);
      const showFlight = blend < 1;
      if (showFlight !== shown) { shown = showFlight; setFlightVisible(showFlight); }
      // Keep all original frames. Only blend adjacent poses; never stretch anatomy.
      const frame = (reduced.matches ? (target > 0.5 ? 1 : 0) : ease(clamp((progress - 0.1) / 0.9))) * (COUNT - 1);
      if (loaded && Math.abs(drawnFrame - frame) > 0.005) {
        const a = Math.floor(frame), b = Math.min(COUNT - 1, a + 1);
        ctx.clearRect(0, 0, SIZE, SIZE);
        ctx.globalAlpha = 1;
        ctx.drawImage(frames[a]!, 0, 0, SIZE, SIZE);
        if (b !== a) { ctx.globalAlpha = frame - a; ctx.drawImage(frames[b]!, 0, 0, SIZE, SIZE); }
        ctx.globalAlpha = 1;
        drawnFrame = frame;
      }
      if (progress !== target) schedule();
    }

    // Decode before revealing the sequence to avoid holes on fast/reverse scrolls.
    let next = 0;
    async function worker() {
      while (next < COUNT && !disposed) {
        const i = next++;
        const img = new Image();
        img.src = `/dragon/landing/frame-${String(i + 1).padStart(3, "0")}.webp`;
        await img.decode();
        if (!disposed) frames[i] = img;
      }
    }
    void Promise.all(Array.from({ length: 4 }, worker)).then(() => {
      if (!disposed) { loaded = true; schedule(); }
    }).catch(() => { /* Retain the working original dragon if a frame cannot load. */ });
    const observer = new ResizeObserver(schedule);
    observer.observe(hero);
    observer.observe(landing);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    document.addEventListener("visibilitychange", schedule);
    schedule();
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, []);

  return (
    <div ref={layerRef} className={styles.journey} aria-hidden="true">
      <div ref={flightRef} className={styles.flight}>{flightVisible && <Dragon2_5D />}</div>
      <canvas ref={canvasRef} width={SIZE} height={SIZE} className={styles.landing} />
    </div>
  );
}
