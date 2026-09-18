export const PROJECT_CATEGORIES = ["Atomrigs Lab", "사이드"] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export interface Project {
  id: string;
  title: string;
  description: string;
  href: string;
  className: string;
  span?: string;
  category: ProjectCategory;
  thumbnail?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "project-1",
    title: "Uni Size",
    description: "오프라인 교복 매장 CRM 웹 서비스",
    href: "https://github.com/Uni-Size",
    className: "bg-[#F3F5FF]",
    category: "사이드",
    thumbnail: "/projects/unisize_thumnail.jpg",
  },
  {
    id: "project-2",
    title: "데일리스크럼 지라 등록 자동화 디스코드 봇",
    description:
      "디스코드 스레드에 작성한 데일리스크럼을 모아 Jira 에픽 하위 태스크로 자동 등록하는 봇",
    href: "https://github.com/kiseon77/scrum-jira-bot.git",
    className: "bg-[#5662F6]",
    category: "사이드",
    thumbnail: "/projects/discord_thumnail.jpg",
  },
  {
    id: "project-3",
    title: "미니게임, 슬롯머신 (서비스 중단)",
    description: "2024.12 ~ 2025.02 ",
    href: "#",
    className: "bg-[#0F3D3E]",
    category: "Atomrigs Lab",
    thumbnail: "/projects/pixels_thumnail.jpg",
  },
  {
    id: "project-4",
    title: "다이버전스 (미출시)",
    description: "2025.04 ~ 2026.02 ",
    href: "#",
    className: "bg-[#D94B2A]",
    category: "Atomrigs Lab",
    thumbnail: "/projects/divergence_thumnail.jpg",
  },
];
