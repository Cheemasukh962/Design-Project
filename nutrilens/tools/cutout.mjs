// Turns the studio-render backdrop transparent via a flood fill from the edges.
// The render sits on a soft light-grey gradient, so a plain luminance threshold
// would eat Vito's highlights; filling inward from the border only removes
// pixels actually connected to the background.
// Usage: node tools/cutout.mjs <in.jpg> <out.png> [tolerance]
import { Jimp } from 'jimp';

const [, , input, output, tolRaw = '38'] = process.argv;
const tol = Number(tolRaw);

const img = await Jimp.read(input);
const { width: w, height: h } = img.bitmap;
const at = (x, y) => (y * w + x) * 4;
const px = img.bitmap.data;

// Seed colour = average of the four corners.
const corners = [[0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1]];
const seed = corners.reduce(
  (acc, [x, y]) => {
    const i = at(x, y);
    return [acc[0] + px[i] / 4, acc[1] + px[i + 1] / 4, acc[2] + px[i + 2] / 4];
  },
  [0, 0, 0],
);

const visited = new Uint8Array(w * h);
const stack = corners.map(([x, y]) => y * w + x);

while (stack.length) {
  const p = stack.pop();
  if (visited[p]) continue;
  visited[p] = 1;

  const i = p * 4;
  const dist = Math.hypot(px[i] - seed[0], px[i + 1] - seed[1], px[i + 2] - seed[2]);
  if (dist > tol) continue;

  px[i + 3] = 0;

  const x = p % w;
  const y = (p / w) | 0;
  if (x > 0) stack.push(p - 1);
  if (x < w - 1) stack.push(p + 1);
  if (y > 0) stack.push(p - w);
  if (y < h - 1) stack.push(p + w);
}

// Feather: any surviving pixel touching a cleared one gets partial alpha, so
// the silhouette edge is not a hard staircase.
const copy = Uint8Array.from(px);
for (let y = 1; y < h - 1; y++) {
  for (let x = 1; x < w - 1; x++) {
    const i = at(x, y);
    if (copy[i + 3] === 0) continue;
    let clear = 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      if (copy[at(x + dx, y + dy) + 3] === 0) clear++;
    }
    if (clear) px[i + 3] = Math.round(255 * (1 - clear / 5));
  }
}

await img.write(output);
const cleared = visited.reduce((n, v) => n + v, 0);
console.log(`cleared ${((cleared / (w * h)) * 100).toFixed(1)}% of ${w}x${h} -> ${output}`);
