import SmoothScroll from "@/components/portfolio/SmoothScroll";
import Ferrofluid from "@/components/portfolio-dark/Ferrofluid";
import DarkNav from "@/components/portfolio-dark/DarkNav";
import DarkHero from "@/components/portfolio-dark/DarkHero";
import DarkProof from "@/components/portfolio-dark/DarkProof";
import DarkWork from "@/components/portfolio-dark/DarkWork";
import DarkHowIBuild from "@/components/portfolio-dark/DarkHowIBuild";
import DarkStack from "@/components/portfolio-dark/DarkStack";
import DarkAbout from "@/components/portfolio-dark/DarkAbout";
import ChapterScroll from "@/components/portfolio-dark/ChapterScroll";

// DARK GLASS VARIANT (feat/portfolio-dark-glass) — the light editorial
// version lives on feat/portfolio-v4-hero, untouched.
export default function Home() {
  return (
    <div className="portfolio portfolio-dark relative min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[var(--bg-2)] focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <SmoothScroll />
      {/* THE one ambient layer, site-wide, behind all sections */}
      <Ferrofluid />
      <DarkNav />
      <main id="main" className="relative" style={{ zIndex: 1 }}>
        <DarkHero />
        <DarkProof />
        <DarkWork />
        <DarkHowIBuild />
        <DarkStack />
        <DarkAbout />
        <ChapterScroll />
      </main>
    </div>
  );
}
