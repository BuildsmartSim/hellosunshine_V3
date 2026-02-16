# Hello Sunshine V2 - Local Performance Guide

If you are experiencing slow responses or system lag while running the development server and Antigravity, follow these steps to recover performance.

## 1. Narrow IDE Indexing
The most common cause of high CPU/RAM usage in Antigravity is the Language Server trying to index too many files.
- **Action**: I have updated `tsconfig.json` to only include `./src/**/*`. This prevents the engine from scanning `node_modules` or `.next` excessively.

## 2. Identify High-Resource Competing Apps
The development server and IDE indexing are CPU-intensive. Check Windows Task Manager for:
- **Spotify**: Can occasionally spike to extreme CPU usage (3000+ units). Consider pausing or closing Spotify during active coding sessions.
- **Chrome/Edge Tabs**: Especially those with the site or heavy web apps open. Close unused tabs.
- **Other IDEs**: Multiple open projects can multiply the language server load.

## 3. Use Turbopack Effectively
Next.js 15+ supports Turbopack via the `--turbo` flag.
- **Command**: `npm run dev` (Ensure it's using `next dev --turbo`).
- **Benefit**: Turbopack significantly speeds up HMR (Hot Module Replacement) and initial compilation.

## 4. Hardware Resources
If Antigravity is still slow:
- **Clean Cache**: Sometimes the `.next` folder becomes bloated. Run `rm -rf .next` and restart.
- **System Memory**: Ensure you have at least 4GB of free RAM before starting.

## 5. Selective Rendering
For pages with complex SVG filters (like the Design System), the browser rendering engine can become the bottleneck.
- **Action**: I have optimized the SVG filters in `GlobalFilters.tsx` to use `numOctaves="1"` in development to keep the UI snappy.
