"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/* ────────────────────────────────────────────────────────────────────
   SPLINE SWAP POINT — #hero-glass
   When the Spline export is ready, replace <PlaceholderShape /> below with:

     import Spline from "@splinetool/react-spline";   // already installed
     <Spline scene="https://prod.spline.design/XXXX/scene.splinecode" />

   Keep the outer #hero-glass wrapper — the entrance fade, slow float and
   scroll parallax live there and will drive the Spline canvas unchanged.
   ──────────────────────────────────────────────────────────────────── */

function PlaceholderShape() {
  return (
    <div className="relative h-full w-full">
      {/* companion shard — depth behind the main form */}
      <div
        className="absolute"
        style={{
          left: "4%",
          bottom: "10%",
          width: "42%",
          aspectRatio: "1 / 1.15",
          borderRadius: "58% 42% 46% 54% / 44% 58% 42% 56%",
          background:
            "linear-gradient(160deg, rgba(59, 130, 246, 0.16), rgba(10, 14, 26, 0.2) 75%)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          transform: "rotate(14deg)",
        }}
      />
      {/* main glass form */}
      <div
        className="glass absolute"
        style={{
          right: "6%",
          top: "12%",
          width: "78%",
          aspectRatio: "1 / 1.06",
          borderRadius: "38% 62% 55% 45% / 48% 40% 60% 52%",
          background:
            "linear-gradient(140deg, rgba(59, 130, 246, 0.30), rgba(34, 211, 238, 0.10) 45%, rgba(10, 14, 26, 0.35) 85%)",
          boxShadow:
            "inset 0 1px 0 rgba(255, 255, 255, 0.16), inset 0 -40px 80px rgba(34, 211, 238, 0.10), 0 40px 120px rgba(34, 211, 238, 0.12)",
        }}
      >
        {/* soft specular highlight */}
        <div
          className="absolute"
          style={{
            top: "8%",
            left: "12%",
            width: "48%",
            height: "34%",
            borderRadius: "50%",
            background:
              "radial-gradient(closest-side, rgba(255, 255, 255, 0.30), transparent 70%)",
            filter: "blur(10px)",
            transform: "rotate(-16deg)",
          }}
        />
        {/* sharp highlight streak */}
        <div
          className="absolute"
          style={{
            top: "14%",
            left: "16%",
            width: "26%",
            height: "6px",
            borderRadius: "999px",
            background: "rgba(255, 255, 255, 0.35)",
            filter: "blur(2px)",
            transform: "rotate(-18deg)",
          }}
        />
        {/* cyan rim light, bottom edge */}
        <div
          className="absolute"
          style={{
            bottom: "6%",
            right: "10%",
            width: "50%",
            height: "18%",
            borderRadius: "50%",
            background:
              "radial-gradient(closest-side, rgba(34, 211, 238, 0.28), transparent 70%)",
            filter: "blur(14px)",
          }}
        />
      </div>
    </div>
  );
}

export default function GlassShape() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // slow float
        gsap.to(".gs-float", {
          y: 20,
          rotation: 1.6,
          duration: 6.5,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
        // scroll parallax — shape drifts up slightly faster than the page
        gsap.to(ref.current, {
          y: -80,
          ease: "none",
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    },
    { scope: ref }
  );

  return (
    <div id="hero-glass" ref={ref} aria-hidden="true" className="h-full w-full">
      <div className="gs-float h-full w-full will-change-transform">
        <PlaceholderShape />
      </div>
    </div>
  );
}
