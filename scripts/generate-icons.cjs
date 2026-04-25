const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputImage = 'C:\\Users\\Chau\\.gemini\\antigravity\\brain\\5265bba8-2f78-435a-88a0-2cc137ee138a\\media__1777078840695.png';
const outputDir = path.resolve(__dirname, '../src/extension');
const distDir = path.resolve(__dirname, '../dist-ext');

const sizes = [16, 32, 48, 128];

async function generateIcons() {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  
  for (const size of sizes) {
    const fileName = `icon${size}.png`;
    const outputPath = path.join(outputDir, fileName);
    
    await sharp(inputImage)
      .resize(size, size)
      .toFile(outputPath);
      
    console.log(`Generated ${fileName} in src/extension`);
    
    // Also copy to dist-ext if it exists
    if (fs.existsSync(distDir)) {
      fs.copyFileSync(outputPath, path.join(distDir, fileName));
      console.log(`Copied ${fileName} to dist-ext`);
    }
  }
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
