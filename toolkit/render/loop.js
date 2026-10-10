// Animated slides -> PNG frames per slide, for seamless loops.
// The page must expose window.render(t) (t in seconds) that draws the exact state at time t,
// and every motion must be periodic in --secs so frame N == frame 0 (no fade-in, nothing disappears).
// Slides sit side by side inside one wide element (default #pano), each 1080x1350.
//
// Usage: node loop.js <page.html> <outdir> [--el #pano] [--slides 7] [--first 2] [--secs 4] [--fps 30] [--still 1.5]
// Output: <outdir>/s<first>/f0000.png ... (one folder per slide). --still renders one frame at that time.
const fs = require('fs');
const path = require('path');
const { openPage } = require('./browser');

const args = process.argv.slice(2);
const inp = args[0], outdir = args[1];
const opt = (k, d) => { const i = args.indexOf('--' + k); return i > -1 ? args[i + 1] : d; };
const el = opt('el', '#pano'), first = +opt('first', 2), secs = +opt('secs', 4), fps = +opt('fps', 30);
const still = opt('still', null);
if (!inp || !outdir) { console.error('Usage: node loop.js <page.html> <outdir> [--el #pano] [--slides N] [--first 2] [--secs 4] [--fps 30] [--still t]'); process.exit(2); }

(async () => {
  const { browser, page } = await openPage(inp, { width: 1200, height: 1400 });
  const size = await page.$eval(el, e => ({ w: e.scrollWidth, h: e.scrollHeight }));
  const nSlides = +opt('slides', Math.round(size.w / 1080));
  // Small viewport + shifting the strip is much faster than clipping a 7000px-wide page.
  await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 });
  const hasRender = await page.evaluate(() => typeof window.render === 'function');
  if (!hasRender) throw new Error('page has no window.render(t)');
  await page.evaluate(sel => {
    document.documentElement.style.overflow = 'hidden'; document.body.style.margin = '0';
    const e = document.querySelector(sel); e.style.position = 'fixed'; e.style.top = '0'; e.style.left = '0'; e.style.right = 'auto';
  }, el);
  const n = still !== null ? 1 : Math.round(fps * secs);
  for (let s = 0; s < nSlides; s++) fs.mkdirSync(path.join(outdir, 's' + (s + first)), { recursive: true });
  for (let i = 0; i < n; i++) {
    const t = still !== null ? +still : i / fps;
    await page.evaluate(a => window.render(a), t);
    for (let s = 0; s < nSlides; s++) {
      await page.evaluate((sel, x) => { document.querySelector(sel).style.transform = `translateX(${x}px)`; }, el, -s * 1080);
      await page.screenshot({ path: path.join(outdir, 's' + (s + first), 'f' + String(i).padStart(4, '0') + '.png') });
    }
    if (i % 30 === 0) console.log(`frame ${i}/${n}`);
  }
  await browser.close();
  console.log(`ok: ${nSlides} slides x ${n} frames -> ${outdir}`);
})().catch(e => { console.error(e); process.exit(1); });
