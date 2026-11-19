import { useState } from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Check, Flame, Landmark, Layers, Lock, Percent, PiggyBank, Star, TrendingUp, Trophy } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { LessonDialog, QuizDialog, lessonOpen } from "@/components/Lessons"
import { LESSONS } from "@/lib/content"
import { useAppState, useT } from "@/lib/app-state"
import { compute, DEFAULT_PROFILE } from "@/lib/fire"

export const Route = createFileRoute("/learn")({
  component: LearnPage,
})

const ICONS = { flame: Flame, piggy: PiggyBank, percent: Percent, trend: TrendingUp, landmark: Landmark, chart: Layers }

// Duolingo-style path: a winding column of round lesson nodes, each unlocked
// after the one before it. The quiz sits at the end of the path.
function LearnPage() {
  const t = useT()
  const { lessonsDone, quizPassed, profile } = useAppState()
  const [lesson, setLesson] = useState<number | null>(null)
  const [quizOpen, setQuizOpen] = useState(false)
  const p = profile ?? DEFAULT_PROFILE
  const freedom = compute({ ...p, savingsRate: 0.3, returnPct: 6, swr: 0.04, habit: false }).freedom
  const allDone = lessonsDone.length >= LESSONS.length
  const offsets = [0, 60, 20, 80, 40, 70, 30]

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-5 pb-6 pt-4">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-2xl font-bold">{t("Learn the basics", "學基本知識")}</h1>
        <div className="flex items-center gap-3">
          <Progress value={(lessonsDone.length / LESSONS.length) * 100} className="flex-1" />
          <span className="text-sm font-semibold text-muted-foreground">
            {lessonsDone.length}/{LESSONS.length}
          </span>
        </div>
      </div>

      <ol className="flex flex-col items-center gap-7 py-2">
        {LESSONS.map((l, i) => {
          const open = lessonOpen(i, lessonsDone)
          const done = lessonsDone.includes(i)
          const current = open && !done
          const Icon = ICONS[l.icon]
          return (
            <li key={i} style={{ transform: `translateX(${offsets[i]}px)` }} className="flex flex-col items-center gap-1">
              <button
                disabled={!open}
                onClick={() => setLesson(i)}
                aria-label={t(l.title.en, l.title.zh)}
                className={`grid size-20 place-items-center rounded-full border-b-[6px] transition-transform active:translate-y-[3px] active:border-b-[3px] disabled:opacity-60 ${
                  done
                    ? "border-primary/70 bg-primary text-primary-foreground"
                    : current
                      ? "border-primary/70 bg-primary text-primary-foreground ring-4 ring-primary/30"
                      : "border-border bg-muted text-muted-foreground"
                }`}
              >
                {done ? <Check className="size-8" /> : open ? <Icon className="size-8" /> : <Lock className="size-7" />}
              </button>
              <span className="max-w-40 text-center text-sm font-semibold">{t(l.title.en, l.title.zh)}</span>
            </li>
          )
        })}
        <li style={{ transform: `translateX(${offsets[6]}px)` }} className="flex flex-col items-center gap-1">
          <button
            disabled={!allDone}
            onClick={() => setQuizOpen(true)}
            aria-label={t("Quiz", "測驗")}
            className={`grid size-20 place-items-center rounded-full border-b-[6px] transition-transform active:translate-y-[3px] active:border-b-[3px] disabled:opacity-60 ${
              allDone ? "border-yellow-600/60 bg-yellow-400 text-yellow-950" : "border-border bg-muted text-muted-foreground"
            }`}
          >
            {allDone ? <Star className="size-8" /> : <Lock className="size-7" />}
          </button>
          <span className="text-sm font-semibold">{t("Quick quiz", "快問快答")}</span>
          {quizPassed && (
            <span className="flex items-center gap-1 text-xs text-primary">
              <Trophy className="size-3.5" /> {t("Certified", "已認證")}
            </span>
          )}
        </li>
      </ol>

      <Link to="/simulator" className="rounded-2xl bg-secondary p-4 text-center text-sm font-semibold">
        {freedom !== null
          ? t(`Back to your freedom date: ${freedom}`, `返去你嘅自由日子：${freedom}歲`)
          : t("Back to the simulator", "返去模擬器")}
      </Link>

      <LessonDialog index={lesson} onIndexChange={setLesson} onOpenChange={(o) => !o && setLesson(null)} />
      <QuizDialog open={quizOpen} onOpenChange={setQuizOpen} freedom={freedom} />
    </main>
  )
}
