// Crops a square head shot out of the full-body Vito render for use as a
// 28-40px avatar, where the full body is unreadable.
import { Jimp } from 'jimp';
const img = await Jimp.read('assets/brand/vito-idle.png');
// Head + sunglasses sit in the upper-middle of the 512px render.
const box = { x: 166, y: 52, w: 158, h: 158 };
img.crop(box);
await img.write('assets/brand/vito-avatar.png');
console.log('wrote assets/brand/vito-avatar.png', box);
