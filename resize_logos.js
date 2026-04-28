const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const rootDir = 'f:\\2-28-Yoramen&Yomeetea-website-development';
const publicDir = path.join(rootDir, 'yoramen-web', 'public', 'images');
const logoDir = path.join(publicDir, 'logo');

const sourceLogo = path.join(rootDir, 'new logo.png');
const sourceLogoW = path.join(rootDir, 'new logo-w.png');

async function processLogos() {
  if (!fs.existsSync(logoDir)) {
    fs.mkdirSync(logoDir, { recursive: true });
  }

  // 1. Process full logos
  await sharp(sourceLogo)
    .trim()
    .webp({ quality: 90 })
    .toFile(path.join(publicDir, 'logo-full.webp'));
  console.log('Created logo-full.webp');

  await sharp(sourceLogoW)
    .trim()
    .webp({ quality: 90 })
    .toFile(path.join(publicDir, 'logo-full-w.webp'));
  console.log('Created logo-full-w.webp');

  await sharp(sourceLogo)
    .trim()
    .webp({ quality: 90 })
    .toFile(path.join(logoDir, 'logo-full.webp'));
  console.log('Created logo/logo-full.webp');

  // 2. Process icons based on height/width (square fitting)
  const sizes = [16, 32, 64, 256, 512];
  for (const size of sizes) {
    await sharp(sourceLogo)
      .trim()
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .webp({ quality: 90 })
      .toFile(path.join(logoDir, `logo-${size}.webp`));
    console.log(`Created logo-${size}.webp`);
  }
}

processLogos().catch(console.error);
