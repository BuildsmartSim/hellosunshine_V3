const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PUBLIC_DIR = path.join(__dirname, 'public', 'optimized');
const MANIFEST_PATH = path.join(PUBLIC_DIR, 'manifest.json');
const SRC_DIR = path.join(__dirname, 'src');

/* ─────────────────────────────────────────────────────
   1. DEFINE CHANGES
   ───────────────────────────────────────────────────── */

// Files to Delete (Duplicates)
// Format: { path: 'relative/path/to/file', reason: '...' }
const DELETIONS = [
    'polaroids/duplicate-sauna-night-ambience.jpg',
    'polaroids/duplicate-sauna-night-ambience.webp',
    'photographs/sauna-entrance-natural-lighting.jpg', // "Natural lighting" is inaccurate
    'photographs/sauna-entrance-natural-lighting.webp',
];

// Files to Rename (High Confidence)
// Format: { old: 'old-name', new: 'new-name' } (Extensions handled automatically for both .jpg and .webp)
const RENAMES = [
    { old: 'polaroids/sauna-garden-wide-angle', new: 'polaroids/couple-smiling-in-hot-tub' },
    { old: 'polaroids/wood', new: 'polaroids/chopped-firewood-logs-texture' },
    { old: 'polaroids/caravan-garden-people', new: 'polaroids/sunbathing-group-silver-caravan' },
    { old: 'polaroids/unsanchop2', new: 'polaroids/playful-group-lying-grass-caravan' },
    { old: 'polaroids/unsanchop3', new: 'polaroids/camp-fire-singalong-night-gathering' },
    { old: 'polaroids/92b142ea-43e2-400f-a964-13589088d1842', new: 'polaroids/silver-chimney-rainbow-sky' },
    { old: 'polaroids/screenshot-2024-05-16-054655', new: 'polaroids/caravan-night-lights-green-glow' },
    { old: 'polaroids/collection-of-golden-abstract-sun-logo-free-vector', new: 'polaroids/hello-sunshine-sign-festival-field' },
    { old: 'polaroids/caravan-entrance-warm-night-logs', new: 'polaroids/caravan-open-door-night-steps' },
    // Adding the one I just viewed
    { old: 'polaroids/team-smiling-sun-sculpture', new: 'polaroids/three-men-hugging-sun-sculpture' },
];


/* ─────────────────────────────────────────────────────
   2. EXECUTION LOGIC
   ───────────────────────────────────────────────────── */

function main() {
    console.log("🚀 Starting Image Fix Process...");

    // Load Manifest
    let manifest = {};
    try {
        if (fs.existsSync(MANIFEST_PATH)) {
            manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
        }
    } catch (e) {
        console.error("❌ Error reading manifest:", e);
        process.exit(1);
    }

    // 1. Process Deletions
    console.log("\n🗑️ Processing Deletions...");
    DELETIONS.forEach(relPath => {
        const fullPath = path.join(PUBLIC_DIR, relPath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log(`   Deleted: ${relPath}`);
        } else {
            console.log(`   Skipped (Not Found): ${relPath}`);
        }

        // Remove from Manifest if present (Key search)
        const keysToDelete = Object.keys(manifest).filter(key => {
            const val = manifest[key];
            const targetName = path.basename(relPath);
            return (val.webp && val.webp.includes(targetName)) || (val.jpeg && val.jpeg.includes(targetName));
        });
        keysToDelete.forEach(key => {
            delete manifest[key];
            console.log(`   Removed from Manifest: ${key}`);
        });
    });

    // 2. Process Renames
    console.log("\nTitle: Processing Renames...");
    // Helper to generate full list of files to rename (jpg + webp)
    const renameOperations = [];
    RENAMES.forEach(item => {
        ['.jpg', '.webp'].forEach(ext => {
            renameOperations.push({
                oldRel: item.old + ext,
                newRel: item.new + ext,
                oldName: path.basename(item.old + ext),
                newName: path.basename(item.new + ext)
            });
        });
    });

    renameOperations.forEach(op => {
        const oldPath = path.join(PUBLIC_DIR, op.oldRel);
        const newPath = path.join(PUBLIC_DIR, op.newRel);

        if (fs.existsSync(oldPath)) {
            // Rename File
            fs.renameSync(oldPath, newPath);
            console.log(`   Renamed: ${op.oldRel} -> ${op.newRel}`);

            // Update Manifest Values
            for (const key in manifest) {
                const val = manifest[key];
                if (val.webp && val.webp.includes(op.oldName)) {
                    val.webp = val.webp.replace(op.oldName, op.newName);
                    val.jpeg = val.jpeg.replace(op.oldName, op.newName);
                    console.log(`   Updated Manifest Key [${key}]: ${op.oldName} -> ${op.newName}`);
                }
            }

            // Update Source Code Content
            updateSourceCode(op.oldName, op.newName);

        } else {
            // It might have been already renamed or doesn't exist
            console.log(`   Skipped (Not Found): ${op.oldRel}`);
        }
    });

    // Save Manifest
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
    console.log("\n✅ Manifest Updated.");
}

function updateSourceCode(oldName, newName) {
    // Basic implementation: Grep and Replace in src dir
    // We are looking for strings that contain the filename
    // e.g. "/optimized/polaroids/oldName.webp"

    // We can use a recursive search strategy or shell command. 
    // Since we are in node, let's just use grep via exec for speed to find files, then read/write.
    // Or simpler: just walk the src directory.

    const filesToUpdate = getFiles(SRC_DIR);
    let count = 0;

    filesToUpdate.forEach(filePath => {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes(oldName)) {
            const newContent = content.replace(new RegExp(oldName, 'g'), newName);
            fs.writeFileSync(filePath, newContent);
            console.log(`   Updated Reference in: ${path.relative(__dirname, filePath)}`);
            count++;
        }
    });
}

function getFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getFiles(filePath, fileList);
        } else {
            // Only examine text files
            if (/\.(tsx|ts|js|jsx|css|md|json)$/.test(file)) {
                fileList.push(filePath);
            }
        }
    });
    return fileList;
}

main();
