"use client";

import { useEffect, useRef, type CSSProperties } from "react";

const COLORS = [
  "#c47a3a",
  "#9a5a28",
  "#6b4f2a",
  "#b86e3a",
  "#3f4f3a",
  "#8a6a3a",
  "#5c5348",
  "#d4893f",
  "#4a5d3f",
];

type LeafSpec = {
  left: string;
  size: string;
  dur: string;
  delay: string;
  x: string;
  rot: string;
  color: string;
  catch: number;
};

function buildLeaves(count: number): LeafSpec[] {
  const leaves: LeafSpec[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const size = 9 + ((i * 17) % 14);
    const dur = 9 + ((i * 13) % 10);
    const delay = (i * 0.47) % 7;
    const drift = ((i * 37) % 140) - 70;
    const rot = ((i * 53) % 360) - 180;
    const catchFactor = 0.7 + (size < 14 ? 0.5 : 0.15) + (i % 3) * 0.08;

    leaves.push({
      left: `${4 + t * 92 + ((i % 5) - 2) * 1.2}%`,
      size: `${size}px`,
      dur: `${dur}s`,
      delay: `${delay}s`,
      x: `${drift}px`,
      rot: `${rot > 0 ? "" : "-"}${Math.abs(rot) + 180}deg`,
      color: COLORS[i % COLORS.length],
      catch: catchFactor,
    });
  }
  return leaves;
}

const LEAVES = buildLeaves(26);

/** Must be this close (px) when the cursor passes a leaf to wake it. */
const INFLUENCE_RADIUS = 160;
/** Instant horizontal cursor effect after a pass (travel direction). */
const PASS_KICK = 10;
/**
 * How much of last frame's displacement carries into this frame.
 * Higher = longer glide; asymptotes to 0 — no spring back to rest.
 */
const MOMENTUM_CARRY = 0.92;
const OFFSET_MAX = 80;

type LeafMotion = {
  /** Current X offset from the leaf's rest path. */
  ox: number;
  /** Snapshot of ox from the previous frame (for momentum). */
  prevOx: number;
  /** Carried inertia: added every frame alongside cursorEffect. */
  momentum: number;
};

type LeafEls = {
  wind: HTMLSpanElement | null;
  body: HTMLSpanElement | null;
};

export function FallingLeaves() {
  const els = useRef<LeafEls[]>(LEAVES.map(() => ({ wind: null, body: null })));
  const motions = useRef<LeafMotion[]>(
    LEAVES.map(() => ({ ox: 0, prevOx: 0, momentum: 0 })),
  );

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let pointerX = -9999;
    let pointerY = -9999;
    let raf = 0;
    // -1 = cursor left of leaf, +1 = right, 0 = unknown / too far
    const sideOfLeaf = new Array<number>(LEAVES.length).fill(0);

    const onMove = (e: PointerEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
    };

    const tick = () => {
      for (let i = 0; i < LEAVES.length; i++) {
        const pair = els.current[i];
        const m = motions.current[i];
        if (!pair?.wind || !pair.body || !m) continue;

        const rect = pair.body.getBoundingClientRect();

        // --- cursorEffect this frame (0 unless we just passed the leaf) ---
        let cursorEffect = 0;

        if (rect.bottom < -40 || rect.top > window.innerHeight + 40) {
          sideOfLeaf[i] = 0;
        } else {
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dist = Math.hypot(cx - pointerX, cy - pointerY);
          const side = pointerX === cx ? 0 : pointerX > cx ? 1 : -1;

          // Approach: no force. Kick only after the cursor crosses leaf X.
          if (
            dist < INFLUENCE_RADIUS &&
            side !== 0 &&
            sideOfLeaf[i] !== 0 &&
            side !== sideOfLeaf[i]
          ) {
            const near = 1 - dist / INFLUENCE_RADIUS;
            cursorEffect = side * PASS_KICK * near * LEAVES[i].catch;
          }

          sideOfLeaf[i] = dist < INFLUENCE_RADIUS * 1.4 ? side : 0;
        }

        // Snapshot → integrate cursor + momentum → refresh momentum from delta
        //   ox'       = ox + cursorEffect + momentum
        //   momentum' = (ox' - ox) * MOMENTUM_CARRY   // → 0 asymptotically
        // No return-to-rest: when momentum dies, the leaf stays at ox'.
        const oxSnapshot = m.ox;
        m.prevOx = oxSnapshot;

        m.ox = oxSnapshot + cursorEffect + m.momentum;
        m.momentum = (m.ox - oxSnapshot) * MOMENTUM_CARRY;
        m.ox = Math.max(-OFFSET_MAX, Math.min(OFFSET_MAX, m.ox));

        if (Math.abs(m.momentum) < 0.01) m.momentum = 0;

        pair.wind.style.transform = `translate3d(${m.ox}px, 0, 0)`;
      }

      raf = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
    >
      {LEAVES.map((leaf, i) => (
        <span
          key={i}
          ref={(el) => {
            els.current[i].wind = el;
          }}
          className="leaf-wind"
          style={
            {
              "--leaf-left": leaf.left,
              "--leaf-size": leaf.size,
            } as CSSProperties
          }
        >
          <span
            ref={(el) => {
              els.current[i].body = el;
            }}
            className="leaf"
            style={
              {
                "--leaf-dur": leaf.dur,
                "--leaf-delay": leaf.delay,
                "--leaf-x": leaf.x,
                "--leaf-rot": leaf.rot,
                "--leaf-color": leaf.color,
              } as CSSProperties
            }
          >
            <svg viewBox="0 0 24 28" fill="currentColor" className="h-full w-full">
              <path d="M12 1C12 1 3 8 3 16c0 5 3.5 9 9 11 5.5-2 9-6 9-11C21 8 12 1 12 1zm0 4.2c2.2 2.1 5.8 6.2 5.8 10.6 0 2.8-1.5 5.2-5.8 7.1-4.3-1.9-5.8-4.3-5.8-7.1C6.2 11.4 9.8 7.3 12 5.2z" />
            </svg>
          </span>
        </span>
      ))}
    </div>
  );
}
