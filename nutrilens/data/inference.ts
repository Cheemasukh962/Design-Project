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
    const dietaryBackup = eats('fish') || eats('dairy');
    findings.push({
      nutrient: NUTRIENTS.d,
      reason: dietaryBackup
        ? answerText
        : `${answerText} You also didn't pick fish or dairy.`,
      weight: outside === 'under-15' ? 100 : 80,
    });
  }

  // ---- B12: found almost only in animal foods -----------------------------
  const b12Sources = ['dairy', 'eggs', 'fish', 'meat'] as const;
  const picked = b12Sources.filter(eats);
  const missing = b12Sources.filter((id) => !eats(id));
  if (picked.length <= 1 || avoids('no-meat')) {
    const reason =
      picked.length === 0
        ? `You didn't pick ${orList(missing.map(foodLabel))} — B12 comes almost entirely from animal foods.`
        : `You picked ${orList(picked.map(foodLabel))} but not ${orList(missing.map(foodLabel))}.`;
    findings.push({
      nutrient: NUTRIENTS.b12,
      reason: avoids('no-meat')
        ? `${reason} You also told us: ${restrictionLabel('no-meat').toLowerCase()}.`
        : reason,
      weight: picked.length === 0 ? 95 : 75,
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
  if ((!eats('meat') && !eats('fish')) || avoids('no-meat')) {
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

/** Answers used by the demo when someone taps straight through to Results. */
export const DEMO_ANSWERS: QuizAnswers = {
  eating: 'dining-hall',
  foods: ['eggs', 'fruit', 'nuts'],
  outside: 'under-15',
  produce: 'once',
  restrictions: [],
};
