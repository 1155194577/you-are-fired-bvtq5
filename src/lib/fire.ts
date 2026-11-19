// All FIRE maths runs in the browser. Figures are in today's HK$ (real terms).
// Estimates only: educational, not financial advice.

export type Plan = "parents" | "flat" | "solo"

export type Costs = { rent: number; food: number; transport: number }

// Per-plan cost overrides chosen by the student. Missing plans use PLANS.
export type CostOverrides = Partial<Record<Plan, Costs>>

export type Profile = { salary: number; plan: Plan; hustle: number; costs?: CostOverrides }

export const DEFAULT_PROFILE: Profile = { salary: 18000, plan: "parents", hustle: 0 }

// Monthly HK$ living costs by plan (rough HK figures).
export const PLANS: Record<Plan, { rent: number; food: number; transport: number }> = {
  parents: { rent: 2000, food: 2500, transport: 600 }, // home contribution to parents
  flat: { rent: 6000, food: 3000, transport: 700 }, // flat-share room
  solo: { rent: 9000, food: 3500, transport: 700 }, // studio
}

export function planCosts(plan: Plan, overrides?: CostOverrides): Costs {
  return overrides?.[plan] ?? PLANS[plan]
}

export function costTotal(c: Costs) {
  return c.rent + c.food + c.transport
}

export const HABIT_MONTHLY = 35 * 30 // HK$35/day bubble tea or coffee, 30 days
export const START_AGE = 22
export const MAX_AGE = 80
export const MPF_AGE = 65
export const INFLATION = 0.025

const BANDS: [number, number][] = [
  [50000, 0.02],
  [50000, 0.06],
  [50000, 0.1],
  [50000, 0.14],
  [Infinity, 0.17],
]

// Approximate HK salaries tax (2024/25 bands, basic allowance, MPF deduction,
// 15% standard-rate cap). Monthly HK$. An estimate, not a tax calculation.
export function monthlyTax(gross: number) {
  const annual = gross * 12
  const mpfDed = Math.min(annual * 0.05, 18000)
  let rem = Math.max(0, annual - 132000 - mpfDed)
  let progressive = 0
  for (const [size, rate] of BANDS) {
    const x = Math.min(rem, size)
    progressive += x * rate
    rem -= x
    if (rem <= 0) break
  }
  const standard = 0.15 * Math.max(0, annual - mpfDed)
  return Math.min(progressive, standard) / 12
}

// Mandatory MPF: employee 5% of salary, capped at HK$1,500/month (employer matches).
export function monthlyMpf(gross: number) {
  return Math.min(gross * 0.05, 1500)
}

export function realMonthlyRate(nominalPct: number) {
  return Math.pow((1 + nominalPct / 100) / (1 + INFLATION), 1 / 12) - 1
}

// Month-by-month projection of ACCESSIBLE money only. MPF is tracked in a
// separate locked bucket until age 65.
export function project(saving: number, target: number, ir: number, mpfContrib: number) {
  const points: { age: number; accessible: number; locked: number }[] = [
    { age: START_AGE, accessible: 0, locked: 0 },
  ]
  let acc = 0
  let locked = 0
  let freedom: number | null = null
  const months = (MAX_AGE - START_AGE) * 12
  for (let m = 1; m <= months; m++) {
    const age = START_AGE + m / 12
    acc = acc * (1 + ir) + saving
    locked = locked * (1 + ir) + (age <= MPF_AGE ? mpfContrib : 0)
    if (freedom === null && acc >= target) freedom = Math.ceil(age)
    if (m % 12 === 0) points.push({ age, accessible: acc, locked })
  }
  return { freedom, points, locked65: points[MPF_AGE - START_AGE].locked }
}

export type Inputs = {
  salary: number
  plan: Plan
  hustle: number
  savingsRate: number // 0..1, share of money left after essentials
  returnPct: number // nominal annual %
  swr: number // withdrawal rate, 0.04 or 0.035
  habit: boolean
  costs?: CostOverrides
}

export function compute(i: Inputs) {
  const mpf = monthlyMpf(i.salary)
  const tax = monthlyTax(i.salary)
  const takeHome = i.salary - mpf - tax
  const income = takeHome + i.hustle
  const ir = realMonthlyRate(i.returnPct)
  const mpfContrib = 2 * mpf

  const scenario = (plan: Plan, habit: boolean) => {
    const p = planCosts(plan, i.costs)
    const essentials = p.rent + p.food + p.transport
    const core = Math.max(0, (income - essentials) * i.savingsRate)
    const saving = Math.max(0, core - (habit ? HABIT_MONTHLY : 0))
    // Retirement budget = what you spend today (income minus savings), so
    // side-hustle money you spend now is part of the lifestyle you must fund.
    const annualSpend = 12 * Math.max(essentials, income - core)
    const target = annualSpend / i.swr
    const res = project(saving, target, ir, mpfContrib)
    return { saving, annualSpend, target, res, essentials }
  }

  const main = scenario(i.plan, i.habit)
  const withHabit = scenario(i.plan, true).res.freedom
  const withoutHabit = scenario(i.plan, false).res.freedom
  const atParents = scenario("parents", i.habit).res.freedom
  const plus1k = project(main.saving + 1000, main.target, ir, mpfContrib).freedom

  const diff = (a: number | null, b: number | null) => (a !== null && b !== null ? a - b : null)

  return {
    takeHome,
    tax,
    mpf,
    essentials: main.essentials,
    saving: main.saving,
    annualSpend: main.annualSpend,
    target: main.target,
    freedom: main.res.freedom,
    points: main.res.points,
    locked65: main.res.locked65,
    topUpMonthly: (main.res.locked65 * i.swr) / 12,
    perThousandYears: diff(main.res.freedom, plus1k),
    habitYears: diff(withHabit, withoutHabit),
    rentYears: diff(main.res.freedom, atParents),
  }
}

// Coast view: monthly HK$500 from 20 to 60, in today's HK$.
export function coastFV(monthly: number, returnPct: number, years = 40) {
  const r = realMonthlyRate(returnPct)
  const n = years * 12
  return (monthly * (Math.pow(1 + r, n) - 1)) / r
}

export function hk(n: number) {
  return `HK$${Math.round(n).toLocaleString("en-US")}`
}

// Real annual return in %, after inflation: (1+nominal)/(1+inflation) - 1.
export function realAnnualPct(nominalPct: number) {
  return ((1 + nominalPct / 100) / (1 + INFLATION) - 1) * 100
}
