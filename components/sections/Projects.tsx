"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";
import { PROJECT_CATEGORIES, PROJECTS } from "@/lib/projects";

const FILTERS = ["전체", ...PROJECT_CATEGORIES] as const;

export default function Projects() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeId = searchParams.get("project");
  const activeProject = PROJECTS.find((p) => p.id === activeId) ?? null;
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("전체");
  const filteredProjects =
    filter === "전체" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  const closeModal = useCallback(() => {
    router.push("?", { scroll: false });
  }, [router]);

  useEffect(() => {
    if (!activeProject) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activeProject, closeModal]);

  return (
    <section className="w-full">
      <div className="w-full max-w-6xl mx-auto px-4 py-16 sm:px-14">
        <h2 className="mb-6 text-xl font-medium sm:text-2xl">프로젝트</h2>
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
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filteredProjects.map((project) =>
            activeProject?.id === project.id ? (
              <div
                key={project.id}
                className={clsx("aspect-[4/2]", project.span)}
              />
            ) : (
              <motion.button
                key={project.id}
                type="button"
                layoutId={`project-card-${project.id}`}
                onClick={() =>
                  router.push(`?project=${project.id}`, { scroll: false })
                }
                className={clsx(
                  "group relative flex aspect-[4/2] flex-col justify-end rounded-2xl p-5 text-left transition-opacity hover:opacity-90",
                  project.className,
                  project.span,
                )}
              >
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
                      {project.title}
                    </span>
                  </span>
                </span>
              </motion.button>
            ),
          )}
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
              layoutId={`project-card-${activeProject.id}`}
              className="w-full max-w-2xl overflow-hidden rounded-2xl shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={clsx(
                  "relative flex aspect-[4/2] flex-col justify-end p-6",
                  activeProject.className,
                )}
              >
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-2xl font-semibold"
                >
                  {activeProject.title}
                </motion.h3>
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
                className="bg-white p-6"
              >
                <p className="text-gray-700">{activeProject.description}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
