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

**On a desktop browser the app is locked to a 393x852 phone canvas**
(`components/ui/DeviceFrame`). Every screen was designed at that width and the
layout assumes it — a 1440px-wide Results page stretches its cards into
unreadable lines and puts the bottom nav where nobody would design it. Native
is a pass-through, and a browser window narrower than the frame fills the
viewport instead of letterboxing.

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
data/           quiz.ts nutrients.ts inference.ts restrictions.ts progress.ts
                QuizContext RoutineContext
theme/          colors typography spacing radius
tools/          shoot.mjs (headless render) cutout.mjs avatar.mjs
```

**The rule that keeps it modular: nothing outside `theme/` hardcodes a colour or
a spacing value.** A palette change is one file.

### Nutrient identity colours

Each of the five nutrients owns a permanent hue (`theme/accents.ts`), used on
its letter mark, result card, detail hero and Home card:

| | | |
|---|---|---|
| Vitamin D | gold `#EAB308` | the sun, closest to the brand gold |
| Vitamin C | orange `#EA580C` | citrus, pushed red-ward so it never reads as gold |
| Vitamin B12 | violet `#7C5CFF` | no natural colour, so the most distinct hue |
| Iron | bronze `#7C2D12` | literal, and dark enough not to compete with C |
| Calcium | teal `#0E7C86` | the only cold accent in the set |

**One rule, and it is absolute: a colour means a nutrient, never a status.**
Gold is Vitamin D whether the user is doing well or badly at it. The moment
orange also means "warning", every screen has to be read twice.

This replaced the earlier scheme where Home coloured a card by how "full" the
nutrient was — which is what put a red on B12 at 50% and broke the guardrail
against red for a nutrition state. Quantity now lives on the progress bar,
where a quantity belongs. Red is absent from the palette entirely.

Note the one deliberate exception: the green completion badge on a Home card
and the green tick on a routine row are statuses, not nutrients. They are
allowed because they never name a nutrient.

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

### Two rules the quiz is held to

1. **A question that cannot change a result does not belong in the quiz.** This
   is why the PRD's "what are you hoping to improve?" goal question is absent —
   it reads well, but nothing downstream consumes it. Q3-Q5 have no mocks and
   earn their steps by producing the vitamin D, vitamin C and restriction lines.
2. **An option that cannot change a result does not belong either.** Three of
   the six Q5 answers used to be collected and then ignored. `restrictions.ts`
   now makes every one of them do something: exclude a food, rename it, or
   change what Results says. Asking someone to declare "no fish" and then
   recommending salmon is worse than never asking.

Restrictions reach Results, the nutrient page **and** the routine. "Food
allergies" is the one answer we cannot act on — we never asked which ones and
guessing would be dangerous — so it changes what we say rather than what we
recommend.

## The companion (prototype for review)

A starter creature that grows from your routine. Reachable at `/starter`, shown
on Home, full screen at `/companion`, and there is a design reference sheet of
all nine forms at `/creatures`.

**Grounded in two pieces of research.** Ken Sugimori describes the starter trio
as a personality split — a cool one, a serious one, a funny one — not just an
elemental one, and the studio's core rule is the silhouette test: fill the
character solid black and it should still be recognisable. Both are implemented
literally. The creatures are built only from circles and triangles, and the
crest is what distinguishes the three species from across the room.

**Nine forms from one skeleton.** `components/companion/Creature.tsx` is
parameterised: stage sets the proportions, species sets the palette and crest.
An evolution line has to read as one creature growing up, and drawing them from
one skeleton makes that true by construction rather than by luck. It also
scales, animates, recolours for free, and borrows nobody's IP — which
hand-drawn or AI-generated art of a "Pokémon crossed with a Digimon" would not.

**Colour is contained.** The game sits on a deep navy ground (`theme/companion.ts`).
The health app is light and its colour language is strict — gold means "worth a
look", green means "done", red is banned. Three saturated elemental hues would
wreck that. So: dark ground means you are in the game and colour means type;
light ground means you are in the health app. The two never share a surface.

**Everything is earned.** One token per routine item actually ticked. No login
bonus, no reward for opening the app, and re-ticking something already done does
not pay twice. Stage 2 at 15 tokens, stage 3 at 50.

### The one deliberate departure from the format

**The creature cannot die, and never loses an evolution.** Care decays when
ignored, floors at 20%, and one tick restores more than a day of decay.

The Tamagotchi literature is clear that the attachment is inseparable from the
guilt — owners "shoulder the guilty burden of knowing that they alone had been
responsible for the death of their pet". Two reasons that guilt cannot come
into this app:

1. The PRD bans guilt mechanics outright.
2. More seriously: the behaviour being reinforced is taking supplements. A
   creature that starves unless you take a pill applies emotional pressure
   toward daily supplementation, and fat-soluble vitamins like D accumulate.
   This is the one place a game mechanic here could do real harm.

What survives is the entire emotional hook — something depends on you, notices
you, and brightens when you show up. What is removed is the punishment.
`CARE.RECOVER`, `CARE.DECAY` and `CARE.FLOOR` in `data/companion.ts` are the
three numbers to change if the team wants real stakes.

### What this replaced

Home used to carry an invented level, XP total, quest counter, "% filled" bars
and buff chips. Once the companion started earning tokens from real ticks, Home
had two progress systems stacked on each other — one honest, one fabricated,
which makes the gamification impossible to judge. The invented layer is gone
from Home; `NutrientProgressCard` and the values in `data/progress.ts` are still
in the tree if you want it back.

### Still open on the companion

- **Persistence is now real.** The companion is the only thing in the app stored
  on the device (`AsyncStorage`), because a care meter that resets each launch
  measures nothing. Quiz answers and the routine still do not persist.
- **3D was not attempted.** `expo-gl` plus a three.js renderer is a large
  dependency for something the flat vector already does well at this size. The
  `Creature` component is one file, so swapping it later changes nothing else.
- **No sound, no haptics, no evolution animation** beyond the reveal overlay.

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
| 8 | Results cards all white; Home cards coloured by progress level | Both carry the nutrient's identity hue | Three white cards on a near-white page read as one grey wall. No elements were added — the mock's layout, recoloured. |
| 7 | Q1 on `#f8f9ff`, 3 dots, pill CTA | Q2's treatment throughout the quiz | The two quiz mocks came from different batches and read as different apps one tap apart. Q2 is newer and matches the five-question spec. |

## Still open

- **Discover and Profile have no mock.** Built because the nav bar in both mocks
  has four destinations and shipping it with two dead would change the design
  rather than implement it. Both say on screen that they are undesigned. Treat
  them as placeholders, not proposals.
- **Every %DV figure on the detail page is unverified.** They came from the mock.
  Check each against the NIH Office of Dietary Supplements fact sheet
  (ods.od.nih.gov) and cite it. The Sources accordion says so on screen.
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
