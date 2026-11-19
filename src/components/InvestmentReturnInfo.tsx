import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useT } from "@/lib/app-state"

// "What is investment return?" explainer, opened from the simulator slider label.
export function InvestmentReturnInfo() {
  const t = useT()
  const paras = [
    t(
      "Investment return is how much your investment grows or falls each year, as a percentage. HK$10,000 that becomes HK$10,600 after a year earned 6%.",
      "投資回報係你嘅投資每年升咗或者跌咗幾多，用百分比表示。例如投資 HK$10,000，一年後變成 HK$10,600，回報就係 6%。",
    ),
    t(
      "Nominal return is before inflation. Real return is after inflation, meaning how much your buying power grows. With 2.5% inflation, 6% nominal is about 3.4% real. This app uses real returns, so all numbers are in today's HK$.",
      "名義回報係未扣通脹。實質回報係扣咗通脹之後，你購買力真正增長幾多。通脹 2.5% 嘅話，6% 名義回報大約等於 3.4% 實質回報。本App用實質回報計算，所以所有數字都以今日 HK$ 計。",
    ),
    t(
      "Small differences compound over decades. But returns are not guaranteed: markets and funds can fall, and past performance does not predict the future.",
      "每年差幾個百分點，幾十年下來複利效果會好明顯。但回報唔係保證，股市同基金都可能跌，過去表現唔代表將來。",
    ),
  ]

  return (
    <Dialog>
      <DialogTrigger
        render={<Button variant="ghost" size="icon-sm" className="size-6 text-muted-foreground" aria-label={t("What is investment return?", "咩係投資回報？")} />}
      >
        <Info className="size-4" />
      </DialogTrigger>
      <DialogContent className="max-h-[80svh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("What is investment return?", "咩係投資回報？")}</DialogTitle>
          <DialogDescription className="sr-only">{t("Investment return explained", "投資回報解釋")}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 text-sm leading-relaxed">
          {paras.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            {t(
              "Educational assumption only. Not investment advice. No securities are recommended.",
              "呢個只係教育用途嘅假設，唔係投資建議，亦唔會推薦任何證券。",
            )}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
