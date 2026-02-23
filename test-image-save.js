const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    acceptDownloads: true
  });
  const page = await context.newPage();

  // Capture console messages
  page.on('console', msg => console.log('CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  // Navigate to leader result page
  console.log('1. Loading leader result page...');
  await page.goto('https://kiiisworking.vercel.app/result/leader', { waitUntil: 'networkidle' });

  // Wait for page to fully load
  await page.waitForTimeout(2000);

  // Click the image save button and wait for download
  console.log('2. Clicking image save button...');

  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 30000 }),
    page.click('text=결과 이미지로 저장하기')
  ]);

  // Save the download
  const downloadPath = path.join(__dirname, 'test-download.png');
  await download.saveAs(downloadPath);

  // Check file exists and size
  const stats = fs.statSync(downloadPath);
  console.log(`3. Download complete: ${download.suggestedFilename()}`);
  console.log(`   File size: ${(stats.size / 1024).toFixed(2)} KB`);

  if (stats.size > 10000) {
    console.log('✅ SUCCESS: Image saved successfully!');
  } else {
    console.log('❌ FAIL: Image file too small');
  }

  await browser.close();
})();
