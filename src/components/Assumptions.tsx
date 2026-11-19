import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useT } from "@/lib/app-state"
import { INFLATION, START_AGE, MPF_AGE } from "@/lib/fire"

export function AssumptionsDialog() {
  const t = useT()
  const rows = [
    t(`Start age ${START_AGE}, starting with no savings.`, `由 ${START_AGE} 歲開始，起步冇儲蓄。`),
    t(`Inflation ${INFLATION * 100}% a year. All figures in today's HK$.`, `通脹假設每年 ${INFLATION * 100}%。所有數字以今日 HK$ 計。`),
    t("Salary held flat in real terms (no pay rises assumed).", "人工以實質計算，假設冇加薪。"),
    t("Salaries tax is an approximation: 2024/25 bands, basic allowance, MPF deduction, 15% standard-rate cap. Not a tax calculation.", "薪俸稅為估算：2024/25 稅階、基本免稅額、強積金扣除、15% 標準稅率上限。並非正式稅務計算。"),
    t(`MPF: 5% from you and 5% from employer, capped at HK$1,500 each a month. Locked until ${MPF_AGE}. Top-up shown after that.`, `強積金：僱員及僱主各供 5%，每人每月上限 HK$1,500。${MPF_AGE} 歲前鎖定，之後作補充顯示。`),
    t("Living costs are rough Hong Kong presets. Edit them in the simulator to test.", "生活成本為粗略香港數字，可在模擬器內改動測試。"),
    t("Bubble tea / coffee habit = HK$35 a day, 30 days a month.", "飲品習慣 = 每日 HK$35，每月 30 日。"),
    t("Freedom date uses accessible money only. Withdrawal rate 4% (or 3.5% if chosen).", "自由日子只計可動用資產。提取率 4%（如選擇則為 3.5%）。"),
    t(
      "Sequence risk: returns are assumed smooth each year. Real markets vary, and poor returns early in retirement can hurt more. The 4% and 3.5% withdrawal rates are historical approximations, not guarantees.",
      "次序風險：假設回報每年平穩。現實市場波動大，退休初期遇上差年份影響更大。4% 同 3.5% 提取率係歷史概略數字，唔係保證。",
    ),
    t("Investment gains are a what-if. Returns are not guaranteed. No securities are recommended.", "投資回報屬假設，並不保證。本工具不推薦任何證券。"),
  ]
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="ghost" size="sm" className="text-muted-foreground" />}>
        {t("Assumptions", "假設條件")}
      </DialogTrigger>
      <DialogContent className="max-h-[80svh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Assumptions", "假設條件")}</DialogTitle>
          <DialogDescription>{t("Everything the maths assumes. Educational only.", "所有計算所用嘅假設。純屬教育用途。")}</DialogDescription>
        </DialogHeader>
        <ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed">
          {rows.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  )
}
