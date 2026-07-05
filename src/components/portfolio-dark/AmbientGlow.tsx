/**
 * Deep ambient background: two very slow, very soft navy→cyan radial glows
 * drifting behind everything. Pure CSS animation (transform/opacity only),
 * frozen automatically under prefers-reduced-motion by the global guard.
 */
export default function AmbientGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <div
        className="absolute"
        style={{
          top: "-25%",
          left: "-15%",
          width: "70vw",
          height: "70vw",
          background:
            "radial-gradient(closest-side, rgba(59, 130, 246, 0.16), transparent 70%)",
          animation: "pf-drift-a 34s ease-in-out infinite",
        }}
      />
      <div
        className="absolute"
        style={{
          bottom: "-30%",
          right: "-20%",
          width: "80vw",
          height: "80vw",
          background:
            "radial-gradient(closest-side, rgba(34, 211, 238, 0.10), transparent 70%)",
          animation: "pf-drift-b 26s ease-in-out infinite",
        }}
      />
    </div>
  );
}
