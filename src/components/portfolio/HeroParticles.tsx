"use client";

/* eslint-disable react-hooks/refs --
   R3F shader uniforms are imperative by design: they live in refs and are
   mutated per-frame/per-gesture outside React's render cycle. */

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/* ── tuning ──────────────────────────────────────────────────────────── */
const WORLD = 4.1; // world-space size the image maps onto
const COUNT_DESKTOP = 26000;
const COUNT_MOBILE = 4500;
const NODE_MAX = 240; // constellation nodes
const LINK_DIST = 0.62; // max link length (world units)
const LINKS_PER_NODE = 2;

type Sampled = {
  home: Float32Array;
  color: Float32Array;
  rand: Float32Array;
  size: Float32Array;
  count: number;
};

/* Sample the hero image into particle home positions, keeping image color. */
function sampleImage(img: HTMLImageElement, count: number): Sampled {
  const S = 240;
  const cv = document.createElement("canvas");
  cv.width = cv.height = S;
  const ctx = cv.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, S, S);
  const data = ctx.getImageData(0, 0, S, S).data;

  const px: number[] = [];
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const i = (y * S + x) * 4;
      if (data[i + 3] > 60) px.push(i);
    }
  }
  if (px.length === 0) return proceduralBlob(count);

  const home = new Float32Array(count * 3);
  const color = new Float32Array(count * 3);
  const rand = new Float32Array(count);
  const size = new Float32Array(count);

  for (let n = 0; n < count; n++) {
    const i = px[(Math.random() * px.length) | 0];
    const x = (i / 4) % S;
    const y = ((i / 4) / S) | 0;
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    const a = data[i + 3] / 255;
    const lum = 0.3 * r + 0.6 * g + 0.1 * b;

    home[n * 3] = (x / S - 0.5) * WORLD + (Math.random() - 0.5) * 0.012;
    home[n * 3 + 1] = -(y / S - 0.5) * WORLD + (Math.random() - 0.5) * 0.012;
    home[n * 3 + 2] = (Math.random() - 0.5) * WORLD * 0.14 * (0.35 + lum);

    color[n * 3] = r;
    color[n * 3 + 1] = g;
    color[n * 3 + 2] = b;
    rand[n] = Math.random();
    size[n] = (0.7 + Math.random() * 1.5) * (0.5 + a * 0.6);
  }
  return { home, color, rand, size, count };
}

/* Fallback if the image is missing: procedural indigo-violet dissolving form. */
function proceduralBlob(count: number): Sampled {
  const palette = [
    [0.192, 0.18, 0.506], // #312e81
    [0.263, 0.22, 0.792], // #4338ca
    [0.31, 0.275, 0.898], // #4f46e5
    [0.427, 0.361, 0.91], // #6d5ce8
    [0.545, 0.486, 0.961], // #8b7cf5
  ];
  const home = new Float32Array(count * 3);
  const color = new Float32Array(count * 3);
  const rand = new Float32Array(count);
  const size = new Float32Array(count);
  const R = WORLD * 0.3;

  for (let n = 0; n < count; n++) {
    const tail = Math.random() < 0.16;
    const u = Math.random() * Math.PI * 2;
    const v = Math.acos(2 * Math.random() - 1);
    const wob =
      1 + 0.14 * Math.sin(u * 3) * Math.sin(v * 2) + 0.08 * Math.sin(u * 7);
    let x = Math.sin(v) * Math.cos(u) * R * wob;
    let y = Math.cos(v) * R * wob * 1.08;
    const z = Math.sin(v) * Math.sin(u) * R * 0.5;
    let fade = 1;
    if (tail) {
      const t = Math.pow(Math.random(), 1.5);
      x += (0.4 + t * 2.2) * R * 0.9 + (Math.random() - 0.5) * 0.5;
      y += (0.4 + t * 2.0) * R * 0.9 + (Math.random() - 0.5) * 0.5;
      fade = 1 - t * 0.7;
    }
    home[n * 3] = x;
    home[n * 3 + 1] = y;
    home[n * 3 + 2] = z;
    const c = palette[(Math.random() * palette.length) | 0];
    color[n * 3] = c[0];
    color[n * 3 + 1] = c[1];
    color[n * 3 + 2] = c[2];
    rand[n] = Math.random();
    size[n] = (0.7 + Math.random() * 1.5) * fade;
  }
  return { home, color, rand, size, count };
}

