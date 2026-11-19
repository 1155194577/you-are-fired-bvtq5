import { useEffect } from "react"
import { createRootRoute, Link, Outlet } from "@tanstack/react-router"
import { Flame } from "lucide-react"
import { AssumptionsDialog } from "@/components/Assumptions"
import { setAppState, useAppState, useT } from "@/lib/app-state"

// The shell every route renders inside: header with EN / 中文 toggle, and the
// disclaimer footer on every screen.
export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const { lang } = useAppState()
  const t = useT()

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-HK" : "en"
  }, [lang])

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-md items-center justify-between px-5 pt-5">
        <Link to="/" className="flex items-center gap-2 font-heading text-lg font-bold">
          <Flame className="size-6 text-primary" aria-hidden="true" />
          {t("You Are Fired", "You Are Fired")}
        </Link>
        <div role="group" aria-label="Language" className="flex rounded-full border border-border p-0.5 text-sm">
          {(["zh", "en"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setAppState({ lang: l })}
              aria-pressed={lang === l}
              className={`rounded-full px-3 py-1 font-medium transition-colors ${
                lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {l === "zh" ? "中文" : "EN"}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1">
        <Outlet />
      </div>

      <footer className="mx-auto flex w-full max-w-md flex-col items-center gap-1 px-5 py-6 text-center text-xs text-muted-foreground">
        <p>
          {t(
            "Educational tool, not financial advice. No securities recommendations.",
            "教育用途工具，並非財務建議。不推薦任何證券。",
          )}
        </p>
        <AssumptionsDialog />
      </footer>
    </div>
  )
}
