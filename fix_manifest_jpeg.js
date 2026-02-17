const fs = require('fs');
const path = require('path');

const MANIFEST_PATH = path.join(__dirname, 'public', 'optimized', 'manifest.json');

function main() {
    console.log("🔧 Fixing Manifest JPEG paths...");
    let manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    let changes = 0;

    for (const key in manifest) {
        const val = manifest[key];
        if (val.webp && val.jpeg) {
            // Check if basename matches
            const webpBase = path.basename(val.webp, '.webp');
            const jpegBase = path.basename(val.jpeg, '.jpg');

            if (webpBase !== jpegBase) {
                // Assuming webp is the source of truth (since we verified it was updated)
                const newJpeg = val.webp.replace('.webp', '.jpg');
                console.log(`   Fixing mismatch for [${key}]:`);
                console.log(`     JPEG: ${val.jpeg} -> ${newJpeg}`);
                val.jpeg = newJpeg;
                changes++;
            }
        }
    }

    if (changes > 0) {
        fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
        console.log(`✅ Fixed ${changes} manifest entries.`);
    } else {
        console.log("✨ Manifest is already consistent.");
    }
}

main();
