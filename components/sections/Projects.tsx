"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import clsx from "clsx";
import { PROJECT_CATEGORIES, PROJECTS } from "@/lib/projects";

const FILTERS = ["전체", ...PROJECT_CATEGORIES] as const;

const PROJECT_CONTENT: Record<
  string,
  () => Promise<{ default: ComponentType }>
> = {
  "project-1": () => import(`@/content/projects/project-1.mdx`),
  "project-2": () => import(`@/content/projects/project-2.mdx`),
  "project-3": () => import(`@/content/projects/project-3.mdx`),
  "project-4": () => import(`@/content/projects/project-4.mdx`),
  "project-5": () => import(`@/content/projects/project-5.mdx`),
};

function ProjectModalContent({ projectId }: { projectId: string }) {
  const [Content, setContent] = useState<ComponentType | null>(null);

  useEffect(() => {
    let cancelled = false;
    PROJECT_CONTENT[projectId]?.().then((mod) => {
      if (!cancelled) setContent(() => mod.default);
    });
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  if (!Content) {
    return <div className="h-24 animate-pulse rounded-lg bg-gray-100" />;
  }

  return <Content />;
}

export default function Projects() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeId = searchParams.get("project");
  const activeProject = PROJECTS.find((p) => p.id === activeId) ?? null;
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("전체");
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const filteredProjects =
    filter === "전체"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === filter);

  const closeModal = useCallback(() => {
    router.push("?", { scroll: false });
  }, [router]);

  useEffect(() => {
    if (!activeProject) return;
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => dialogRef.current?.focus());
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      lastFocusedRef.current?.focus();
    };
  }, [activeProject, closeModal]);

  return (
    <section id="projects" className="w-full">
      <div className="w-full max-w-6xl mx-auto px-4 py-16 sm:px-14">
        <h2 className="mb-6 text-xl font-bold sm:text-2xl">프로젝트</h2>
        <div className="mb-6 flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={clsx(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                filter === f
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-x-3 gap-y-8 sm:grid-cols-2">
          {filteredProjects.map((project) => (
            <article key={project.id} className="flex flex-col gap-3">
              {activeProject?.id === project.id ? (
                <div className={clsx("aspect-[4/2] rounded-2xl", project.span)} />
              ) : (
                <motion.button
                  type="button"
                  layoutId={`project-card-${project.id}`}
                  onClick={() =>
                    router.push(`?project=${project.id}`, { scroll: false })
                  }
                  aria-label={`${project.title} 자세히 보기`}
                  className={clsx(
                    "group relative flex aspect-[4/2] flex-col justify-end overflow-hidden rounded-2xl p-5 text-left transition-opacity hover:opacity-90",
                    project.className,
                    project.span,
                  )}
                >
                  {project.thumbnail && (
                    <Image
                      src={project.thumbnail}
                      alt={project.title}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                      loading={project.id === "project-1" ? "eager" : "lazy"}
                    />
                  )}
                  <span className="absolute bottom-4 left-4 flex h-9 items-center overflow-hidden rounded-full bg-white/90 text-black shadow-md backdrop-blur-sm">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center transition-transform duration-300 -rotate-45 group-hover:rotate-0">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                    <span className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-300 ease-out group-hover:grid-cols-[1fr] group-hover:pr-3">
                      <span className="overflow-hidden whitespace-nowrap text-sm font-medium">
                        자세히 보기
                      </span>
                    </span>
                  </span>
                </motion.button>
              )}
              <button
                type="button"
                onClick={() =>
                  router.push(`?project=${project.id}`, { scroll: false })
                }
                className="flex flex-col gap-1.5 px-1 text-left"
              >
                <span className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-lg font-bold text-black">
                    {project.title}
                  </span>
                  <span className="text-xs text-neutral-600">
                    {project.period}
                  </span>
                </span>
                <span className="text-sm leading-6 text-neutral-800 break-keep">
                  {project.description}
                </span>
                <span className="flex flex-wrap gap-1.5">
                  {project.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-white/70 px-2.5 py-0.5 text-xs text-neutral-800"
                    >
                      {t}
                    </span>
                  ))}
                </span>
              </button>
            </article>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-dialog-title"
              tabIndex={-1}
              layoutId={`project-card-${activeProject.id}`}
              className="w-full max-w-3xl overflow-hidden rounded-2xl shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={clsx(
                  "relative flex h-40 flex-col justify-end overflow-hidden px-6 pb-4 pt-6 sm:h-44",
                  activeProject.className,
                )}
              >
                {activeProject.thumbnail && (
                  <>
                    <Image
                      src={activeProject.thumbnail}
                      alt={activeProject.title}
                      fill
                      sizes="768px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 " />
                  </>
                )}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative flex items-center gap-1"
                >
                  <h3 id="project-dialog-title" className="text-2xl font-semibold text-white drop-shadow-sm">
                    {activeProject.title}
                  </h3>
                  {activeProject.href !== "#" && (
                    <a
                      href={activeProject.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="프로젝트 링크로 이동"
                      onClick={(e) => e.stopPropagation()}
                      className="flex h-8 w-8 items-center justify-center rounded-full p-0.5 text-white hover:bg-white/10"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1M8 13h8v-2H8zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5" />
                      </svg>
                    </a>
                  )}
                </motion.div>
                <p className="relative text-sm font-medium text-white/90 drop-shadow-sm sm:text-base">
                  {activeProject.description}
                  <span className="ml-2 text-white/60">
                    {activeProject.period}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="닫기"
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black shadow-md"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-h-[72vh] overflow-y-auto bg-white p-5 break-keep sm:p-8"
              >
                <ProjectModalContent projectId={activeProject.id} />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
