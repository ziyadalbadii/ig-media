// Static slides -> one JPG per slide (1080x1350).
// Usage: node stills.js <page.html> <outdir> [selector=.s] [prefix=slide-]
// Every element matching the selector becomes <prefix><n>.jpg in document order.
const fs = require('fs');
const path = require('path');
const { openPage } = require('./browser');

const [inp, outdir, selector = '.s', prefix = 'slide-'] = process.argv.slice(2);
if (!inp || !outdir) { console.error('Usage: node stills.js <page.html> <outdir> [selector] [prefix]'); process.exit(2); }

(async () => {
  fs.mkdirSync(outdir, { recursive: true });
  const { browser, page } = await openPage(inp, { width: 1200, height: 1400 });
  const els = await page.$$(selector);
  if (!els.length) throw new Error('No elements match ' + selector);
  for (let i = 0; i < els.length; i++) {
    const box = await els[i].boundingBox();
    if (Math.round(box.width) !== 1080 || Math.round(box.height) !== 1350) console.warn(`WARNING element ${i + 1} is ${box.width}x${box.height}, expected 1080x1350`);
    const out = path.join(outdir, `${prefix}${i + 1}.jpg`);
    await els[i].screenshot({ path: out, type: 'jpeg', quality: 95 });
    console.log(out);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
