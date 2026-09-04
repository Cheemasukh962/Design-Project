# NutriLens — build handoff

React Native / Expo port of the Stitch mocks. Twelve screens, all rendering.

## Run it

```bash
cd nutrilens
npm install
npx expo start          # QR code for Expo Go, or press w for browser
```

## Flow

```
/                 Splash                                      cream
/quiz/q1 … q5     The five questions                           cream
/results          Findings, with the reason behind each        surface
/nutrient/[id]    Reference page — d, b12, c, iron, calcium    surface

[ Home | Discover | Routine | Profile ]   bottom nav, four tabs
```

**Two page grounds, and the split is deliberate.** Splash and the quiz sit on
cream (`#FAF7F0`); everything after sits on the app surface (`#f8f9ff`). That is
what the mocks do, and it earns its keep: the quiz reads as a distinct, finite
errand and arriving at Results feels like entering the actual product.

The nav bar is custom (`components/nav/BottomNav`) because the active tab is a
filled navy pill wrapping icon and label together, which the default bar cannot
draw. It is scoped to the `(tabs)` group, so it never appears on the splash, the
quiz, results or a nutrient page.

## Structure

```
app/            routes (expo-router, file-based)
components/
  ui/           Button Screen Icon AppBar BrandBar Badge Photo Accordion
                Toast InsightCard FooterLinks
  nav/          BottomNav
  quiz/         QuizHeader ProgressDots MascotChip OptionCard OptionTile NotSureCard
  results/      ResultCard
  nutrient/     LetterMark FoodChip SourceCard BenefitChip PerspectiveCard
  home/         HomeHeader GapSummaryCard NutrientProgressCard RoutineTickRow ArticleCard
  routine/      WeekCalendar ProgressRing RoutineItemRow FilterPills ConsistencyMatrix
  brand/        VitoMascot
  splash/       FoldText
data/           quiz.ts nutrients.ts inference.ts progress.ts QuizContext RoutineContext
theme/          colors typography spacing radius
tools/          shoot.mjs (headless render) cutout.mjs avatar.mjs
```

**The rule that keeps it modular: nothing outside `theme/` hardcodes a colour or
a spacing value.** A palette change is one file.

### Reading the mocks' Tailwind config

The exported HTML overrides Tailwind's defaults, so class names do not mean
their usual sizes. `rounded-xl` is **12px**, not 24. The full table is at the
top of `theme/radius.ts`. Getting this wrong inflates every card on the screen.

## Where the numbers come from

`data/inference.ts` holds the rules. They are deliberately simple and readable,
because the "How this works" screen promises the user exactly that — a rule you
can print in one sentence is a rule you can defend in review.

Every finding carries a `reason` that quotes the user's own answer back:

> "You said you're outside under 15 minutes on a normal day."
> "You picked Eggs but not Dairy / alternatives, Fish or Meat."

Research said people reject nutrition advice on **relevance**, not accuracy, so
a result the user can trace to something they typed is one they can argue with.

## Three things to decide before anyone tests this

These are design calls, not bugs. Each is isolated to one place in the code.

### 1. The gamification layer is invented — `data/progress.ts`

Level 3, 820 XP, Quests 2/3, "80% filled", the 5-day streak, the filled-in
week. There is no account, no logging history and no intake model, so nothing
in the app can compute any of it. A tester will ask where 820 XP comes from
within about ten seconds.

Options: keep it and say up front that the profile is a sample; derive it (XP
from ticked items, "% filled" from logged foods — real work, not a copy
change); or cut it from the demo build.

The same file holds `SEED_DEMO_ROUTINE`, which pre-fills the routine so the app
opens in the populated state the mocks draw. **Turn that off for a real session** —
watching someone reach an empty routine and work out how to fill it is most of
what the session is for.

### 2. "Vito's tip: … absorption by 32%" — `ROUTINE_TIP` in `data/progress.ts`

Built as drawn, but it breaks two of the project's own guardrails at once: a
health claim in the mascot's mouth, and an uncited statistic.

The claim itself is probably fine — vitamin D is fat-soluble and 32% closely
matches Dawson-Hughes et al. (2015) on taking the dose with the largest
fat-containing meal. So this is likely a citation problem, not a wrong fact.
Cheapest fix: add the citation and attribute the line to the app rather than to
Vito.

### 3. The athlete quote is a fabricated person — `data/nutrients.ts`

Marcus Vance does not exist and never said that. The mock generated a name, a
portrait and a testimonial together. Shown unlabelled, it functions as a real
person endorsing a health behaviour.

**One line was added to the mock here:** the card prints "Illustrative persona —
not a real quote" under the name. Proper fixes are a real attributed quote, or a
sourced statement with no face attached. Removing the label without doing one of
those is the one option that is not on the table.

## Other departures from the mocks — and why

| # | Mock | Built | Reason |
|---|---|---|---|
| 1 | Results card shows only a generic nutrient description | Description kept, reason line **added** below it | The reason is the transparency mechanism and an earlier spec required it. Added, not substituted — delete the `reason` block in `ResultCard` to revert. |
| 2 | "an estimate from 3 questions"; "These 3 nutrients" | Both counts derived | The stepper promises five. Derived counts cannot drift. |
| 3 | Active nav icon in `on-primary-container` (#7490bf) | White | ~2.4:1 on the navy pill, under the 3:1 minimum, on the "where am I" marker. Stitch mapped the M3 token mechanically. |
| 4 | Hardcoded "Today, Oct 24"; week pre-filled | Real date; week from a flagged constant | A date that is wrong the day after the demo undermines the daily screen. |
| 5 | Food photography (Stitch CDN URLs) | Tinted plate with the nutrient's mark | We do not own the photos and those URLs expire. Same frame, so a real photo drops in with no layout change. |
| 6 | Bitmap logo in the Home header | Wordmark set in type beside Vito | No logo asset. Swap in `HomeHeader`. |
| 7 | Q1 on `#f8f9ff`, 3 dots, pill CTA | Q2's treatment throughout the quiz | The two quiz mocks came from different batches and read as different apps one tap apart. Q2 is newer and matches the five-question spec. |

## Still open

- **Discover and Profile have no mock.** Built because the nav bar in both mocks
  has four destinations and shipping it with two dead would change the design
  rather than implement it. Both say on screen that they are undesigned. Treat
  them as placeholders, not proposals.
- **Every %DV figure on the detail page is unverified.** They came from the mock.
  Check each against the NIH Office of Dietary Supplements fact sheet
  (ods.od.nih.gov) and cite it. The Sources accordion says so on screen.
- **The rose accent on Home is a red** marking a low nutrient state (B12, "Lv.1 /
  50%"), which the PRD guardrail says never to do. Flagged in `theme/colors.ts`.
  Either accept it or move the low state to a neutral or gold.
- **Q3–Q5 have no mocks.** Authored against the PRD. Each exists because a
  specific result line needs it: Q3 → the vitamin D reason, Q4 → vitamin C,
  Q5 → narrows everything.
- **Nothing persists.** Answers and routine live in memory for the session, by
  design: accounts are out of MVP scope.

## Checking a screen against its mock

```bash
npx expo export --platform web
node tools/shoot.mjs ../design/out.png "quiz/q2" 2000 "Eggs,Fruit"
```

Renders headlessly at 393×852, reports console errors, and optionally taps
labels first so selected states can be photographed. Current renders are
`design/new-01-home.png` through `new-10-b12.png`.
