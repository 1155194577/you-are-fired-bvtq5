import { useState } from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Home, Users, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { setAppState, useAppState, useT } from "@/lib/app-state"
import { DEFAULT_PROFILE, PLANS, type Plan, hk } from "@/lib/fire"

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
})

const SALARIES = [16000, 18000, 20000]
const HUSTLES = [0, 2000, 5000]

function ProfilePage() {
  const navigate = useNavigate()
  const t = useT()
  const { profile } = useAppState()
  const start = profile ?? DEFAULT_PROFILE
  const [salary, setSalary] = useState(start.salary)
  const [plan, setPlan] = useState<Plan>(start.plan)
  const [hustle, setHustle] = useState(start.hustle)

  const planCards: { id: Plan; label: string; sub: string; icon: typeof Home }[] = [
    { id: "parents", label: t("With parents", "同父母住"), sub: t("Contribution HK$2,000/mo", "每月俾屋企HK$2,000"), icon: Home },
    { id: "flat", label: t("Flat-share", "合租"), sub: t("Room about HK$6,000/mo", "租房約HK$6,000/月"), icon: Users },
    { id: "solo", label: t("Solo studio", "獨居細單位"), sub: t("About HK$9,000/mo", "約HK$9,000/月"), icon: Building2 },
  ]

  const chip = (on: boolean) =>
    `rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors ${
      on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-accent"
    }`

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-7 px-5 pb-6 pt-4">
      <p className="text-sm text-muted-foreground">{t("Quick profile · 3 taps", "快速資料 · 3 步")}</p>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-xl font-bold">{t("1. Expected first salary", "1. 預計起薪")}</h2>
        <div className="flex flex-wrap gap-2">
          {SALARIES.map((s) => (
            <button key={s} className={chip(salary === s)} onClick={() => setSalary(s)}>
              {hk(s)}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          {t("Or type your own (per month)", "或者自己輸入（每月）")}
          <Input
            type="number"
            min={0}
            step={500}
            value={salary}
            onChange={(e) => setSalary(Math.max(0, Number(e.target.value) || 0))}
            className="h-9 w-32 text-foreground"
            aria-label={t("Monthly salary", "每月薪金")}
          />
        </label>
        <p className="text-xs text-muted-foreground">{t("HK grad median is about HK$18–20k a month.", "香港畢業生中位數大約每月HK$18–20k。")}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-xl font-bold">{t("2. Living plan", "2. 住屋計劃")}</h2>
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
                <span>
                  <span className="block font-semibold">{c.label}</span>
                  <span className="block text-sm text-muted-foreground">{c.sub}</span>
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-xl font-bold">{t("3. Side-hustle income (per month)", "3. 副業收入（每月）")}</h2>
        <div className="flex flex-wrap gap-2">
          {HUSTLES.map((h) => (
            <button key={h} className={chip(hustle === h)} onClick={() => setHustle(h)}>
              {h === 0 ? t("HK$0", "HK$0") : hk(h)}
            </button>
          ))}
        </div>
      </section>

      <Card className="gap-1 p-4 text-sm">
        <p>
          {t("Your living costs:", "你嘅生活成本：")} <b>{hk(PLANS[plan].rent + PLANS[plan].food + PLANS[plan].transport)}</b>
          {t(" / month (rent, food, transport).", " / 月（租金、食物、交通）。")}
        </p>
      </Card>

      <Button
        size="lg"
        className="h-14 w-full rounded-2xl text-base"
        onClick={() => {
          setAppState({ profile: { salary, plan, hustle } })
          navigate({ to: "/simulator" })
        }}
      >
        {t("Show my freedom date", "顯示我嘅自由日子")}
      </Button>
    </main>
  )
}
