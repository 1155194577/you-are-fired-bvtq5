import { useState } from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { FlowDiagram, type FlowEdge, type FlowNode } from "@/components/FlowDiagram"
import { useAppState, useT } from "@/lib/app-state"
import { costTotal, DEFAULT_PROFILE, HABIT_MONTHLY, hk, monthlyMpf, monthlyTax, planCosts } from "@/lib/fire"

export const Route = createFileRoute("/flow")({
  component: FlowPage,
})

const first = (v: number | readonly number[]) => (typeof v === "number" ? v : v[0])

function FlowPage() {
  const t = useT()
  const { profile } = useAppState()
  const p = profile ?? DEFAULT_PROFILE
  const [rate, setRate] = useState(0.3)
  const [habit, setHabit] = useState(false)

  // Monthly flows, HK$. Same maths as the simulator (fire.ts).
  const mpf = monthlyMpf(p.salary) // employee share; employer matches it
  const tax = monthlyTax(p.salary)
  // Only your 5% comes out of your pay. The employer's matching 5% goes into
  // your MPF on top, so it is not part of money in.
  const mpfTotal = mpf
  const money = p.salary + p.hustle // what you earn each month
  const income = p.salary - mpf - tax + p.hustle // spendable after tax and MPF
  const living = Math.min(costTotal(planCosts(p.plan, p.costs)), income)
  const core = Math.max(0, (income - living) * rate)
  const invested = Math.max(0, core - (habit ? HABIT_MONTHLY : 0))
  const habitUsed = habit ? core - invested : 0
  const other = Math.max(0, income - living - habitUsed - invested)

  // Take-home is what is left after tax, MPF and investing. Living costs,
  // bubble tea and other spending all come out of it.
  const takeHome = living + habitUsed + other

  const nodes: FlowNode[] = [
    { id: "in", label: t("Money in", "總進賬"), value: hk(money), row: 0, x: 190, tone: "stroke-foreground" },
    { id: "tax", label: t("Tax", "稅"), value: hk(tax), row: 1, x: 40, tone: "stroke-destructive" },
    { id: "mpf", label: t("MPF", "強積金"), value: hk(mpfTotal), row: 1, x: 120, tone: "stroke-muted-foreground" },
    { id: "invested", label: t("Invested", "投資"), value: hk(invested), row: 1, x: 200, tone: "stroke-primary" },
    { id: "takehome", label: t("Take home", "可用收入"), value: hk(takeHome), row: 1, x: 310, tone: "stroke-foreground" },
    { id: "living", label: t("Living", "生活費"), value: hk(living), row: 2, x: 196, tone: "stroke-accent-foreground" },
    { id: "habit", label: t("Bubble tea", "飲品"), value: hk(habitUsed), row: 2, x: 270, tone: "stroke-destructive" },
    { id: "other", label: t("Other", "其他"), value: hk(other), row: 2, x: 344, tone: "stroke-muted-foreground" },
  ]
  const edges: FlowEdge[] = [
    { from: "in", to: "tax" },
    { from: "in", to: "mpf" },
    { from: "in", to: "invested" },
    { from: "in", to: "takehome" },
    { from: "takehome", to: "living" },
    { from: "takehome", to: "habit" },
    { from: "takehome", to: "other" },
  ]

  const pct = (v: number) => (money > 0 ? Math.round((v / money) * 100) : 0)
  const legend = [
    { label: t("Tax", "稅"), value: tax, dot: "bg-destructive", note: t("Salaries tax, estimated", "薪俸稅（估算）") },
    { label: t("MPF, locked to 65", "強積金，鎖到65歲"), value: mpfTotal, dot: "bg-muted-foreground", note: t("Your 5% (employer adds as much again)", "你供5%（僱主再加等額）") },
    { label: t("Living costs", "生活費"), value: living, dot: "bg-accent-foreground", note: t("Rent, food, transport", "租金、食物、交通") },
    { label: t("Bubble tea / coffee", "飲品習慣"), value: habitUsed, dot: "bg-destructive", note: t("Only if switched on", "只計開咗嗰陣") },
    { label: t("Invested", "儲落投資"), value: invested, dot: "bg-primary", note: t("Builds your freedom money", "積落自由基金") },
    { label: t("Other spending", "其他消費"), value: other, dot: "bg-muted-foreground", note: t("Everything else you spend", "其餘消費") },
  ]

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-5 pb-6 pt-4">
      <header className="flex flex-col gap-1 text-center">
        <h1 className="font-heading text-2xl font-bold">{t("Where your money goes", "你嘅錢去咗邊")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("Every month, from money in to each bucket.", "每個月，由進賬流到每個戶口。")}
        </p>
      </header>

      <Card className="flex flex-col gap-4 p-4">
        <FlowDiagram nodes={nodes} edges={edges} label={t("Monthly money flow diagram", "每月資金流向圖")} />
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("Money in each month", "每月總進賬")}</span>
          <span className="font-semibold">{hk(money)}</span>
        </div>
      </Card>

      <section className="flex flex-col gap-3">
        {legend.map((l) => (
          <div key={l.label} className="flex items-center gap-3">
            <span className={`size-3 shrink-0 rounded-full ${l.dot}`} aria-hidden="true" />
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-semibold">{l.label}</span>
              <span className="text-xs text-muted-foreground">{l.note}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold">{hk(l.value)}</div>
              <div className="text-xs text-muted-foreground">{pct(l.value)}%</div>
            </div>
          </div>
        ))}
      </section>

      <Card className="flex flex-col gap-5 p-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm font-semibold">
            <span>{t("Savings rate", "儲蓄率")}</span>
            <span className="text-primary">{Math.round(rate * 100)}%</span>
          </div>
          <Slider
            value={[Math.round(rate * 100)]}
            min={0}
            max={100}
            step={1}
            onValueChange={(v) => setRate(first(v) / 100)}
            aria-label={t("Savings rate", "儲蓄率")}
          />
        </div>
        <label className="flex items-center justify-between gap-3 text-sm font-semibold">
          {t("Bubble tea / coffee habit (HK$35 a day)", "飲品習慣（每日 HK$35）")}
          <Switch checked={habit} onCheckedChange={setHabit} />
        </label>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        {t("Income, living plan and side-hustle come from ", "收入、住屋計劃同副業收入嚟自 ")}
        <Link to="/profile" className="font-semibold text-primary underline-offset-4 hover:underline">
          {t("your profile", "你嘅資料")}
        </Link>
        {t(".", "。")}
      </p>
      <Link to="/simulator" className="text-center text-sm font-semibold text-primary underline-offset-4 hover:underline">
        {t("Back to freedom date", "返回自由日子")}
      </Link>
    </main>
  )
}
