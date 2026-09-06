import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ALL_OPTIONS,
  isoDay,
  nutrientsIn,
  optionById,
  resolveItems,
  streakFrom,
  supplementOption,
} from './routine.ts';

/**
 * Run with `npm test`.
 *
 * These cover the rules, not the rendering. Every one of them is a property
 * that was broken at some point during the build and would not have been
 * caught by looking at a screen: ids that renumbered under a restriction, a
 * streak that counted a day nobody used, a pick that resolved to the wrong row.
 */

test('every nutrient offers a supplement route', () => {
  for (const id of ['d', 'b12', 'c', 'iron', 'calcium']) {
    assert.ok(supplementOption(id), `${id} has no supplement route`);
  }
});

test('the supplement is what "add this vitamin" resolves to', () => {
  assert.equal(supplementOption('d')?.id, 'd-0');
  assert.equal(supplementOption('iron')?.type, 'supplement');
});

test('iron carries no dose', () => {
  // Too much iron is genuinely dangerous and this app cannot suggest a number.
  const iron = supplementOption('iron');
  assert.ok(iron, 'iron has no supplement route');
  assert.doesNotMatch(`${iron!.title} ${iron!.detail}`, /\d+\s*(mg|IU|mcg|µg)/i);
});

test('ids are unique and stable against the raw catalogue', () => {
  const ids = ALL_OPTIONS.map((o) => o.id);
  assert.equal(new Set(ids).size, ids.length);
  // Index is into the unfiltered list, so a restriction cannot renumber it.
  assert.equal(optionById('d-2')?.type, 'food');
});

test('an unknown pick is dropped rather than crashing', () => {
  assert.deepEqual(resolveItems(['nope-9'], []), []);
});

test('picks resolve in the order they were chosen', () => {
  const items = resolveItems(['c-0', 'd-0'], []);
  assert.deepEqual(
    items.map((i) => i.id),
    ['c-0', 'd-0'],
  );
});

test('a restriction removes a route without discarding the pick', () => {
  const picks = ['d-0', 'd-2'];
  const withFish = resolveItems(picks, []);
  const noFish = resolveItems(picks, ['no-fish']);
  assert.equal(withFish.length, 2);
  // d-2 narrows rather than disappears — "Salmon fillet or 2 eggs" -> "2 eggs".
  assert.equal(noFish.length, 2);
  assert.equal(noFish[1].title, '2 eggs');
  // And removing the answer restores the original wording from the same picks.
  assert.equal(resolveItems(picks, [])[1].title, 'Salmon fillet or 2 eggs');
});

test('no dairy rewrites the calcium food route rather than dropping it', () => {
  const [item] = resolveItems(['calcium-1'], ['no-dairy']);
  assert.match(item.title, /plant milk/i);
});

test('nutrientsIn is unique and skips rows with no nutrient', () => {
  const items = resolveItems(['d-0', 'd-1', 'b12-0'], []);
  assert.deepEqual(nutrientsIn(items), ['d', 'b12']);
});

test('isoDay pads month and day', () => {
  assert.equal(isoDay(new Date(2026, 0, 5)), '2026-01-05');
});

/* ---------------------------------------------------------------- streaks */

const day = (y: number, m: number, d: number) => new Date(y, m - 1, d);

test('consecutive days count', () => {
  const history = { '2026-09-03': 1, '2026-09-04': 2, '2026-09-05': 1 };
  assert.equal(streakFrom(history, day(2026, 9, 5)), 3);
});

test('a day with nothing ticked yet does not break the streak', () => {
  // Otherwise every morning would open on "0-day streak".
  const history = { '2026-09-03': 1, '2026-09-04': 2 };
  assert.equal(streakFrom(history, day(2026, 9, 5)), 2);
});

test('a genuine gap ends the streak', () => {
  const history = { '2026-09-01': 3, '2026-09-04': 1, '2026-09-05': 1 };
  assert.equal(streakFrom(history, day(2026, 9, 5)), 2);
});

test('no history is no streak, never a fabricated one', () => {
  assert.equal(streakFrom({}, day(2026, 9, 5)), 0);
});

test('a day recorded with zero ticks does not count', () => {
  assert.equal(streakFrom({ '2026-09-04': 0 }, day(2026, 9, 5)), 0);
});
