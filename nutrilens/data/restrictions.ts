import type { FoodSource } from './nutrients';

/**
 * What a dietary restriction actually does to the advice.
 *
 * This file exists because of a rule stated in data/quiz.ts: an option that
 * cannot change a result does not belong in the quiz. Before this, three of the
 * six Q5 answers were collected and then ignored — "No fish", "Gluten free" and
 * "Halal / Kosher" changed nothing on any screen. Asking someone to declare a
 * restriction and then recommending salmon anyway is worse than not asking.
 *
 * Two mechanisms, deliberately distinct:
 *
 *   EXCLUDED  — the food is removed from every suggestion.
 *   RELABELLED — the food stays, but is named in a form the user can eat.
 *
 * Halal and kosher are the reason the second exists. They govern how meat is
 * sourced and prepared, not whether meat is eaten, so removing meat outright
 * would be wrong — it would strip a genuine iron source from someone who eats
 * it. The suggestion is renamed instead.
 */

/** Food labels removed outright, keyed by restriction id. */
const EXCLUDES: Record<string, string[]> = {
  'no-meat': ['Red meat'],
  'no-dairy': ['Dairy', 'Fortified milk'],
  'no-fish': ['Wild salmon'],
};

/** Food labels rewritten rather than dropped, keyed by restriction id. */
const RELABELS: Record<string, Record<string, string>> = {
  'halal-kosher': { 'Red meat': 'Halal or kosher meat' },
  // Most fortified cereals are wheat-based, but gluten-free fortified products
  // exist and are a real B12 and iron route. Narrow the suggestion, keep it.
  'gluten-free': { 'Fortified foods': 'Gluten-free fortified foods' },
};

/**
 * Applies the user's restrictions to a nutrient's food sources.
 *
 * Never returns an empty list while any source survives exclusion — and if
 * every source is excluded, returns an empty array so the caller can say so
 * honestly rather than showing a food the user told us they do not eat.
 */
export function applyRestrictions(
  foods: FoodSource[],
  restrictions: string[],
): FoodSource[] {
  if (restrictions.length === 0) return foods;

  const banned = new Set(
    restrictions.flatMap((id) => EXCLUDES[id] ?? []),
  );
  const renames = Object.assign(
    {},
    ...restrictions.map((id) => RELABELS[id] ?? {}),
  ) as Record<string, string>;

  return foods
    .filter((food) => !banned.has(food.label))
    .map((food) =>
      renames[food.label] ? { ...food, label: renames[food.label] } : food,
    );
}

/**
 * The caveat shown on Results when someone reports food allergies.
 *
 * "Food allergies" is the one Q5 answer we cannot act on directly — we never
 * asked which allergies, and guessing would be dangerous. So it does the only
 * honest thing an unqualified answer can: it changes what we say, not what we
 * recommend. Asking for specifics would mean a medical intake form, which the
 * PRD puts out of scope.
 */
export const ALLERGY_CAVEAT =
  'You told us you have food allergies. We do not know which, so check any food suggestion here against your own before acting on it.';

export function hasAllergyFlag(restrictions: string[]): boolean {
  return restrictions.includes('allergies');
}
