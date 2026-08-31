const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/home/z/pw-browsers/chromium-1223/chrome-linux64/chrome',
  });

  const contexts = [];

  // Test 1: Mobile viewport - Product detail page
  console.log('\n=== TEST 1: Mobile Product Detail (375x812) ===');
  const mobileCtx = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
  });
  const mobilePage = await mobileCtx.newPage();

  // Server should already be running
  console.log('Connecting to server...');

  try {
    await mobilePage.goto('http://127.0.0.1:3999/productos/bolsas-de-envio-courier-25x35-cm', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    // Check for mobile layout issues
    const mobileResults = await mobilePage.evaluate(() => {
      const body = document.body;
      const scrollWidth = body.scrollWidth;
      const clientWidth = body.clientWidth;
      
      // Check if any element overflows horizontally
      const allElements = document.querySelectorAll('*');
      let overflowCount = 0;
      let overflowDetails = [];
      
      allElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > 395) { // 375 + 20px tolerance
          overflowCount++;
          if (overflowCount <= 5) {
            overflowDetails.push({
              tag: el.tagName,
              class: el.className?.toString?.()?.substring(0, 80) || '',
              right: Math.round(rect.right),
              width: Math.round(rect.width)
            });
          }
        }
      });

      // Check the main layout structure
      const mainContainer = document.querySelector('.min-h-screen');
      const gridLayout = document.querySelector('.grid');
      
      return {
        scrollWidth,
        clientWidth,
        horizontalOverflow: scrollWidth > clientWidth + 5,
        overflowCount,
        overflowDetails,
        hasGridOnMobile: gridLayout ? true : false,
        bodyHeight: body.scrollHeight,
        viewportHeight: window.innerHeight,
      };
    });

    console.log('Mobile Results:');
    console.log(`  Scroll width: ${mobileResults.scrollWidth}px`);
    console.log(`  Client width: ${mobileResults.clientWidth}px`);
    console.log(`  Horizontal overflow: ${mobileResults.horizontalOverflow}`);
    console.log(`  Elements overflowing: ${mobileResults.overflowCount}`);
    if (mobileResults.overflowCount > 0) {
      console.log('  Overflow details:', JSON.stringify(mobileResults.overflowDetails, null, 2));
    }
    console.log(`  Grid layout on mobile: ${mobileResults.hasGridOnMobile}`);
    console.log(`  Body height: ${mobileResults.bodyHeight}px`);

    // Take screenshot
    await mobilePage.screenshot({ 
      path: '/home/z/my-project/download/mobile-product-detail.png',
      fullPage: true 
    });
    console.log('  Screenshot saved: /home/z/my-project/download/mobile-product-detail.png');

    // Test 2: Mobile products listing
    console.log('\n=== TEST 2: Mobile Products Listing (375x812) ===');
    await mobilePage.goto('http://127.0.0.1:3999/productos', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    const listingResults = await mobilePage.evaluate(() => {
      const body = document.body;
      return {
        scrollWidth: body.scrollWidth,
        clientWidth: body.clientWidth,
        horizontalOverflow: body.scrollWidth > body.clientWidth + 5,
      };
    });

    console.log('Listing Results:');
    console.log(`  Scroll width: ${listingResults.scrollWidth}px`);
    console.log(`  Client width: ${listingResults.clientWidth}px`);
    console.log(`  Horizontal overflow: ${listingResults.horizontalOverflow}`);

    await mobilePage.screenshot({ 
      path: '/home/z/my-project/download/mobile-products-listing.png',
      fullPage: true 
    });
    console.log('  Screenshot saved: /home/z/my-project/download/mobile-products-listing.png');

    // Test 3: Small mobile (320px)
    console.log('\n=== TEST 3: Small Mobile (320x568) ===');
    const smallCtx = await browser.newContext({
      viewport: { width: 320, height: 568 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
    });
    const smallPage = await smallCtx.newPage();
    await smallPage.goto('http://127.0.0.1:3999/productos/bolsas-de-envio-courier-25x35-cm', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    const smallResults = await smallPage.evaluate(() => {
      const body = document.body;
      return {
        scrollWidth: body.scrollWidth,
        clientWidth: body.clientWidth,
        horizontalOverflow: body.scrollWidth > body.clientWidth + 5,
      };
    });

    console.log('Small Mobile Results:');
    console.log(`  Scroll width: ${smallResults.scrollWidth}px`);
    console.log(`  Client width: ${smallResults.clientWidth}px`);
    console.log(`  Horizontal overflow: ${smallResults.horizontalOverflow}`);

    await smallPage.screenshot({ 
      path: '/home/z/my-project/download/small-mobile-product-detail.png',
      fullPage: true 
    });
    console.log('  Screenshot saved: /home/z/my-project/download/small-mobile-product-detail.png');

    // Test 4: Desktop viewport
    console.log('\n=== TEST 4: Desktop Product Detail (1440x900) ===');
    const desktopCtx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const desktopPage = await desktopCtx.newPage();
    await desktopPage.goto('http://127.0.0.1:3999/productos/bolsas-de-envio-courier-25x35-cm', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    await desktopPage.screenshot({ 
      path: '/home/z/my-project/download/desktop-product-detail.png',
      fullPage: true 
    });
    console.log('  Screenshot saved: /home/z/my-project/download/desktop-product-detail.png');

    // Verify desktop has 3-column layout
    const desktopLayout = await desktopPage.evaluate(() => {
      const grids = document.querySelectorAll('.grid');
      let hasThreeCol = false;
      grids.forEach(g => {
        if (g.className.includes('grid-cols-[') || g.className.includes('220px')) {
          hasThreeCol = true;
        }
      });
      const sidebar = document.querySelector('aside.hidden.lg\\:block');
      return {
        hasThreeColGrid: hasThreeCol,
        hasDesktopSidebar: !!sidebar,
        bodyWidth: document.body.scrollWidth,
      };
    });
    console.log('Desktop Layout:');
    console.log(`  3-column grid: ${desktopLayout.hasThreeColGrid}`);
    console.log(`  Desktop sidebar: ${desktopLayout.hasDesktopSidebar}`);
    console.log(`  Body width: ${desktopLayout.bodyWidth}px`);

    // Summary
    console.log('\n=== SUMMARY ===');
    const allPassed = !mobileResults.horizontalOverflow && 
                      !listingResults.horizontalOverflow && 
                      !smallResults.horizontalOverflow;
    console.log(allPassed ? '✅ All mobile tests passed - no horizontal overflow' : '❌ Some tests failed - horizontal overflow detected');

    await smallCtx.close();
    await desktopCtx.close();
  } catch (err) {
    console.error('Test error:', err.message);
  } finally {
    await mobileCtx.close();
    await browser.close();
  }
})();