const fs = require('fs');
const path = require('path');

const OPTIMIZED_DIR = path.join(__dirname, '../public/optimized');
const MANIFEST_PATH = path.join(OPTIMIZED_DIR, 'manifest.json');

function main() {
    console.log("📦 Starting Image Migration...");

    if (!fs.existsSync(MANIFEST_PATH)) {
        console.error("❌ Manifest not found!");
        return;
    }

    let manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    let changes = 0;

    // Get categories (subfolders in optimized/)
    const categories = fs.readdirSync(OPTIMIZED_DIR).filter(file => {
        return fs.statSync(path.join(OPTIMIZED_DIR, file)).isDirectory();
    });

    categories.forEach(category => {
        const catDir = path.join(OPTIMIZED_DIR, category);
        const files = fs.readdirSync(catDir);

        const webpDir = path.join(catDir, 'webp');
        const jpgDir = path.join(catDir, 'jpg');

        if (!fs.existsSync(webpDir)) fs.mkdirSync(webpDir);
        if (!fs.existsSync(jpgDir)) fs.mkdirSync(jpgDir);

        files.forEach(file => {
            const filePath = path.join(catDir, file);

            // Skip directories (including the new webp/jpg ones)
            if (fs.statSync(filePath).isDirectory()) return;

            const ext = path.extname(file).toLowerCase();
            let newPath = '';

            if (ext === '.webp') {
                newPath = path.join(webpDir, file);
            } else if (ext === '.jpg' || ext === '.jpeg') {
                newPath = path.join(jpgDir, file);
            } else {
                return; // Skip other files
            }

            // Move file
            fs.renameSync(filePath, newPath);
            console.log(`   Moved: ${category}/${file} -> ${category}/${path.basename(path.dirname(newPath))}/${file}`);
        });
    });

    // Update Manifest
    for (const key in manifest) {
        const val = manifest[key];
        if (val.webp) {
            // Check if already updated (idempotency)
            if (!val.webp.includes('/webp/')) {
                const parts = val.webp.split('/');
                const filename = parts.pop();
                const category = parts.pop(); // e.g. 'polaroids'
                // Reconstruct path: .../category/webp/filename
                val.webp = val.webp.replace(`/${category}/`, `/${category}/webp/`);
                changes++;
            }
        }
        if (val.jpeg) {
            if (!val.jpeg.includes('/jpg/')) {
                const parts = val.jpeg.split('/');
                const filename = parts.pop();
                const category = parts.pop();
                val.jpeg = val.jpeg.replace(`/${category}/`, `/${category}/jpg/`);
                changes++;
            }
        }
    }

    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
    console.log(`✅ Migration Complete. Updated ${changes} manifest entries.`);
}

main();
