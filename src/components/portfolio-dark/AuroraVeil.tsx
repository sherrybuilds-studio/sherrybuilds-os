"use client";

import { useEffect, useRef } from "react";

/**
 * THE site-wide ambient background — one locked layer behind all sections.
 * A calm dark veil: domain-warped aurora glow drifting navy→cyan, with a
 * faint diagonal streak modulation. Replaces the earlier AmbientGlow +
 * LightRays stack (both kept in the repo, unmounted) so exactly ONE
 * atmosphere runs under the page.
 *
 * Raw WebGL, no libraries. Quiet by design:
 * - intensity 0.16 desktop / 0.10 mobile, premultiplied over the page
 * - DPR capped at 1; mobile drops an fbm octave
 * - prefers-reduced-motion: one static frame, no loop
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

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = vec2(uv.x * uRes.x / uRes.y, uv.y);

  float t = uTime * 0.03; // very slow drift

  // domain warp — gives the veil its organic aurora flow
  vec2 q = vec2(
    noise(p * 1.3 + vec2(t, -t * 0.7)),
    noise(p * 1.3 + vec2(-t * 0.6, t * 0.9))
  );
  float a = noise(p * 1.9 + q * 1.5 + vec2(t * 0.5, -t * 0.3)) * 0.7;
  if (uDetail > 1.5) {
    a += noise(p * 4.5 - q * 2.0 + vec2(-t * 0.4, t * 0.6)) * 0.3;
  }
  a = smoothstep(0.32, 0.92, a);

  // faint diagonal streak modulation (upper-left → lower-right)
  vec2 dir = normalize(vec2(0.55, -1.0));
  float streak = noise(vec2(dot(p, vec2(-dir.y, dir.x)) * 3.0 - t * 1.2, dot(p, dir) * 0.5));
  a *= 0.65 + 0.35 * streak;

  // veil mass sits in the upper half, dissolves toward the bottom
  float mask = smoothstep(-0.1, 0.35, uv.y) * smoothstep(1.35, 0.45, uv.y) + 0.18;

  float glow = a * mask;

  vec3 navy = vec3(0.075, 0.115, 0.23);
  vec3 cyan = vec3(0.133, 0.827, 0.933); /* --accent #22D3EE */
  vec3 col = mix(navy, cyan, glow * 0.65);

  float alpha = glow * uIntensity;
  gl_FragColor = vec4(col * alpha, alpha); /* premultiplied */
}
`;

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

export default function AuroraVeil() {
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
    if (!gl) return; // no WebGL → plain navy background, still fine

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

    gl.uniform1f(uIntensity, mobile ? 0.1 : 0.16);
    gl.uniform1f(uDetail, mobile ? 1 : 2);

    const resize = () => {
      canvas.width = canvas.clientWidth; // DPR 1 on purpose — soft veil
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
      draw(30); // static gradient
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
