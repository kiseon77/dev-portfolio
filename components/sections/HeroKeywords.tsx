"use client";

import { useRef, useState } from "react";
import clsx from "clsx";

interface Keyword {
  id: string;
  label: string;
  skills: string;
}

const KEYWORDS: Keyword[] = [
  { id: "designer", label: "Designer", skills: "Figma, Design System" },
  { id: "frontend", label: "Frontend", skills: "React, Typescript" },
  { id: "ai-native", label: "AI-Native", skills: "LLM, Agent, MCP" },
];

const INITIAL_POSITIONS: Record<string, { xPct: number; yPct: number }> = {
  designer: { xPct: 8, yPct: 14 },
  frontend: { xPct: 0, yPct: 27 },
  "ai-native": { xPct: 6, yPct: 40 },
};

export default function HeroKeywords() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dropZoneRef = useRef<HTMLButtonElement>(null);
  const draggingRef = useRef(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [dragOver, setDragOver] = useState(false);
  const [positions, setPositions] = useState<
    Record<string, { x: number; y: number } | null>
  >(Object.fromEntries(KEYWORDS.map((k) => [k.id, null])));

  const active = KEYWORDS.find((k) => k.id === activeId) ?? null;
  const dragging = KEYWORDS.find((k) => k.id === dragId) ?? null;

  function startDrag(e: React.PointerEvent, id: string) {
    e.preventDefault();
    draggingRef.current = false;
    const chip = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - chip.left;
    const offsetY = e.clientY - chip.top;
    setDragPos({
      x: chip.left + chip.width / 2,
      y: chip.top + chip.height / 2,
    });

    function isOverDropZone(x: number, y: number) {
      const zone = dropZoneRef.current;
      if (!zone) return false;
      const r = zone.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    }

    function onMove(ev: PointerEvent) {
      if (!draggingRef.current) {
        if (Math.hypot(ev.clientX - e.clientX, ev.clientY - e.clientY) < 4)
          return;
        draggingRef.current = true;
        setDragId(id);
      }
      setDragPos({
        x: ev.clientX - offsetX + chip.width / 2,
        y: ev.clientY - offsetY + chip.height / 2,
      });
      setDragOver(isOverDropZone(ev.clientX, ev.clientY));
    }
    function onUp(ev: PointerEvent) {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      if (draggingRef.current) {
        if (isOverDropZone(ev.clientX, ev.clientY)) {
          setActiveId(id);
        } else {
          const container = containerRef.current;
          if (container) {
            const r = container.getBoundingClientRect();
            setPositions((prev) => ({
              ...prev,
              [id]: {
                x: ev.clientX - offsetX - r.left,
                y: ev.clientY - offsetY - r.top,
              },
            }));
          }
        }
      } else {
        setActiveId(activeId === id ? null : id);
      }
      setDragId(null);
      setDragOver(false);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0">
      {KEYWORDS.map((k) => {
        const pos = positions[k.id];
        const style = pos
          ? { left: pos.x, top: pos.y }
          : {
              left: `${INITIAL_POSITIONS[k.id].xPct}%`,
              top: `${INITIAL_POSITIONS[k.id].yPct}%`,
            };
        return (
          <div
            key={k.id}
            role="button"
            tabIndex={0}
            onPointerDown={(e) => startDrag(e, k.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                setActiveId(activeId === k.id ? null : k.id);
            }}
            style={style}
            className={clsx(
              "pointer-events-auto absolute cursor-grab touch-none select-none rounded-md px-4 py-2 text-base font-light md:px-6 md:py-3 md:text-2xl",
              activeId === k.id
                ? "bg-black text-white"
                : "bg-white hover:bg-neutral-100",
              (activeId === k.id || dragId === k.id) && "invisible",
            )}
          >
            {k.label}
          </div>
        );
      })}

      <div className="pointer-events-auto absolute bottom-[10%] left-4 right-4 flex flex-col items-end gap-2 text-right text-2xl md:left-auto md:right-[-2%] md:text-4xl">
        <p className="-mb-2 text-xs text-neutral-500 md:text-sm">
          {active ? active.skills : ""}
        </p>
        <p className="flex flex-wrap items-center justify-end gap-2 ">
          안녕하세요
        </p>
        <p className="flex w-full flex-wrap items-center justify-end gap-2 ">
          <button
            ref={dropZoneRef}
            type="button"
            onClick={() => {
              if (activeId)
                setPositions((prev) => ({ ...prev, [activeId]: null }));
              setActiveId(null);
            }}
            className={clsx(
              "rounded-md h-11 px-4 text-center font-bold text-2xl transition-colors md:h-16 md:px-6 md:text-4xl",
              active
                ? "bg-white text-black"
                : [
                    " bg-white/30  text-[#686868] backdrop-blur-md ",
                    dragOver
                      ? "border-neutral-500 bg-black/5"
                      : "border-neutral-300",
                  ],
            )}
          >
            {active ? (
              active.label
            ) : (
              <span className="flex flex-col leading-none">
                <span className="hidden md:inline">drag a word here</span>
                <span className="md:hidden">tap a word</span>
                <span className="text-[10px] font-medium text-[#686868] md:text-sm">
                  키워드를 드래그하거나 탭하세요.
                </span>
              </span>
            )}
          </button>
          개발자
        </p>
        <p className="text-2xl md:text-4xl ">
          <span className="font-medium">한기선</span> 입니다
        </p>
      </div>

      {dragging && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white shadow-lg sm:text-base"
          style={{ left: dragPos.x, top: dragPos.y }}
        >
          {dragging.label}
        </div>
      )}
    </div>
  );
}
