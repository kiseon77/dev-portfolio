import Dragon2_5D from "@/components/ui/Dragon2_5D";
import HeroKeywords from "@/components/sections/HeroKeywords";
import AboutMe from "@/components/sections/AboutMe";

export default function Home() {
  return (
    <div className="flex flex-col font-sans">
      <main className="relative flex h-dvh w-full max-w-3xl mx-auto flex-col items-stretch justify-center py-4">
        <Dragon2_5D />
        <HeroKeywords />
      </main>
      <AboutMe />
    </div>
  );
}
