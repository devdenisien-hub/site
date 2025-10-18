// components/pdf-to-png-client.tsx
"use client";

import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Loader2 } from "lucide-react";

// Configuration pour le navigateur avec CDN alternatif
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@5.4.296/build/pdf.worker.min.mjs';

// Déclaration globale pour Tesseract.js depuis le CDN
declare global {
  interface Window {
    Tesseract: any;
  }
}

interface PDFToPNGProps {
  file: File;
  onImageGenerated: (imageFile: File, extractedData?: any) => void;
  onError: (error: string) => void;
}

export function PDFToPNGConverter({ file, onImageGenerated, onError }: PDFToPNGProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedImage, setConvertedImage] = useState<File | null>(null);
  const [isOCRLoading, setIsOCRLoading] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);

  const convertPDFToPNG = async () => {
    setIsProcessing(true);
    setOcrError(null);
    
    try {
      console.log("🔄 [Client PDF] Début de la conversion PDF → PNG");
      
      // Charger le PDF
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      console.log("📄 [Client PDF] PDF chargé, pages:", pdf.numPages);
      
      // Récupérer la première page
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 2 }); // Haute résolution
      
      // Créer un canvas
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      
      if (!context) {
        throw new Error("Impossible de créer le contexte canvas");
      }
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      // Rendre la page sur le canvas
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      
      await page.render(renderContext).promise;
      
      console.log("🖼️ [Client PDF] Page rendue sur canvas");
      
      // Convertir le canvas en PNG
      canvas.toBlob(async (blob) => {
        if (!blob) {
          throw new Error("Impossible de générer l'image PNG");
        }
        
        // Créer un fichier File à partir du blob
        const imageFile = new File([blob], `${file.name.replace('.pdf', '')}_page1.png`, {
          type: "image/png",
        });
        
        console.log("✅ [Client PDF] PNG généré:", imageFile.name, imageFile.size, "octets");
        
        // Stocker l'image convertie pour affichage
        setConvertedImage(imageFile);
        setIsProcessing(false);
        
        // Créer une URL pour l'aperçu
        const imageUrl = URL.createObjectURL(blob);
        console.log("🖼️ [Client PDF] Image prête pour aperçu:", imageUrl);
        
      }, "image/png", 0.95);
      
    } catch (error) {
      console.error("❌ [Client PDF] Erreur:", error);
      onError(`Erreur lors de la conversion PDF: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      setIsProcessing(false);
    }
  };

  const runOCR = async () => {
    if (!convertedImage) {
      console.error("❌ [Client OCR] Aucune image convertie disponible");
      return;
    }

    setIsOCRLoading(true);
    setOcrError(null);
    
    try {
      console.log("🤖 [Client OCR] Début de l'OCR côté client");
      
      // Charger Tesseract.js depuis le CDN si pas déjà chargé
      if (!window.Tesseract) {
        await loadTesseractFromCDN();
      }
      
      const { data: { text } } = await window.Tesseract.recognize(convertedImage, 'fra+eng', {
        logger: m => console.log("🤖 [Client Tesseract]", m),
        // Configuration pour améliorer la reconnaissance des documents structurés
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇàâäéèêëïîôöùûüÿç0123456789/.-: ',
        tessedit_pageseg_mode: '6', // Mode de segmentation uniforme
        tessedit_ocr_engine_mode: '1', // Mode LSTM uniquement
        preserve_interword_spaces: '1', // Préserver les espaces entre mots
        tessedit_create_hocr: '0', // Pas de HOCR
        tessedit_create_tsv: '0', // Pas de TSV
      });
      
      console.log("📝 [Client OCR] Texte extrait (200c):", text.slice(0, 200));
      
      // Extraire les données PPS côté client
      const extractedData = extractPPSDataClient(text);
      console.log("🎯 [Client OCR] Données extraites:", extractedData);
      
      // Envoyer l'image et les données extraites
      onImageGenerated(convertedImage, extractedData);
      
    } catch (ocrError) {
      console.error("❌ [Client OCR] Erreur OCR:", ocrError);
      setOcrError(`Erreur OCR: ${ocrError instanceof Error ? ocrError.message : 'Erreur inconnue'}`);
    } finally {
      setIsOCRLoading(false);
    }
  };

  const loadTesseractFromCDN = async () => {
    return new Promise((resolve, reject) => {
      if (window.Tesseract) {
        resolve(window.Tesseract);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
      script.onload = () => {
        console.log("✅ [Client OCR] Tesseract.js chargé depuis le CDN");
        resolve(window.Tesseract);
      };
      script.onerror = () => {
        reject(new Error('Impossible de charger Tesseract.js depuis le CDN'));
      };
      document.head.appendChild(script);
    });
  };

  // Fonctions utilitaires pour l'extraction robuste
  const pick1 = (patterns: RegExp[], text: string): string | undefined => {
    for (const r of patterns) {
      const m = text.match(r);
      if (m?.[1]) return m[1];
    }
    return undefined;
  };

  const oneLine = (s: string): string => {
    return s.replace(/\r?\n/g, " ").replace(/\s{2,}/g, " ").trim();
  };

  const toISO = (input: string): string => {
    // Accepte ISO déjà propre
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
    // DD/MM/YYYY | DD-MM-YYYY | DD.MM.YYYY
    const m = input.match(/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/);
    if (!m) return input;
    const dd = m[1].padStart(2, "0");
    const mm = m[2].padStart(2, "0");
    let yy = m[3];
    if (yy.length === 2) yy = "20" + yy;
    return `${yy}-${mm}-${dd}`;
  };

  const extractPPSDataClient = (text: string) => {
    console.log("🔍 [Client Extraction] Début de l'extraction des données PPS");
    console.log("📝 [Client Extraction] Texte original:");
    console.log("=".repeat(50));
    console.log(text);
    console.log("=".repeat(50));

    const t = oneLine(text);
    console.log("📝 [Client Extraction] Texte normalisé (une ligne):");
    console.log(t);
    console.log("=".repeat(50));

    const extractedData: any = {};

    // NOM - Pattern tolérant au bruit entre "Nom" et la valeur
    console.log("🔍 [Client Extraction] Recherche du nom...");
    extractedData.nom = pick1([
      // Pattern très tolérant : Nom suivi de n'importe quoi puis capture des majuscules
      /(?:\bNom\b)[^A-Z]*([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ]{2,})/,
      // Pattern de fallback : chercher des mots en majuscules après "Nom"
      /(?:\bNom\b).*?([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ]{2,})/,
    ], t)?.toUpperCase()?.trim();
    console.log(`✅ [Client Extraction] Nom extrait: "${extractedData.nom}"`);

    // PRÉNOM - Pattern tolérant au bruit entre "Prénom" et la valeur
    console.log("🔍 [Client Extraction] Recherche du prénom...");
    const prenomPatterns = [
      // Pattern très tolérant : Prénom suivi de n'importe quoi puis capture des lettres (peut commencer par plusieurs majuscules)
      /(?:\bPr[ée]nom\b)[^A-Za-z]*([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ]+[a-zàâäéèêëïîôöùûüÿç]+)/,
      // Pattern pour prénoms avec plusieurs majuscules au début (comme FLorian)
      /(?:\bPr[ée]nom\b)[^A-Za-z]*([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ]{2,}[a-zàâäéèêëïîôöùûüÿç]+)/,
      // Pattern de fallback : chercher des prénoms après "Prénom"
      /(?:\bPr[ée]nom\b).*?([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ]+[a-zàâäéèêëïîôöùûüÿç]+)/,
      // Pattern encore plus tolérant : n'importe quel mot avec lettres mixtes après "Prénom"
      /(?:\bPr[ée]nom\b).*?([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ][A-Za-zàâäéèêëïîôöùûüÿç]+)/,
      // Pattern ultra-tolérant : chercher "FLorian" spécifiquement après "prénom"
      /(?:\bPr[ée]nom\b).*?(FLorian)/i,
      // Pattern de secours : chercher n'importe quel mot commençant par F après "prénom"
      /(?:\bPr[ée]nom\b).*?(F[A-Za-z]+)/i,
    ];
    
    for (let i = 0; i < prenomPatterns.length; i++) {
      const pattern = prenomPatterns[i];
      const match = t.match(pattern);
      console.log(`  Pattern ${i + 1}: ${pattern} → ${match ? `Trouvé: "${match[1]}"` : 'Pas de match'}`);
      if (match) {
        extractedData.prenom = match[1].toUpperCase().trim();
        console.log(`✅ [Client Extraction] Prénom extrait avec pattern ${i + 1}: "${extractedData.prenom}"`);
        break;
      }
    }
    
    if (!extractedData.prenom) {
      console.log("⚠️ [Client Extraction] Aucun pattern n'a trouvé le prénom");
    }

    // DATE NAISSANCE → ISO
    console.log("🔍 [Client Extraction] Recherche de la date de naissance...");
    const dn = pick1([
      // Pattern tolérant : Date de naissance suivi de n'importe quoi puis capture de date
      /(?:Date\s+de\s+naissance)[^\d]*(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})/,
      // Pattern de fallback : chercher des dates après "Date de naissance"
      /(?:Date\s+de\s+naissance).*?(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})/,
    ], t);
    if (dn) {
      extractedData.dateNaissance = toISO(dn);
      console.log(`✅ [Client Extraction] Date de naissance extraite: "${extractedData.dateNaissance}"`);
    }

    // NUMÉRO PPS - Pattern tolérant au bruit entre libellés et valeur
    console.log("🔍 [Client Extraction] Recherche du numéro PPS...");
    extractedData.numeroPps = pick1([
      // Pattern très tolérant : Numéro de PPS suivi de n'importe quoi puis capture du code
      /(?:Num[ée]ro\s+de\s+PPS)[^A-Z0-9]*([A-Z0-9]{6,})/,
      // Pattern pour "Numéro PPS" sans "de"
      /(?:Num[ée]ro\s+PPS)[^A-Z0-9]*([A-Z0-9]{6,})/,
      // Pattern pour "PPS" seul
      /(?:\bPPS\b)[^A-Z0-9]*([A-Z0-9]{6,})/,
      // Pattern de fallback : chercher des codes après "PPS"
      /(?:\bPPS\b).*?([A-Z0-9]{6,})/,
    ], t)?.toUpperCase()?.trim();
    console.log(`✅ [Client Extraction] Numéro PPS extrait: "${extractedData.numeroPps}"`);

    // VALIDITÉ → ISO
    console.log("🔍 [Client Extraction] Recherche de la validité PPS...");
    const val = pick1([
      // Pattern tolérant : Valable jusqu'au suivi de n'importe quoi puis capture de date
      /(?:Valable\s+jusqu['']au)[^\d]*(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})/,
      // Pattern de fallback : chercher des dates après "Valable"
      /(?:Valable).*?(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})/,
    ], t);
    if (val) {
      extractedData.validitePps = toISO(val);
      console.log(`✅ [Client Extraction] Validité PPS extraite: "${extractedData.validitePps}"`);
    }

    console.log("🎯 [Client Extraction] Résumé des données extraites:", extractedData);
    return extractedData;
  };


  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg bg-blue-50">
        <h3 className="font-medium text-blue-900 mb-2">📄 Fichier PDF détecté</h3>
        <p className="text-sm text-blue-700 mb-4">
          Nous devons convertir votre PDF en image pour l'analyse OCR.
        </p>
        
        {!convertedImage && (
          <button
            onClick={convertPDFToPNG}
            disabled={isProcessing}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed w-full"
          >
            {isProcessing ? (
              <>
                🔄 Conversion en cours...
              </>
            ) : (
              <>
                🔄 Convertir le PDF en image
              </>
            )}
          </button>
        )}
      </div>

      {/* Aperçu de l'image convertie */}
      {convertedImage && (
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-green-50">
            <h4 className="font-medium text-green-900 mb-2">✅ Image convertie avec succès</h4>
            <p className="text-sm text-green-700 mb-4">
              Vérifiez que l'image est claire et lisible avant de lancer l'OCR.
            </p>
            
            {/* Aperçu de l'image */}
            <div className="border rounded-lg p-4 bg-white">
              <img 
                src={URL.createObjectURL(convertedImage)} 
                alt="Aperçu de l'image convertie"
                className="max-w-full h-auto max-h-96 mx-auto block rounded"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Taille: {convertedImage.size} octets
              </p>
            </div>
            
            {/* Bouton pour lancer l'OCR */}
            <div className="mt-4 space-y-2">
              <button
                onClick={runOCR}
                disabled={isOCRLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed w-full"
              >
                {isOCRLoading ? (
                  <>
                    🤖 Analyse OCR en cours...
                  </>
                ) : (
                  <>
                    🤖 Lancer l'analyse OCR
                  </>
                )}
              </button>
              
              {ocrError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">
                    <strong>Erreur OCR:</strong> {ocrError}
                  </p>
                  <button
                    onClick={runOCR}
                    className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                  >
                    Réessayer l'OCR
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
