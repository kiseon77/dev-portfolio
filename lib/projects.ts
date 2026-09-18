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
    description: "프로젝트 설명이 들어갈 자리입니다",
    href: "#",
    className: "bg-[#1D2433] text-white",
    category: "Atomrigs Lab",
  },
  {
    id: "project-2",
    title: "Project Two",
    description: "",
    href: "#",
    className: "bg-[#E4E4E4] text-black",
    category: "Atomrigs Lab",
  },
  {
    id: "project-3",
    title: "Project Three",
    description: "",
    href: "#",
    className: "bg-[#0F3D3E] text-white",
    category: "개인",
  },
  {
    id: "project-4",
    title: "Project Four",
    description: "프로젝트 설명이 들어갈 자리입니다",
    href: "#",
    className: "bg-[#D94B2A] text-white",
    category: "개인",
  },
  {
    id: "project-5",
    title: "Project Five",
    description: "프로젝트 설명이 들어갈 자리입니다",
    href: "#",
    className: "bg-[#F0F0F0] text-black",
    category: "개인",
  },
];
