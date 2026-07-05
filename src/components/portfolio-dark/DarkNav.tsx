"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const cyanPill: React.CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(34, 211, 238, 0.22), rgba(34, 211, 238, 0.10))",
  border: "1px solid rgba(34, 211, 238, 0.40)",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.12)",
  color: "var(--text)",
  transition: "transform var(--dur-ui) var(--ease), box-shadow var(--dur-ui) var(--ease)",
};

export default function DarkNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      style={{
        background: "rgba(10, 14, 26, 0.55)",
        WebkitBackdropFilter: "blur(20px) saturate(140%)",
        backdropFilter: "blur(20px) saturate(140%)",
        borderBottom: "1px solid var(--glass-border)",
      }}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex w-full max-w-[80rem] items-center justify-between px-6 lg:px-10"
        style={{ height: "var(--nav-height)" }}
      >
        <Link
          href="/"
          className="text-[1.3rem] tracking-tight"
          style={{ fontFamily: "var(--font-display)", fontWeight: 560, color: "var(--text)" }}
        >
          sherrybuilds<span style={{ color: "var(--accent)" }}>.</span>
        </Link>

        <ul className="hidden items-center gap-9 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="pf-underline text-[0.9rem]"
                style={{ color: "var(--muted)" }}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden items-center rounded-full px-5 text-[0.875rem] font-medium md:inline-flex"
            style={{ ...cyanPill, height: "2.75rem" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 28px -8px rgba(34, 211, 238, 0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.12)";
            }}
          >
            Get in touch
          </a>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center md:hidden"
            style={{ color: "var(--text)" }}
          >
            <span className="relative block h-3 w-6" aria-hidden="true">
              <span
                className="absolute left-0 top-0 h-px w-full bg-current"
                style={{
                  transition: "transform var(--dur-ui) var(--ease)",
                  transform: open ? "translateY(5.5px) rotate(45deg)" : "none",
                }}
              />
              <span
                className="absolute bottom-0 left-0 h-px w-full bg-current"
                style={{
                  transition: "transform var(--dur-ui) var(--ease)",
                  transform: open ? "translateY(-5.5px) rotate(-45deg)" : "none",
                }}
              />
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 top-[var(--nav-height)] z-40 flex flex-col px-6 pt-10 md:hidden"
          style={{ background: "var(--bg)" }}
        >
          <ul className="flex flex-col gap-2">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-[2rem] tracking-tight"
                  style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-8 inline-flex h-12 w-fit items-center rounded-full px-7 text-[0.95rem] font-medium"
            style={cyanPill}
          >
            Get in touch
          </a>
        </div>
      )}
    </header>
  );
}
