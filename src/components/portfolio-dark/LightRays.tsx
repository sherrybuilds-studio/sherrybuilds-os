"use client";

import { useEffect, useRef } from "react";

/**
 * Faint diagonal light-rays background — deep atmosphere layer behind
 * everything (the glass object stays the star). Raw WebGL, no libraries,
 * ~1kb of shader; recolored to the site's navy/cyan tokens.
 *
 * - LOW intensity by design (0.14 desktop / 0.09 mobile)
 * - DPR capped at 1 — the effect is soft, extra pixels buy nothing
 * - mobile: single noise octave (fewer/cheaper rays)
 * - prefers-reduced-motion: renders ONE static frame, no rAF loop
 * - tab hidden: rAF pauses automatically
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

  // rays flow diagonally from the upper-left
  vec2 origin = vec2(0.1, 1.4);
  vec2 dir = normalize(vec2(0.55, -1.0));
  float along = dot(p - origin, dir);
  float across = dot(p - origin, vec2(-dir.y, dir.x));

  float t = uTime * 0.045; // slow, calm

  float bands = noise(vec2(across * 3.5 + t * 1.6, along * 0.5 - t * 0.6)) * 0.65;
  if (uDetail > 1.5) {
    bands += noise(vec2(across * 8.0 - t * 1.1, along * 0.9 + t * 0.5)) * 0.35;
  }
  bands = pow(smoothstep(0.3, 0.95, bands), 2.4);

  // fade in from the source, dissolve toward the bottom of the page
  float fall = smoothstep(-0.15, 0.3, along) * smoothstep(1.5, 0.25, along);
  float glow = bands * fall;

  vec3 navy = vec3(0.07, 0.11, 0.22);
  vec3 cyan = vec3(0.133, 0.827, 0.933); /* --accent #22D3EE */
  vec3 col = mix(navy, cyan, glow * 0.75);

  float alpha = glow * uIntensity;
  gl_FragColor = vec4(col * alpha, alpha); /* premultiplied */
}
`;

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

export default function LightRays() {
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
    if (!gl) return; // no WebGL → AmbientGlow alone carries the atmosphere

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

    // fullscreen triangle
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); // premultiplied over the page

    const uTime = gl.getUniformLocation(prog, "uTime");
    const uRes = gl.getUniformLocation(prog, "uRes");
    const uIntensity = gl.getUniformLocation(prog, "uIntensity");
    const uDetail = gl.getUniformLocation(prog, "uDetail");

    gl.uniform1f(uIntensity, mobile ? 0.11 : 0.18);
    gl.uniform1f(uDetail, mobile ? 1 : 2);

    const resize = () => {
      // DPR 1 on purpose — soft glow, extra pixels are wasted work
      canvas.width = canvas.clientWidth;
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
      draw(20); // one static frame — frozen gradient
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
