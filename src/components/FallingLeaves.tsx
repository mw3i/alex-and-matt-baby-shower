import type { CSSProperties } from "react";

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

const FLUTTER = ["leaf-flutter-a", "leaf-flutter-b", "leaf-flutter-c"] as const;

type LeafSpec = {
  left: string;
  size: string;
  dur: string;
  delay: string;
  sway: number;
  color: string;
  flutter: (typeof FLUTTER)[number];
};

function buildLeaves(count: number): LeafSpec[] {
  const leaves: LeafSpec[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const size = 9 + ((i * 17) % 14);
    // Slightly longer so the zigzags read clearly
    const dur = 11 + ((i * 13) % 9);
    const delay = (i * 0.47) % 7;
    // Side sway (~20% less than prior wide pass)
    const sway = Math.round((70 + ((i * 23) % 50)) * 0.8);

    leaves.push({
      left: `${4 + t * 92 + ((i % 5) - 2) * 1.2}%`,
      size: `${size}px`,
      dur: `${dur}s`,
      delay: `${delay}s`,
      sway,
      color: COLORS[i % COLORS.length],
      flutter: FLUTTER[i % FLUTTER.length],
    });
  }
  return leaves;
}

const LEAVES = buildLeaves(40);

export function FallingLeaves() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden"
    >
      {LEAVES.map((leaf, i) => (
        <span
          key={i}
          className={`leaf ${leaf.flutter}`}
          style={
            {
              left: leaf.left,
              "--leaf-size": leaf.size,
              "--leaf-dur": leaf.dur,
              "--leaf-delay": leaf.delay,
              "--leaf-sway": leaf.sway,
              "--leaf-color": leaf.color,
            } as CSSProperties
          }
        >
          <svg viewBox="0 0 24 28" fill="currentColor" className="h-full w-full">
            <path d="M12 1C12 1 3 8 3 16c0 5 3.5 9 9 11 5.5-2 9-6 9-11C21 8 12 1 12 1zm0 4.2c2.2 2.1 5.8 6.2 5.8 10.6 0 2.8-1.5 5.2-5.8 7.1-4.3-1.9-5.8-4.3-5.8-7.1C6.2 11.4 9.8 7.3 12 5.2z" />
          </svg>
        </span>
      ))}
    </div>
  );
}
