// Walks the demo end to end in a browser and reports what worked.
import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 2 });
const errors = [];
page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e)));
page.on('console', (m) => { if (m.type() === 'error' && !/collapsable/.test(m.text())) errors.push('CONSOLE ' + m.text()); });

const go = async (r) => { await page.goto(`http://localhost:8081/${r}`, { waitUntil: 'networkidle0', timeout: 90000 }); await wait(1800); };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function tap(text) {
  const hit = await page.evaluate((t) => {
    const vis = (n) => n.getClientRects().length > 0;
    const nodes = [...document.querySelectorAll('div,span,button,a')];
    const el = nodes.reverse().find((n) => n.textContent?.trim() === t && vis(n))
      ?? nodes.find((n) => n.getAttribute('aria-label') === t && vis(n))
      ?? nodes.find((n) => n.textContent?.trim().startsWith(t) && vis(n));
    if (!el) return false;
    const target = el.closest('[tabindex],[role],div');
    target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    target.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
    target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    return true;
  }, text);
  await wait(1200);
  console.log(hit ? `  tap  ${text}` : `  MISS ${text}`);
  return hit;
}
const has = async (t) => page.evaluate((x) => document.body.innerText.includes(x), t);
const check = async (label, t) => console.log(`  ${(await has(t)) ? 'OK  ' : 'FAIL'} ${label}`);

// Clean slate.
await go('');
await page.evaluate(() => localStorage.clear());

console.log('\n== QUIZ ==');
await go('quiz/q1');
await tap('Mostly quick and packaged');
await tap('Continue');
await tap('Beans / lentils');
await tap('Continue');
await tap('Under 15 minutes');
await tap('Continue');
await tap('Rarely');
await tap('Continue');
await tap('No meat');
await tap('Meet your pal');

console.log('\n== PAL PICKER (must appear) ==');
await check('on the pal picker', 'Pick your pal');
await tap('Next pal');
await tap('Choose Nimbi');

console.log('\n== RESULTS ==');
await check('landed on results', "Here's what we found");
const meat = await has('Red meat');
console.log(`  ${meat ? 'FAIL' : 'OK  '} no-meat removed the red meat suggestion`);
const cites = await has('You said');
console.log(`  ${cites ? 'FAIL' : 'OK  '} results card carries no reason panel`);
const allergy = await has('We do not know which');
console.log(`  ${allergy ? 'FAIL' : 'OK  '} no allergy caveat block`);
await tap('Continue');

console.log('\n== PERSISTENCE (reload) ==');
await go('home');
await check('quiz answers survived reload', 'nutrients worth a closer look');
const stored = await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('vitapal') || k.startsWith('nutrilens')));
console.log('  keys:', stored.join(', '));

console.log('\n== NEW SCREENS ==');
for (const [route, needle] of [
  ['how-it-works', 'The rules'],
  ['disclaimer', 'What it cannot tell you'],
  ['supplements', 'What to check on the label'],
  ['article/b12-campus', 'Where it comes from'],
  ['article/budget-produce', 'Frozen is not the compromise'],
  ['companion', 'HP'],
]) {
  await go(route);
  console.log(`  ${(await has(needle)) ? 'OK  ' : 'FAIL'} /${route}`);
}

console.log('\n== ROUTINE + TOKENS ==');
await go('routine');
await check('routine filled from results', 'My Daily Routine');

// Start from nothing ticked, so the tap below is a genuine first tick rather
// than un-ticking something the demo seed had already completed.
await page.evaluate(() => {
  const r = JSON.parse(localStorage.getItem('vitapal.routine.v1') || '{}');
  localStorage.setItem('vitapal.routine.v1', JSON.stringify({ ...r, done: [] }));
  // Pretend yesterday: the same items must be earnable again today.
  const c = JSON.parse(localStorage.getItem('nutrilens.companion.v1') || '{}');
  localStorage.setItem('nutrilens.companion.v1', JSON.stringify({ ...c, rewardedDay: '2020-01-01' }));
});
await go('routine');
const before = await page.evaluate(() => JSON.parse(localStorage.getItem('nutrilens.companion.v1') || '{}').tokens ?? 0);
await tap('Vitamin D3, 1,000 IU');
await wait(900);
const after = await page.evaluate(() => JSON.parse(localStorage.getItem('nutrilens.companion.v1') || '{}').tokens ?? 0);
console.log(`  ${after > before ? 'OK  ' : 'FAIL'} first tick earned a token (${before} -> ${after})`);

