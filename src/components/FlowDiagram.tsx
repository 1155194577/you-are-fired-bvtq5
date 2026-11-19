// A node-and-edge graph: rectangular boxes are nodes (money pools and buckets),
// arrows are edges (where the money goes). Each node sits at an explicit x
// position in the SVG; rows read top to bottom.

export type FlowNode = { id: string; label: string; value: string; row: number; x: number; tone: string }
export type FlowEdge = { from: string; to: string }

const W = 380
const ROW_H = 96
const BOX_H = 56
const TOP = 6
const SMALL_W = 72
const ROOT_W = 130

export function FlowDiagram({ nodes, edges, label }: { nodes: FlowNode[]; edges: FlowEdge[]; label: string }) {
  const rows = Math.max(...nodes.map((n) => n.row)) + 1
  const box = new Map<string, { cx: number; y: number; w: number }>()
  for (const n of nodes) {
    box.set(n.id, { cx: n.x, y: TOP + n.row * ROW_H, w: n.row === 0 ? ROOT_W : SMALL_W })
  }

  const H = TOP + (rows - 1) * ROW_H + BOX_H + 6

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-auto w-full">
      <defs>
        <marker id="flow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" className="fill-muted-foreground" />
        </marker>
      </defs>

      {edges.map((e) => {
        const a = box.get(e.from)
        const b = box.get(e.to)
        if (!a || !b) return null
        return (
          <line
            key={`${e.from}-${e.to}`}
            x1={a.cx}
            y1={a.y + BOX_H}
            x2={b.cx}
            y2={b.y - 2}
            className="stroke-muted-foreground"
            strokeWidth={1.5}
            markerEnd="url(#flow-arrow)"
          />
        )
      })}

      {nodes.map((n) => {
        const p = box.get(n.id)!
        return (
          <g key={n.id}>
            <rect x={p.cx - p.w / 2} y={p.y} width={p.w} height={BOX_H} rx={8} className={`fill-card stroke-2 ${n.tone}`} />
            <text x={p.cx} y={p.y + 22} textAnchor="middle" className="fill-muted-foreground text-[11px]">
              {n.label}
            </text>
            <text x={p.cx} y={p.y + 41} textAnchor="middle" className="fill-foreground text-[12px] font-semibold">
              {n.value}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