/* Shared displacement — identical for points and constellation lines. */
const DISPLACE_GLSL = /* glsl */ `
  uniform float uTime;
  uniform float uMotion;
  uniform float uSplash;
  uniform vec3 uSplashPos;
  uniform float uBurst;
  attribute float aRand;

  vec3 displace(vec3 home) {
    vec3 pos = home;
    // calm idle whisper
    vec3 drift = vec3(
      sin(uTime * 0.38 + home.y * 2.1 + aRand * 6.2831),
      sin(uTime * 0.31 + home.x * 1.7 + aRand * 4.1),
      sin(uTime * 0.24 + aRand * 9.3)
    ) * (0.012 + 0.03 * aRand);
    pos += drift * uMotion;

    // tap splash — radial push; JS tweens uSplash back with an elastic ease
    vec3 d = pos - uSplashPos;
    float dist = length(d);
    float force = uSplash * exp(-dist * dist * 1.1);
    pos += (d / max(dist, 0.0001)) * force * (0.45 + aRand * 0.9);

    // section-change burst — scatter outward, then reform
    vec3 dir = normalize(home + vec3(0.0001));
    pos += dir * uBurst * (1.1 + aRand * 1.6);
    pos.z += uBurst * (aRand - 0.5) * 1.4;
    return pos;
  }
`;

const POINT_VERT = /* glsl */ `
  ${DISPLACE_GLSL}
  uniform float uPixelRatio;
  uniform float uScale;
  attribute vec3 aColor;
  attribute float aSize;
  varying vec3 vColor;
  varying float vSoft;

  void main() {
    vec3 pos = displace(position);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uScale * uPixelRatio * (44.0 / -mv.z) * (1.0 - 0.5 * uBurst);
    vColor = aColor;
    vSoft = 0.7 + 0.3 * aRand;
  }
`;

const POINT_FRAG = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vSoft;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.14, d) * vSoft * uOpacity;
    if (alpha < 0.02) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

const LINE_VERT = /* glsl */ `
  ${DISPLACE_GLSL}
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displace(position), 1.0);
  }
`;

const LINE_FRAG = /* glsl */ `
  uniform float uBurstF;
  uniform float uLineOpacity;
  void main() {
    gl_FragColor = vec4(0.31, 0.275, 0.898, uLineOpacity * (1.0 - uBurstF));
  }
`;

type CloudProps = { data: Sampled; mobile: boolean; reduced: boolean };

