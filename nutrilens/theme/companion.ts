/**
 * The companion world's palette.
 *
 * CONTAINMENT IS THE WHOLE IDEA. The nutrition app is light — #f8f9ff
 * throughout — and carries a strict colour language: gold means "worth a look",
 * green means "done", red is banned outright. Dropping three saturated
 * elemental hues into that would wreck it: an orange creature next to a gold
 * insight card makes the reader ask which orange means what.
 *
 * So the companion lives on a deep navy ground of its own. Anywhere you see
 * that ground, you are in the game and these colours mean elemental type.
 * Anywhere you see the light ground, you are in the health app and colour
 * means what it always meant. The two never mix on one surface.
 *
 * The navy is the brand's own Aggie Blue pushed darker, so the game reads as
 * part of the product rather than a bolted-on minigame — and the creatures'
 * outlines are that same navy rather than black.
 */

export const companion = {
  /** The game ground. Everything creature-related sits on this. */
  night: '#041B33',
  /** A raised surface inside the game ground — cards, meters. */
  nightRaised: '#0B2A47',
  /** Hairlines on the night ground. */
  nightLine: '#1C4368',
  /** Body text on the night ground. */
  onNight: '#D8E6F5',
  /** Secondary text on the night ground. */
  onNightMuted: '#7E9DBE',
  /** Every creature is outlined in brand navy, never black. */
  outline: '#022851',
} as const;

export type SpeciesPalette = {
  /** Main body fill. */
  base: string;
  /** Belly / underside. */
  belly: string;
  /** Crest, highlights, the energy of the thing. */
  accent: string;
  /** The glow behind the creature on the night ground. */
  glow: string;
};

/**
 * One palette per elemental type. Three hues, deliberately far apart on the
 * wheel so the three starters are distinguishable in silhouette-plus-colour
 * even at the 40px size they appear at on Home.
 */
export const speciesPalettes: Record<'ember' | 'tide' | 'sprout', SpeciesPalette> = {
  ember: {
    base: '#E4572E',
    belly: '#FFBF00',
    accent: '#FF8A5B',
    glow: 'rgba(228,87,46,0.35)',
  },
  tide: {
    base: '#1E9BB5',
    belly: '#A9DDE2',
    accent: '#5FC8DC',
    glow: 'rgba(30,155,181,0.35)',
  },
  sprout: {
    base: '#3E9B6B',
    belly: '#DCEBD8',
    accent: '#6FCB92',
    glow: 'rgba(62,155,107,0.35)',
  },
};
