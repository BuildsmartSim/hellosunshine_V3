
const fs = require('fs');

const photoRenames = {
    "301182689_496044919194095_8165369422444873796_n": "sauna-entrance-natural-lighting",
    "51db1596-7adf-4dea-973b-9eae633d8103": "wood-heated-sauna-interior-logs",
    "549fd27a-f884-403b-9d16-d97cca38f9b0": "sauna-exterior-silver-caravan-sunny",
    "5612af0f-fe77-4ee9-97d9-f6b066c2aab7": "sauna-interior-wooden-benches",
    "70260507_505234013589128_7562339928147755008_n": "sauna-guests-relaxing-outdoor",
    "83652249_621005405345321_952118185652387840_n": "sauna-garden-social-gathering",
    "8bd5bc9b-1100-495b-90fe-d56938959134": "sauna-bench-detail-texture",
    "92b142ea-43e2-400f-a964-13589088d184": "sauna-stove-wood-burning-detail",
    "9a79c3b5-1bbe-44ad-b9bd-382959686f17": "sauna-window-view-nature",
    "capture": "sauna-garden-aerial-view",
    "d07f230b-848b-44c6-90bf-b31e1b505b7d-enhanced": "sauna-interior-warm-glow-enhanced",
    "img-0013": "sauna-guest-portrait-relaxing",
    "img-0052": "sun-relaxing-yellow-chairs-sanctuary",
    "img-1159": "festival-crowd-relaxing-beanbags",
    "img-1988": "sanctuary-guitar-relaxing-sun",
    "img-1995": "caravan-camp-fire-pit-gathering",
    "img_2752": "vintage-caravan-cloudy-sky",
    "img_2754": "caravan-tent-view-garlands",
    "img_5632": "sauna-signage-vintage-caravan-outdoor",
    "photo-2022-12-19-22-04-41-2": "happy-group-hot-tub-thumbs-up",
    "sun-grass-nude": "relaxing-lawn-caravan-sanctuary"
};

const polaroidRenames = {
    "0b1a91d1-9593-4683-a883-cb6518e4ac33": "tent-interior-towels-night-lamp",
    "2-1024x1024": "wood-fired-sauna-interior-benches",
    "20220519_235539": "night-spa-towels-boombox-lighting",
    "20220519_235819": "caravan-metallic-detail-curve",
    "20220519_235836": "night-fire-pit-heart-decor-chairs",
    "2024-02-07": "medicine-festival-hot-tub-smiles",
    "5": "warm-night-caravan-fire-pit-ambience",
    "6": "hello-sign-warm-lighting-detail",
    "caravan1": "vintage-silver-caravan-daytime-field",
    "door": "caravan-entrance-warm-night-logs",
    "dscf2479": "smiling-man-beard-festival-hat",
    "img-20250326-wa0005": "relaxing-beanbags-caravan-tents-festival",
    "interior-fire": "sauna-interior-wood-stove-glow",
    "opendoor": "caravan-open-door-night-lighting",
    "sauna-garden": "sauna-garden-relaxing-crowd",
    "showers_outdoor_square": "outdoor-showers-reed-privacy-screen",
    "tim-team": "team-smiling-sun-sculpture",
    "saunagarden": "sauna-garden-wide-angle",
    "5-1": "duplicate-sauna-night-ambience"
};

const manifestPath = 'c:/Projects/hello_sunshine_v2/public/optimized/manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

for (const key in manifest) {
    const item = manifest[key];

    // Photographs
    if (item.webp.includes('/photographs/')) {
        const base = item.webp.split('/').pop().split('.').shift();
        if (photoRenames[base]) {
            item.webp = item.webp.replace(base, photoRenames[base]);
            item.jpeg = item.jpeg.replace(base, photoRenames[base]);
        }
    }

    // Polaroids
    if (item.webp.includes('/polaroids/')) {
        const base = item.webp.split('/').pop().split('.').shift();
        if (polaroidRenames[base]) {
            item.webp = item.webp.replace(base, polaroidRenames[base]);
            item.jpeg = item.jpeg.replace(base, polaroidRenames[base]);
        }
    }
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('Manifest updated.');
