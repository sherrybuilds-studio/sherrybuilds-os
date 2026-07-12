"use client";

import { useGSAP, gsap } from "@/lib/gsap";

/**
 * THE scroll language — one system, applied between every [data-chapter].
 *
 * Chapter turn: as a chapter's bottom reaches the viewport bottom it PINS
 * (pinSpacing: false) so the next chapter physically rises over it. During
 * the 60vh overlap the covered chapter's [data-chapter-inner] settles back
 * (scale 0.965, -4%, dims to 0.2) while the incoming chapter's inner rises
 * the last 8% and fades to full — a crossfade through the shared ferrofluid
 * space rather than a hard cut. Scrub-synced to Lenis via native scroll.
 *
 * Desktop + full-motion only: mobile and prefers-reduced-motion get plain
 * document flow (sections simply follow each other).
 */
export default function ChapterScroll() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
      const chapters = gsap.utils.toArray<HTMLElement>("[data-chapter]");

      chapters.forEach((sec, i) => {
        const inner =
          sec.querySelector<HTMLElement>("[data-chapter-inner]") ?? sec;

        // PERF: only ONE pinned chapter turn on the whole page. Pinning
        // recalculates layout on refresh and was producing 300-517ms long
        // tasks across 6 pinned sections. Stack keeps its pinned turn (the
        // marquee "moment" earns the held context); every other boundary is
        // a plain in-view section whose content reveals itself.
        if (sec.id === "stack" && i < chapters.length - 1) {
          // ONE trigger pins AND scrubs the covered-turn (separate pin+scrub
          // triggers on the same element fight over measurements). Text fully
          // gone by 40% of the window; anticipatePin smooths the pin engage.
          gsap
            .timeline({
              scrollTrigger: {
                trigger: sec,
                start: "bottom bottom",
                end: "+=60%",
                scrub: true,
                pin: sec,
                pinSpacing: false,
                anticipatePin: 1,
              },
            })
            .to(inner, { autoAlpha: 0, duration: 0.4, ease: "none" }, 0)
            .to(inner, { scale: 0.96, yPercent: -5, duration: 1, ease: "none" }, 0);
        }
        // Non-pinned chapters: no section-level tween. Their [data-reveal]
        // content plays a ONE-SHOT in-view reveal (Reveal.tsx / each section's
        // own entrance), so anchor-jumping into a section always lands on
        // fully-revealed content — never a scroll-scrubbed stuck-fade.
      });
    });
  });

  return null;
}
