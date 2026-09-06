/**
 * The routine's rules, with no React in them.
 *
 * Split out of RoutineContext so the parts that can be reasoned about — what a
 * pick resolves to, what a restriction removes, what counts as a streak — can
 * be read and tested without mounting a provider. The context file is now the
 * storage and wiring around these functions.
 *
 * Everything here is pure: same input, same output, no dates read from the
 * clock except where a parameter is explicitly a "today".
 */

export type RoutineItemType = 'supplement' | 'food' | 'habit';

export type RoutineItem = {
  id: string;
  /** Nutrient this item serves, when it came from a result. */
  nutrientId?: string;
  title: string;
  detail: string;
  type: RoutineItemType;
};

/**
 * What a nutrient expands into once it is in the routine.
 *
 * A nutrient is not itself a thing you do, so adding one has to produce actual
 * actions. Each nutrient offers a food route and a habit route alongside the
 * supplement, because defaulting a 20-year-old to a pill for something a meal
 * would fix is the wrong instinct — and it is the reason the PRD warns against
 * a pill-shaped mascot.
 */
type Expansion = Omit<RoutineItem, 'id' | 'nutrientId'> & {
  /** Restriction ids that remove this item entirely. */
  excludedBy?: string[];
  /**
   * Restriction id -> replacement title. Most items narrow rather than drop:
   * telling someone who avoids dairy that calcium is simply unavailable to them
   * would be both wrong and the opposite of useful, since they are exactly the
   * person the finding was raised for.
   */
  narrows?: Record<string, string>;
};

const EXPANSIONS: Record<string, Expansion[]> = {
  d: [
    { title: 'Vitamin D3, 1,000 IU', detail: 'Morning, with food', type: 'supplement' },
    { title: '15 minutes outside', detail: 'Around midday', type: 'habit' },
    {
      title: 'Salmon fillet or 2 eggs',
      detail: 'Lunch or dinner',
      type: 'food',
      narrows: { 'no-fish': '2 eggs' },
    },
  ],
  b12: [
    { title: 'B12 supplement', detail: 'Morning', type: 'supplement' },
    {
      title: 'Fortified cereal or nutritional yeast',
      detail: 'Breakfast',
      type: 'food',
      narrows: { 'gluten-free': 'Gluten-free fortified cereal or nutritional yeast' },
    },
  ],
  c: [
    { title: 'Vitamin C tablet', detail: 'Any time', type: 'supplement' },
    { title: 'A piece of fruit', detail: 'Any time — it is not stored', type: 'food' },
    { title: 'Peppers or greens with a meal', detail: 'Lunch or dinner', type: 'food' },
  ],
  iron: [
    // No dose. Iron is the one nutrient here where too much is genuinely
    // dangerous, and this app is in no position to suggest a number.
    { title: 'Iron supplement', detail: 'Check the dose with a pharmacist', type: 'supplement' },
    { title: 'Beans, lentils or leafy greens', detail: 'With something citrus', type: 'food' },
  ],
  calcium: [
    { title: 'Calcium supplement', detail: 'With a meal', type: 'supplement' },
    {
      title: 'Fortified milk or yoghurt',
      detail: 'Breakfast',
      type: 'food',
      narrows: { 'no-dairy': 'Fortified plant milk, tofu or leafy greens' },
    },
  ],
};

/**
 * Every route in the catalogue, flattened, with the id it will carry.
 *
 * Ids are `<nutrient>-<index into the raw list>`. Indexing the RAW list rather
 * than the restriction-filtered one is what makes an id stable: filtering used
 * to happen first, so answering "no fish" renumbered every item below it and
 * a stored tick silently pointed at a different row.
 */
export type RoutineOption = {
  id: string;
  nutrientId: string;
  title: string;
  detail: string;
  type: RoutineItemType;
  excludedBy?: string[];
  narrows?: Record<string, string>;
};

export const ALL_OPTIONS: RoutineOption[] = Object.entries(EXPANSIONS).flatMap(
  ([nutrientId, list]) =>
    list.map((e, i) => ({ ...e, id: `${nutrientId}-${i}`, nutrientId })),
);

/** The supplement route for a nutrient — what "add this vitamin" means. */
export function supplementOption(nutrientId: string): RoutineOption | undefined {
  return ALL_OPTIONS.find((o) => o.nutrientId === nutrientId && o.type === 'supplement');
}

/** Fast lookup for resolving a pick. A linear scan per pick was fine at five
 * nutrients and is the kind of thing that quietly stops being fine. */
const BY_ID = new Map(ALL_OPTIONS.map((o) => [o.id, o]));

export function optionById(id: string): RoutineOption | undefined {
  return BY_ID.get(id);
}

/**
 * Turns the chosen route ids into the rows shown on screen.
 *
 * Restrictions are applied here rather than at pick time, so answering the
 * quiz differently changes the routine immediately and reversibly — a route
 * removed by "no fish" comes back if that answer is removed, because the pick
 * itself was never thrown away.
 */
export function resolveItems(picks: string[], restrictions: string[]): RoutineItem[] {
  return picks
    .map(optionById)
    .filter((o): o is RoutineOption => o !== undefined)
    .filter((o) => !o.excludedBy?.some((id) => restrictions.includes(id)))
    .map((o) => {
      const narrowed = restrictions.map((id) => o.narrows?.[id]).find(Boolean);
      return {
        id: o.id,
        nutrientId: o.nutrientId,
        title: narrowed ?? o.title,
        detail: o.detail,
        type: o.type,
      };
    });
}

/** Nutrients with at least one row in the routine. */
export function nutrientsIn(items: RoutineItem[]): string[] {
  return Array.from(
    new Set(items.map((i) => i.nutrientId).filter((id): id is string => !!id)),
  );
}

/** Local calendar day as YYYY-MM-DD. */
export function isoDay(d: Date): string {
  return `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, '0')}-${`${d.getDate()}`.padStart(2, '0')}`;
}

/**
 * Consecutive days ending today with at least one item ticked.
 *
 * A day with nothing ticked yet does not break the streak — the count simply
 * starts from yesterday — because otherwise every morning would open on
 * "0-day streak" and the number would be useless before lunch.
 */
export function streakFrom(
  history: Record<string, number>,
  from: Date = new Date(),
): number {
  const cursor = new Date(from);
  if (!(history[isoDay(cursor)] > 0)) cursor.setDate(cursor.getDate() - 1);
  let days = 0;
  while (history[isoDay(cursor)] > 0) {
    days += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return days;
}
