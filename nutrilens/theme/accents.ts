/**
 * Nutrient identity colours.
 *
 * ONE RULE, AND IT IS ABSOLUTE: a colour here always means a nutrient, and
 * never means a status. Gold is Vitamin D whether the user is doing well or
 * badly at it. The moment orange also means "warning", the whole system
 * collapses and every screen has to be read twice.
 *
 * This replaces the previous scheme on Home, where the accent encoded how
 * "full" a nutrient was — which is what put a red on Vitamin B12 at 50% and
 * broke the PRD guardrail against red for a nutrition state. Quantity now lives
 * on the progress bar, where a quantity belongs.
 *
 * Chosen for distinctness at a glance, since these appear side by side on
 * Results. Gold and orange are the closest pair, so they are pushed apart —
 * D is a true yellow, C is a red-orange. Red proper is avoided entirely, so
 * that nothing in the product can be mistaken for an alarm.
 *
 * Each accent carries four values:
 *   base    — the strong hue: marks, stripes, progress fill
 *   surface — a pale wash for card and chip backgrounds
 *   border  — a mid tint for hairlines on that wash
 *   text    — dark enough to read as body text on `surface` (>= 4.5:1)
 */

export type AccentName = 'gold' | 'orange' | 'violet' | 'bronze' | 'teal';

export type Accent = {
  base: string;
  surface: string;
  border: string;
  text: string;
};

export const accents: Record<AccentName, Accent> = {
  /** Vitamin D — the sun, and the closest of the five to the brand gold. */
  gold: {
    base: '#EAB308',
    surface: '#FEFAE8',
    border: '#FDE68A',
    text: '#854D0E',
  },
  /** Vitamin C — citrus. Pushed to red-orange so it never reads as gold. */
  orange: {
    base: '#EA580C',
    surface: '#FFF3EC',
    border: '#FED7AA',
    text: '#9A3412',
  },
  /** Vitamin B12 — no natural colour, so the most distinct hue available. */
  violet: {
    base: '#7C5CFF',
    surface: '#F2EFFF',
    border: '#D6CCFF',
    text: '#4C31C4',
  },
  /** Iron — literal. Dark enough that it never competes with vitamin C. */
  bronze: {
    base: '#7C2D12',
    surface: '#FAF1EC',
    border: '#E7C9B8',
    text: '#7C2D12',
  },
  /** Calcium — cool and mineral, the only cold accent in the set. */
  teal: {
    base: '#0E7C86',
    surface: '#E9F7F8',
    border: '#A9DDE2',
    text: '#0A5A62',
  },
};

/** Fallback for a nutrient with no accent assigned yet. */
export const NEUTRAL_ACCENT: Accent = {
  base: '#435f8b',
  surface: '#EEF4FA',
  border: '#C4C6D0',
  text: '#022851',
};
