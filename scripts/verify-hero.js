const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/home/z/pw-browsers/chromium-1228/chrome-linux64/chrome',
  });

  const pages = [
    { url: 'http://127.0.0.1:3999/', name: 'home', vp: { width: 375, height: 812 } },
    { url: 'http://127.0.0.1:3999/', name: 'home-desktop', vp: { width: 1440, height: 900 } },
    { url: 'http://127.0.0.1:3999/productos', name: 'productos', vp: { width: 375, height: 812 } },
    { url: 'http://127.0.0.1:3999/favoritos', name: 'favoritos', vp: { width: 375, height: 812 } },
    { url: 'http://127.0.0.1:3999/carrito', name: 'carrito', vp: { width: 375, height: 812 } },
  ];

  const allPassed = true;

  for (const p of pages) {
    const ctx = await browser.newContext({ viewport: p.vp });
    const page = await ctx.newPage();
    try {
      await page.goto(p.url, { waitUntil: 'networkidle', timeout: 30000 });
      
      const result = await page.evaluate(() => {
        const body = document.body;
        const scrollW = body.scrollWidth;
        const clientW = body.clientWidth;
        // Check for hero/immersive banner
        const sections = document.querySelectorAll('section');
        let hasFullBleedHero = false;
        sections.forEach(s => {
          const cls = s.className || '';
          if (cls.includes('min-h-[') || cls.includes('min-h-[100svh]') || cls.includes('h-[220px]')) {
            hasFullBleedHero = true;
          }
        });
        // Check navbar transparency (when not scrolled)
        const header = document.querySelector('header');
        let navbarTransparent = false;
        if (header) {
          const div = header.querySelector('div');
          if (div) {
            const cls = div.className || '';
            navbarTransparent = cls.includes('bg-transparent');
          }
        }
        return {
          scrollW, clientW,
          overflow: scrollW > clientW + 5,
          hasFullBleedHero,
          navbarTransparent,
          bodyHeight: body.scrollHeight,
        };
      });

      const ok = !result.overflow && result.hasFullBleedHero;
      console.log(`${ok ? '✅' : '❌'} ${p.name} (${p.vp.width}x${p.vp.height})`);
      console.log(`   Hero: ${result.hasFullBleedHero}, Nav transparent: ${result.navbarTransparent}, Overflow: ${result.overflow}`);
      console.log(`   Size: ${result.scrollW}x${result.bodyHeight}px`);

      await page.screenshot({ 
        path: `/home/z/my-project/download/verify-${p.name}-${p.vp.width}.png`,
        fullPage: true
      });

      if (!ok) allPassed = false;
    } catch (e) {
      console.log(`❌ ${p.name}: ${e.message}`);
    }
    await ctx.close();
  }

  console.log(`\n${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  await browser.close();
})();