const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputFiles = [
  'C:\\Users\\Chau\\.gemini\\antigravity\\brain\\5265bba8-2f78-435a-88a0-2cc137ee138a\\imagesnap_screenshot_1_hero_1777081740846.png',
  'C:\\Users\\Chau\\.gemini\\antigravity\\brain\\5265bba8-2f78-435a-88a0-2cc137ee138a\\imagesnap_screenshot_2_popup_1777081753903.png',
  'C:\\Users\\Chau\\.gemini\\antigravity\\brain\\5265bba8-2f78-435a-88a0-2cc137ee138a\\imagesnap_screenshot_3_drive_1777081765353.png',
  'C:\\Users\\Chau\\.gemini\\antigravity\\brain\\5265bba8-2f78-435a-88a0-2cc137ee138a\\imagesnap_screenshot_4_security_1777082235545.png',
  'C:\\Users\\Chau\\.gemini\\antigravity\\brain\\5265bba8-2f78-435a-88a0-2cc137ee138a\\imagesnap_screenshot_5_multilang_1777082246088.png'
];

const outputDir = 'c:\\dev\\imagesnap\\docs\\store-assets';

async function processScreenshots() {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  for (let i = 0; i < inputFiles.length; i++) {
    const outputPath = path.join(outputDir, `screenshot${i + 1}.png`);
    await sharp(inputFiles[i])
      .resize(1280, 800)
      .flatten({ background: '#000000' }) // Remove Alpha, flatten to Black (match dark theme)
      .png({ palette: true, quality: 100 }) // 24-bit equivalent
      .toFile(outputPath);
    console.log(`Processed: screenshot${i + 1}.png`);
  }
}

processScreenshots().catch(console.error);
