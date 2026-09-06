import type { IconName } from '../components/ui/Icon';
import type { FoodKind } from '../components/nutrient/FoodMark';
import type { PillShape } from '../components/nutrient/PillMark';

export type FoodSource = {
  label: string;
  icon: IconName;
  /**
   * Which illustration to draw. Kept separate from `label` because a
   * restriction can rename the label — "Red meat" becomes "Halal or kosher
   * meat" — and the picture must survive the rename unchanged.
   */
  art: FoodKind;
  /** Headline figure on the detail card — "100% DV", "Optimal". */
  amount?: string;
  /** Portion this figure refers to — "1 palm-sized fillet". */
  portion?: string;
};

/** One of the two supporting facts inside the "What it does" accordion. */
export type NutrientFact = {
  icon: IconName;
  title: string;
  body: string;
};

/**
 * A first-person quote shown on the detail page.
 *
 * READ THIS BEFORE SHOWING THE APP TO ANYONE. The person below is invented.
 * The Stitch mock generated a named athlete, a portrait and a testimonial, none
 * of which correspond to a real person or a real statement. A fabricated named
 * endorsement in a health interface is the single most damaging thing in this
 * build: it is presented as a human vouching for a health behaviour, and a
 * participant has no way to tell it is synthetic.
 *
 * The detail screen therefore prints an "Illustrative persona" line inside the
 * card. Three ways to resolve it properly, in order of preference:
 *   1. Replace with a real, attributed quote you have permission to use.
 *   2. Replace with a sourced statement from a body like the NIH and drop the
 *      person entirely — the content works without a face.
 *   3. Cut the section.
 * Removing the label without doing one of those is the one option that is not
 * on the table.
 */
export type Perspective = {
  quote: string;
  name: string;
  role: string;
  /** Always true right now. Drives the on-card disclosure. */
  fictional: boolean;
};

export type Nutrient = {
  id: string;
  /** Full display name, e.g. "Vitamin B12". */
  name: string;
  /** Letter mark shown in the rounded square. Icons are unreadable this small. */
  letter: string;
  /**
   * The pill silhouette used as this nutrient's mark.
   *
   * Shape, not colour. Five accent hues had crept into the health app and made
   * it look like a paint chart; the palette is back to white and navy, and a
   * capsule / tablet / softgel tells the marks apart inside it.
   */
  pill: PillShape;
  /** One plain sentence. No jargon, no hedging. */
  summary: string;
  /** The "Essential for" grid at the top of the detail page. */
  benefits: string[];
  /** Long-form body inside the "What it does" accordion. */
  detail: string;
  /** Two supporting facts beside the body. */
  facts: NutrientFact[];
  foods: FoodSource[];
  perspective?: Perspective;
};

/**
 * The nutrient catalogue.
 *
 * Content for Vitamin D comes from the Stitch "Vitamin D Reference" mock; the
 * others follow the same shape so the detail screen works for any of them.
 *
 * IMPORTANT — the %DV figures carried over from the mock have NOT been checked
 * against a source. Before this is shown to a test user, every number on the
 * detail page must be verified against the NIH Office of Dietary Supplements
 * fact sheet for that nutrient (ods.od.nih.gov) and cited. A fabricated figure
 * in a health interface is the one thing that is trivially checkable.
 */
