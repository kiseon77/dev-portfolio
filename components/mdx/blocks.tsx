import Image from "next/image";
import clsx from "clsx";
import type { ReactNode } from "react";

/* 프로젝트 모달(MDX)에서 쓰는 도식 블록 모음.
 * 글 대신 구조로 읽히도록: 개요 표 → 핵심 수치 → 흐름도 → 문제·해결 카드 순으로 쓴다. */

interface OverviewProps {
  period: string;
  role: string;
  team?: string;
  stack: string[];
}

export function Overview({ period, role, team, stack }: OverviewProps) {
  const rows = [
    { label: "기간", value: period },
    { label: "역할", value: role },
    ...(team ? [{ label: "팀", value: team }] : []),
  ];
  return (
    <div className="not-prose mb-8 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
      <dl className="grid gap-x-4 gap-y-2 text-sm sm:grid-cols-[4.5rem_1fr]">
        {rows.map((r) => (
          <div key={r.label} className="contents">
            <dt className="font-medium text-gray-600">{r.label}</dt>
            <dd className="mb-1 text-gray-900 sm:mb-0">{r.value}</dd>
          </div>
        ))}
        <dt className="font-medium text-gray-600">기술</dt>
        <dd className="flex flex-wrap gap-1.5">
          {stack.map((s) => (
            <span
              key={s}
              className="rounded-md bg-white px-2 py-0.5 text-xs font-medium text-gray-800 ring-1 ring-gray-200"
            >
              {s}
            </span>
          ))}
        </dd>
      </dl>
    </div>
  );
}

interface HighlightItem {
  value: string;
  label: string;
}

export function Highlights({ items }: { items: HighlightItem[] }) {
  return (
    <div
      className={clsx(
        "mb-8 grid gap-2",
        items.length >= 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2",
      )}
    >
      {items.map((it) => (
        <div key={it.label} className="rounded-xl bg-black px-4 py-4 text-white">
          <p className="text-2xl font-bold tracking-tight sm:text-[1.7rem]">
            {it.value}
          </p>
          <p className="mt-1 text-xs leading-5 text-white/80 sm:text-sm">
            {it.label}
          </p>
        </div>
      ))}
    </div>
  );
}

interface FlowStep {
  title: string;
  desc?: string;
  tag?: string;
}

