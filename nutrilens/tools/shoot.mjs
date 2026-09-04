// Renders the exported web build at iPhone 15 size and writes a PNG.
// Usage: node tools/shoot.mjs <outfile> [route-without-leading-slash] [waitMs]
// Note: the route takes no leading slash, because Git Bash on Windows rewrites
// a bare "/" argument into a filesystem path before node ever sees it.
import puppeteer from 'puppeteer';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const [, , out = 'shot.png', route = '', waitMs = '2500', clicks = ''] = process.argv;
const DIST = path.resolve('dist');

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.json': 'application/json',
  '.ttf': 'font/ttf', '.otf': 'font/otf', '.woff': 'font/woff', '.woff2': 'font/woff2' };

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  let file = path.join(DIST, url);
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(DIST, 'index.html');
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

await new Promise((r) => server.listen(0, r));
const PORT = server.address().port;

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 2 });

const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto(`http://localhost:${PORT}/${route}`, { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, Number(waitMs)));

// Optional: comma-separated visible labels to tap before capturing, so a
// selected / filled state can be photographed rather than only the empty one.
for (const label of clicks.split(',').map((s) => s.trim()).filter(Boolean)) {
  const hit = await page.evaluate((text) => {
    const nodes = [...document.querySelectorAll('div,span,button')];
    const el = nodes.reverse().find(
      (n) => n.textContent?.trim() === text && n.getClientRects().length,
    );
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

await page.screenshot({ path: out });

console.log(errors.length ? 'CONSOLE ERRORS:\n' + errors.join('\n') : 'no console errors');
await browser.close();
server.close();
