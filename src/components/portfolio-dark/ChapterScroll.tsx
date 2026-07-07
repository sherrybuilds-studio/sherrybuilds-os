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

        // outgoing: ONE trigger pins the chapter AND scrubs its exit
        // (separate pin + scrub triggers on the same element fight over
        // measurements — the scrub never advanced).
        // DISJOINT WINDOWS: outgoing text is FULLY gone by 40% of the turn;
        // incoming text only starts appearing at 60% — at no scroll position
        // are both chapters' text visible together.
        if (i < chapters.length - 1) {
          const exit = gsap.timeline({
            scrollTrigger: {
              trigger: sec,
              start: "bottom bottom",
              end: "+=60%",
              scrub: true,
              pin: sec,
              pinSpacing: false,
            },
          });
          exit
            .to(inner, { autoAlpha: 0, duration: 0.4, ease: "none" }, 0)
            .to(inner, { scale: 0.96, yPercent: -5, duration: 1, ease: "none" }, 0);
        }

        // incoming: rises through the whole window, but its opacity holds
        // at 0 until 60% — it reads only after the previous chapter is gone
        if (i > 0) {
          const enter = gsap.timeline({
            scrollTrigger: {
              trigger: sec,
              start: "top bottom",
              end: "top 35%",
              scrub: 0.5,
            },
          });
          enter
            .fromTo(inner, { yPercent: 8 }, { yPercent: 0, duration: 1, ease: "none" }, 0)
            .fromTo(inner, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "none" }, 0.6);
        }
      });
    });
  });

  return null;
}
