import { useState } from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Check, Coffee, Lock, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { LessonDialog, QuizDialog, lessonOpen } from "@/components/Lessons"
import { NetWorthChart } from "@/components/NetWorthChart"
import { InvestmentReturnInfo } from "@/components/InvestmentReturnInfo"
import { LESSONS } from "@/lib/content"
import { useAppState, useT } from "@/lib/app-state"
import { coastFV, compute, DEFAULT_PROFILE, hk, INFLATION, PLANS, realAnnualPct, START_AGE, type Plan } from "@/lib/fire"

export const Route = createFileRoute("/simulator")({
  component: Simulator,
})

const first = (v: number | readonly number[]) => (typeof v === "number" ? v : v[0])

function Simulator() {
  const t = useT()
  const { profile, lessonsDone, quizPassed } = useAppState()
  const p = profile ?? DEFAULT_PROFILE

  const [plan, setPlan] = useState<Plan>(p.plan)
  const [hustle, setHustle] = useState(p.hustle)
  const [rate, setRate] = useState(0.3)
  const [ret, setRet] = useState(6)
  const [habit, setHabit] = useState(false)
  const [conservative, setConservative] = useState(false)
  const [lesson, setLesson] = useState<number | null>(null)
  const [quizOpen, setQuizOpen] = useState(false)

  const r = compute({
    salary: p.salary,
    plan,
    hustle,
    savingsRate: rate,
    returnPct: ret,
    swr: conservative ? 0.035 : 0.04,
    habit,
  })

  const freedomText =
    r.freedom !== null ? t(`Freedom at ${r.freedom}.`, `${r.freedom}歲 自由。`) : t("Not by 80.", "80歲前未能達到。")
  const yearsLeft = r.freedom !== null ? r.freedom - START_AGE : null
  const allLessons = lessonsDone.length >= LESSONS.length
  const coast = coastFV(500, ret)

  const planLabel: Record<Plan, string> = {
    parents: t("With parents", "同父母住"),
    flat: t("Flat-share", "合租"),
    solo: t("Solo studio", "獨居"),
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-5 px-5 pb-6 pt-4">
      {/* HERO */}
      <section className="flex flex-col items-center gap-1 text-center">
        <p className="text-sm text-muted-foreground">{t("Your freedom date", "你嘅自由日子")}</p>
        <h1 className="font-heading text-5xl font-bold leading-tight text-primary">{freedomText}</h1>
        <p className="text-sm text-muted-foreground">
          {yearsLeft !== null
            ? t(`About ${yearsLeft} years of work left, if nothing changes.`, `如果情況不變，大約仲有 ${yearsLeft} 年要返工。`)
            : t("Try a higher savings rate or cheaper living.", "試下提高儲蓄率或者減少開支。")}
        </p>
      </section>

      {/* CHART */}
      <Card className="p-4">
        <NetWorthChart points={r.points} target={r.target} freedom={r.freedom} />
      </Card>

      {/* KEY INSIGHTS */}
      <section className="grid grid-cols-1 gap-3">
        <Card className="gap-1 bg-primary/10 p-4">
          <p className="text-sm text-muted-foreground">{t("Every HK$1,000 a month you save", "每月多儲HK$1,000")}</p>
          <p className="font-heading text-2xl font-bold">
            {r.perThousandYears !== null
              ? t(`= ${Math.abs(r.perThousandYears)} years of life back`, `= 人生奪返 ${Math.abs(r.perThousandYears)} 年`)
              : t("= not measurable yet", "= 暫時未能計算")}
          </p>
        </Card>
        <Card className="gap-1 p-4">
          <p className="text-sm text-muted-foreground">{t("MPF, locked until 65", "強積金，鎖到65歲")}</p>
          <p className="font-heading text-xl font-bold">
            {t(
              `${hk(r.locked65)} at 65 · top-up ≈ ${hk(r.topUpMonthly)}/mo after 65`,
              `65歲時 ${hk(r.locked65)} · 65歲後每月補充約 ${hk(r.topUpMonthly)}`,
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("Not counted in your freedom date. Shown as a top-up after 65.", "唔計入自由日子，65歲後作補充顯示。")}
          </p>
        </Card>
      </section>

      {/* CONTROLS */}
      <section className="flex flex-col gap-5 rounded-2xl border border-border p-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm font-semibold">
            <span>{t("Savings rate", "儲蓄率")}</span>
            <span className="text-primary">
              {Math.round(rate * 100)}% · {hk(r.saving)}/{t("mo", "月")}
            </span>
          </div>
          <Slider value={[Math.round(rate * 100)]} min={0} max={70} step={1} onValueChange={(v) => setRate(first(v) / 100)} aria-label={t("Savings rate", "儲蓄率")} />
          <p className="text-xs text-muted-foreground">{t("The single biggest lever. Share of money left after living costs.", "最有力嘅一個槓桿：生活開支之後，儲返幾多。")}</p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm font-semibold">
            <span className="flex items-center gap-1">
              {t("Investment return", "投資回報")}
              <InvestmentReturnInfo />
            </span>
            <span className="text-primary">{ret}% / {t("yr", "年")}</span>
          </div>
          <Slider value={[ret]} min={2} max={10} step={0.5} onValueChange={(v) => setRet(first(v))} aria-label={t("Investment return", "投資回報")} />
          <p className="text-xs text-muted-foreground">
            {t(
              `${ret}% ≈ ${realAnnualPct(ret).toFixed(1)}% real after ${INFLATION * 100}% inflation`,
              `${ret}% ≈ ${realAnnualPct(ret).toFixed(1)}% 實質回報（扣除 ${INFLATION * 100}% 通脹）`,
            )}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold">{t("Where you live", "住喺邊度")}</span>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(PLANS) as Plan[]).map((k) => (
              <button
                key={k}
                onClick={() => setPlan(k)}
                className={`rounded-xl border-2 p-2 text-center text-xs font-semibold transition-colors ${
                  plan === k ? "border-primary bg-primary/10" : "border-border hover:bg-accent"
                }`}
              >
                <span className="block">{planLabel[k]}</span>
                <span className="block font-normal text-muted-foreground">{hk(PLANS[k].rent + PLANS[k].food + PLANS[k].transport)}</span>
              </button>
            ))}
          </div>
          <p className="text-sm">
            {plan === "parents"
              ? t("Living with parents is the cheapest route. Try moving out.", "同父母住係最平嘅方法。試下搬出去睇吓。")
              : r.rentYears !== null
                ? t(
                    `Moving out (${planLabel[plan]}) pushes your date back ${Math.abs(r.rentYears)} years.`,
                    `搬去（${planLabel[plan]}）自由日子推後 ${Math.abs(r.rentYears)} 年。`,
                  )
                : t(`Moving out (${planLabel[plan]}) means freedom is no longer reachable by 80.`, `搬去（${planLabel[plan]}）就未能喺80歲前自由。`)}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm font-semibold">
            <span>{t("Side-hustle income / mo", "副業收入／月")}</span>
            <span className="text-primary">{hk(hustle)}</span>
          </div>
          <Slider value={[hustle]} min={0} max={10000} step={500} onValueChange={(v) => setHustle(first(v))} aria-label={t("Side-hustle income", "副業收入")} />
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <Coffee className="size-4 text-primary" /> {t("Bubble tea / coffee habit", "飲品習慣")}
            </span>
            <span className="text-xs text-muted-foreground">
              {t("HK$35 a day", "每日 HK$35")}
              {r.habitYears !== null
                ? t(` = ${r.habitYears} years later`, ` = 遲咗 ${r.habitYears} 年`)
                : ""}
            </span>
            <span className="text-xs text-muted-foreground">
              {t("Warren Buffett's point: money you spend early grows nothing for you later.", "巴菲特嘅道理：早年花掉嘅錢，之後唔會為你生錢。")}
            </span>
          </div>
          <Switch checked={habit} onCheckedChange={setHabit} aria-label={t("Bubble tea habit", "飲品習慣")} />
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold">{t("Safer 3.5% withdrawal", "較保守嘅 3.5% 提取率")}</span>
          <Switch checked={conservative} onCheckedChange={setConservative} aria-label={t("Use 3.5% withdrawal", "用3.5%提取率")} />
        </div>
      </section>

      {/* COAST */}
      <Card className="gap-1 bg-secondary p-4">
        <p className="text-sm font-semibold">{t("Coast FIRE", "Coast FIRE")}</p>
        <p className="text-sm">
          {t(
            `HK$500 a month from age 20 ≈ ${hk(coast)} at 60 (today's money).`,
            `20歲起每月HK$500，60歲時約值 ${hk(coast)}（以今日價值計）。`,
          )}
        </p>
      </Card>

      {/* LESSONS */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold">{t("Lessons, unlocked as you go", "課程，逐步解鎖")}</h2>
          <Link to="/learn" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
            {t("Full path", "完整課程")}
          </Link>
        </div>
        <Progress value={(lessonsDone.length / LESSONS.length) * 100} />
        <div className="grid grid-cols-3 gap-2">
          {LESSONS.map((l, i) => {
            const open = lessonOpen(i, lessonsDone)
            const done = lessonsDone.includes(i)
            return (
              <button
                key={i}
                disabled={!open}
                onClick={() => setLesson(i)}
                className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-center text-xs font-semibold transition-colors ${
                  done ? "border-primary bg-primary/10" : open ? "border-border hover:bg-accent" : "border-border opacity-50"
                }`}
              >
                {done ? <Check className="size-4 text-primary" /> : open ? <span className="text-sm">{i + 1}</span> : <Lock className="size-4" />}
                <span>{t(l.title.en, l.title.zh)}</span>
              </button>
            )
          })}
        </div>
        <Button variant={allLessons ? "default" : "outline"} onClick={() => setQuizOpen(true)} disabled={!allLessons}>
          <Trophy className="size-4" />
          {quizPassed
            ? t("Certified plan unlocked · retake quiz", "已解鎖認證計劃 · 重做測驗")
            : allLessons
              ? t("Take the 6-question quiz", "做6題快問快答")
              : t("Finish the 6 lessons to unlock the quiz", "完成6課後解鎖測驗")}
        </Button>
      </section>

      <LessonDialog index={lesson} onIndexChange={setLesson} onOpenChange={(o) => !o && setLesson(null)} />
      <QuizDialog open={quizOpen} onOpenChange={setQuizOpen} freedom={r.freedom} />
    </main>
  )
}
