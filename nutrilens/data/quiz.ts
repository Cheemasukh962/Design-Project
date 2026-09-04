import type { IconName } from '../components/ui/Icon';

/**
 * Quiz content.
 *
 * Q1 and Q2 are lifted verbatim from the Stitch mocks. Q3–Q5 have no mocks —
 * the stepper promises five questions and only two were ever drawn — so they
 * are authored here, against the PRD and against the reasons the Results
 * screen has to be able to give. Each exists because a specific result line
 * needs it:
 *
 *   Q3 (time outside)  -> the Vitamin D reason
 *   Q4 (fruit and veg) -> the Vitamin C reason
 *   Q5 (restrictions)  -> narrows every result, and is the segment question
 *
 * **A question that cannot change a result does not belong in the quiz.** That
 * is why the PRD's "what are you hoping to improve?" goal question is absent:
 * it reads well, but nothing downstream consumes it.
 *
 * The same test applies one level down — **an option that cannot change a
 * result does not belong either.** Every choice in Q5 now feeds something: it
 * changes a finding, filters which foods we suggest, or relabels them. See
 * data/restrictions.ts.
 *
 * Copy lives here rather than in the screens so the wording can be reviewed in
 * one place — every string on a quiz screen is subject to the PRD copy rules
 * (claims about diets, never about this person's body).
 *
 * ON LENGTH: the PRD describes a three-question quiz; the mocks show a
 * five-step stepper. TOTAL_STEPS follows the mocks, and Q3–Q5 earn the extra
 * two steps by producing result lines the first two cannot.
 *
 * ON PRIMING: the insight card explains *why we ask*, never what a good answer
 * looks like. "Time outdoors is the main source of vitamin D" placed above the
 * options invites the user to inflate their answer; the wording below keeps the
 * transparency without setting a target.
 */
export const TOTAL_STEPS = 5;

export type SingleChoice = {
  id: string;
  label: string;
};

export type MultiChoice = SingleChoice & {
  icon: IconName;
};

/** Q1 — eating pattern. Single select. */
export const Q1 = {
  chip: "Let's get to know you",
  question: 'How do you usually eat?',
  options: [
    { id: 'packaged', label: 'Mostly quick and packaged' },
    { id: 'dining-hall', label: 'Dining hall most days' },
    { id: 'cook', label: 'I cook a few times a week' },
    { id: 'balanced', label: 'Pretty balanced' },
  ] satisfies SingleChoice[],
} as const;

/** Q2 — food sources actually eaten. Multi select, the highest-signal question. */
export const Q2 = {
  chip: "Let's get to know you",
  question: 'Which of these do you eat regularly?',
  helper: 'Pick as many as apply.',
  options: [
    // Shortened from the mock's "Dairy or fortified alternatives", which
    // clamps to an ellipsis at this tile width. Meaning is preserved.
    { id: 'dairy', label: 'Dairy / alternatives', icon: 'water-drop' },
    { id: 'eggs', label: 'Eggs', icon: 'egg' },
    { id: 'fish', label: 'Fish', icon: 'set-meal' },
    { id: 'meat', label: 'Meat', icon: 'restaurant' },
    { id: 'beans', label: 'Beans / lentils', icon: 'grain' },
    { id: 'greens', label: 'Leafy greens', icon: 'eco' },
    { id: 'fruit', label: 'Fruit', icon: 'fruit-citrus' },
    { id: 'nuts', label: 'Nuts / seeds', icon: 'spa' },
  ] satisfies MultiChoice[],
  insight:
    "These are common sources of B12, iron and calcium, so we'll pay closer attention to those in your results.",
} as const;

/**
 * Q3 — daylight exposure. Single select. Drives the Vitamin D line.
 *
 * The four buckets span every plausible day, which is why there is no "I'm not
 * sure" here: anyone can place themselves in a range this wide. Q2 offers one
 * because recalling eight food categories is genuinely hard; this is not.
 */
export const Q3 = {
  chip: 'Three to go',
  question: 'On a normal day, how long are you outside?',
  options: [
    { id: 'under-15', label: 'Under 15 minutes' },
    { id: '15-30', label: 'Around 15 to 30 minutes' },
    { id: '30-60', label: 'Half an hour to an hour' },
    { id: 'over-60', label: 'More than an hour' },
  ] satisfies SingleChoice[],
  insight:
    'Most people get their vitamin D from daylight rather than food, which is why we ask. There is no target here — a normal day is the useful answer.',
} as const;

/** Q4 — produce frequency. Single select. Drives the Vitamin C line. */
export const Q4 = {
  chip: 'Two to go',
  question: 'How often do you eat fruit or vegetables?',
  options: [
    { id: 'rarely', label: 'Rarely' },
    { id: 'once', label: 'About once a day' },
    { id: 'twice', label: 'Two or three times a day' },
    { id: 'most-meals', label: 'With most meals' },
  ] satisfies SingleChoice[],
  insight:
    'Your body does not store vitamin C, so this is about a typical day rather than a good week.',
} as const;

/**
 * Q5 — restrictions. Multi select, with one mutually exclusive option.
 *
 * This is the segment question. A restriction is the one constraint a user
 * already knows they have, so it is the strongest signal in the quiz — and the
 * one thing that makes a suggestion useless if we ignore it.
 */
export const Q5 = {
  chip: 'Last one',
  question: 'Is anything off the table for you?',
  helper: 'Pick as many as apply.',
  /** Selecting this clears every other choice, and vice versa. */
  exclusiveId: 'none',
  options: [
    { id: 'no-meat', label: 'No meat', icon: 'restaurant' },
    { id: 'no-dairy', label: 'No dairy', icon: 'water-drop' },
    { id: 'no-fish', label: 'No fish', icon: 'set-meal' },
    { id: 'gluten-free', label: 'Gluten free', icon: 'grain' },
    // "Certified" is genuinely what this is about, and the glyph reads that way
    // rather than as a dietary exclusion — halal and kosher change how a food
    // is sourced, not whether it is eaten.
    { id: 'halal-kosher', label: 'Halal / Kosher', icon: 'verified' },
    { id: 'allergies', label: 'Food allergies', icon: 'help-outline' },
  ] satisfies MultiChoice[],
  noneLabel: 'Nothing in particular',
  insight:
    'A restriction is not a problem to fix — it just changes which foods are the easy ones to reach for.',
} as const;
