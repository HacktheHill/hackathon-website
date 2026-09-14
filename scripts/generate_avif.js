import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

async function processDirectory(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await processDirectory(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.webp')) {
            const avifPath = fullPath.replace(/\.webp$/, '.avif');
            // Check if AVIF already exists and is newer than WebP
            try {
                const avifStats = await fs.stat(avifPath);
                const webpStats = await fs.stat(fullPath);
                if (avifStats.mtime > webpStats.mtime) {
                    continue; // Skip already processed
                }
            } catch (e) {
                // Doesn't exist, proceed
            }
            
            console.log(`Converting ${fullPath} to AVIF...`);
            await sharp(fullPath)
                .avif({ quality: 65, effort: 4 })
                .toFile(avifPath);
        }
    }
}

async function main() {
    await processDirectory(path.join(ROOT, 'public', 'art', 'scene'));
    await processDirectory(path.join(ROOT, 'public', 'art', 'hero', 'responsive'));
    await processDirectory(path.join(ROOT, 'src', 'assets', 'Hero'));
    console.log("Done!");
}

main().catch(console.error);
