// Screenshot helper for visual review against localhost.
// Usage: node screenshot.mjs http://localhost:3000 [label]
// Requires puppeteer: npm install puppeteer
import puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(root, 'temporary screenshots');

const url = process.argv[2];
const label = process.argv[3];

if (!url) {
  console.error('Usage: node screenshot.mjs <url> [label]');
  process.exit(1);
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const existing = fs.readdirSync(outDir)
  .map(f => f.match(/^screenshot-(\d+)/))
  .filter(Boolean)
  .map(m => parseInt(m[1], 10));
const nextIndex = existing.length ? Math.max(...existing) + 1 : 1;
const fileName = `screenshot-${nextIndex}${label ? '-' + label : ''}.png`;
const filePath = path.join(outDir, fileName);

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle0' });
await page.screenshot({ path: filePath, fullPage: true });
await browser.close();

console.log(`Saved ${filePath}`);
