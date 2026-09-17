import Dragon2_5D from "@/components/ui/Dragon2_5D";
import HeroKeywords from "@/components/sections/HeroKeywords";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 min-h-0 items-stretch justify-center font-sans">
      <main className="relative flex flex-1 min-h-0 w-full max-w-3xl mx-auto flex-col items-stretch justify-center py-4">
        <Dragon2_5D />
        <HeroKeywords />
      </main>
    </div>
  );
}
