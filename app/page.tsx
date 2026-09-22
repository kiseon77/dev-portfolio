import { Suspense } from "react";
import DragonJourney from "@/components/ui/DragonJourney";
import HeroKeywords from "@/components/sections/HeroKeywords";
import AboutMe from "@/components/sections/AboutMe";
import Projects from "@/components/sections/Projects";
import DigitalTwin from "@/components/sections/DigitalTwin";

export default function Home() {
  return (
    <main className="flex flex-col font-sans">
      <DragonJourney />
      <section id="dragon-hero" className="relative flex h-dvh w-full max-w-6xl mx-auto flex-col items-stretch justify-center py-4">
        <HeroKeywords />
      </section>
      <AboutMe />
      <Suspense>
        <Projects />
      </Suspense>
      <DigitalTwin />
    </main>
  );
}
