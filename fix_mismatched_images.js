const fs = require('fs');
const path = require('path');

const OPTIMIZED_DIR = path.join(__dirname, 'public/optimized');
const MANIFEST_PATH = path.join(OPTIMIZED_DIR, 'manifest.json');

const SWAPS = [
    {
        name1: 'silver-chimney-rainbow-sky',
        name2: 'hello-sunshine-sign-festival-field'
    }
];

const RENAMES = [
    { old: 'sauna-garden-aerial-view', new: 'man-in-ice-barrel' },
    { old: 'sauna-guests-relaxing-outdoor', new: 'golden-sun-face-sculpture' },
    { old: 'sauna-garden-social-gathering', new: 'ladies-fellas-sign' }
];

function main() {
    console.log("🔧 Fixing Mismatched Images...");

    let manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

    // 1. Handle Swaps
    SWAPS.forEach(swap => {
        console.log(`\n🔄 Swapping: ${swap.name1} <-> ${swap.name2}`);
        ['polaroids', 'photographs'].forEach(category => {
            ['webp', 'jpg'].forEach(ext => {
                const dir = path.join(OPTIMIZED_DIR, category, ext === 'webp' ? 'webp' : 'jpg');
                if (!fs.existsSync(dir)) return;

                const file1 = path.join(dir, `${swap.name1}.${ext}`);
                const file2 = path.join(dir, `${swap.name2}.${ext}`);
                const temp = path.join(dir, `TEMP_SWAP.${ext}`);

                if (fs.existsSync(file1) && fs.existsSync(file2)) {
                    fs.renameSync(file1, temp);
                    fs.renameSync(file2, file1);
                    fs.renameSync(temp, file2);
                    console.log(`   Swapped in ${category}/${ext}`);
                    updateManifestSwap(manifest, swap.name1, swap.name2, category, ext);
                } else if (fs.existsSync(file1)) {
                    // Only one exists? Maybe they are in different categories?
                    // In our case both are polaroids.
                }
            });
        });
    });

    // 2. Handle Renames
    RENAMES.forEach(item => {
        console.log(`\n✏️ Renaming: ${item.old} -> ${item.new}`);
        ['polaroids', 'photographs'].forEach(category => {
            ['webp', 'jpg'].forEach(ext => {
                const dir = path.join(OPTIMIZED_DIR, category, ext === 'webp' ? 'webp' : 'jpg');
                if (!fs.existsSync(dir)) return;

                const oldPath = path.join(dir, `${item.old}.${ext}`);
                const newPath = path.join(dir, `${item.new}.${ext}`);

                if (fs.existsSync(oldPath)) {
                    fs.renameSync(oldPath, newPath);
                    console.log(`   Renamed in ${category}/${ext}`);
                    updateManifestRename(manifest, item.old, item.new);
                }
            });
        });
    });

    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
    console.log("\n✅ Fixes applied.");
}

function updateManifestSwap(manifest, name1, name2, category, ext) {
    // This is tricky because manifest keys are original filenames.
    // We need to find which key points to name1 and which points to name2, then swap their values.
    // Actually, simply scanning values is safer.

    for (const key in manifest) {
        const val = manifest[key];
        const prop = ext === 'webp' ? 'webp' : 'jpeg'; // Manifest uses 'jpeg' key

        if (val[prop] && val[prop].includes(name1)) {
            // This entry points to name1. We need to point it to name2?
            // No, if we swapped the FILES, the CONTENT of "name1" is now the content of "name2".
            // The filename "name1" now contains the image that was "name2".

            // Wait.
            // File A matches Name A. File B matches Name B.
            // We want File A to have Name B, and File B to have Name A.
            // We renamed File A -> B, and File B -> A.

            // The manifest maps "Original.png" -> "Name A".
            // If "Original.png" was the content for Name B, then we want it to map to "Name B".

            // So we just need to update the manifest paths.
            // If key K1 maps to .../name1.webp
            // And we just renamed name1.webp to have name2's content?
            // No, we swapped the contents of the files name1 and name2.
            // NO.

            // Scenario:
            // Key "Chimney.jpg" -> "hello-sunshine-sign.webp" (WRONG content)
            // Key "Sign.jpg" -> "silver-chimney.webp" (WRONG content)

            // I physically swapped the files.
            // Now "hello-sunshine-sign.webp" contains the SIGN (Correct for the name).
            // And "silver-chimney.webp" contains the CHIMNEY (Correct for the name).

            // So "Chimney.jpg" now points to "hello-sunshine-sign.webp" (which is now the Sign). WRONG.
            // "Chimney.jpg" should point to "silver-chimney.webp".

            // So I DO need to swap the manifest values too.

            // BUT, we have a problem.
            // If I swap the values, "Chimney.jpg" -> "silver-chimney.webp". Correct.

            // So yes, I need to swap the substrings in the manifest values.
        }
    }
}

