import { useNavigate } from "@tanstack/react-router"
import { BookOpen, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAppState, useT } from "@/lib/app-state"
import { coastFV, compute, DEFAULT_PROFILE, hk } from "@/lib/fire"

function App() {
  const navigate = useNavigate()
  const { profile } = useAppState()
  const t = useT()
  const p = profile ?? DEFAULT_PROFILE
  const hero = compute({ ...p, savingsRate: 0.3, returnPct: 6, swr: 0.04, habit: false })
  const coast = coastFV(500, 6)

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-5 pb-4 pt-6 text-center">
      <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight">
        {t("At what age could you stop working?", "你幾歲可以唔使返工？")}
      </h1>
      <p className="text-lg text-muted-foreground">
        {t("no one wants to work hard — I want to hardly work.", "冇人想做到死，我只想少做啲嘢。")}
      </p>

      <Card className="gap-1 bg-primary/10 p-6">
        <p className="text-lg font-semibold">{t("Freedom at", "自由年齡")}</p>
        <p className="font-heading text-7xl font-bold leading-none text-primary">
          {hero.freedom ?? "80+"}
        </p>
        <p className="pt-2 text-sm text-muted-foreground">
          {t(
            `Based on HK$${p.salary.toLocaleString("en-US")} first salary, ${
              p.plan === "parents" ? "living with parents" : p.plan === "flat" ? "in a flat-share" : "in a studio"
            }, saving 30%.`,
            `以起薪 HK$${p.salary.toLocaleString("en-US")}、${
              p.plan === "parents" ? "同父母住" : p.plan === "flat" ? "合租" : "住獨立單位"
            }、儲三成計。`,
          )}
        </p>
      </Card>

      <div className="flex flex-col gap-3">
        <Button size="lg" className="h-14 w-full rounded-2xl text-base" onClick={() => navigate({ to: "/profile" })}>
          {t("Find my freedom date", "搵我嘅自由日子")}
          <Sparkles className="size-5" />
        </Button>
        <Button variant="outline" size="lg" className="h-14 w-full rounded-2xl text-base" onClick={() => navigate({ to: "/learn" })}>
          <BookOpen className="size-5" />
          {t("Learn the basics", "學基本知識")}
        </Button>
        <p className="text-xs text-muted-foreground">{t("6 lessons · a quick quiz", "6 課 · 一個快問快答")}</p>
      </div>

      <p className="rounded-xl bg-secondary p-4 text-sm">
        {t(
          `Coast FIRE: HK$500 a month from age 20 ≈ ${hk(coast)} at 60 (today's money).`,
          `Coast FIRE：20歲起每月HK$500，60歲時約值 ${hk(coast)}（以今日價值計）。`,
        )}
      </p>
    </main>
  )
}

export default App
