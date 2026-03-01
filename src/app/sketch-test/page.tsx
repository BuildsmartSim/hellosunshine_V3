import React from "react";

export default function SketchTestPage() {
  return (
    <main
      className="min-h-screen p-12 md:p-24 flex flex-col gap-16"
      style={{ backgroundColor: "#F3EFE6" }}
    >
      <div className="max-w-4xl mx-auto space-y-16">
        <div>
          <span className="overline mb-4 block">
            1. Lightest (Scale 300px, w/ Stroke)
          </span>
          <h1 className="sketch-lh-1 text-6xl md:text-8xl">The Sanctuary</h1>
        </div>

        <div>
          <span className="overline mb-4 block">
            2. Medium (Scale 150px, w/ Stroke)
          </span>
          <h1 className="sketch-lh-2 text-6xl md:text-8xl">The Sanctuary</h1>
        </div>

        <div>
          <span className="overline mb-4 block">
            3. Densest (Scale 75px, w/ Stroke)
          </span>
          <h1 className="sketch-lh-3 text-6xl md:text-8xl">The Sanctuary</h1>
        </div>

        <div className="pt-12 border-t border-charcoal/10">
          <span className="overline mb-4 block">
            4. Densest (Scale 75px, NO STROKE)
          </span>
          <h1 className="sketch-lh-4 text-6xl md:text-8xl">The Sanctuary</h1>
        </div>

        <div>
          <span className="overline mb-4 block">
            5. Medium (Scale 150px, NO STROKE)
          </span>
          <h1 className="sketch-lh-5 text-6xl md:text-8xl">The Sanctuary</h1>
        </div>

        <div className="pt-12 border-t border-charcoal/10 text-primary">
          <span className="overline mb-4 block text-primary">
            6. AI GENERATED MAXIMUM DENSITY (w/ Stroke)
          </span>
          <h1 className="sketch-ai-dense-1 text-6xl md:text-8xl text-charcoal">
            The Sanctuary
          </h1>
        </div>

        <div>
          <span className="overline mb-4 block text-primary">
            7. AI GENERATED MAXIMUM DENSITY (NO STROKE)
          </span>
          <h1 className="sketch-ai-dense-2 text-6xl md:text-8xl text-charcoal">
            The Sanctuary
          </h1>
        </div>

        <div className="pt-12 border-t border-charcoal/10 text-blue-600">
          <span className="overline mb-4 block text-blue-600">
            8. USER TEXTURE (pencilshading.jpg - w/ Stroke)
          </span>
          <h1 className="sketch-custom-user-1 text-6xl md:text-8xl text-charcoal">
            The Sanctuary
          </h1>
        </div>

        <div>
          <span className="overline mb-4 block text-blue-600">
            9a. USER TEXTURE (Original / Scale 800px - NO STROKE)
          </span>
          <h1 className="sketch-custom-user-2a text-6xl md:text-8xl text-charcoal">
            The Sanctuary
          </h1>
        </div>

        <div>
          <span className="overline mb-4 block text-blue-600">
            9b. USER TEXTURE (Lighter 1 - NO STROKE)
          </span>
          <h1 className="sketch-custom-user-2b text-6xl md:text-8xl text-charcoal">
            The Sanctuary
          </h1>
        </div>

        <div>
          <span className="overline mb-4 block text-blue-600">
            9c. USER TEXTURE (Lightest 2 - NO STROKE)
          </span>
          <h1 className="sketch-custom-user-2c text-6xl md:text-8xl text-charcoal">
            The Sanctuary
          </h1>
        </div>
      </div>
    </main>
  );
}
