// Shared launcher: finds puppeteer-core and a Chromium build, opens a page with fonts loaded.
const fs = require('fs');
const path = require('path');

function req(name) {
  const tries = [name, '/opt/npm-tools/node_modules/' + name, path.join(__dirname, 'node_modules', name)];
  for (const t of tries) { try { return require(t); } catch (e) {} }
  throw new Error(`${name} not found. Run toolkit/setup.sh first.`);
}

function chromePath() {
  const c = [
    process.env.CHROME_PATH,
    '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
    '/opt/pw-browsers/chromium',
    '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
  ].filter(Boolean);
  for (const p of c) { try { if (fs.statSync(p).isFile()) return p; } catch (e) {} }
  // Playwright layout: /opt/pw-browsers/chromium-XXXX/chrome-linux/chrome
  try {
    for (const d of fs.readdirSync('/opt/pw-browsers')) {
      const p = path.join('/opt/pw-browsers', d, 'chrome-linux', d.includes('headless') ? 'headless_shell' : 'chrome');
      if (fs.existsSync(p)) return p;
    }
  } catch (e) {}
  throw new Error('No Chromium found. Set CHROME_PATH.');
}

async function openPage(file, viewport) {
  const puppeteer = req('puppeteer-core');
  const browser = await puppeteer.launch({ executablePath: chromePath(), args: ['--no-sandbox', '--allow-file-access-from-files'] });
  const page = await browser.newPage();
  await page.setViewport({ deviceScaleFactor: 1, ...viewport }); // always scale 1: IG size is exact
  await page.goto('file://' + path.resolve(file), { waitUntil: 'networkidle0' });
  await page.evaluate(async () => { await document.fonts.ready; });
  const missing = await page.evaluate(() => ['Tajawal', 'Space Grotesk'].filter(f => !document.fonts.check(`700 40px "${f}"`)));
  if (missing.length) console.warn('WARNING fonts not available:', missing.join(', '), '- run toolkit/setup.sh');
  return { browser, page };
}

module.exports = { openPage };