/** 단계가 한 방향으로 이어지는 흐름도. 좁은 화면에서는 세로로 쌓인다. */
export function Flow({
  steps,
  caption,
}: {
  steps: FlowStep[];
  caption?: ReactNode;
}) {
  return (
    <figure className="mb-8">
      <ol className="flex flex-col items-stretch gap-0 sm:flex-row sm:items-stretch">
        {steps.map((s, i) => (
          <li
            key={s.title}
            className="flex min-w-0 flex-col items-center sm:flex-1 sm:basis-0 sm:flex-row"
          >
            <div className="flex w-full flex-1 flex-col rounded-xl border border-gray-200 bg-white px-3 py-3 sm:h-full sm:min-w-0">
              <span className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-[10px] text-white">
                  {i + 1}
                </span>
                {s.tag}
              </span>
              <span className="text-sm font-bold text-gray-900 break-keep">
                {s.title}
              </span>
              {s.desc && (
                <span className="mt-1 text-xs leading-5 text-gray-600">
                  {s.desc}
                </span>
              )}
            </div>
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className="flex h-6 shrink-0 items-center justify-center text-gray-500 sm:h-auto sm:w-5"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="rotate-90 sm:rotate-0"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            )}
          </li>
        ))}
      </ol>
      {caption && (
        <figcaption className="mt-2 text-xs leading-5 text-gray-600">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

interface CaseItem {
  title: string;
  problem: string;
  solution: string;
  result?: string;
}

/** 문제 → 해결 → 결과를 한 카드에 나란히 보여 준다. */
export function Cases({ items }: { items: CaseItem[] }) {
  const rows = (it: CaseItem) =>
    [
      { k: "문제", v: it.problem, c: "bg-red-50 text-red-600" },
      { k: "해결", v: it.solution, c: "bg-blue-50 text-blue-600" },
      ...(it.result
        ? [{ k: "결과", v: it.result, c: "bg-emerald-50 text-emerald-700" }]
        : []),
    ] as const;
  return (
    <div className="mb-8 space-y-3">
      {items.map((it) => (
        <div
          key={it.title}
          className="rounded-xl border border-gray-200 bg-white p-4"
        >
          <p className="mb-3 text-[15px] font-bold text-gray-900">
            {it.title}
          </p>
          <ul className="space-y-2">
            {rows(it).map((r) => (
              <li key={r.k} className="flex gap-2.5 text-sm leading-6">
                <span
                  className={clsx(
                    "mt-0.5 h-fit shrink-0 rounded px-1.5 text-[11px] font-semibold leading-5",
                    r.c,
                  )}
                >
                  {r.k}
                </span>
                <span className="text-gray-800">{r.v}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

interface CompareSide {
  title: string;
  items: string[];
}

/** 이전 → 이후를 두 열로 비교한다. */
export function Compare({
  before,
  after,
  caption,
}: {
  before: CompareSide;
  after: CompareSide;
  caption?: ReactNode;
}) {
  return (
    <figure className="mb-8">
      <div className="grid items-stretch gap-2 sm:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
          <p className="mb-2 text-xs font-semibold text-gray-500">BEFORE</p>
          <p className="mb-2 text-sm font-semibold text-gray-800">
            {before.title}
          </p>
          <ul className="space-y-1.5 text-sm leading-6 text-gray-600">
            {before.items.map((t) => (
              <li key={t} className="flex gap-2">
                <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-gray-500" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <span
          aria-hidden
          className="flex items-center justify-center text-gray-500"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="rotate-90 sm:rotate-0"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
        <div className="rounded-xl bg-gray-900 p-4 text-white">
          <p className="mb-2 text-xs font-semibold text-white/50">AFTER</p>
          <p className="mb-2 text-sm font-semibold">{after.title}</p>
          <ul className="space-y-1.5 text-sm leading-6 text-white/80">
            {after.items.map((t) => (
              <li key={t} className="flex gap-2">
                <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-white/60" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {caption && (
        <figcaption className="mt-2 text-xs leading-5 text-gray-600">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/** 캡션이 붙는 이미지. 원본 비율을 지키도록 width/height를 받는다. */
export function Figure({
  src,
  alt,
  width,
  height,
  caption,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: ReactNode;
  className?: string;
}) {
  return (
    <figure className="mb-8">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 768px) 720px, 100vw"
        className={clsx(
          "h-auto w-full rounded-xl border border-gray-200",
          className,
        )}
        unoptimized={src.endsWith(".gif")}
      />
      {caption && (
        <figcaption className="mt-2 text-xs leading-5 text-gray-600">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/** 칩 목록. 팀 개발 환경처럼 '무엇을 만들었는지'를 빠르게 훑게 할 때. */
export function Chips({ items }: { items: string[] }) {
  return (
    <ul className="mb-8 flex flex-wrap gap-2">
      {items.map((t) => (
        <li
          key={t}
          className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-800"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

interface Slice {
  label: string;
  p: number;
}

/** 확률 룰렛 도식: 1%처럼 좁은 칸은 최소 각도를 먼저 보장하고 나머지를 비율대로 나눈다. */
export function RouletteSketch({
  slices,
  minDeg = 14,
}: {
  slices: Slice[];
  minDeg?: number;
}) {
  const small = slices.filter((s) => s.p * 360 < minDeg);
  const reserved = small.length * minDeg;
  const restP = slices
    .filter((s) => s.p * 360 >= minDeg)
    .reduce((a, s) => a + s.p, 0);
  const degs = slices.map((s) =>
    s.p * 360 < minDeg ? minDeg : (s.p / restP) * (360 - reserved),
  );
  const colors = ["#111827", "#4B5563", "#9CA3AF", "#D1D5DB", "#D94B2A"];
  const R = 80;
  const C = 90;
  const starts = degs.map(
    (_, i) => -90 + degs.slice(0, i).reduce((a, b) => a + b, 0),
  );
  const paths = degs.map((d, i) => {
    const start = starts[i];
    const a0 = (start * Math.PI) / 180;
    const a1 = ((start + d) * Math.PI) / 180;
    const mid = ((start + d / 2) * Math.PI) / 180;
    const large = d > 180 ? 1 : 0;
    return {
      d: `M${C},${C} L${C + R * Math.cos(a0)},${C + R * Math.sin(a0)} A${R},${R} 0 ${large} 1 ${C + R * Math.cos(a1)},${C + R * Math.sin(a1)} Z`,
      lx: C + (R + 16) * Math.cos(mid),
      ly: C + (R + 16) * Math.sin(mid),
      color: slices[i].p * 360 < minDeg ? colors[4] : colors[i % 4],
      label: slices[i].label,
    };
  });
  return (
    <svg
      viewBox="-30 -20 240 220"
      className="h-auto w-full max-w-[220px]"
      role="img"
      aria-label="확률별 룰렛 칸 도식"
    >
      {paths.map((p) => (
        <path key={p.label} d={p.d} fill={p.color} stroke="white" strokeWidth="1.5" />
      ))}
      {paths.map((p) => (
        <text
          key={`t-${p.label}`}
          x={p.lx}
          y={p.ly}
          fontSize="10"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#374151"
        >
          {p.label}
        </text>
      ))}
    </svg>
  );
}

/** 왼쪽 도식 + 오른쪽 설명을 나란히 둘 때. */
export function SideBySide({
  visual,
  children,
}: {
  visual: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mb-8 grid items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-[220px_1fr]">
      <div className="flex justify-center">{visual}</div>
      <div className="text-sm leading-6 text-gray-800 [&_p]:mb-2 [&_p]:text-sm [&_p:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}
