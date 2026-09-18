export const PROJECT_CATEGORIES = ["Atomrigs Lab", "개인"] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export interface Project {
  id: string;
  title: string;
  description: string;
  href: string;
  className: string;
  span?: string;
  category: ProjectCategory;
}

export const PROJECTS: Project[] = [
  {
    id: "project-1",
    title: "Project One",
    description: "A simple project to demonstrate the concept.",
    href: "https://github.com/example/project-one",
    className: "bg-[#1D2433] text-white",
    category: "Atomrigs Lab",
  },
  {
    id: "project-2",
    title: "Project Two",
    description: "Another simple project to demonstrate the concept.",
    href: "#",
    className: "bg-[#E4E4E4] text-black",
    category: "Atomrigs Lab",
  },
  {
    id: "project-3",
    title: "Project Three",
    description: "A third simple project to demonstrate the concept.",
    href: "#",
    className: "bg-[#0F3D3E] text-white",
    category: "개인",
  },
  {
    id: "project-4",
    title: "Project Four",
    description: "A fourth simple project to demonstrate the concept.",
    href: "#",
    className: "bg-[#D94B2A] text-white",
    category: "개인",
  },
  {
    id: "project-5",
    title: "Project Five",
    description: "A fifth simple project to demonstrate the concept.",
    href: "#",
    className: "bg-[#F0F0F0] text-black",
    category: "개인",
  },
];
