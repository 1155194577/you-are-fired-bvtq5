import { START_AGE, MAX_AGE, MPF_AGE } from "@/lib/fire"
import { useT } from "@/lib/app-state"

type Point = { age: number; accessible: number; locked: number }

// One chart: accessible net worth to the freedom date, MPF locked bucket dashed.
export function NetWorthChart({ points, target, freedom }: { points: Point[]; target: number; freedom: number | null }) {
  const t = useT()
  const W = 320
  const H = 170
  const PAD_L = 8
  const PAD_B = 22
  const top = 10
  const maxY = Math.max(target * 1.1, 1)
  const x = (age: number) => PAD_L + ((age - START_AGE) / (MAX_AGE - START_AGE)) * (W - PAD_L - 8)
  const y = (v: number) => H - PAD_B - (Math.min(v, maxY) / maxY) * (H - PAD_B - top)
  const accLine = points.map((p) => `${x(p.age)},${y(p.accessible)}`).join(" ")
  const lockLine = points.map((p) => `${x(p.age)},${y(p.locked)}`).join(" ")
  const ticks = [START_AGE, 40, 60, MAX_AGE]

  return (
    <div className="flex flex-col gap-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={t("Net worth chart to your freedom date", "由而家到自由日子嘅資產圖")}>
        <line x1={PAD_L} x2={W - 8} y1={y(target)} y2={y(target)} className="stroke-muted-foreground" strokeDasharray="4 4" strokeWidth={1.5} />
        <text x={PAD_L} y={y(target) - 4} textAnchor="start" className="fill-muted-foreground" fontSize={10}>
          {t("Freedom target", "自由目標")}
        </text>
        <polyline points={lockLine} fill="none" className="stroke-secondary-foreground/50" strokeWidth={2} strokeDasharray="2 3" />
        <polyline points={accLine} fill="none" className="stroke-primary" strokeWidth={3} strokeLinejoin="round" />
        {freedom !== null && (
          <g>
            <line x1={x(freedom)} x2={x(freedom)} y1={top} y2={H - PAD_B} className="stroke-primary/40" strokeWidth={1.5} />
            <circle cx={x(freedom)} cy={y(target)} r={5} className="fill-primary" />
          </g>
        )}
        <line x1={x(MPF_AGE)} x2={x(MPF_AGE)} y1={top} y2={H - PAD_B} className="stroke-border" strokeDasharray="2 2" />
        <text x={x(MPF_AGE) - 4} y={H - PAD_B - 6} textAnchor="end" className="fill-muted-foreground" fontSize={9}>
          {t("MPF unlocks 65", "65歲強積金解鎖")}
        </text>
        {ticks.map((a) => (
          <text key={a} x={x(a)} y={H - 6} textAnchor={a === START_AGE ? "start" : a === MAX_AGE ? "end" : "middle"} className="fill-muted-foreground" fontSize={10}>
            {a}
          </text>
        ))}
      </svg>
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-5 bg-primary" /> {t("Accessible money", "可動用資產")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-5 border-t-2 border-dotted border-muted-foreground" /> {t("MPF (locked to 65)", "強積金（鎖到65歲）")}
        </span>
      </div>
    </div>
  )
}