function Cloud({ data, mobile, reduced }: CloudProps) {
  const { gl, invalidate } = useThree();
  const viewport = useThree((s) => s.viewport);
  const groupRef = useRef<THREE.Group>(null);

  // Fit the object to the canvas: contained on desktop, sparser + tucked
  // top-right behind the copy on mobile.
  const fit = Math.min(1, (viewport.width / WORLD) * (mobile ? 0.66 : 0.92));
  const groupPos: [number, number, number] = mobile
    ? [viewport.width * 0.14, viewport.height * 0.2, 0]
    : [0, -0.12, 0];

  // Uniforms live in a ref: they are mutated every frame by design.
  // mobile/reduced are stable by the time Cloud mounts (data loads after them).
  const uniformsRef = useRef<Record<string, { value: unknown }> | null>(null);
  if (uniformsRef.current === null) {
    uniformsRef.current = {
      uTime: { value: 0 },
      uMotion: { value: reduced ? 0 : 1 },
      uSplash: { value: 0 },
      uSplashPos: { value: new THREE.Vector3(99, 99, 99) },
      uBurst: { value: 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
      uScale: { value: mobile ? 0.6 : 1 },
      uOpacity: { value: mobile ? 0.5 : 0.92 },
    };
  }
  const uniforms = uniformsRef.current;

  const lineUniformsRef = useRef<Record<string, { value: unknown }> | null>(null);
  if (lineUniformsRef.current === null) {
    lineUniformsRef.current = {
      uTime: uniforms.uTime,
      uMotion: uniforms.uMotion,
      uSplash: uniforms.uSplash,
      uSplashPos: uniforms.uSplashPos,
      uBurst: uniforms.uBurst,
      uBurstF: uniforms.uBurst,
      uLineOpacity: { value: 0.15 },
    };
  }
  const lineUniforms = lineUniformsRef.current;

  const pointGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(data.home, 3));
    g.setAttribute("aColor", new THREE.BufferAttribute(data.color, 3));
    g.setAttribute("aRand", new THREE.BufferAttribute(data.rand, 1));
    g.setAttribute("aSize", new THREE.BufferAttribute(data.size, 1));
    return g;
  }, [data]);

  /* Sparse constellation: ≤2 links per node, short, faint — never a mesh. */
  const lineGeo = useMemo(() => {
    const stride = Math.max(1, Math.floor(data.count / NODE_MAX));
    const nodes: number[] = [];
    for (let i = 0; i < data.count && nodes.length < NODE_MAX; i += stride) nodes.push(i);

    const verts: number[] = [];
    const rands: number[] = [];
    const linked = new Map<number, number>();
    for (const i of nodes) {
      const near: { j: number; d: number }[] = [];
      for (const j of nodes) {
        if (j === i) continue;
        const dx = data.home[i * 3] - data.home[j * 3];
        const dy = data.home[i * 3 + 1] - data.home[j * 3 + 1];
        const dz = data.home[i * 3 + 2] - data.home[j * 3 + 2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < LINK_DIST) near.push({ j, d });
      }
      near.sort((a, b) => a.d - b.d);
      let links = linked.get(i) ?? 0;
      for (const { j } of near) {
        if (links >= LINKS_PER_NODE) break;
        if ((linked.get(j) ?? 0) >= LINKS_PER_NODE) continue;
        if (j < i) continue; // dedupe pairs
        verts.push(
          data.home[i * 3], data.home[i * 3 + 1], data.home[i * 3 + 2],
          data.home[j * 3], data.home[j * 3 + 1], data.home[j * 3 + 2]
        );
        rands.push(data.rand[i], data.rand[j]);
        links++;
        linked.set(j, (linked.get(j) ?? 0) + 1);
      }
      linked.set(i, links);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(verts), 3));
    g.setAttribute("aRand", new THREE.BufferAttribute(new Float32Array(rands), 1));
    return g;
  }, [data]);

  useFrame((state) => {
    if (!reduced) uniformsRef.current!.uTime.value = state.clock.elapsedTime;
  });

  /* Tap/click → radial splash, elastic spring back home. */
  const splash = (point: THREE.Vector3) => {
    if (reduced) return;
    const local = groupRef.current
      ? groupRef.current.worldToLocal(point.clone())
      : point;
    (uniforms.uSplashPos.value as THREE.Vector3).copy(local);
    gsap.killTweensOf(uniforms.uSplash);
    gsap.fromTo(
      uniforms.uSplash,
      { value: 1.55 },
      { value: 0, duration: 1.7, ease: "elastic.out(1, 0.32)" }
    );
  };

  /* Section change → burst, then reform. */
  useEffect(() => {
    if (reduced) {
      invalidate();
      return;
    }
    const burst = () => {
      gsap.killTweensOf(uniforms.uBurst);
      gsap
        .timeline()
        .to(uniforms.uBurst, { value: 1, duration: 0.5, ease: "power2.in" })
        .to(uniforms.uBurst, { value: 0, duration: 1.5, ease: "pf" });
    };
    const st = ScrollTrigger.create({
      trigger: "#hero",
      start: "bottom 60%",
      onEnter: burst,
      onEnterBack: burst,
    });
    return () => st.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return (
    <group ref={groupRef} scale={fit} position={groupPos}>
      <points geometry={pointGeo} frustumCulled={false}>
        <shaderMaterial
          vertexShader={POINT_VERT}
          fragmentShader={POINT_FRAG}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </points>
      <lineSegments geometry={lineGeo} frustumCulled={false}>
        <shaderMaterial
          vertexShader={LINE_VERT}
          fragmentShader={LINE_FRAG}
          uniforms={lineUniforms}
          transparent
          depthWrite={false}
        />
      </lineSegments>
      {/* invisible hit plane for taps */}
      <mesh visible={false} onPointerDown={(e) => splash(e.point)}>
        <planeGeometry args={[WORLD * 3, WORLD * 3]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}

export default function HeroParticles() {
  // ssr:false — first render happens on the client, so lazy init is safe.
  const [data, setData] = useState<Sampled | null>(null);
  const [mobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
  );
  const [reduced] = useState(prefersReducedMotion);

  useEffect(() => {
    const count = mobile ? COUNT_MOBILE : COUNT_DESKTOP;
    const img = new Image();
    img.onload = () => setData(sampleImage(img, count));
    img.onerror = () => setData(proceduralBlob(count));
    img.src = "/hero-object.webp";
  }, [mobile]);

  if (!data) return null;

  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={reduced ? "demand" : "always"}
      camera={{ position: [0, 0, 5.6], fov: 42 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Cloud data={data} mobile={mobile} reduced={reduced} />
    </Canvas>
  );
}
