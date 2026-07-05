"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

// Single registration point for the whole portfolio.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, CustomEase, useGSAP);
  // Mirrors --ease: cubic-bezier(0.16, 1, 0.3, 1)
  if (!CustomEase.get("pf")) CustomEase.create("pf", "0.16, 1, 0.3, 1");
}

export const DUR_UI = 0.2;
export const DUR_REVEAL = 0.7;
export const STAGGER = 0.08;
export const EASE = "pf";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger, useGSAP };
