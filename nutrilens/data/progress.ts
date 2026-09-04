import { colors } from '../theme';

/**
 * DEMO STATE — every number in this file is invented.
 *
 * The Home and Routine mocks show a gamification layer: an account level, an
 * XP total, a quest counter, a per-nutrient "% filled" bar, and a day streak.
 * None of it has a source. There is no account system, no logging history and
 * no intake model, so nothing in the app can currently compute any of it.
 *
 * It lives here, in one file, for three reasons:
 *   1. The screens stay honest about where the values came from.
 *   2. A reviewer can see the whole fabricated surface at a glance.
 *   3. When real tracking lands, this file is what gets deleted.
 *
 * BEFORE A USABILITY SESSION, decide one of:
 *   (a) keep it, and tell participants up front that the profile is a sample; or
 *   (b) derive it — level and XP from ticked routine items, "% filled" from
 *       logged foods — which is real work, not a copy change; or
 *   (c) cut the layer from the demo build.
 *
 * Option (b) is the only one that survives the question "where does 820 XP come
 * from?", which a tester will ask within about ten seconds of seeing it.
 */

/**
 * The demo persona. The Home mock greets "Chino" and shows a "C" avatar.
 * There is no auth, so this is a stand-in rather than a signed-in user.
 */
export const PROFILE = {
  name: 'Chino',
  initial: 'C',
} as const;

/** Account-level gamification shown beside the "Your nutrients" heading. */
export const ACCOUNT = {
  level: 3,
  xp: 820,
  questsDone: 2,
  questsTotal: 3,
} as const;

export type NutrientAccent = 'amber' | 'emerald' | 'rose';

/** The three-colour accent families the Home cards use. */
export const ACCENT: Record<
  NutrientAccent,
  { base: string; border: string; surface: string; text: string }
> = {
  amber: {
    base: colors.amber,
    border: colors.amberBorder,
    surface: colors.amberSurface,
    text: colors.amberText,
  },
  emerald: {
    base: colors.emeraldStrong,
    border: colors.emeraldBorder,
    surface: colors.emeraldSurface,
    text: colors.emeraldText,
  },
  rose: {
    base: colors.rose,
    border: colors.roseBorder,
    surface: colors.roseSurface,
    text: colors.roseText,
  },
};

export type NutrientProgress = {
  /** Percentage shown on the card overlay and the bar. Invented. */
  percent: number;
  /** Badge text — "Lv.2", "Maxed". Invented. */
  badge: string;
  /** Badge glyph. */
  badgeIcon: 'stars' | 'check-circle' | 'local-fire-department';
  /** The buff chip, e.g. "+20 Bone Shield". Invented. */
  buff: string;
  buffEmoji: string;
  accent: NutrientAccent;
};

/**
 * Per-nutrient card state on Home. Values are taken straight from the mock for
 * the three nutrients it draws; anything else falls back to `DEFAULT_PROGRESS`
 * so the row still renders for a user whose results differ.
 */
export const NUTRIENT_PROGRESS: Record<string, NutrientProgress> = {
  d: {
    percent: 80,
    badge: 'Lv.2',
    badgeIcon: 'stars',
    buff: '+20 Bone Shield',
    buffEmoji: '🛡️',
    accent: 'amber',
  },
  c: {
    percent: 100,
    badge: 'Maxed',
    badgeIcon: 'check-circle',
    buff: '+25 Immunity',
    buffEmoji: '🌿',
    accent: 'emerald',
  },
  b12: {
    percent: 50,
    badge: 'Lv.1',
    badgeIcon: 'local-fire-department',
    buff: '+15 Energy',
    buffEmoji: '⚡',
    accent: 'rose',
  },
};

export const DEFAULT_PROGRESS: NutrientProgress = {
  percent: 0,
  badge: 'Lv.1',
  badgeIcon: 'stars',
  buff: 'Not started',
  buffEmoji: '✨',
  accent: 'amber',
};

export function progressFor(nutrientId: string): NutrientProgress {
  return NUTRIENT_PROGRESS[nutrientId] ?? DEFAULT_PROGRESS;
}

/** Routine tracker: consecutive days logged. Invented. */
export const STREAK_DAYS = 5;

/**
 * Routine tracker: which weekdays are already complete, 0 = Monday.
 * Invented — the app records nothing across days.
 */
export const WEEK_COMPLETED = [0, 1, 2];

/** "Learn more" cards on Home and the Discover tab. Titles only; no articles exist. */
export const ARTICLES = [
  { id: 'b12-campus', title: 'Why B12 matters on a campus diet', meta: '3 min read', tint: colors.tintBlue },
  { id: 'russell-produce', title: 'Cheap produce near Russell Blvd', meta: 'Guide', tint: colors.tintNeutral },
] as const;

/**
 * Demo seed for the routine store.
 *
 * The Home and Routine mocks both draw a populated routine — items present,
 * some already ticked. A fresh install has an empty one, so opening the app
 * cold shows an empty state that looks nothing like the design.
 *
 * Rather than fake the empty state away inside the screens, the store starts
 * seeded and this is the single switch that controls it. Set to false for a
 * real usability session: watching someone arrive at an genuinely empty routine
 * and work out how to fill it is most of what that session is for.
 */
export const SEED_DEMO_ROUTINE = true;

/** Nutrients pre-added when the seed is on. */
export const SEED_NUTRIENTS = ['d', 'b12'];

/** Routine item ids pre-ticked when the seed is on. Ids are `<nutrient>-<index>`. */
export const SEED_DONE = ['d-0', 'd-1', 'd-2'];

/**
 * The mascot tip on the routine tracker.
 *
 * CONFLICT — FLAGGED, NOT RESOLVED. This line breaks two of the project's own
 * stated guardrails at once:
 *   1. It puts a health claim in the mascot's mouth. The rule is that Vito
 *      carries tone and never information; anything he "says" must be real text
 *      the screen would carry anyway.
 *   2. The figure is uncited. The rule is never to state a statistic without a
 *      source, because a number is the one thing a reader can trivially check.
 *
 * It is built as drawn because it is in the mock and the design is yours to
 * set. The underlying claim is probably sound — vitamin D is fat-soluble, and
 * the 32% figure closely matches Dawson-Hughes et al. (2015), which found
 * higher serum levels when the dose was taken with the largest fat-containing
 * meal. So this is likely a citation problem rather than a wrong fact.
 *
 * Three ways out, cheapest first:
 *   (a) add the citation and attribute the line to the app, not the mascot;
 *   (b) keep Vito, drop the number: "Vitamin D absorbs better with a meal";
 *   (c) cut the row.
 */
export const ROUTINE_TIP = {
  attribution: "Vito's tip:",
  body: 'Taking Vitamin D with a fat source aids absorption by 32%.',
  /** Set this and the claim becomes defensible. */
  citation: null as string | null,
};