// Anti-farming: un-tick and re-tick must not pay twice.
await tap('Vitamin D3, 1,000 IU');
await wait(600);
await tap('Vitamin D3, 1,000 IU');
await wait(900);
const again = await page.evaluate(() => JSON.parse(localStorage.getItem('nutrilens.companion.v1') || '{}').tokens ?? 0);
console.log(`  ${again === after ? 'OK  ' : 'FAIL'} re-ticking does not pay twice (${after} -> ${again})`);

// Overnight: yesterday's ticks must not carry over.
await page.evaluate(() => {
  const r = JSON.parse(localStorage.getItem('vitapal.routine.v1') || '{}');
  localStorage.setItem('vitapal.routine.v1', JSON.stringify({ ...r, done: ['x', 'y'], day: '2020-01-01' }));
});
await go('routine');
const carried = await page.evaluate(() => JSON.parse(localStorage.getItem('vitapal.routine.v1') || '{}').done.length);
console.log(`  ${carried === 0 ? 'OK  ' : 'FAIL'} yesterday's ticks cleared overnight (${carried} left)`);
await tap('Remind me daily');
await check('reminder bar tells the truth on web', 'not in a browser');
await go('profile');
await check('profile leads with HP', 'HP');

console.log('');
console.log('== ROUTINE IS USABLE ==');
await go('routine');
const count = () => page.evaluate(() => (document.body.innerText.match(/Supplement|Habit|Food/g) || []).length);
const n0 = await count();
await tap('Add item to daily routine');
await check('add sheet opens', 'Add to your routine');
await tap('Add Calcium. Calcium supplement.');
await wait(1000);
const n1 = await count();
console.log(`  ${n1 > n0 ? 'OK  ' : 'FAIL'} adding a nutrient added rows (${n0} -> ${n1})`);
const persistedAdd = await page.evaluate(() => (JSON.parse(localStorage.getItem('vitapal.routine.v1')||'{}').picks||[]).includes('calcium-0'));
console.log(`  ${persistedAdd ? 'OK  ' : 'FAIL'} the add was saved`);

// Remove needs a ticked row, since that is where the control lives.
await tap('Log Vitamin D3, 1,000 IU');
await wait(700);
await tap('Remove Vitamin D3, 1,000 IU from your routine');
await wait(900);
const gone = await page.evaluate(() => !document.body.innerText.includes('Vitamin D3, 1,000 IU'));
console.log(`  ${gone ? 'OK  ' : 'FAIL'} removing a row removed it`);
const left = await page.evaluate(() => (JSON.parse(localStorage.getItem('vitapal.routine.v1')||'{}').picks||[]).includes('d-0'));
console.log(`  ${left ? 'FAIL' : 'OK  '} the removal was saved`);
const supplementsOnly = await page.evaluate(() =>
  (JSON.parse(localStorage.getItem('vitapal.routine.v1')||'{}').picks||[]).length);
console.log(`  rows in routine: ${supplementsOnly}`);
await check('streak is real, not the invented 5', '1-day streak');

console.log('');
console.log('== NO INVENTED PROGRESS ==');
await go('results');
const bulk = await page.evaluate(() => document.body.innerText.includes('Add these to my routine'));
console.log(`  ${bulk ? 'FAIL' : 'OK  '} results CTA is Continue, not bulk-add`);
await go('');
const guest = await page.evaluate(() => document.body.innerText.includes('Continue as guest'));
console.log(`  ${guest ? 'FAIL' : 'OK  '} splash has no guest door`);
await go('quiz/q2');
const dairy = await page.evaluate(() => document.body.innerText.includes('Dairy / alternatives'));
console.log(`  ${dairy ? 'FAIL' : 'OK  '} Q2 says just "Dairy"`);
await go('discover');
const apology = await page.evaluate(() => document.body.innerText.includes('no design yet'));
console.log(`  ${apology ? 'FAIL' : 'OK  '} discover no longer apologises`);
await go('profile');
const sample = await page.evaluate(() => document.body.innerText.includes('Sample profile'));
console.log(`  ${sample ? 'FAIL' : 'OK  '} profile notice removed`);

console.log('\n== SAVE (heart) ==');
await go('nutrient/b12');
await tap('Save Vitamin B12');
await go('discover');
await check('saved shows on Discover', 'Saved');

console.log('\n== ERRORS ==');
console.log(errors.length ? errors.slice(0, 10).join('\n') : '  none');
await browser.close();
