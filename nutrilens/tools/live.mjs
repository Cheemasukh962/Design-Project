// Screenshots the running dev server, so a design tweak can be checked without
// a full web export.
import puppeteer from 'puppeteer';
const [, , out = 'shot.png', route = '', waitMs = '3500', scrollY = '0', railX = '0', clicks = ''] = process.argv;
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 2 });
// Seed AsyncStorage (localStorage on web) before the app boots, so a state
// that only exists after several taps can be photographed directly.
if (process.env.SEED) {
  const seed = JSON.parse(process.env.SEED);
  await page.evaluateOnNewDocument((entries) => {
    for (const [k, v] of Object.entries(entries)) localStorage.setItem(k, v);
  }, seed);
}

const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(`http://localhost:8081/${route}`, { waitUntil: 'networkidle0', timeout: 90000 });
await new Promise((r) => setTimeout(r, Number(waitMs)));
if (Number(scrollY)) {
  await page.evaluate((y) => {
    const els = [...document.querySelectorAll('*')].filter((e) => e.scrollHeight > e.clientHeight + 40);
    (els[els.length - 1] || document.scrollingElement).scrollTop = y;
  }, Number(scrollY));
  await new Promise((r) => setTimeout(r, 900));
}
for (const label of clicks.split(',').map((t) => t.trim()).filter(Boolean)) {
  const hit = await page.evaluate((text) => {
    const nodes = [...document.querySelectorAll('div,span,button,a')];
    const visible = (n) => n.getClientRects().length > 0;
    const el =
      nodes.reverse().find((n) => n.textContent?.trim() === text && visible(n)) ??
      nodes.find((n) => n.getAttribute('aria-label') === text && visible(n));
    if (!el) return false;
    const target = el.closest('[tabindex],[role],div');
    target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    target.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
    target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    return true;
  }, label);
  if (!hit) console.log(`WARN: no element matched "${label}"`);
  await new Promise((r) => setTimeout(r, 1100));
}
if (Number(railX)) {
  await page.evaluate((x) => {
    const el = [...document.querySelectorAll('*')].find((e) => e.scrollWidth > e.clientWidth + 40);
    if (el) el.scrollLeft = x;
  }, Number(railX));
  await new Promise((r) => setTimeout(r, 900));
}
if (Number(scrollY)) {
  await page.evaluate((y) => {
    const els = [...document.querySelectorAll('*')].filter((e) => e.scrollHeight > e.clientHeight + 40);
    (els[els.length - 1] || document.scrollingElement).scrollTop = y;
  }, Number(scrollY));
  await new Promise((r) => setTimeout(r, 700));
}
await page.screenshot({ path: out });
console.log(errors.length ? 'CONSOLE ERRORS:\n' + errors.join('\n') : 'no console errors');
await browser.close();
