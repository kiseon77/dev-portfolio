export const PROJECT_CATEGORIES = ["Atomrigs Lab", "사이드"] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export interface Project {
  id: string;
  title: string;
  description: string;
  period: string;
  /** 카드 아래에 보이는 핵심 키워드 (2~3개) */
  tags: string[];
  href: string;
  className: string;
  span?: string;
  category: ProjectCategory;
  thumbnail?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "project-1",
    title: "유니사이즈",
    description: "교복 매장 주문·재고 관리 서비스 · 기획부터 배포까지 1인 개발",
    period: "2025.09 ~ 진행중",
    tags: ["Next.js", "PostgreSQL", "AWS 배포"],
    href: "https://github.com/Uni-Size/node",
    className: "bg-[#F3F5FF]",
    category: "사이드",
    thumbnail: "/projects/unisize_thumnail.jpg",
  },
  {
    id: "project-5",
    title: "술케줄",
    description: "면세 한도 맞춤 위스키 구매 플래너 · SWYP 6주 팀 프로젝트",
    period: "2026.08 ~ 2026.10",
    tags: ["Next.js 16", "인증", "기획 공백 대응"],
    href: "https://github.com/swyp-web15-3team/front",
    className: "bg-[#FFF1E0]",
    category: "사이드",
    thumbnail: "/projects/sulchedule_thumnail.jpg",
  },
  {
    id: "project-2",
    title: "데일리 스크럼 자동화 봇",
    description: "Discord 스크럼을 Jira에 기록하고 AI가 주간보고 초안 작성",
    period: "2026.09",
    tags: ["Claude API", "Jira", "참여율 +13.5%p"],
    href: "https://github.com/kiseon77/scrum-jira-bot",
    className: "bg-[#5662F6]",
    category: "사이드",
    thumbnail: "/projects/discord_thumnail.jpg",
  },
  {
    id: "project-4",
    title: "다이버전스",
    description: "AI 기반 Web3 게임 · 캐릭터 생성·이벤트·AI 에셋 파이프라인",
    period: "2025.03 ~ 2026.02 · 미출시",
    tags: ["Svelte5", "ComfyUI", "요청 16→1회"],
    href: "#",
    className: "bg-[#D94B2A]",
    category: "Atomrigs Lab",
    thumbnail: "/projects/divergence_thumnail.jpg",
  },
  {
    id: "project-3",
    title: "픽셀즈 슬롯머신",
    description: "물리 기반 슬롯머신 미니게임 · 인턴 과제",
    period: "2024.12 ~ 2025.02 · 서비스 중단",
    tags: ["React", "GSAP", "Matter.js"],
    href: "#",
    className: "bg-[#0F3D3E]",
    category: "Atomrigs Lab",
    thumbnail: "/projects/pixels_thumnail.jpg",
  },
];
