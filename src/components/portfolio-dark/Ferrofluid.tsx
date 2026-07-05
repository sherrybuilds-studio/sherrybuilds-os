"use client";

import { useEffect, useRef } from "react";

/**
 * Ferrofluid ambient background — THE one site-wide layer behind all
 * sections (replaces AuroraVeil in the slot; that file stays in the repo,
 * unmounted). Flowing liquid-metal tendrils built from ridged, domain-
 * warped value noise: thin bright filaments where the field crosses its
 * midline, with a faked directional sheen for the metallic feel.
 * Recolored to the site palette: navy base, blue mass, cyan crests.
 *
 * Raw WebGL, no libraries. Background discipline:
 * - low intensity (0.20 desktop / 0.12 mobile), thin filaments only —
 *   average luminance stays low so the glass object remains the star
 * - DPR capped at 1; mobile skips the fine second filament layer
 * - prefers-reduced-motion: one static frame (frozen blue gradient)
 * - rAF pauses on hidden tabs; context released on unmount
 */

const FRAG = `
precision mediump float;
uniform float uTime;
uniform vec2 uRes;
uniform float uIntensity;
uniform float uDetail;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p, float t) {
  float v = 0.0;
  v += noise(p + vec2(t, -t * 0.6)) * 0.55;
  v += noise(p * 2.1 + vec2(-t * 0.7, t * 0.4)) * 0.3;
  v += noise(p * 4.3 + vec2(t * 0.3, t * 0.8)) * 0.15;
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = vec2(uv.x * uRes.x / uRes.y, uv.y) * 1.4;

  float t = uTime * 0.05; // continuous, slow

  // domain warp — the "magnetic" flow
  vec2 warp = vec2(fbm(p + vec2(0.0, 3.7), t), fbm(p + vec2(5.2, 1.3), t * 0.85));
  float n = fbm(p * 1.15 + warp * 1.7, t);

  // ridged: thin bright filaments where the field crosses its midline
  float ridge = 1.0 - abs(2.0 * n - 1.0);
  ridge = pow(smoothstep(0.62, 1.0, ridge), 3.0);

  float glow = ridge * 0.85;

  // finer secondary tendrils (desktop only)
  if (uDetail > 1.5) {
    float n2 = fbm(p * 2.6 - warp * 1.2, t * 1.25);
    float ridge2 = 1.0 - abs(2.0 * n2 - 1.0);
    glow += pow(smoothstep(0.7, 1.0, ridge2), 4.0) * 0.35;
  }

  // faked metallic sheen — directional gradient of the field
  float sheen = clamp((fbm(p * 1.15 + warp * 1.7 + vec2(0.03, 0.015), t) - n) * 7.0, -1.0, 1.0);

  vec3 blue = vec3(0.231, 0.51, 0.965);  /* --accent-2 #3B82F6 */
  vec3 cyan = vec3(0.133, 0.827, 0.933); /* --accent   #22D3EE */
  vec3 col = mix(blue * 0.55, cyan, clamp(glow * 0.8 + sheen * 0.25, 0.0, 1.0));

  float alpha = clamp(glow, 0.0, 1.0) * uIntensity;
  gl_FragColor = vec4(col * alpha, alpha); /* premultiplied */
}
`;

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

export default function Ferrofluid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      powerPreference: "low-power",
    });
    if (!gl) return; // no WebGL → flat navy --bg carries it

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const uTime = gl.getUniformLocation(prog, "uTime");
    const uRes = gl.getUniformLocation(prog, "uRes");
    const uIntensity = gl.getUniformLocation(prog, "uIntensity");
    const uDetail = gl.getUniformLocation(prog, "uDetail");

    gl.uniform1f(uIntensity, mobile ? 0.12 : 0.2);
    gl.uniform1f(uDetail, mobile ? 1 : 2);

    const resize = () => {
      canvas.width = canvas.clientWidth; // DPR 1 — soft background
      canvas.height = canvas.clientHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (timeSec: number) => {
      gl.uniform1f(uTime, timeSec);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    let raf = 0;
    if (reduced) {
      draw(40); // static blue gradient frame
    } else {
      const loop = (t: number) => {
        draw(t / 1000);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 h-full w-full"
      style={{ zIndex: 0 }}
    />
  );
}
