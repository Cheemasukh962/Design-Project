import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CARE,
  SPECIES,
  SPECIES_LIST,
  STAGE_THRESHOLDS,
  decayCare,
  daysBetween,
  moodForCare,
  moodLine,
  stageForTokens,
  stageProgress,
  tokensToNextStage,
} from './companion.ts';

/* ------------------------------------------------------------------ HP */

test('a day away costs DECAY', () => {
  assert.equal(decayCare(100, 1), 100 - CARE.DECAY);
});

test('HP never falls below the floor, however long you are away', () => {
  // The floor is the whole reason this is not a Tamagotchi. An empty heart is
  // a picture of a dead pet and this app does not do that.
  assert.equal(decayCare(100, 365), CARE.FLOOR);
  assert.equal(decayCare(CARE.FLOOR, 10), CARE.FLOOR);
});

test('no elapsed days is no decay', () => {
  assert.equal(decayCare(64, 0), 64);
  assert.equal(decayCare(64, -3), 64);
});

test('one good day undoes several bad ones', () => {
  // Recovery is deliberately larger than a day of decay, so the meter never
  // becomes a hole the user has to climb out of.
  assert.ok(CARE.RECOVER > CARE.DECAY);
});

test('mood follows HP downward without gaps', () => {
  assert.equal(moodForCare(100), 'happy');
  assert.equal(moodForCare(75), 'happy');
  assert.equal(moodForCare(74), 'content');
  assert.equal(moodForCare(50), 'content');
  assert.equal(moodForCare(49), 'sleepy');
  assert.equal(moodForCare(30), 'sleepy');
  assert.equal(moodForCare(29), 'droopy');
  assert.equal(moodForCare(CARE.FLOOR), 'droopy');
});

test('every species has a line for every mood', () => {
  for (const species of SPECIES_LIST) {
    for (const mood of ['happy', 'content', 'sleepy', 'droopy'] as const) {
      const line = moodLine(species.id, mood);
      assert.ok(line.length > 0, `${species.id}/${mood} is empty`);
    }
  }
});

test('the pal never comments on the user or their body', () => {
  // The guardrail: anything the mascot says could be deleted without losing
  // information. It talks about itself, never about your health.
  const banned = /\b(you are|your body|deficien|healthy|unhealthy|you should)\b/i;
  for (const species of SPECIES_LIST) {
    for (const mood of ['happy', 'content', 'sleepy', 'droopy'] as const) {
      assert.doesNotMatch(moodLine(species.id, mood), banned);
    }
  }
});

/* -------------------------------------------------------------- growth */

test('stages come from tokens at the published thresholds', () => {
  assert.equal(stageForTokens(0), 0);
  assert.equal(stageForTokens(STAGE_THRESHOLDS[1] - 1), 0);
  assert.equal(stageForTokens(STAGE_THRESHOLDS[1]), 1);
  assert.equal(stageForTokens(STAGE_THRESHOLDS[2]), 2);
  assert.equal(stageForTokens(999), 2);
});

test('progress runs 0 to 1 and stops at fully grown', () => {
  assert.equal(stageProgress(0), 0);
  assert.equal(stageProgress(STAGE_THRESHOLDS[2]), 1);
  const mid = stageProgress(Math.floor(STAGE_THRESHOLDS[1] / 2));
  assert.ok(mid > 0 && mid < 1);
});

test('the countdown reaches zero exactly at the threshold', () => {
  assert.equal(tokensToNextStage(0), STAGE_THRESHOLDS[1]);
  assert.equal(tokensToNextStage(STAGE_THRESHOLDS[1]), STAGE_THRESHOLDS[2] - STAGE_THRESHOLDS[1]);
  assert.equal(tokensToNextStage(STAGE_THRESHOLDS[2]), 0);
});

test('thresholds are reachable by daily ticking', () => {
  // A five-item routine at one token per tick should reach the final form in
  // a few weeks, not never. This is the bug that made the pal unable to grow.
  const perDay = 5;
  assert.ok(STAGE_THRESHOLDS[2] / perDay < 30);
});

test('every species has three named forms', () => {
  for (const species of SPECIES_LIST) {
    assert.equal(species.names.length, 3);
    assert.equal(new Set(species.names).size, 3);
  }
  assert.equal(Object.keys(SPECIES).length, 3);
});

/* ---------------------------------------------------------------- dates */

test('daysBetween counts whole days and never goes negative', () => {
  assert.equal(daysBetween('2026-09-01', '2026-09-05'), 4);
  assert.equal(daysBetween('2026-09-05', '2026-09-05'), 0);
  assert.equal(daysBetween('2026-09-09', '2026-09-05'), 0);
});
