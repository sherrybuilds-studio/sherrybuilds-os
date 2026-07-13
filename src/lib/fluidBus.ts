/**
 * fluidBus — a tiny decoupled channel so content can make the ferrofluid
 * REACT to events (count-ups, card entrances, step activations) on top of
 * its per-section scroll mood. Ferrofluid reads these transient boosts each
 * frame, adds them over the base mood, then decays them toward 0 — so a
 * pulse spikes and settles. Module-level (no DOM events / no React re-render)
 * to stay off the render path and within the perf budget.
 *
 * Semantics: pulse() sets each channel to the MAX of its current and the new
 * value. A one-off nudge therefore spikes then decays; a repeated call during
 * an animation (e.g. count-up onUpdate) keeps the channel topped up so the
 * fluid RAMPS with the animation and settles when it stops.
 */
export type FluidPulse = {
  cyan?: number; // extra cyan intensity
  turb?: number; // extra turbulence / churn
  bright?: number; // extra brightness
  dir?: number; // directional advection impulse (signed)
};

const boost = { cyan: 0, turb: 0, bright: 0, dir: 0 };

export const fluidBus = {
  pulse(p: FluidPulse) {
    if (p.cyan) boost.cyan = Math.max(boost.cyan, p.cyan);
    if (p.turb) boost.turb = Math.max(boost.turb, p.turb);
    if (p.bright) boost.bright = Math.max(boost.bright, p.bright);
    // direction keeps its sign, largest magnitude wins
    if (p.dir && Math.abs(p.dir) > Math.abs(boost.dir)) boost.dir = p.dir;
  },
  /** Ferrofluid reads this every frame. */
  read() {
    return boost;
  },
  /** Ferrofluid decays toward rest after reading (f in [0,1) per frame). */
  decay(f: number) {
    boost.cyan *= f;
    boost.turb *= f;
    boost.bright *= f;
    boost.dir *= f;
  },
};
