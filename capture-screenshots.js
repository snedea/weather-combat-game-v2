import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const SCREENSHOTS_DIR = path.join(__dirname, 'docs', 'screenshots');

async function captureScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 2, // For retina-quality screenshots
  });
  const page = await context.newPage();

  const screenshots = [];
  const failed = [];

  console.log('🎬 Starting screenshot capture...');
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log(`📁 Output directory: ${SCREENSHOTS_DIR}`);

  try {
    // Ensure screenshots directory exists
    await fs.mkdir(SCREENSHOTS_DIR, { recursive: true });

    // 1. HERO SCREENSHOT - Initial landing page
    try {
      console.log('\n📸 Capturing hero screenshot...');
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000); // Wait for animations

      const heroPath = path.join(SCREENSHOTS_DIR, 'hero.png');
      await page.screenshot({
        path: heroPath,
        fullPage: false,
      });

      screenshots.push({
        filename: 'hero.png',
        path: 'docs/screenshots/hero.png',
        type: 'hero',
        description: 'Main application view - city selection screen',
      });
      console.log('✅ Hero screenshot captured');
    } catch (error) {
      console.error('❌ Failed to capture hero screenshot:', error.message);
      failed.push({ name: 'hero', error: error.message });
    }

    // 2. FEATURE SCREENSHOT - City input filled
    try {
      console.log('\n📸 Capturing feature screenshot - city input...');

      // Fill in city names
      await page.fill('input[placeholder*="city" i]:first-of-type', 'London');
      await page.waitForTimeout(500);
      await page.fill('input[placeholder*="city" i]:last-of-type', 'Tokyo');
      await page.waitForTimeout(500);

      const featureInputPath = path.join(SCREENSHOTS_DIR, 'feature-01-city-input.png');
      await page.screenshot({
        path: featureInputPath,
        fullPage: false,
      });

      screenshots.push({
        filename: 'feature-01-city-input.png',
        path: 'docs/screenshots/feature-01-city-input.png',
        type: 'feature',
        description: 'City selection - entering city names for battle',
      });
      console.log('✅ City input screenshot captured');
    } catch (error) {
      console.error('❌ Failed to capture city input screenshot:', error.message);
      failed.push({ name: 'feature-01-city-input', error: error.message });
    }

    // 3. FEATURE SCREENSHOT - Battle in progress
    try {
      console.log('\n📸 Capturing feature screenshot - battle view...');

      // Click start battle button (try multiple selectors)
      const buttonSelectors = [
        'button:has-text("Start Battle")',
        'button:has-text("Battle")',
        'button[type="submit"]',
        'button:visible',
      ];

      let buttonClicked = false;
      for (const selector of buttonSelectors) {
        try {
          await page.click(selector, { timeout: 2000 });
          buttonClicked = true;
          break;
        } catch (e) {
          continue;
        }
      }

      if (buttonClicked) {
        // Wait for weather data and battle to load
        await page.waitForTimeout(3000);

        const battlePath = path.join(SCREENSHOTS_DIR, 'feature-02-battle-view.png');
        await page.screenshot({
          path: battlePath,
          fullPage: true,
        });

        screenshots.push({
          filename: 'feature-02-battle-view.png',
          path: 'docs/screenshots/feature-02-battle-view.png',
          type: 'feature',
          description: 'Battle in progress - weather stats converted to RPG attributes',
        });
        console.log('✅ Battle view screenshot captured');
      } else {
        console.log('⚠️ Could not find battle button, skipping battle screenshot');
      }
    } catch (error) {
      console.error('❌ Failed to capture battle screenshot:', error.message);
      failed.push({ name: 'feature-02-battle-view', error: error.message });
    }

    // 4. MOBILE SCREENSHOT - Responsive design
    try {
      console.log('\n📸 Capturing mobile screenshot...');
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      const mobilePath = path.join(SCREENSHOTS_DIR, 'feature-03-mobile-view.png');
      await page.screenshot({
        path: mobilePath,
        fullPage: true,
      });

      screenshots.push({
        filename: 'feature-03-mobile-view.png',
        path: 'docs/screenshots/feature-03-mobile-view.png',
        type: 'feature',
        description: 'Mobile responsive design',
      });
      console.log('✅ Mobile screenshot captured');
    } catch (error) {
      console.error('❌ Failed to capture mobile screenshot:', error.message);
      failed.push({ name: 'feature-03-mobile-view', error: error.message });
    }

    // Generate manifest
    const manifest = {
      generated: new Date().toISOString(),
      baseURL: BASE_URL,
      projectType: 'web-app',
      screenshots,
      total: screenshots.length,
      failed: failed.length,
      failedScreenshots: failed,
    };

    const manifestPath = path.join(SCREENSHOTS_DIR, 'manifest.json');
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('\n✅ Screenshot manifest generated');

    // Summary
    console.log('\n📊 Screenshot Capture Summary:');
    console.log(`✅ Successfully captured: ${screenshots.length} screenshots`);
    if (failed.length > 0) {
      console.log(`❌ Failed: ${failed.length} screenshots`);
      failed.forEach(f => console.log(`   - ${f.name}: ${f.error}`));
    }
    console.log(`📄 Manifest: docs/screenshots/manifest.json`);

  } catch (error) {
    console.error('\n❌ Fatal error during screenshot capture:', error);
    throw error;
  } finally {
    await browser.close();
  }

  return { screenshots, failed };
}

// Run the capture
captureScreenshots()
  .then(({ screenshots, failed }) => {
    if (failed.length > 0) {
      console.log('\n⚠️  Some screenshots failed, but continuing...');
      process.exit(0); // Don't fail the build
    } else {
      console.log('\n✨ All screenshots captured successfully!');
      process.exit(0);
    }
  })
  .catch((error) => {
    console.error('\n❌ Screenshot capture failed:', error);
    console.log('⚠️  Continuing without screenshots...');
    process.exit(0); // Don't fail the build
  });
