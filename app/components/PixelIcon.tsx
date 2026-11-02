import { PALETTE, SPRITES } from "@/lib/sprites";

export default function PixelIcon({ name, size = 3, className = "" }: { name: string; size?: number; className?: string }) {
  const rows = SPRITES[name];
  if (!rows) return null;
  const w = Math.max(...rows.map((r) => r.length));
  return (
    <svg
      className={`shrink-0 ${className}`}
      width={w * size}
      height={rows.length * size}
      viewBox={`0 0 ${w} ${rows.length}`}
      shapeRendering="crispEdges"
      aria-hidden
    >
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) =>
          PALETTE[ch] ? <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={PALETTE[ch]} /> : null,
        ),
      )}
    </svg>
  );
}
