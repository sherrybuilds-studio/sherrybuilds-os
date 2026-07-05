import SmoothScroll from "@/components/portfolio/SmoothScroll";
import Nav from "@/components/portfolio/Nav";
import Hero from "@/components/portfolio/Hero";
import Proof from "@/components/portfolio/Proof";

export default function Home() {
  return (
    <div className="portfolio min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[var(--surface)] focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <SmoothScroll />
      <Nav />
      <main id="main">
        <Hero />
        <Proof />
      </main>
    </div>
  );
}
