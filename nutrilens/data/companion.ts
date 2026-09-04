import { speciesPalettes, type SpeciesPalette } from '../theme/companion';

/**
 * The companion system.
 *
 * DESIGN SOURCES. Two pieces of research shape this file, and both are worth
 * knowing before changing anything in it.
 *
 * 1. Ken Sugimori on designing starters: the three are split by *personality*,
 *    not just element — "a cool one, a serious one, a funny one". The other
 *    rule is the silhouette test: fill the character solid black and it should
 *    still be recognisable, which is why every form here is built from circles
 *    and triangles rather than detail.
 *
 * 2. The Tamagotchi literature: the attachment is real, and so is the guilt.
 *    Owners "shoulder the guilty burden of knowing that they alone had been
 *    responsible for the death of their pet". That guilt is the contested part
 *    of the format, and it is the part this app must not import — see CARE.
 */

export type SpeciesId = 'ember' | 'tide' | 'sprout';
export type Stage = 0 | 1 | 2;

export type Species = {
  id: SpeciesId;
  /** Names by stage. Portmanteaus, as the genre expects. */
  names: [string, string, string];
  /** The Sugimori personality split. */
  personality: string;
  /** One line shown on the starter screen. */
  pitch: string;
  /**
   * The nutrients this species is drawn from.
   *
   * This is the part that stops the game being bolted on: each element maps
   * to a real food group in the quiz, so the creature a user picks is tied to
   * the nutrition domain rather than floating beside it.
   */
  affinity: string[];
  palette: SpeciesPalette;
  /** Head ornament shape. Drives the silhouette, so it is per species. */
  crest: 'flame' | 'cloud' | 'leaf';
};

export const SPECIES: Record<SpeciesId, Species> = {
  ember: {
    id: 'ember',
    names: ['Solen', 'Solara', 'Solarch'],
    personality: 'The cool one',
    pitch: 'Runs on daylight and iron. Acts like it already knew that.',
    affinity: ['Vitamin D', 'Vitamin B12', 'Iron'],
    palette: speciesPalettes.ember,
    crest: 'flame',
  },
  tide: {
    id: 'tide',
    names: ['Nimbi', 'Nimbus', 'Nimbora'],
    personality: 'The serious one',
    pitch: 'Quiet, steady, and quietly judging your calcium intake.',
    affinity: ['Calcium', 'Vitamin D'],
    palette: speciesPalettes.tide,
    crest: 'cloud',
  },
  sprout: {
    id: 'sprout',
    names: ['Sprig', 'Sprout', 'Sylvan'],
    personality: 'The funny one',
    pitch: 'Powered entirely by fruit and enthusiasm. Mostly enthusiasm.',
    affinity: ['Vitamin C', 'Iron', 'Fibre'],
    palette: speciesPalettes.sprout,
    crest: 'leaf',
  },
};

export const SPECIES_LIST = [SPECIES.ember, SPECIES.tide, SPECIES.sprout];

/**
 * Tokens.
 *
 * One token per routine item actually ticked. Nothing else grants them — no
 * login bonus, no "opened the app" reward — because the only thing worth
 * reinforcing here is the behaviour the product exists to support, and a
 * currency you can earn by doing nothing teaches that doing nothing works.
 */
export const TOKENS_PER_ITEM = 1;

/** Tokens needed to reach each stage. Index is the stage being entered. */
export const STAGE_THRESHOLDS: [number, number, number] = [0, 15, 50];

export function stageForTokens(tokens: number): Stage {
  if (tokens >= STAGE_THRESHOLDS[2]) return 2;
  if (tokens >= STAGE_THRESHOLDS[1]) return 1;
  return 0;
}

/** Progress toward the next stage, 0-1. Returns 1 when fully evolved. */
export function stageProgress(tokens: number): number {
  const stage = stageForTokens(tokens);
  if (stage === 2) return 1;
  const from = STAGE_THRESHOLDS[stage];
  const to = STAGE_THRESHOLDS[stage + 1];
  return Math.min(1, Math.max(0, (tokens - from) / (to - from)));
}

export function tokensToNextStage(tokens: number): number {
  const stage = stageForTokens(tokens);
  if (stage === 2) return 0;
  return STAGE_THRESHOLDS[stage + 1] - tokens;
}

