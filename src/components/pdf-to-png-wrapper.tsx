// components/pdf-to-png-wrapper.tsx
"use client";

import dynamic from "next/dynamic";

// Import dynamique du composant PDF pour éviter les erreurs côté serveur
const PDFToPNGConverter = dynamic(
  () => import("./pdf-to-png-client").then((mod) => ({ default: mod.PDFToPNGConverter })),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Chargement du convertisseur PDF...</p>
        </div>
      </div>
    )
  }
);

export { PDFToPNGConverter };
