"use client";

import { useState } from "react";
import { exportInscriptionsToCSV } from "@/app/actions/randonnees";
import { Button } from "@/components/ui/button";

interface ExportCSVButtonProps {
  randonneeId: string;
}

export default function ExportCSVButton({ randonneeId }: ExportCSVButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const result = await exportInscriptionsToCSV(randonneeId);

      if (result.success && result.csv) {
        // Créer un blob et télécharger le fichier
        const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);

        link.setAttribute("href", url);
        link.setAttribute("download", result.filename || "inscriptions.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        alert(result.error || "Erreur lors de l'export");
      }
    } catch (error) {
      console.error("Erreur export CSV:", error);
      alert("Une erreur est survenue lors de l'export");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button onClick={handleExport} disabled={isExporting}>
      {isExporting ? "Export en cours..." : "📊 Exporter en CSV"}
    </Button>
  );
}


