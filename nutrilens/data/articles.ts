import { colors } from '../theme';

/**
 * The Discover reading, actually written.
 *
 * These were two titles with "not written yet" under them, which is honest but
 * makes a whole tab non-functional. They are written now, under three rules
 * that the rest of the app already follows:
 *
 *   NO STATISTICS. Not one number that would need a citation. Every "%DV" style
 *   figure in this build is still unverified, and adding more unsourced numbers
 *   in prose — where they are harder to audit than in a data file — is the
 *   fastest way to make the whole app untrustworthy.
 *
 *   NO DIAGNOSIS. Nothing says "you are low in X" or "this will fix Y".
 *
 *   NO INVENTED FACTS. The second piece was titled "Cheap produce near Russell
 *   Blvd". Writing it would have meant inventing shops, days and prices for a
 *   real street in Davis, presented to students who could walk there and find
 *   it wrong. It is now a budget piece that makes no claim about any specific
 *   place. If someone on the team has actually surveyed the local shops, the
 *   original title is worth restoring with their real data behind it.
 */
export type Article = {
  id: string;
  title: string;
  /** Reading time or format, shown under the title. */
  meta: string;
  tint: string;
  /** One line on the card and at the top of the piece. */
  standfirst: string;
  sections: { heading: string; body: string }[];
  /** Shown at the end. Keeps the "we are not your doctor" line attached. */
  footnote?: string;
};

export const ARTICLES: Article[] = [
  {
    id: 'b12-campus',
    title: 'Why B12 matters on a campus diet',
    meta: '3 min read',
    tint: colors.tintBlue,
    standfirst:
      'It is the one nutrient where cutting out a food group actually removes the source rather than just reducing it.',
    sections: [
      {
        heading: 'Where it comes from',
        body: 'B12 is made by bacteria, not by plants or animals. Animals accumulate it, which is why it shows up in meat, fish, eggs and dairy and essentially nowhere else in an unfortified diet. This makes it different from most nutrients in this app: with vitamin C or iron there is always another food to reach for, but with B12 an entirely plant-based diet has no natural source at all.',
      },
      {
        heading: 'Why students in particular',
        body: 'Not because being a student changes your biology. Because the diet changes fast and in one direction — cooking less, eating cheaper, and often cutting meat first, since it is the most expensive thing in the basket. The switch usually happens without anyone mentioning that this specific nutrient does not come along with the rest of the diet.',
      },
      {
        heading: 'What actually covers it',
        body: 'Fortified foods and supplements, mainly. Nutritional yeast, fortified plant milks and fortified cereals all carry added B12 — but "fortified" is a choice the manufacturer made, not a property of the food, so two nearly identical cartons on the same shelf can differ. It is worth reading the panel once and then buying the same thing.',
      },
      {
        heading: 'The slow part',
        body: 'The liver holds a reserve, so a change in diet does not show up immediately. That sounds reassuring and is mostly the opposite: it means the gap between changing how you eat and noticing anything can be long enough that nobody connects the two. That is the argument for sorting it out when the diet changes, rather than waiting to feel something.',
      },
    ],
    footnote:
      'If you have been off animal foods for a while and want to know where you actually stand, that is a blood test and a conversation with a clinician — not something this app can tell you.',
  },
  {
    id: 'budget-produce',
    title: 'Eating well on a student budget',
    meta: 'Guide',
    tint: colors.tintNeutral,
    standfirst:
      'Most of the advice about eating better assumes a car, a kitchen and time. Here is what is left when you remove those.',
    sections: [
      {
        heading: 'Frozen is not the compromise',
        body: 'Frozen fruit and vegetables are picked ripe and frozen quickly, whereas fresh produce is picked early and spends days getting to you. For most things the nutritional difference is small in either direction. What is not small is the waste: frozen keeps for months, so the bag you buy is the bag you eat, instead of the salad that liquefies in the fridge by Thursday.',
      },
      {
        heading: 'Tinned counts',
        body: 'Tinned tomatoes, beans, lentils, sweetcorn and fish are cheap, keep indefinitely, need no preparation and survive a shared kitchen. Tinned beans in particular do a lot of work in this app — they are an iron source, a protein source and a fibre source in the same tin. Rinsing them takes the edge off the salt.',
      },
      {
        heading: 'Buy what is in season, without tracking what is in season',
        body: 'You do not need a calendar. Whatever is stacked highest and priced lowest at the front of the shop is in season, because that is how produce pricing works. Shopping that way costs nothing to learn and quietly rotates your diet through the year.',
      },
      {
        heading: 'The end-of-day shelf',
        body: 'Most shops reduce fresh items on their last day. Anything you are going to cook or freeze that evening is fine to buy reduced. This is worth knowing because it makes the expensive category — fresh produce, meat, fish — occasionally the cheap one.',
      },
      {
        heading: 'One tin, one frozen bag, one fresh thing',
        body: 'A workable shortcut when standing in the aisle with no plan. The tin is the base, the frozen bag is the vegetable, and the fresh thing is whatever you actually want to eat that week. It is not a meal plan and it is not trying to be — it is a way of leaving the shop with something that becomes food.',
      },
    ],
    footnote:
      'No shop, brand or price is named here on purpose. If your team surveys what is actually available locally, that version of this guide would be more useful than this one.',
  },
];

export function articleById(id: string): Article | undefined {
  return ARTICLES.find((a) => a.id === id);
}
