#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports --
   plain Node CLI: CJS require() is what makes NODE_PATH (global playwright) work */
/**
 * Capture a portfolio section into ./screenshots/ at desktop (1440) + mobile (375).
 *
 * Usage:
 *   NODE_PATH=$(npm root -g) node scripts/screenshot.js <name> [selector] [port]
 *   e.g. NODE_PATH=$(npm root -g) node scripts/screenshot.js 01-proof "#proof" 3005
 *
 * - <name>     → screenshots/<name>-desktop.png / <name>-mobile.png
 * - [selector] → scrolls that element into view first (omit for top of page)
 * - [port]     → dev server port, default 3005
 *
 * Requires playwright (globally installed is fine, hence NODE_PATH).
 * WebGL works headless via the swiftshader flags below.
 */
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const name = process.argv[2];
const selector = process.argv[3] || null;
const port = process.argv[4] || "3005";
if (!name) {
  console.error("usage: node scripts/screenshot.js <name> [selector] [port]");
  process.exit(1);
}

const outDir = path.join(__dirname, "..", "screenshots");
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  });

  for (const [device, viewport, deviceScaleFactor] of [
    ["desktop", { width: 1440, height: 900 }, 1],
    ["mobile", { width: 375, height: 812 }, 2],
  ]) {
    const page = await browser.newPage({ viewport, deviceScaleFactor });
    const errors = [];
    page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push("CONSOLE: " + m.text());
    });

    await page.goto(`http://localhost:${port}`, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(2000);
    if (selector) {
      await page.locator(selector).scrollIntoViewIfNeeded();
      await page.waitForTimeout(1600); // let the Reveal settle
    }

    const file = path.join(outDir, `${name}-${device}.png`);
    await page.screenshot({ path: file });

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    console.log(`${device}: saved ${path.relative(process.cwd(), file)} | overflow=${overflow}px | errors=${errors.length}`);
    errors.slice(0, 5).forEach((e) => console.log("  " + e.slice(0, 250)));
    await page.close();
  }

  await browser.close();
})();
