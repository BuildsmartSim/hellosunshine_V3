import fs from 'node:fs/promises';
import path from 'node:path';
import Image from 'next/image';
import { renamePhoto } from './actions';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default async function AdminPhotosPage() {
    const rootDir = process.cwd();
    const manifestPath = path.join(rootDir, 'public', 'optimized', 'manifest.json');

    let manifest: Record<string, { webp: string; jpeg: string }> = {};
    try {
        const data = await fs.readFile(manifestPath, 'utf-8');
        manifest = JSON.parse(data);
    } catch (err) {
        console.error('Failed to read manifest', err);
    }

    // Convert to array and filter out files that are already SEO renamed
    // E.g. ones that don't start with DSCF, P11, IMG etc.
    const entries = Object.entries(manifest).map(([originalName, paths]) => ({
        originalName,
        webp: paths.webp,
        isRawName: /^(DSCF|P11|IMG|_)/i.test(originalName) || /^\d/.test(originalName) // Matches default camera names or number-prefixed like timestamps
    }));

    const needsRenaming = entries.filter(e => e.isRawName).sort((a, b) => a.originalName.localeCompare(b.originalName));
    const alreadyRenamed = entries.filter(e => !e.isRawName).sort((a, b) => a.originalName.localeCompare(b.originalName));

    async function handleRename(formData: FormData) {
        'use server';
        const oldName = formData.get('oldName') as string;
        const newName = formData.get('newName') as string;

        if (oldName && newName) {
            await renamePhoto(oldName, newName);
            revalidatePath('/admin/photos');
            redirect('/admin/photos'); // force fresh load
        }
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12">
            <div className="mb-8 border-b pb-4">
                <h1 className="text-4xl font-black uppercase text-gray-900 tracking-tight font-chicle">SEO Photo Review</h1>
                <p className="text-gray-600 mt-2 font-handwriting text-xl">
                    Review new uploads and give them descriptive, SEO-friendly names.
                </p>
            </div>

            <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center shadow-yellow-200">
                    <span className="bg-yellow-100 px-2 py-1 rounded">Needs Renaming ({needsRenaming.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {needsRenaming.map((photo) => (
                        <div key={photo.originalName} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-all hover:shadow-md">
                            <div className="aspect-square relative bg-gray-50 flex-shrink-0">
                                {/* Notice: we use unoptimized because we don't need Next.js to do runtime optimization of our already optimized images in the admin tool */}
                                <Image
                                    src={photo.webp}
                                    alt={photo.originalName}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                            <div className="p-4 flex-grow flex flex-col self-stretch">
                                <p className="text-xs text-gray-500 mb-2 font-mono truncate">{photo.originalName}</p>
                                <form action={handleRename} className="mt-auto space-y-3">
                                    <input type="hidden" name="oldName" value={photo.originalName} />
                                    <div>
                                        <label className="sr-only">New SEO Name</label>
                                        <input
                                            type="text"
                                            name="newName"
                                            placeholder="e.g. sunny-garden-festival"
                                            required
                                            pattern="^[a-z0-9-]+$"
                                            title="Only lowercase letters, numbers, and hyphens"
                                            className="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-shadow"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-gray-900 text-white text-sm font-semibold py-2 rounded-lg hover:bg-yellow-400 hover:text-black transition-colors"
                                    >
                                        Rename & Re-optimize
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-bold mb-4 text-gray-400">Already Renamed ({alreadyRenamed.length})</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 opacity-75">
                    {alreadyRenamed.map((photo) => (
                        <div key={photo.originalName} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                            <div className="aspect-square relative flex-shrink-0">
                                <Image
                                    src={photo.webp}
                                    alt={photo.originalName}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                            <div className="p-2">
                                <p className="text-xs text-gray-600 font-mono truncate" title={photo.originalName}>{photo.originalName}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
