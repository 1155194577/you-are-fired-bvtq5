import { describe, expect, test } from "bun:test"
import { compute, monthlyTax, type Inputs } from "./fire"

const base: Inputs = {
  salary: 18000,
  plan: "parents",
  hustle: 0,
  savingsRate: 0.3,
  returnPct: 6,
  swr: 0.04,
  habit: false,
}

describe("freedom date", () => {
  test("saving more never makes freedom later", () => {
    const low = compute({ ...base, savingsRate: 0.2 }).freedom
    const high = compute({ ...base, savingsRate: 0.5 }).freedom
    expect(low).not.toBeNull()
    expect(high).not.toBeNull()
    expect(high!).toBeLessThanOrEqual(low!)
  })

  test("moving to a costlier plan never makes freedom earlier", () => {
    const parents = compute(base).freedom
    const solo = compute({ ...base, plan: "solo" }).freedom
    expect(solo === null || (parents !== null && solo >= parents)).toBe(true)
  })

  test("the bubble-tea habit never makes freedom earlier", () => {
    const without = compute(base).freedom
    const withHabit = compute({ ...base, habit: true }).freedom
    expect(without).not.toBeNull()
    expect(withHabit === null || withHabit >= without!).toBe(true)
  })

  test("no savings means no freedom date by 80", () => {
    expect(compute({ ...base, savingsRate: 0 }).freedom).toBeNull()
  })
})

describe("salaries tax estimate", () => {
  test("HK$18,000 a month pays about HK$199 a month in tax", () => {
    expect(monthlyTax(18000)).toBeGreaterThan(190)
    expect(monthlyTax(18000)).toBeLessThan(210)
  })
})
