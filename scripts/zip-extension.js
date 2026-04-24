import AdmZip from 'adm-zip';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const extensionDir = path.join(__dirname, '../extension');
const outputDir = path.join(__dirname, '../dist-extension');
const manifestPath = path.join(extensionDir, 'manifest.json');

async function zipExtension() {
  console.log('📦 Starting extension packaging...');

  try {
    // Check if manifest exists
    if (!fs.existsSync(manifestPath)) {
      throw new Error('manifest.json not found in extension directory');
    }

    // Read version from manifest
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const version = manifest.version || 'unknown';
    const name = manifest.name.toLowerCase().replace(/\s+/g, '-');

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const zip = new AdmZip();
    
    // Add all files from extension folder
    zip.addLocalFolder(extensionDir);
    
    // Define output path
    const outputFileName = `${name}-v${version}.zip`;
    const outputPath = path.join(outputDir, outputFileName);

    // Write zip file
    zip.writeZip(outputPath);

    console.log(`✅ Success! Extension zipped to: ${outputPath}`);
    console.log(`🚀 Version: ${version}`);
    console.log('You can now upload this file to Chrome Web Store or Edge Add-ons.');
  } catch (error) {
    console.error('❌ Failed to package extension:', error.message);
    process.exit(1);
  }
}

zipExtension();
