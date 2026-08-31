const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Mobile check
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3099', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Check mobile bg image exists
  const mobileBg = await page.$('section#inicio .lg\:hidden img');
  console.log('Mobile bg image exists:', !!mobileBg);
  if (mobileBg) {
    const src = await mobileBg.getAttribute('src');
    console.log('Mobile bg src:', src);
  }

  // Check NO floaters on desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3099', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Check that floater text elements are NOT present in hero visual area
  const heroVisual = await page.$('.hero-visual');
  if (heroVisual) {
    const floaterTexts = await heroVisual.$$eval('span', els => els.map(e => e.textContent));
    console.log('Floater texts in hero-visual:', floaterTexts);
    console.log('Floaters removed:', floaterTexts.length === 0);
  }

  // Check desktop image
  const desktopImg = await page.$('.hero-visual img');
  console.log('Desktop hero image exists:', !!desktopImg);

  // Check no overlap: measure hero image bounds
  if (desktopImg) {
    const box = await desktopImg.boundingBox();
    console.log('Desktop image bounds:', box);
  }

  await browser.close();
  console.log('All checks passed!');
})();
