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

        // outgoing: ONE trigger pins the chapter AND scrubs its settle-back
        // (separate pin + scrub triggers on the same element fight over
        // measurements — the scrub never advanced)
        if (i < chapters.length - 1) {
          gsap.fromTo(
            inner,
            { autoAlpha: 1, scale: 1, yPercent: 0 },
            {
              autoAlpha: 0.2,
              scale: 0.965,
              yPercent: -4,
              ease: "none",
              scrollTrigger: {
                trigger: sec,
                start: "bottom bottom",
                end: "+=60%",
                scrub: true,
                pin: sec,
                pinSpacing: false,
              },
            }
          );
        }

        // incoming: rise the last stretch + fade up to full presence
        if (i > 0) {
          gsap.fromTo(
            inner,
            { yPercent: 8, autoAlpha: 0 },
            {
              yPercent: 0,
              autoAlpha: 1,
              ease: "none",
              scrollTrigger: {
                trigger: sec,
                start: "top bottom",
                end: "top 35%",
                scrub: 0.5,
              },
            }
          );
        }
      });
    });
  });

  return null;
}
