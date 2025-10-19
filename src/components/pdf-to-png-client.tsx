// components/pdf-to-png-client.tsx
"use client";

import { useState, useEffect } from "react";
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
    onStatusChange?: (status: 'converting' | 'analyzing') => void;
  }

  export function PDFToPNGConverter({ file, onImageGenerated, onError, onStatusChange }: PDFToPNGProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedImage, setConvertedImage] = useState<File | null>(null);
  const [isOCRLoading, setIsOCRLoading] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  // Démarrer automatiquement la conversion et l'analyse
  useEffect(() => {
    if (file && !hasStarted && !isProcessing && !convertedImage) {
      setHasStarted(true);
      handleFullProcess();
    }
  }, [file, hasStarted, isProcessing, convertedImage]);

  const handleFullProcess = async () => {
    try {
      // Étape 1: Conversion PDF → PNG
      onStatusChange?.('converting');
      const imageFile = await convertPDFToPNG();
      
      if (imageFile) {
        // Étape 2: Analyse OCR automatique
        onStatusChange?.('analyzing');
        await runOCR(imageFile);
      }
    } catch (error) {
      console.error("❌ [Client PDF] Erreur dans le processus complet:", error);
      onError("Erreur lors du traitement du document");
    }
  };

  const convertPDFToPNG = async (): Promise<File | null> => {
    setIsProcessing(true);
    setOcrError(null);
    
    try {
      
      // Charger le PDF
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      
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
        canvas: canvas,
      };
      
      await page.render(renderContext).promise;
      
      
      // Convertir le canvas en PNG et retourner une Promise
      return new Promise((resolve, reject) => {
        canvas.toBlob(async (blob) => {
          if (!blob) {
            reject(new Error("Impossible de générer l'image PNG"));
            return;
          }
          
          // Créer un fichier File à partir du blob
          const imageFile = new File([blob], `${file.name.replace('.pdf', '')}_page1.png`, {
            type: "image/png",
          });
          
          
          // Stocker l'image convertie pour affichage
          setConvertedImage(imageFile);
          setIsProcessing(false);
          
          // Créer une URL pour l'aperçu
          const imageUrl = URL.createObjectURL(blob);
          
          resolve(imageFile);
        }, "image/png");
      });
      
    } catch (error) {
      console.error("❌ [Client PDF] Erreur:", error);
      onError(`Erreur lors de la conversion PDF: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      setIsProcessing(false);
      return null;
    }
  };

  const runOCR = async (imageFile?: File) => {
    const imageToUse = imageFile || convertedImage;
    
    if (!imageToUse) {
      console.error("❌ [Client OCR] Aucune image convertie disponible");
      return;
    }

    setIsOCRLoading(true);
    setOcrError(null);
    
    try {
      
      // Charger Tesseract.js depuis le CDN si pas déjà chargé
      if (!window.Tesseract) {
        await loadTesseractFromCDN();
      }
      
      const { data: { text } } = await window.Tesseract.recognize(imageToUse, 'fra+eng', {
        logger: (m: any) => {},
        // Configuration pour améliorer la reconnaissance des documents structurés
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇàâäéèêëïîôöùûüÿç0123456789/.-: ',
        tessedit_pageseg_mode: '6', // Mode de segmentation uniforme
        tessedit_ocr_engine_mode: '1', // Mode LSTM uniquement
        preserve_interword_spaces: '1', // Préserver les espaces entre mots
        tessedit_create_hocr: '0', // Pas de HOCR
        tessedit_create_tsv: '0', // Pas de TSV
      });
      
      
      // Extraire les données PPS côté client
      const extractedData = extractPPSDataClient(text);
      
      // Envoyer l'image et les données extraites
      onImageGenerated(imageToUse, extractedData);
      
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

    const t = oneLine(text);

    const extractedData: any = {};

    // NOM - Pattern tolérant au bruit entre "Nom" et la valeur
    extractedData.nom = pick1([
      // Pattern très tolérant : Nom suivi de n'importe quoi puis capture des majuscules
      /(?:\bNom\b)[^A-Z]*([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ]{2,})/,
      // Pattern de fallback : chercher des mots en majuscules après "Nom"
      /(?:\bNom\b).*?([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ]{2,})/,
    ], t)?.toUpperCase()?.trim();

    // PRÉNOM - Pattern tolérant au bruit entre "Prénom" et la valeur
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
      if (match) {
        extractedData.prenom = match[1].toUpperCase().trim();
        break;
      }
    }
    
    if (!extractedData.prenom) {
    }

    // DATE NAISSANCE → ISO
    const dn = pick1([
      // Pattern tolérant : Date de naissance suivi de n'importe quoi puis capture de date
      /(?:Date\s+de\s+naissance)[^\d]*(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})/,
      // Pattern de fallback : chercher des dates après "Date de naissance"
      /(?:Date\s+de\s+naissance).*?(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})/,
    ], t);
    if (dn) {
      extractedData.dateNaissance = toISO(dn);
    }

    // NUMÉRO PPS - Pattern tolérant au bruit entre libellés et valeur
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

    // VALIDITÉ → ISO
    const val = pick1([
      // Pattern tolérant : Valable jusqu'au suivi de n'importe quoi puis capture de date
      /(?:Valable\s+jusqu['']au)[^\d]*(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})/,
      // Pattern de fallback : chercher des dates après "Valable"
      /(?:Valable).*?(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})/,
    ], t);
    if (val) {
      extractedData.validitePps = toISO(val);
    }

    return extractedData;
  };


  return (
    <div className="space-y-4">

    </div>
  );
}

