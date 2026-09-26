"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./DragonJourney.module.css";

const COUNT = 121;
const SIZE = 960;
const CONTACT = 0.62;
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => n * n * (3 - 2 * n);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/** One continuous pose sequence, driven exclusively by scroll position. */
export default function DragonJourney() {
  const layerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState("용이 날아올 준비를 하고 있어요…");

  useEffect(() => {
    const hero = document.getElementById("dragon-hero");
    const landing = document.getElementById("dragon-landing");
    const layer = layerRef.current;
    const canvas = canvasRef.current;
    if (!hero || !landing || !layer || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const frames: (HTMLImageElement | undefined)[] = Array(COUNT);
    let disposed = false;
    let raf = 0;
    let drawnFrame = -1;
    let ready = false;

    function schedule() {
      if (!raf && !disposed && !document.hidden) raf = requestAnimationFrame(render);
    }

    function render() {
      raf = 0;
      if (!hero || !landing || !layer || !canvas || !ctx) return;
      const h = hero.getBoundingClientRect();
      const d = landing.getBoundingClientRect();
      const heroTop = h.top + scrollY;
      const destinationY = d.top + scrollY + d.height / 2;
      const start = heroTop + h.height * 0.05;
      // Leave the card visible while the final 38% of scrolling lowers the haunches.
      const end = Math.max(start + h.height * 0.65, destinationY - innerHeight * 0.42);
      const p = clamp((scrollY - start) / (end - start));
      const travel = ease(clamp(p / CONTACT));
      const startSize = Math.min(h.width * 0.92, h.height * 1.08, 1000);
      const endSize = Math.min(d.width, d.height);
      const size = lerp(startSize, endSize, travel);
      const startX = h.left + h.width / 2;
      const startY = h.height * 0.52 + Math.max(0, h.top);
      const endX = d.left + d.width / 2;
      const endY = d.top + d.height / 2;
      // Ease into the card on a shallow arc. Scale/position stop changing relative
      // to the card at ground contact, so planted feet cannot slide during sitting.
      const x = lerp(startX, endX, travel);
      const y = lerp(startY, endY, travel) - Math.sin(travel * Math.PI) * Math.min(48, h.height * 0.05);
      layer.style.width = `${size}px`;
      layer.style.height = `${size}px`;
      layer.style.transform = `translate3d(${x - size / 2}px,${y - size / 2}px,0)`;
      layer.style.visibility = d.bottom < 0 ? "hidden" : "visible";
      // The source reaches four-foot contact at frame 60. Spend the remaining
      // scroll distance on bending the hind legs and settling the tail.
      const pose = p <= CONTACT ? p / CONTACT * 60 : 60 + (p - CONTACT) / (1 - CONTACT) * 60;
      // No automatic motion or inertia: direct scroll control also preserves
      // intermediate poses when the OS requests reduced motion.
      const frame = Math.round(pose);
      layer.dataset.phase = p === 0 ? "flight" : p < CONTACT ? "approach" : p < 1 ? "sitting" : "seated";
      layer.dataset.frame = String(frame);
      layer.dataset.progress = p.toFixed(4);
      if (ready && frame !== drawnFrame && frames[frame]) {
        ctx.clearRect(0, 0, SIZE, SIZE);
        ctx.drawImage(frames[frame]!, 0, 0, SIZE, SIZE);
        drawnFrame = frame;
      }
    }

    // Show the first pose as soon as it decodes; don't replace it with another
    // illustration while loading. Four concurrent requests avoid a network burst.
    let next = 0;
    async function worker() {
      while (next < COUNT && !disposed) {
        const i = next++;
        const img = new Image();
        img.src = `/dragon/landing-motion/frame-${String(i + 1).padStart(3, "0")}.webp`;
        await img.decode();
        if (disposed) return;
        frames[i] = img;
        if (i === 0) { ctx!.drawImage(img, 0, 0, SIZE, SIZE); }
      }
    }
    void Promise.all(Array.from({ length: 4 }, worker)).then(() => {
      if (!disposed) { ready = true; setStatus(""); schedule(); }
    }).catch(() => {
      if (!disposed) setStatus("착지 동작을 불러오지 못했어요. 새로고침해주세요.");
    });
    const observer = new ResizeObserver(schedule);
    observer.observe(hero);
    observer.observe(landing);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    schedule();
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, []);

  return (
    <div ref={layerRef} className={styles.journey}>
      <canvas ref={canvasRef} width={SIZE} height={SIZE} className={styles.landing} role="img" aria-label="스크롤에 맞춰 날아와 소개 영역에 앉는 빨간 용" />
      {status && <p className={styles.status} role="status">{status}</p>}
    </div>
  );
}
