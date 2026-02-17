const fs = require('fs');
const path = require('path');

const OPTIMIZED_DIR = path.join(__dirname, 'public/optimized');
const MANIFEST_PATH = path.join(OPTIMIZED_DIR, 'manifest.json');

// Mismatches to fix
// Format: { category, currentName, newName, isDuplicate }
const FIXES = [
    // Polaroids
    {
        category: 'polaroids',
        current: 'caravan-night-lights-green-glow',
        target: 'caravan-open-door-night-lighting',
        isDuplicate: true
    },
    // Photographs
    {
        category: 'photographs',
        current: 'sauna-bench-detail-texture',
        new: 'van-loaded-with-festival-gear'
    },
    {
        category: 'photographs',
        current: 'sauna-interior-warm-glow-enhanced',
        new: 'sauna-campsite-sunset-rays-pool'
    },
    {
        category: 'photographs',
        current: 'sauna-interior-wooden-benches',
        new: 'fire-pit-burning-logs-overhead'
    },
    {
        category: 'photographs',
        current: 'sauna-stove-wood-burning-detail',
        target: 'hello-sunshine-sign-festival-field', // Duplicate of verified image
        isDuplicate: true
        // Note: verified image is in polaroids? No, verified image is in polaroids AND photographs?
        // Let's check step 570. It was in polaroids list.
        // Let's check photography list... "hello-sunshine-sign-festival-field.webp" was NOT in the photography list in step 528?
        // Step 528 list:
        // ...
        // no "hello-sunshine-sign..." in photographs list!
        // But "sauna-stove-wood-burning-detail" IS in photographs list.
        // And it CONTAINS the hello sunshine sign.
        // So we should rename it to `hello-sunshine-sign-festival-field` (moving it to match naming convention) OR keep it unique?
        // If I rename it to `hello-sunshine-sign-festival-field`, and that file doesn't exist in `photographs`, then it's a RENAME, not a DUPLICATE handling.
    },
    {
        category: 'photographs',
        current: 'sauna-window-view-nature',
        new: 'hand-painted-sauna-sign-detail'
    },
    {
        category: 'photographs',
        current: 'wood-heated-sauna-interior-logs',
        new: 'sanctuary-garden-yellow-chairs-beanbags'
    }
];

function main() {
    console.log("🔧 Application Fixes for Image Re-Audit...");
    let manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

    FIXES.forEach(fix => {
        ['webp', 'jpg'].forEach(ext => {
            const dir = path.join(OPTIMIZED_DIR, fix.category, ext === 'webp' ? 'webp' : 'jpg');
            const currentPath = path.join(dir, `${fix.current}.${ext}`);

            if (!fs.existsSync(currentPath)) {
                console.log(`⚠️  File not found: ${fix.current}.${ext} in ${fix.category}`);
                return;
            }

            if (fix.isDuplicate) {
                // If it's a duplicate of another file, we can simply delete this one 
                // OR rename it to confirm identity?
                // fix.target refers to the filename that supposedly has the same content.
                // In case 1: 'caravan-night-lights-green-glow' (night scene) is dup of 'caravan-open-door-night-lighting'.
                // We should probably delete the confusing one? Or rename it to `caravan-open-door-night-lighting-v2`?
                // Let's rename to avoid data loss, just in case they are slightly different frames.

                let newName = fix.target + '-dup';

                // Special case for the Hello Sign
                if (fix.current === 'sauna-stove-wood-burning-detail') {
                    // This file exists in photographs. The 'target' exists in polaroids.
                    // We want to rename this file in photographs to be descriptive.
                    newName = 'hello-sunshine-sign-festival-field';
                    // This is a RENAME because the target name doesn't exist in THIS category/folder yet.
                }

                const newPath = path.join(dir, `${newName}.${ext}`);
                fs.renameSync(currentPath, newPath);
                console.log(`   🔄 Renamed (Dup/Fix): ${fix.current} -> ${newName} (${ext})`);
                updateManifest(manifest, fix.current, newName);

            } else {
                // Standard Rename
                const newPath = path.join(dir, `${fix.new}.${ext}`);
                fs.renameSync(currentPath, newPath);
                console.log(`   ✏️  Renamed: ${fix.current} -> ${fix.new} (${ext})`);
                updateManifest(manifest, fix.current, fix.new);
            }
        });
    });

    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
    console.log("\n✅ Fixes applied.");
}

function updateManifest(manifest, oldName, newName) {
    for (const key in manifest) {
        const val = manifest[key];
        ['webp', 'jpeg'].forEach(prop => {
            if (val[prop] && val[prop].includes(oldName)) {
                val[prop] = val[prop].replace(oldName, newName);
            }
        });
    }
}

main();