/**
 * CARE — and the one deliberate departure from the Tamagotchi format.
 *
 * The creature gets tired when it is ignored. It does NOT die, it does NOT
 * lose an evolution, and it never drops below `FLOOR`. Two reasons, and the
 * second is the important one:
 *
 * 1. The PRD bans guilt mechanics outright. A wellness app that manufactures
 *    dread about opening it has failed at the thing it claims to do.
 *
 * 2. Specific to this product: the action being reinforced is taking
 *    supplements. A creature that starves unless you take a pill applies
 *    emotional pressure toward daily supplementation — and fat-soluble
 *    vitamins like D accumulate, so "more, every day, or the pet suffers" is
 *    not a neutral message to send. This is the one place where a game
 *    mechanic in this app could do real harm rather than just annoy.
 *
 * What survives is the whole emotional hook: something depends on you, notices
 * you, and brightens when you show up. What is removed is the punishment.
 * Recovery is one tick — deliberately cheaper than the decay.
 *
 * If the team decides it wants real stakes, RECOVER / DECAY / FLOOR are the
 * three numbers to change, and they are all here.
 */
export const CARE = {
  /** Starting and maximum value. */
  MAX: 100,
  /**
   * The lowest care can ever go. A dull, sleepy creature — never a dead one,
   * and never a screen that says you failed.
   */
  FLOOR: 20,
  /** Gained on a day where at least one routine item is ticked. */
  RECOVER: 25,
  /** Lost per full day with nothing ticked. */
  DECAY: 8,
} as const;

export type Mood = 'happy' | 'content' | 'sleepy' | 'droopy';

export function moodForCare(care: number): Mood {
  if (care >= 75) return 'happy';
  if (care >= 50) return 'content';
  if (care >= 30) return 'sleepy';
  return 'droopy';
}

/**
 * What the creature "says", per species and mood.
 *
 * Species-specific because personality is the whole point of the starter split
 * — a generic line makes the three interchangeable, which is exactly what the
 * cool / serious / funny division exists to prevent. The serious one should not
 * be described as "bouncing".
 *
 * None of these is a health claim. The creature never comments on the user's
 * body, their diet, or what they should take — only on itself. That keeps the
 * mascot inside the guardrail: anything it says could be deleted without losing
 * information.
 */
export const MOOD_LINE: Record<SpeciesId, Record<Mood, string>> = {
  ember: {
    happy: 'Showing off. Pretending it is not showing off.',
    content: 'Warm and unbothered.',
    sleepy: 'Dimming a bit. It perks up when you tick something off.',
    droopy: 'Barely smouldering. One tick brings it back.',
  },
  tide: {
    happy: 'Calm, and quietly very pleased.',
    content: 'Settled. Steady as usual.',
    sleepy: 'Going still. It wakes up when you tick something off.',
    droopy: 'Gone quiet. One tick is enough to stir it.',
  },
  sprout: {
    happy: 'Bouncing. Absolutely delighted with you.',
    content: 'Perky and getting on with it.',
    sleepy: 'Wilting slightly. It perks up when you tick something off.',
    droopy: 'Drooping. One tick and it springs back.',
  },
};

/** Convenience for callers that already know both. */
export function moodLine(species: SpeciesId, mood: Mood): string {
  return MOOD_LINE[species][mood];
}

/**
 * Applies elapsed-day decay.
 *
 * Care is stored with the date it was last updated, and the drop is computed
 * on load rather than by a timer — a timer would need the app to be open,
 * which is exactly when the user is not neglecting it.
 */
export function decayCare(care: number, daysMissed: number): number {
  if (daysMissed <= 0) return care;
  return Math.max(CARE.FLOOR, care - daysMissed * CARE.DECAY);
}

/** Whole days between two ISO date strings (date-only comparison). */
export function daysBetween(fromISO: string, toISO: string): number {
  const a = new Date(fromISO.slice(0, 10)).getTime();
  const b = new Date(toISO.slice(0, 10)).getTime();
  return Math.max(0, Math.round((b - a) / 86_400_000));
}

/** Today as a date-only ISO string. */
export function today(): string {
  return new Date().toISOString().slice(0, 10);
}
