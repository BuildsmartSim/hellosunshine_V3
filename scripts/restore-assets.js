const fs = require('fs');
const path = require('path');

const BACKUP_DIR = 'c:/prog/Hellosunshine_V2/photography_backup/public_optimized';
const TARGET_DIR = 'c:/prog/Hellosunshine_V2/public/optimized';

const POLAROID_MAP = {
    "sauna-garden": "sauna-garden-relaxing-crowd",
    "20220519_235836": "night-fire-pit-heart-decor-chairs",
    "interior-fire": "sauna-interior-wood-stove-glow",
    "opendoor": "caravan-open-door-night-steps",
    "saunagarden": "silver-chimney-rainbow-sky",
    "6": "hello-sign-warm-lighting-detail",
    "2-1024x1024": "wood-fired-sauna-interior-benches",
    "caravan1": "vintage-silver-caravan-daytime-field",
    "20220519_235819": "caravan-metallic-detail-curve",
    "2024-02-07": "medicine-festival-hot-tub-smiles",
    "wood": "chopped-firewood-logs-texture" // Assumption
};

const PHOTO_MAP = {
    "img_5632": "sauna-signage-vintage-caravan-outdoor",
    "photo-2022-12-19-22-04-41-2": "happy-group-hot-tub-thumbs-up",
    "img_2754": "caravan-tent-view-garlands",
    "img-1995": "caravan-camp-fire-pit-gathering"
};

function copyRenamed(sourceDir, targetDir, mapping, category) {
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    // Copy all files from sourceDir to targetDir/webp and targetDir/jpg
    const files = fs.readdirSync(sourceDir);
    files.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        const base = path.basename(file, ext);
        const newBase = mapping[base] || base;

        let subDir = ext === '.webp' ? 'webp' : 'jpg';
        const finalDestDir = path.join(targetDir, subDir);
        if (!fs.existsSync(finalDestDir)) fs.mkdirSync(finalDestDir, { recursive: true });

        const srcPath = path.join(sourceDir, file);
        const destPath = path.join(finalDestDir, newBase + ext);

        console.log(`Copying ${file} -> ${category}/${subDir}/${newBase}${ext}`);
        fs.copyFileSync(srcPath, destPath);
    });
}

// Polaroids
copyRenamed(
    path.join(BACKUP_DIR, 'polaroids'),
    path.join(TARGET_DIR, 'polaroids'),
    POLAROID_MAP,
    'polaroids'
);

// Photographs
copyRenamed(
    path.join(BACKUP_DIR, 'photographs'),
    path.join(TARGET_DIR, 'photographs'),
    PHOTO_MAP,
    'photographs'
);

console.log("Restoration complete.");
