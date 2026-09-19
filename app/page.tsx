import { Suspense } from "react";
import Dragon2_5D from "@/components/ui/Dragon2_5D";
import HeroKeywords from "@/components/sections/HeroKeywords";
import AboutMe from "@/components/sections/AboutMe";
import Projects from "@/components/sections/Projects";
import DigitalTwin from "@/components/sections/DigitalTwin";

export default function Home() {
  return (
    <main className="flex flex-col font-sans">
      <section className="relative flex h-dvh w-full max-w-6xl mx-auto flex-col items-stretch justify-center py-4">
        <Dragon2_5D />
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
