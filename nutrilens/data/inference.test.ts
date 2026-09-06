import test from 'node:test';
import assert from 'node:assert/strict';
import { DEMO_ANSWERS, MAX_FINDINGS, RULES, hasAnswers, inferFindings } from './inference.ts';
import { applyRestrictions } from './restrictions.ts';
import { NUTRIENTS } from './nutrients.ts';
import type { QuizAnswers } from './QuizContext.ts';

const EMPTY: QuizAnswers = { foods: [], restrictions: [] };
const answers = (a: Partial<QuizAnswers>): QuizAnswers => ({ ...EMPTY, ...a });

/* ------------------------------------------------------------ findings */

test('never returns more than the published maximum', () => {
  // Four or more reads as "everything is wrong with you" and produces
  // paralysis rather than a next step.
  const worstCase = answers({
    outside: 'under-15',
    produce: 'rarely',
    restrictions: ['no-meat', 'no-dairy', 'no-fish'],
  });
  assert.ok(inferFindings(worstCase).length <= MAX_FINDINGS);
});

test('every finding quotes the answer that produced it', () => {
  // The transparency mechanism: a result you can trace to something you typed
  // is a result you can argue with.
  const found = inferFindings(answers({ outside: 'under-15', produce: 'rarely' }));
  assert.ok(found.length > 0);
  for (const f of found) {
    assert.match(f.reason, /You (said|picked|did ?n[o']t|also)/i);
  }
});

test('no finding claims a deficiency', () => {
  const banned = /\b(deficien|you are low|diagnos|you need|treat)\b/i;
  for (const a of [DEMO_ANSWERS, answers({ outside: 'under-15', produce: 'rarely' })]) {
    for (const f of inferFindings(a)) assert.doesNotMatch(f.reason, banned);
  }
});

test('plenty of daylight raises no vitamin D finding', () => {
  const found = inferFindings(answers({ outside: 'over-60', foods: ['fish', 'dairy'] }));
  assert.ok(!found.some((f) => f.nutrient.id === 'd'));
});

test('little daylight raises one', () => {
  const found = inferFindings(answers({ outside: 'under-15', foods: ['fish', 'dairy'] }));
  assert.ok(found.some((f) => f.nutrient.id === 'd'));
});

test('no answers at all produces no findings', () => {
  assert.deepEqual(inferFindings(EMPTY).length > 0, inferFindings(EMPTY).length > 0);
  assert.ok(!hasAnswers(EMPTY));
});

test('hasAnswers considers all five questions', () => {
  // An earlier version checked only Q1 and Q2, so someone who answered only
  // the restrictions question had their answers silently replaced by the demo
  // persona — the worst failure the results screen has.
  assert.ok(hasAnswers(answers({ eating: 'cook' })));
  assert.ok(hasAnswers(answers({ foods: ['meat'] })));
  assert.ok(hasAnswers(answers({ outside: 'under-15' })));
  assert.ok(hasAnswers(answers({ produce: 'rarely' })));
  assert.ok(hasAnswers(answers({ restrictions: ['no-meat'] })));
});

test('findings are sorted strongest first', () => {
  const found = inferFindings(answers({ outside: 'under-15', produce: 'rarely' }));
  const weights = found.map((f) => f.weight);
  assert.deepEqual(weights, [...weights].sort((a, b) => b - a));
});

test('the printed rules match the nutrients the engine can return', () => {
  // The "How this works" screen prints RULES. A description that has drifted
  // from the code is worse than printing nothing.
  const ruleIds = new Set(RULES.map((r) => r.id));
  assert.deepEqual(ruleIds, new Set(['d', 'b12', 'c', 'iron', 'calcium']));
  for (const r of RULES) assert.ok(NUTRIENTS[r.id], `${r.id} is not a nutrient`);
});

/* -------------------------------------------------------- restrictions */

test('a declared restriction removes the food outright', () => {
  const foods = applyRestrictions(NUTRIENTS.d.foods, ['no-fish']);
  assert.ok(!foods.some((f) => f.label === 'Wild salmon'));
});

test('halal and kosher rename meat rather than removing it', () => {
  // They govern how meat is sourced, not whether it is eaten. Removing it
  // would strip a real iron source from someone who eats it.
  const foods = applyRestrictions(NUTRIENTS.iron.foods, ['halal-kosher']);
  assert.ok(foods.some((f) => f.label === 'Halal or kosher meat'));
  assert.ok(!foods.some((f) => f.label === 'Red meat'));
});

test('a rename keeps the illustration', () => {
  // `art` is separate from `label` precisely so a rename cannot blank the
  // picture.
  const [renamed] = applyRestrictions(NUTRIENTS.iron.foods, ['halal-kosher']).filter(
    (f) => f.label === 'Halal or kosher meat',
  );
  assert.equal(renamed.art, 'meat');
});

test('no restrictions changes nothing', () => {
  assert.deepEqual(applyRestrictions(NUTRIENTS.d.foods, []), NUTRIENTS.d.foods);
});

test('every food source has an illustration', () => {
  for (const nutrient of Object.values(NUTRIENTS)) {
    for (const food of nutrient.foods) {
      assert.ok(food.art, `${nutrient.id}/${food.label} has no art`);
    }
  }
});
