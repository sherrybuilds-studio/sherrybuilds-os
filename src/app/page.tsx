import SmoothScroll from "@/components/portfolio/SmoothScroll";
import LightRays from "@/components/portfolio-dark/LightRays";
import AmbientGlow from "@/components/portfolio-dark/AmbientGlow";
import DarkNav from "@/components/portfolio-dark/DarkNav";
import DarkHero from "@/components/portfolio-dark/DarkHero";

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
      {/* deepest layer first: rays, then the glow wash, then content */}
      <LightRays />
      <AmbientGlow />
      <DarkNav />
      <main id="main" className="relative" style={{ zIndex: 1 }}>
        <DarkHero />
      </main>
    </div>
  );
}
