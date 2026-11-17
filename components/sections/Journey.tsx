interface Stage {
  period: string;
  title: string;
  place: string;
  note: string;
  kind: "design" | "study" | "dev";
}

const STAGES: Stage[] = [
  {
    period: "2020 ~ 2022",
    title: "시각디자인 전공",
    place: "충청전문대학교",
    note: "이후 사이버대 멀티미디어학과 졸업",
    kind: "study",
  },
  {
    period: "2022.09 ~ 2023.09",
    title: "UX/UI 디자이너",
    place: "쿠발토 기획팀",
    note: "TV 게임 · Apple Watch 화면 설계",
    kind: "design",
  },
  {
    period: "2023.09 ~ 2024.12",
    title: "개발 전향",
    place: "새싹 풀스택 · 오즈코딩스쿨 FE",
    note: "React · Node.js · Java · MySQL",
    kind: "study",
  },
  {
    period: "2024.12 ~ 2026.02",
    title: "프론트엔드 개발자",
    place: "아톰릭스랩",
    note: "Web3 게임 2종 · AI 에셋 파이프라인",
    kind: "dev",
  },
  {
    period: "2025.09 ~ 현재",
    title: "제품 전체를 만드는 개발자",
    place: "유니사이즈 · 술케줄 · 스크럼 봇",
    note: "DB 설계부터 AWS 배포, AI 협업",
    kind: "dev",
  },
  {
    period: "2026.09 ~ 2026.12",
    title: "자연어처리 심화 과정",
    place: "멋쟁이사자처럼",
    note: "Transformer · LLM · 기업 연계 프로젝트",
    kind: "study",
  },
];

const KIND_LABEL: Record<Stage["kind"], string> = {
  design: "Design",
  study: "Learn",
  dev: "Develop",
};

export default function Journey() {
  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-6xl px-4 pt-16 pb-4 sm:px-14">
        <h2 className="mb-2 text-xl font-bold sm:text-2xl">걸어온 길</h2>
        <p className="mb-8 text-sm text-neutral-700 sm:text-base">
          디자인에서 시작해 화면, 그리고 화면 뒤의 데이터까지 한 칸씩 안쪽으로
          들어왔습니다.
        </p>

        <ol className="relative grid gap-6 border-l border-neutral-400/60 pl-6 lg:grid-cols-6 lg:gap-3 lg:border-l-0 lg:border-t lg:pl-0 lg:pt-6">
          {STAGES.map((s) => (
            <li key={s.title} className="relative">
              <span
                aria-hidden
                className={
                  "absolute -left-[31px] top-1 h-3 w-3 rounded-full ring-4 ring-background lg:-top-[31px] lg:left-0 " +
                  (s.kind === "dev"
                    ? "bg-black"
                    : s.kind === "design"
                      ? "bg-neutral-600"
                      : "border border-neutral-600 bg-background")
                }
              />
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-600">
                {KIND_LABEL[s.kind]} · {s.period}
              </p>
              <p className="text-base font-bold leading-snug text-black break-keep">
                {s.title}
              </p>
              <p className="text-sm text-neutral-800 break-keep">{s.place}</p>
              <p className="mt-1 text-xs leading-5 text-neutral-600 break-keep">
                {s.note}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
