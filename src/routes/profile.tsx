import { useEffect, useState } from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Home, Users, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { setAppState, useAppState, useT } from "@/lib/app-state"
import { DEFAULT_PROFILE, planCosts, costTotal, type Costs, type CostOverrides, type Plan, hk } from "@/lib/fire"

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
})

const SALARIES = [16000, 18000, 20000]
const HUSTLES = [0, 2000, 5000]

// Number input that keeps what the student is typing. A plain controlled
// number input turns an empty field into 0, so typing "2000" became "02000".
function MoneyInput({
  value,
  onCommit,
  step,
  label,
}: {
  value: number
  onCommit: (n: number) => void
  step: number
  label: string
}) {
  const [text, setText] = useState(String(value))
  const [focused, setFocused] = useState(false)
  useEffect(() => {
    if (!focused) setText(String(value))
  }, [value, focused])

  return (
    <Input
      type="number"
      inputMode="numeric"
      min={0}
      step={step}
      value={text}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false)
        const n = Math.max(0, Number(text) || 0)
        setText(String(n))
        onCommit(n)
      }}
      onChange={(e) => {
        setText(e.target.value)
        if (e.target.value !== "" && !Number.isNaN(Number(e.target.value))) {
          onCommit(Math.max(0, Number(e.target.value)))
        }
      }}
      className="h-9 w-32 text-right text-foreground"
      aria-label={label}
    />
  )
}

function ProfilePage() {
  const navigate = useNavigate()
  const t = useT()
  const { profile } = useAppState()
  const start = profile ?? DEFAULT_PROFILE
  const [salary, setSalary] = useState(start.salary)
  const [plan, setPlan] = useState<Plan>(start.plan)
  const [hustle, setHustle] = useState(start.hustle)
  const [costs, setCosts] = useState<CostOverrides>(start.costs ?? {})
  const current = planCosts(plan, costs)
  const setField = (field: keyof Costs, value: number) =>
    setCosts({ ...costs, [plan]: { ...current, [field]: Math.max(0, value) } })

  const planCards: { id: Plan; label: string; icon: typeof Home }[] = [
    { id: "parents", label: t("With parents", "同父母住"), icon: Home },
    { id: "flat", label: t("Flat-share", "合租"), icon: Users },
    { id: "solo", label: t("Solo studio", "獨居細單位"), icon: Building2 },
  ]

  const chip = (on: boolean) =>
    `rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors ${
      on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-accent"
    }`

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-8 px-5 pb-6 pt-4">
      {/* INCOME */}
      <section className="flex flex-col gap-6">
        <h1 className="font-heading text-2xl font-bold">{t("Income", "收入")}</h1>

        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-muted-foreground">{t("Expected first salary (per month)", "預計起薪（每月）")}</h2>
          <div className="flex flex-wrap gap-2">
            {SALARIES.map((s) => (
              <button key={s} className={chip(salary === s)} onClick={() => setSalary(s)}>
                {hk(s)}
              </button>
            ))}
          </div>
          <label className="flex items-center justify-between gap-3 text-sm">
            {t("Or type your own", "或者自己輸入")}
            <MoneyInput value={salary} onCommit={setSalary} step={500} label={t("Monthly salary", "每月薪金")} />
          </label>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-muted-foreground">{t("Side-hustle income (per month)", "副業收入（每月）")}</h2>
          <div className="flex flex-wrap gap-2">
            {HUSTLES.map((h) => (
              <button key={h} className={chip(hustle === h)} onClick={() => setHustle(h)}>
                {h === 0 ? "HK$0" : hk(h)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* EXPENSE */}
      <section className="flex flex-col gap-6">
        <h1 className="font-heading text-2xl font-bold">{t("Expense", "支出")}</h1>

        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-muted-foreground">{t("Living plan", "住屋計劃")}</h2>
          <div className="flex flex-col gap-2">
            {planCards.map((c) => {
              const Icon = c.icon
              const on = plan === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => setPlan(c.id)}
                  className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors ${
                    on ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-accent"
                  }`}
                >
                  <Icon className="size-6 text-primary" />
                  <span className="font-semibold">{c.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground">{t("Living costs (per month)", "生活成本（每月）")}</h2>
            {costs[plan] && (
              <button
                className="text-xs font-semibold text-primary underline-offset-4 hover:underline"
                onClick={() => setCosts(Object.fromEntries(Object.entries(costs).filter(([k]) => k !== plan)))}
              >
                {t("Reset to default", "還原預設")}
              </button>
            )}
          </div>
          {(
            [
              ["rent", t("Rent or home contribution", "租金或家用")],
              ["food", t("Food", "食物")],
              ["transport", t("Transport", "交通")],
            ] as const
          ).map(([field, label]) => (
            <label key={field} className="flex items-center justify-between gap-3 text-sm">
              <span>{label}</span>
              <MoneyInput value={current[field]} onCommit={(n) => setField(field, n)} step={100} label={label} />
            </label>
          ))}
          <p className="flex justify-between border-t border-border pt-2 font-semibold">
            <span>{t("Total", "總計")}</span>
            <span>{hk(costTotal(current))}</span>
          </p>
        </div>
      </section>

      <Button
        size="lg"
        className="h-14 w-full rounded-2xl text-base"
        onClick={() => {
          setAppState({ profile: { salary, plan, hustle, costs } })
          navigate({ to: "/simulator" })
        }}
      >
        {t("Show my freedom date", "顯示我嘅自由日子")}
      </Button>
    </main>
  )
}
