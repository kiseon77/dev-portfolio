import { Suspense } from "react";
import Dragon2_5D from "@/components/ui/Dragon2_5D";
import DragonJourney from "@/components/ui/DragonJourney";
import HeroKeywords from "@/components/sections/HeroKeywords";
import AboutMe from "@/components/sections/AboutMe";
import Journey from "@/components/sections/Journey";
import Projects from "@/components/sections/Projects";
import DigitalTwin from "@/components/sections/DigitalTwin";

export default function Home() {
  return (
    <main className="flex flex-col font-sans">
      <DragonJourney />
      <section id="dragon-hero" className="relative flex h-[82svh] min-h-[620px] w-full max-w-6xl mx-auto flex-col items-stretch justify-center py-4 md:h-dvh">
        {/* 히어로에서는 마우스를 따라 나는 원본 용, 스크롤을 시작하면 착지 애니메이션으로 넘긴다 */}
        <div className="h-full w-full" style={{ opacity: "var(--hero-dragon, 1)" }}>
          <Dragon2_5D />
        </div>
        <HeroKeywords />
      </section>
      <AboutMe />
      <Journey />
      <Suspense>
        <Projects />
      </Suspense>
      <DigitalTwin />
    </main>
  );
}
