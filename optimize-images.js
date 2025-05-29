const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const inputDir = 'images';
const outputDir = 'images/optimized';

async function optimizeImages() {
    try {
        // Create output directory if it doesn't exist
        await fs.mkdir(outputDir, { recursive: true });

        // Get all image files
        const files = await fs.readdir(inputDir);
        const imageFiles = files.filter(file => 
            /\.(jpg|jpeg|png)$/i.test(file) && 
            !file.includes('optimized')
        );

        for (const file of imageFiles) {
            const inputPath = path.join(inputDir, file);
            const baseName = path.parse(file).name;

            // Create WebP version
            await sharp(inputPath)
                .rotate()
                .resize(800, 600, { // Max dimensions
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .webp({ quality: 80 })
                .toFile(path.join(outputDir, `${baseName}.webp`));

            // Create JPG fallback
            await sharp(inputPath)
                .rotate()
                .resize(800, 600, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .jpeg({ quality: 80 })
                .toFile(path.join(outputDir, `${baseName}.jpg`));

            console.log(`Optimized ${file}`);
        }

        console.log('All images optimized successfully!');
    } catch (error) {
        console.error('Error optimizing images:', error);
    }
}

optimizeImages(); 