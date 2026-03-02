'use server';

import fs from 'node:fs/promises';
import path from 'node:path';
import { exec } from 'node:child_process';
import util from 'node:util';

const execAsync = util.promisify(exec);

export async function renamePhoto(originalName: string, newNameWithoutExt: string) {
    const rootDir = process.cwd();
    const manifestPath = path.join(rootDir, 'public', 'optimized', 'manifest.json');
    const manifestData = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestData);

    const entry = manifest[originalName];
    if (!entry) {
        throw new Error(`Original file not found in manifest: ${originalName}`);
    }

    // Determine subfolder (photographs or polaroids)
    const isPolaroid = entry.webp.includes('/polaroids/');
    const subfolder = isPolaroid ? 'polaroids' : 'photographs';
    const imagesDir = path.join(rootDir, 'images', subfolder);

    const ext = path.extname(originalName);
    const newNameWithExt = newNameWithoutExt + ext.toLowerCase(); // keep ext lowercased for seo

    // 1. Rename original file
    await fs.rename(
        path.join(imagesDir, originalName),
        path.join(imagesDir, newNameWithExt)
    );

    // 2. We don't necessarily delete the old optimized versions safely without knowing their exact old names, 
    // but they'll be overwritten/ignored. Let's just run optimize.
    const optimizeScript = path.join(rootDir, 'scripts', 'optimize-images.mjs');
    await execAsync(`node "${optimizeScript}"`);

    return { success: true, newNameWithoutExt };
}