// Rewriting manifest logic to be simpler:
// scan all values, replace substrings.
// For SWAP:
//  Find entries pointing to name1, change to TEMP.
//  Find entries pointing to name2, change to name1.
//  Find entries pointing to TEMP, change to name2.

// For RENAME:
//  Find entries pointing to oldName, change to newName.

// I will re-implement the main function's manifest update logic to be robust.
main = function () {
    console.log("🔧 Fixing Mismatched Images...");
    let manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

    // 1. SWAP
    SWAPS.forEach(swap => {
        console.log(`\n🔄 Swapping: ${swap.name1} <-> ${swap.name2}`);

        // Physical Swap
        ['polaroids', 'photographs'].forEach(category => {
            ['webp', 'jpg'].forEach(ext => {
                const dir = path.join(OPTIMIZED_DIR, category, ext === 'webp' ? 'webp' : 'jpg');
                if (!fs.existsSync(dir)) return;
                const file1 = path.join(dir, `${swap.name1}.${ext}`);
                const file2 = path.join(dir, `${swap.name2}.${ext}`);
                const temp = path.join(dir, `TEMP_SWAP.${ext}`);

                if (fs.existsSync(file1) && fs.existsSync(file2)) {
                    fs.renameSync(file1, temp);
                    fs.renameSync(file2, file1);
                    fs.renameSync(temp, file2);
                    console.log(`   Swapped files in ${category}/${ext}`);
                }
            });
        });

        // Manifest Swap
        for (const key in manifest) {
            const val = manifest[key];
            ['webp', 'jpeg'].forEach(prop => {
                if (!val[prop]) return;
                if (val[prop].includes(swap.name1)) {
                    val[prop] = val[prop].replace(swap.name1, 'TEMP_SWAP_MARKER');
                } else if (val[prop].includes(swap.name2)) {
                    val[prop] = val[prop].replace(swap.name2, swap.name1);
                }
            });
        }
        for (const key in manifest) {
            const val = manifest[key];
            ['webp', 'jpeg'].forEach(prop => {
                if (!val[prop]) return;
                if (val[prop].includes('TEMP_SWAP_MARKER')) {
                    val[prop] = val[prop].replace('TEMP_SWAP_MARKER', swap.name2);
                }
            });
        }
    });

    // 2. RENAME
    RENAMES.forEach(item => {
        console.log(`\n✏️ Renaming: ${item.old} -> ${item.new}`);
        ['polaroids', 'photographs'].forEach(category => {
            ['webp', 'jpg'].forEach(ext => {
                const dir = path.join(OPTIMIZED_DIR, category, ext === 'webp' ? 'webp' : 'jpg');
                if (!fs.existsSync(dir)) return;
                const oldPath = path.join(dir, `${item.old}.${ext}`);
                const newPath = path.join(dir, `${item.new}.${ext}`);
                if (fs.existsSync(oldPath)) {
                    fs.renameSync(oldPath, newPath);
                    console.log(`   Renamed file in ${category}/${ext}`);
                }
            });
        });

        // Manifest Rename
        for (const key in manifest) {
            const val = manifest[key];
            ['webp', 'jpeg'].forEach(prop => {
                if (val[prop] && val[prop].includes(item.old)) {
                    val[prop] = val[prop].replace(item.old, item.new);
                }
            });
        }
    });

    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
    console.log("\n✅ Fixes applied.");
}

main();
