import type { QuizAnswers } from './QuizContext';
import { NUTRIENTS, type Nutrient } from './nutrients';
import { Q2, Q5 } from './quiz';

export type Finding = {
  nutrient: Nutrient;
  /**
   * The sentence shown under the nutrient name. It must quote the user's own
   * answer back to them — "You said…", "You picked…" — never a generic fact
   * about the nutrient. This is the whole transparency mechanism: a result the
   * user can trace to something they typed is a result they can argue with.
   */
  reason: string;
  /** Higher sorts first. Only relative order matters, not the value. */
  weight: number;
};

/** Human-readable list: ["a","b","c"] -> "a, b or c". */
function orList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} or ${items[items.length - 1]}`;
}

const foodLabel = (id: string) =>
  Q2.options.find((o) => o.id === id)?.label ?? id;
const restrictionLabel = (id: string) =>
  Q5.options.find((o) => o.id === id)?.label ?? id;

/**
 * The rules in one sentence each, for the "How this works" screen.
 *
 * KEEP THIS IN SYNC WITH inferFindings BELOW. It lives in this file, directly
 * above the implementation, precisely so that a change to a condition and a
 * change to its description are the same diff. Printing the rules is the whole
 * transparency argument — a description that has drifted from the code is
 * worse than printing nothing, because it is a claim about behaviour that is
 * no longer true.
 */
export const RULES: { id: string; nutrientId: string; when: string }[] = [
  {
    id: 'd',
    nutrientId: 'Vitamin D',
    when: 'You are outside less than 30 minutes on a normal day.',
  },
  {
    id: 'b12',
    nutrientId: 'Vitamin B12',
    when: 'You eat at most one of dairy, eggs, fish or meat — or you told us no meat.',
  },
  {
    id: 'c',
    nutrientId: 'Vitamin C',
    when: 'Fruit or vegetables show up rarely, or about once a day.',
  },
  {
    id: 'iron',
    nutrientId: 'Iron',
    when: 'You eat neither meat nor fish, or you told us you avoid one of them.',
  },
  {
    id: 'calcium',
    nutrientId: 'Calcium',
    when: 'You did not pick dairy, or you told us no dairy.',
  },
];

/** At most three findings are ever shown, highest weight first. */
export const MAX_FINDINGS = 3;

/**
 * Turns quiz answers into at most three findings.
 *
 * These are deliberately simple, readable rules rather than a model — the
 * "How this works" screen promises the user exactly this, and a rule you can
 * print in one sentence is a rule you can defend in a design review.
 *
 * Nothing here diagnoses. A finding says a nutrient is commonly low in diets
 * shaped like this one; it never says anything about this person's body.
 */
export function inferFindings(answers: QuizAnswers): Finding[] {
  const { foods, restrictions, outside, produce } = answers;
  const findings: Finding[] = [];

  const eats = (id: string) => foods.includes(id);
  const avoids = (id: string) => restrictions.includes(id);

  // ---- Vitamin D: daylight first, diet second -----------------------------
  const lowSun = outside === 'under-15' || outside === '15-30';
  if (lowSun) {
    const answerText =
      outside === 'under-15'
        ? "You said you're outside under 15 minutes on a normal day."
        : "You said you're outside around 15 to 30 minutes on a normal day.";
    // Fish and fortified dairy are the two food routes that partly cover a
    // low-daylight day. A declared restriction closes one outright, which is
    // stronger evidence than simply not having ticked it in Q2.
    const noFish = avoids('no-fish');
    const noDairy = avoids('no-dairy');
    const dietaryBackup = (eats('fish') && !noFish) || (eats('dairy') && !noDairy);

    let reason = answerText;
    if (noFish || noDairy) {
      const off = [noFish ? 'fish' : null, noDairy ? 'dairy' : null].filter(
        (x): x is string => x !== null,
      );
      reason = `${answerText} You also told us no ${orList(off)}, which rules out the main food sources.`;
    } else if (!dietaryBackup) {
      reason = `${answerText} You also didn't pick fish or dairy.`;
    }

    findings.push({
      nutrient: NUTRIENTS.d,
      reason,
      weight: (outside === 'under-15' ? 100 : 80) + (noFish || noDairy ? 5 : 0),
    });
  }

  // ---- B12: found almost only in animal foods -----------------------------
  const b12Sources = ['dairy', 'eggs', 'fish', 'meat'] as const;
  const picked = b12Sources.filter(eats);
  const missing = b12Sources.filter((id) => !eats(id));
  if (picked.length <= 1 || avoids('no-meat')) {
    const base =
      picked.length === 0
        ? `You didn't pick ${orList(missing.map(foodLabel))} — B12 comes almost entirely from animal foods.`
        : `You picked ${orList(picked.map(foodLabel))} but not ${orList(missing.map(foodLabel))}.`;
    let b12Reason = base;
    if (avoids('no-meat')) {
      b12Reason = `${b12Reason} You also told us: ${restrictionLabel('no-meat').toLowerCase()}.`;
    }
    // Fortified cereal is the standard non-animal B12 route and most of it is
    // wheat-based, so gluten free narrows an already narrow set of options.
    if (avoids('gluten-free')) {
      b12Reason = `${b12Reason} Fortified cereal is the usual alternative, and most of it contains gluten.`;
    }
    findings.push({
      nutrient: NUTRIENTS.b12,
      reason: b12Reason,
      weight: (picked.length === 0 ? 95 : 75) + (avoids('gluten-free') ? 5 : 0),
    });
  }

  // ---- Vitamin C: not stored, so daily intake is what counts --------------
  if (produce === 'rarely' || produce === 'once') {
    const answerText =
      produce === 'rarely'
        ? 'You said you rarely eat fruit or vegetables.'
        : 'You said you eat fruit or vegetables about once a day.';
    findings.push({
      nutrient: NUTRIENTS.c,
      reason: `${answerText} Your body doesn't store vitamin C, so it depends on the day.`,
      weight: produce === 'rarely' ? 90 : 60,
    });
  }

  // ---- Iron: plant iron absorbs less well than the animal kind ------------
  if ((!eats('meat') && !eats('fish')) || avoids('no-meat') || avoids('no-fish')) {
    const alternatives = ['beans', 'greens'].filter(eats).map(foodLabel);
    findings.push({
      nutrient: NUTRIENTS.iron,
      reason: alternatives.length
        ? `You picked ${orList(alternatives)} but not meat or fish. Plant iron is absorbed less easily.`
        : "You didn't pick meat, fish, beans or leafy greens — the common iron sources.",
      weight: 55,
    });
  }

  // ---- Calcium: dairy does most of the work in a typical diet -------------
  if (!eats('dairy') || avoids('no-dairy')) {
    findings.push({
      nutrient: NUTRIENTS.calcium,
      reason: avoids('no-dairy')
        ? "You told us you don't eat dairy, which is where most people get calcium."
        : "You didn't pick dairy or fortified alternatives, the most common calcium sources.",
      weight: 50,
    });
  }

  // Never show more than three. Four or more reads as "everything is wrong
  // with you" and produces paralysis rather than a next step.
  return findings.sort((a, b) => b.weight - a.weight).slice(0, 3);
}

/**
 * Has the user answered anything at all?
 *
 * This gates the fall back to DEMO_ANSWERS. It has to consider all five
 * questions: an earlier version checked only Q1 and Q2, so anyone who entered
 * the flow partway — or answered only the restrictions question — had their
 * real answers silently replaced by the demo persona. Showing someone a result
 * built from a stranger's diet, with no indication it is not theirs, is the
 * worst failure this screen has.
 */
export function hasAnswers(a: QuizAnswers): boolean {
  return (
    a.eating !== undefined ||
    a.outside !== undefined ||
    a.produce !== undefined ||
    a.foods.length > 0 ||
    a.restrictions.length > 0
  );
}

/** Answers used by the demo when someone taps straight through to Results. */
export const DEMO_ANSWERS: QuizAnswers = {
  eating: 'dining-hall',
  foods: ['eggs', 'fruit', 'nuts'],
  outside: 'under-15',
  produce: 'once',
  restrictions: [],
};
