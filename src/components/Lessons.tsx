import { useState } from "react"
import { Check, Flame, Landmark, Layers, Percent, PiggyBank, Trophy, TrendingUp, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LESSONS, QUIZ } from "@/lib/content"
import { setAppState, useAppState, useT } from "@/lib/app-state"

const ICONS = { flame: Flame, piggy: PiggyBank, percent: Percent, trend: TrendingUp, landmark: Landmark, chart: Layers }

export function lessonOpen(index: number, done: number[]) {
  return index === 0 || done.includes(index - 1) || done.includes(index)
}

export function LessonDialog({
  index,
  onIndexChange,
  onOpenChange,
}: {
  index: number | null
  onIndexChange: (i: number) => void
  onOpenChange: (open: boolean) => void
}) {
  const { lessonsDone } = useAppState()
  const t = useT()
  const lesson = index === null ? null : LESSONS[index]
  const Icon = lesson ? ICONS[lesson.icon] : Flame
  const done = index !== null && lessonsDone.includes(index)
  const hasNext = index !== null && index < LESSONS.length - 1

  const finish = () => {
    if (index === null) return
    setAppState({ lessonsDone: Array.from(new Set([...lessonsDone, index])) })
    if (hasNext) onIndexChange(index + 1)
    else onOpenChange(false)
  }

  return (
    <Dialog open={index !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        {lesson && index !== null && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {t(`Lesson ${index + 1} of ${LESSONS.length}`, `第 ${index + 1} 課，共 ${LESSONS.length} 課`)}
                  </p>
                  <DialogTitle className="text-lg">{t(lesson.title.en, lesson.title.zh)}</DialogTitle>
                </div>
              </div>
              <DialogDescription className="pt-2 text-base leading-relaxed text-foreground">
                {t(lesson.body.en, lesson.body.zh)}
              </DialogDescription>
            </DialogHeader>
            <p className="text-xs text-muted-foreground">
              {t("Illustration and education only. Not a recommendation to buy any security.", "只供教育及說明，並非買入任何證券嘅建議。")}
            </p>
            <Button size="lg" onClick={finish} className="w-full">
              {done && <Check className="size-4" />}
              {hasNext ? t("Next lesson", "下一課") : t("Finish lessons", "完成課程")}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export function QuizDialog({
  open,
  onOpenChange,
  freedom,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  freedom: number | null
}) {
  const t = useT()
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [copied, setCopied] = useState(false)

  const reset = () => {
    setI(0)
    setPicked(null)
    setScore(0)
    setFinished(false)
    setCopied(false)
  }

  const choose = (k: number) => {
    if (picked !== null) return
    setPicked(k)
    if (k === QUIZ[i].answer) setScore((s) => s + 1)
  }

  const next = () => {
    if (i + 1 >= QUIZ.length) {
      const final = score
      setFinished(true)
      if (final / QUIZ.length >= 0.8) setAppState({ quizPassed: true })
      return
    }
    setI(i + 1)
    setPicked(null)
  }

  const passed = score / QUIZ.length >= 0.8
  const text = t(
    `You Are Fired certified plan: freedom at ${freedom ?? "80+"}. Quiz ${score}/${QUIZ.length}.`,
    `You Are Fired 認證計劃：${freedom ?? "80+"}歲自由。測驗 ${score}/${QUIZ.length}。`,
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset()
        onOpenChange(v)
      }}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("Quick quiz", "快問快答")}</DialogTitle>
          <DialogDescription>{t("Score 5 of 6 or more to unlock your certified plan.", "答啱 6 題中至少 5 題，即可解鎖認證計劃。")}</DialogDescription>
        </DialogHeader>

        {!finished && (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-muted-foreground">
              {i + 1} / {QUIZ.length}
            </p>
            <p className="font-medium">{t(QUIZ[i].q.en, QUIZ[i].q.zh)}</p>
            <div className="flex flex-col gap-2">
              {QUIZ[i].options.map((o, k) => {
                const correct = picked !== null && k === QUIZ[i].answer
                const wrong = picked === k && k !== QUIZ[i].answer
                return (
                  <button
                    key={k}
                    onClick={() => choose(k)}
                    className={`rounded-lg border-2 px-4 py-3 text-left text-sm transition-colors ${
                      correct
                        ? "border-primary bg-primary/15"
                        : wrong
                          ? "border-destructive bg-destructive/10"
                          : "border-border hover:bg-accent"
                    }`}
                  >
                    {t(o.en, o.zh)}
                  </button>
                )
              })}
            </div>
            {picked !== null && (
              <Button onClick={next} className="w-full">
                {i + 1 >= QUIZ.length ? t("See my score", "睇結果") : t("Next question", "下一題")}
              </Button>
            )}
          </div>
        )}

        {finished && (
          <div className="flex flex-col gap-4">
            <p className="text-4xl font-bold">
              {score} / {QUIZ.length}
            </p>
            {passed ? (
              <Card className="gap-2 bg-primary/10 p-4">
                <p className="flex items-center gap-2 font-semibold">
                  <Trophy className="size-4 text-primary" /> {t("Certified plan unlocked", "已解鎖認證計劃")}
                </p>
                <p className="text-sm">{text}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(text)
                      setCopied(true)
                    } catch {
                      setCopied(false)
                    }
                  }}
                >
                  <Copy className="size-4" />
                  {copied ? t("Copied", "已複製") : t("Copy share text", "複製分享文字")}
                </Button>
              </Card>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t("Not quite. Review the lessons and try again.", "未夠。再溫習一次課程，然後重試。")}
              </p>
            )}
            <Button variant="outline" onClick={reset} className="w-full">
              {t("Try again", "再試一次")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
