"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, DUR_REVEAL, STAGGER, EASE } from "@/lib/gsap";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Seconds, added on top of the scroll-trigger start. */
  delay?: number;
  /** Stagger direct children instead of revealing the block as one. */
  staggerChildren?: boolean;
};

/**
 * The one scroll-reveal language of the site: soft clip-mask + fade + small rise.
 * Used by every section below the hero; the hero runs its own entrance timeline.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  staggerChildren = false,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const targets = staggerChildren ? Array.from(el.children) : el;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          targets,
          { autoAlpha: 0, y: 28, clipPath: "inset(0% 0% 18% 0%)" },
          {
            autoAlpha: 1,
            y: 0,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: DUR_REVEAL,
            ease: EASE,
            delay,
            stagger: staggerChildren ? STAGGER : 0,
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(targets, { autoAlpha: 1, y: 0, clipPath: "none" });
      });
    },
    { scope: ref }
  );

  // Polymorphic tags defeat TSX prop inference — runtime is a plain element.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp = Tag as any;
  return (
    <Comp ref={ref} className={className} data-reveal="">
      {children}
    </Comp>
  );
}
