/** Decorative bottom band — vines + pumpkins. Swap art via this component. */

function Pumpkin({
  cx,
  cy,
  rx,
  ry,
  rotate = 0,
}: {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rotate?: number;
}) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate})`}>
      <ellipse cx={-rx * 0.35} cy={0} rx={rx * 0.55} ry={ry} fill="#c47a3a" />
      <ellipse cx={0} cy={0} rx={rx * 0.62} ry={ry * 1.05} fill="#d4893f" />
      <ellipse cx={rx * 0.35} cy={0} rx={rx * 0.55} ry={ry} fill="#b86e3a" />
      <ellipse cx={0} cy={-ry * 0.15} rx={rx * 0.2} ry={ry * 0.35} fill="#e0a05a" opacity={0.35} />
      <path
        d={`M0 ${-ry * 0.95} C ${rx * 0.15} ${-ry * 1.35}, ${rx * 0.05} ${-ry * 1.55}, 0 ${-ry * 1.45} C ${-rx * 0.1} ${-ry * 1.55}, ${-rx * 0.12} ${-ry * 1.25}, 0 ${-ry * 0.95}Z`}
        fill="#3f4f3a"
      />
      <path
        d={`M0 ${-ry * 0.9} C ${rx * 0.4} ${-ry * 1.1}, ${rx * 0.7} ${-ry * 0.7}, ${rx * 0.55} ${-ry * 0.35}`}
        fill="none"
        stroke="#4a5d3f"
        strokeWidth={2.2}
        strokeLinecap="round"
      />
    </g>
  );
}

export function PumpkinPatch() {
  return (
    <div
      aria-hidden
      className="pumpkin-patch pointer-events-none fixed inset-x-0 bottom-0 z-30"
    >
      <svg
        viewBox="0 0 1440 220"
        className="block h-auto w-full"
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          <linearGradient id="patch-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e7e2d6" stopOpacity="0" />
            <stop offset="45%" stopColor="#d9d2c2" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#cfc6b4" stopOpacity="0.75" />
          </linearGradient>
        </defs>

        <rect x="0" y="120" width="1440" height="100" fill="url(#patch-fade)" />

        {/* Ground vine sprawl */}
        <g className="vine-sway vine-sway-a" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M-20 198 C 80 170, 160 210, 260 185 S 420 155, 520 190 S 700 220, 820 175 S 1040 140, 1180 185 S 1360 210, 1480 170"
            stroke="#3f4f3a"
            strokeWidth="3.5"
            opacity="0.85"
          />
          <path
            d="M40 210 C 140 185, 220 205, 320 195 S 480 175, 600 200 S 780 215, 900 188 S 1100 165, 1260 195 S 1400 205, 1500 180"
            stroke="#5c6b4a"
            strokeWidth="2.4"
            opacity="0.7"
          />
          <path
            d="M120 205 C 200 160, 280 195, 360 170 S 500 145, 580 175"
            stroke="#4a5d3f"
            strokeWidth="2"
            opacity="0.65"
          />
          <path
            d="M980 200 C 1080 155, 1160 190, 1240 165 S 1380 140, 1460 175"
            stroke="#4a5d3f"
            strokeWidth="2"
            opacity="0.65"
          />
        </g>

        {/* Tendrils curling up */}
        <g className="vine-sway vine-sway-b" fill="none" stroke="#3f4f3a" strokeWidth="1.8" strokeLinecap="round">
          <path d="M180 190 C 170 150, 200 130, 210 150 C 220 170, 190 175, 195 155" opacity="0.75" />
          <path d="M470 195 C 455 155, 490 125, 505 145 C 520 168, 480 172, 488 150" opacity="0.7" />
          <path d="M760 188 C 745 148, 780 120, 798 142 C 815 165, 770 170, 778 148" opacity="0.75" />
          <path d="M1100 192 C 1085 150, 1125 122, 1140 145 C 1155 168, 1110 172, 1118 150" opacity="0.7" />
          <path d="M1320 195 C 1305 155, 1345 128, 1360 150 C 1375 172, 1330 176, 1338 154" opacity="0.75" />
        </g>

        {/* Leaf clusters on vines */}
        <g className="vine-sway vine-sway-a" fill="#3f4f3a" opacity="0.8">
          <ellipse cx="210" cy="155" rx="14" ry="8" transform="rotate(-35 210 155)" />
          <ellipse cx="505" cy="148" rx="12" ry="7" transform="rotate(25 505 148)" />
          <ellipse cx="798" cy="145" rx="15" ry="8" transform="rotate(-20 798 145)" />
          <ellipse cx="1140" cy="148" rx="13" ry="7" transform="rotate(30 1140 148)" />
          <ellipse cx="1360" cy="152" rx="14" ry="8" transform="rotate(-28 1360 152)" />
          <ellipse cx="340" cy="178" rx="11" ry="6" transform="rotate(15 340 178)" fill="#4a5d3f" />
          <ellipse cx="920" cy="172" rx="12" ry="6" transform="rotate(-18 920 172)" fill="#4a5d3f" />
          <ellipse cx="620" cy="185" rx="10" ry="5" transform="rotate(40 620 185)" fill="#5c6b4a" />
        </g>

        {/* Pumpkins */}
        <g className="patch-pumpkins">
          <Pumpkin cx={95} cy={185} rx={38} ry={28} rotate={-6} />
          <Pumpkin cx={280} cy={198} rx={26} ry={19} rotate={8} />
          <Pumpkin cx={430} cy={190} rx={34} ry={25} rotate={-3} />
          <Pumpkin cx={640} cy={200} rx={22} ry={16} rotate={10} />
          <Pumpkin cx={850} cy={188} rx={40} ry={29} rotate={4} />
          <Pumpkin cx={1020} cy={198} rx={24} ry={18} rotate={-8} />
          <Pumpkin cx={1200} cy={186} rx={36} ry={26} rotate={5} />
          <Pumpkin cx={1365} cy={196} rx={28} ry={20} rotate={-4} />
        </g>

        {/* Small gourds / accents */}
        <g opacity="0.9">
          <ellipse cx="175" cy="205" rx="12" ry="9" fill="#9a5a28" transform="rotate(-20 175 205)" />
          <ellipse cx="560" cy={208} rx="10" ry="8" fill="#c47a3a" transform="rotate(15 560 208)" />
          <ellipse cx="960" cy={205} rx="11" ry="8" fill="#8a6a3a" transform="rotate(-12 960 205)" />
          <ellipse cx="1285" cy={208} rx="13" ry="9" fill="#b86e3a" transform="rotate(18 1285 208)" />
        </g>
      </svg>
    </div>
  );
}