export const NUTRIENTS: Record<string, Nutrient> = {
  d: {
    id: 'd',
    pill: 'softgel',
    name: 'Vitamin D',
    letter: 'D',
    summary: 'Helps your body absorb calcium and supports your immune system.',
    benefits: ['Bone strength', 'Immune function', 'Mood and energy', 'Muscle recovery'],
    detail:
      'Vitamin D behaves more like a hormone than a vitamin. It is the key that lets your intestines absorb calcium and phosphorus — the minerals your body uses to build and hold onto bone density.',
    facts: [
      {
        icon: 'shield',
        title: 'Immune defence',
        body: 'Helps regulate the white blood cells that handle seasonal illness.',
      },
      {
        icon: 'fitness-center',
        title: 'Bone and muscle',
        body: 'Supports bone density and the muscle strength that protects it.',
      },
    ],
    foods: [
      { label: 'Wild salmon', art: 'salmon', icon: 'set-meal', amount: '100% DV', portion: '1 palm-sized fillet' },
      { label: 'Whole eggs', art: 'egg', icon: 'egg', amount: '15% DV', portion: '2 large eggs (yolks)' },
      { label: 'Fortified milk', art: 'milk', icon: 'water-drop', amount: '20% DV', portion: '1 cup dairy or plant milk' },
      { label: 'Midday sun', art: 'sun', icon: 'wb-sunny', amount: 'Optimal', portion: '15–20 mins exposure' },
    ],
    perspective: {
      quote:
        'During long winter training blocks and indoor court sessions, keeping my vitamin D up keeps bone stress injuries away, speeds up recovery, and prevents mid-season stamina crashes.',
      name: 'Marcus Vance',
      role: 'All-Star point guard and health advocate',
      fictional: true,
    },
  },
  b12: {
    id: 'b12',
    pill: 'capsule',
    name: 'Vitamin B12',
    letter: 'B12',
    summary: 'Supports nerve function and helps turn food into energy.',
    benefits: ['Nerve function', 'Energy from food', 'Red blood cells'],
    detail:
      'B12 is needed to build red blood cells and to keep the protective sheath around your nerves intact. It occurs almost entirely in animal foods, which is why it is the nutrient that most often comes up for people eating little or no meat and dairy.',
    facts: [
      {
        icon: 'bolt',
        title: 'Steady energy',
        body: 'Part of how your body releases energy from what you eat.',
      },
      {
        icon: 'biotech',
        title: 'Stored, then not',
        body: 'The liver holds a reserve, so a shortfall can take a long time to show.',
      },
    ],
    foods: [
      { label: 'Eggs', art: 'egg', icon: 'egg', portion: '2 large eggs' },
      { label: 'Dairy', art: 'milk', icon: 'water-drop', portion: '1 cup milk or yoghurt' },
      { label: 'Fortified foods', art: 'grain', icon: 'bakery-dining', portion: 'Cereal, nutritional yeast' },
    ],
  },
  c: {
    id: 'c',
    pill: 'tablet',
    name: 'Vitamin C',
    letter: 'C',
    summary: 'An antioxidant that supports healing and iron absorption.',
    benefits: ['Healing and repair', 'Immune support', 'Helps you absorb iron'],
    detail:
      'Vitamin C is water soluble and your body does not store it, so what matters is regular intake rather than any single big serving. It also markedly improves how much iron you absorb from plant foods eaten in the same meal.',
    facts: [
      {
        icon: 'eco',
        title: 'Pairs with iron',
        body: 'Citrus or peppers alongside beans or greens improves iron uptake.',
      },
      {
        icon: 'biotech',
        title: 'Not stored',
        body: 'Excess is passed out daily, so intake depends on the day.',
      },
    ],
    foods: [
      { label: 'Citrus', art: 'citrus', icon: 'fruit-citrus', portion: '1 orange' },
      { label: 'Peppers', art: 'pepper', icon: 'chili-mild', portion: 'Half a bell pepper' },
      { label: 'Leafy greens', art: 'greens', icon: 'eco', portion: '1 cup raw' },
    ],
  },
  iron: {
    id: 'iron',
    pill: 'capsule',
    name: 'Iron',
    letter: 'Fe',
    summary: 'Carries oxygen around your body; low iron shows up as fatigue.',
    benefits: ['Carries oxygen', 'Steady energy', 'Focus and concentration'],
    detail:
      'Iron is what lets your blood carry oxygen. It comes in two forms: the kind in meat and fish is absorbed easily, and the kind in plants is not — which is why the plant sources are usually paired with something high in vitamin C.',
    facts: [
      {
        icon: 'bolt',
        title: 'Fatigue first',
        body: 'Tiredness and poor concentration usually show up before anything else.',
      },
      {
        icon: 'fruit-citrus',
        title: 'Absorption varies',
        body: 'Plant iron absorbs far less readily than the animal form.',
      },
    ],
    foods: [
      { label: 'Beans / lentils', art: 'beans', icon: 'grain', portion: '1 cup cooked' },
      { label: 'Leafy greens', art: 'greens', icon: 'eco', portion: '1 cup cooked' },
      { label: 'Red meat', art: 'meat', icon: 'restaurant', portion: '1 palm-sized portion' },
    ],
  },
  calcium: {
    id: 'calcium',
    pill: 'tablet',
    name: 'Calcium',
    letter: 'Ca',
    summary: 'Builds and maintains bone, and your bones are still forming into your twenties.',
    benefits: ['Bone density', 'Muscle contraction', 'Nerve signalling'],
    detail:
      'Most of the calcium in your body is in your skeleton, and peak bone mass is reached in your twenties — which makes this a nutrient that matters more at college age than at almost any later point.',
    facts: [
      {
        icon: 'fitness-center',
        title: 'A closing window',
        body: 'Bone is still being laid down through your early twenties.',
      },
      {
        icon: 'water-drop',
        title: 'Needs vitamin D',
        body: 'Without enough vitamin D, much of the calcium you eat is not absorbed.',
      },
    ],
    foods: [
      { label: 'Dairy', art: 'milk', icon: 'water-drop', portion: '1 cup milk or yoghurt' },
      { label: 'Fortified foods', art: 'grain', icon: 'bakery-dining', portion: 'Fortified plant milk' },
      { label: 'Leafy greens', art: 'greens', icon: 'eco', portion: '1 cup cooked' },
    ],
  },
};


/** The pill silhouette for a nutrient id. Defaults to a capsule. */
export function pillFor(nutrientId: string): PillShape {
  return NUTRIENTS[nutrientId]?.pill ?? 'capsule';
}
