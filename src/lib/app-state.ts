import { useSyncExternalStore } from "react"
import type { Profile } from "@/lib/fire"

export type Lang = "en" | "zh"

export type AppState = {
  lang: Lang
  profile: Profile | null
  lessonsDone: number[]
  quizPassed: boolean
}

const KEY = "you-are-fired-v1"
const initial: AppState = { lang: "en", profile: null, lessonsDone: [], quizPassed: false }

let state: AppState = initial
let loaded = false
const listeners = new Set<() => void>()

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return
  loaded = true
  try {
    state = { ...state, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") }
  } catch {
    // ignore corrupt storage
  }
}

export function setAppState(patch: Partial<AppState>) {
  ensureLoaded()
  state = { ...state, ...patch }
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // storage unavailable: keep in memory
  }
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}

function getSnapshot() {
  ensureLoaded()
  return state
}

export function useAppState() {
  return useSyncExternalStore(subscribe, getSnapshot, () => initial)
}

// Bilingual copy helper: t("English", "中文")
export function useT() {
  const { lang } = useAppState()
  return (en: string, zh: string) => (lang === "zh" ? zh : en)
}
