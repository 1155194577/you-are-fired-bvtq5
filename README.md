# You Are Fired

A simulator-first web app that teaches university students in Hong Kong about
Financial Independence, Retire Early (FIRE). Students enter their salary and
living plan, then drag sliders to see their own **freedom date**: the age at
which their accessible money can support their living costs.

Bilingual: English and Cantonese-friendly Traditional Chinese (中文).

> Educational tool. Not financial advice. No securities are recommended.

## What it does

- **Quick profile**: expected first salary, living plan (with parents, flat-share,
  solo studio), and monthly side-hustle income.
- **Simulator**: the freedom date as a large number, a net-worth chart, and
  sliders for savings rate, investment return, rent, side-hustle income, a
  bubble-tea habit (HK$35/day), and a safer 3.5% withdrawal rate.
- **Six short lessons**: FIRE, savings rate, the 4% rule, compound interest,
  MPF basics, index funds. They unlock one at a time.
- **Quiz**: six questions; 5 or more correct unlocks a shareable "certified plan".
- **Assumptions panel**: every assumption the maths makes, in plain language.

## How the maths works

- All calculations run in the browser. There is no backend and no API cost.
- Figures are in today's HK$ (real terms, with 2.5% inflation).
- Salaries tax is an approximation (2024/25 bands, basic allowance, MPF
  deduction, 15% standard-rate cap).
- Mandatory MPF is 5% from the employee and 5% from the employer, capped at
  HK$1,500 each per month. It goes into a separate bucket locked until 65 and
  is **not** counted in the freedom date. It is shown as a top-up after 65.
- The freedom date is the first month when accessible money reaches
  annual spending divided by the withdrawal rate (4%, or 3.5% if chosen).
- Savings rate applies to money left after living costs. Retirement spending
  is what you spend today (income minus savings).
- Known simplifications: returns are smooth year to year (sequence risk is not
  modelled), salary is flat in real terms, and MPF is modelled with the same
  return as other money.

## Run it

```bash
bun install
bun run dev      # local dev server
bun run build    # production build
bun test         # maths tests (src/lib/fire.test.ts)
```

## Stack

React, TypeScript, Vite, Tailwind CSS and shadcn/ui components.
Routes live in `src/routes/` (TanStack Router). The maths lives in
`src/lib/fire.ts`, and the lesson and quiz copy lives in `src/lib/content.ts`.

## Sources and disclaimers

The 4% and 3.5% withdrawal rates are historical approximations and are not
guaranteed. Investment returns are assumptions, not forecasts. Living-cost
presets are rough Hong Kong figures for illustration. Check current MPF and
tax rules with the official sources before relying on any number.
