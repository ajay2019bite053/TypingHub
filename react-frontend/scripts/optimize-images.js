const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Image optimization configuration
const imageConfig = {
  'Main_LOGO.webp': { width: 90, height: 90, quality: 85 },
  'ashoka-chakra.webp': { width: 120, height: 120, quality: 80 },
  'gold-seal.webp': { width: 60, height: 60, quality: 85 },
  'SSC.webp': { width: 70, height: 70, quality: 85 },
  'RAILWAY.webp': { width: 70, height: 70, quality: 85 },
  'Cbse.webp': { width: 70, height: 70, quality: 85 },
  'court.webp': { width: 70, height: 70, quality: 85 },
  'Background-img.webp': { width: 1920, height: 1080, quality: 75 }
};

const imagesDir = path.join(__dirname, '../public/images');
const optimizedDir = path.join(__dirname, '../public/images/optimized');

// Create optimized directory if it doesn't exist
if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir, { recursive: true });
}

console.log('🖼️  Starting image optimization...');

// Check if sharp is available, if not install it
try {
  require('sharp');
} catch (error) {
  console.log('📦 Installing sharp for image optimization...');
  execSync('npm install sharp', { stdio: 'inherit' });
}

const sharp = require('sharp');

async function optimizeImage(filename, config) {
  const inputPath = path.join(imagesDir, filename);
  const outputPath = path.join(optimizedDir, filename);
  
  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  Skipping ${filename} - file not found`);
    return;
  }

  try {
    const originalSize = fs.statSync(inputPath).size;
    
    await sharp(inputPath)
      .resize(config.width, config.height, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .webp({ quality: config.quality })
      .toFile(outputPath);
    
    const optimizedSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ ${filename}: ${(originalSize / 1024).toFixed(1)}KB → ${(optimizedSize / 1024).toFixed(1)}KB (${savings}% smaller)`);
    
    // Replace original with optimized version
    fs.copyFileSync(outputPath, inputPath);
    fs.unlinkSync(outputPath);
    
  } catch (error) {
    console.error(`❌ Error optimizing ${filename}:`, error.message);
  }
}

async function optimizeAllImages() {
  const promises = Object.entries(imageConfig).map(([filename, config]) => 
    optimizeImage(filename, config)
  );
  
  await Promise.all(promises);
  console.log('🎉 Image optimization complete!');
}

optimizeAllImages().catch(console.error);




