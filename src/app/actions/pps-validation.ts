"use server";

import { google } from "googleapis";
import { Readable } from "stream";
import Tesseract from "tesseract.js";
import path from "path";

interface PPSExtractedData {
  nom?: string;
  prenom?: string;
  dateNaissance?: string;
  numeroPps?: string;
  validitePps?: string;
}

interface ValidationResult {
  success: boolean;
  error?: string;
  extractedData?: PPSExtractedData;
  googleDriveUrl?: string;
}

/**
 * Action principale: upload + validation des données déjà extraites côté client
 */
export async function uploadAndValidatePPS(
  file: File,
  userData: {
    nom: string;
    prenom: string;
    dateNaissance: string; // attendu au format ISO (YYYY-MM-DD) côté formulaire si possible
  },
  extractedData?: PPSExtractedData // Données déjà extraites côté client
): Promise<ValidationResult> {
  console.log("🚀 [PPS Validation] Début du processus");
  console.log("📁 [PPS Validation] Fichier:", file.name, "Taille:", file.size, "Type:", file.type);
  console.log("👤 [PPS Validation] Données utilisateur:", userData);
  console.log("📄 [PPS Validation] Données extraites côté client:", extractedData);

  try {
    // 1) Upload vers Google Drive via OAuth utilisateur
    console.log("📤 [PPS Validation] Étape 1: Upload vers Google Drive...");
    const uploadResult = await uploadToGoogleDrive(file);
    if (!uploadResult.success) {
      console.error("❌ [PPS Validation] Échec upload:", uploadResult.error);
      return { success: false, error: uploadResult.error };
    }
    console.log("✅ [PPS Validation] Upload réussi:", uploadResult.url);

    // 2) Utiliser les données déjà extraites côté client (pas besoin de refaire l'OCR)
    console.log("🔍 [PPS Validation] Étape 2: Utilisation des données extraites côté client...");
    console.log("✅ [PPS Validation] Données extraites côté client utilisées");
    console.log("📝 [PPS Validation] Données extraites:", extractedData);

    // 3) Validation des données extraites vs données saisies
    console.log("🔍 [PPS Validation] Étape 3: Validation des données...");
    const validationResult = extractedData ? validateExtractedData(extractedData, userData) : { success: true, extractedData: {} };
    if (!validationResult.success) {
      console.error("❌ [PPS Validation] Échec validation:", validationResult.error);
      return { success: false, error: validationResult.error };
    }
    console.log("✅ [PPS Validation] Validation réussie");

    console.log("🎉 [PPS Validation] Processus terminé avec succès");
    return {
      success: true,
      extractedData: validationResult.extractedData,
      googleDriveUrl: uploadResult.url,
    };
  } catch (error) {
    console.error("💥 [PPS Validation] Erreur inattendue:", error);
    console.error("💥 [PPS Validation] Stack trace:", error instanceof Error ? error.stack : "Pas de stack trace");
    return { success: false, error: "Une erreur inattendue est survenue" };
  }
}

/**
 * Upload vers Google Drive (OAuth utilisateur)
 * Variables d'env utilisées:
 * - GOOGLE_OAUTH_CLIENT_ID
 * - GOOGLE_OAUTH_CLIENT_SECRET
 * - GOOGLE_OAUTH_REFRESH_TOKEN
 * - GOOGLE_DRIVE_PARENT_FOLDER_ID
 */
async function uploadToGoogleDrive(
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Initialisation OAuth2 avec refresh token
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID!,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      "http://localhost" // redirect_uri utilisé lors de l'obtention du refresh token
    );

    oauth2Client.setCredentials({
      refresh_token:
        process.env.GOOGLE_OAUTH_REFRESH_TOKEN ||
        // fallback si tu avais nommé différemment:
        (process.env as any).GOOGLE_REFRESH_TOKEN,
    });

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    // Buffer → stream pour l'API Drive
    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    // Création du fichier dans le dossier cible
    const createRes = await drive.files.create({
      requestBody: {
        name: `attestation-pps-${Date.now()}-${file.name}`,
        parents: [process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID!],
      },
      media: {
        mimeType: file.type || "application/octet-stream",
        body: stream,
      },
      fields: "id",
    });

    const fileId = createRes.data.id;
    if (!fileId) {
      return { success: false, error: "Création du fichier Drive: aucun ID retourné." };
    }

    // (Optionnel) rendre le fichier public. Retire ce bloc pour du privé.
    await drive.permissions.create({
      fileId,
      requestBody: { role: "reader", type: "anyone" },
    });

    // Récupérer un lien d’affichage propre
    const getRes = await drive.files.get({
      fileId,
      fields: "id, webViewLink",
    });

    const webViewLink =
      getRes.data.webViewLink || `https://drive.google.com/file/d/${fileId}/view`;

    return { success: true, url: webViewLink };
  } catch (error) {
    console.error("Error uploading to Google Drive:", error);
    return { success: false, error: "Erreur lors de l'upload vers Google Drive" };
  }
}

/**
 * OCR basique via Tesseract.js
 * - Idéal pour images (jpg/png). Pour PDF scannés, ajouter une conversion PDF→PNG.
 */
async function extractTextFromImage(
  file: File
): Promise<{ success: boolean; extractedData?: PPSExtractedData; error?: string }> {
  try {
    console.log("🔍 [OCR] Début de l'extraction");
    console.log("📁 [OCR] Fichier:", file.name, "Type:", file.type, "Taille:", file.size);

    // Vérifier que c'est bien une image
    if (!file.type.startsWith('image/')) {
      return { success: false, error: "Le fichier doit être une image (PNG, JPG, etc.)" };
    }

    // L'OCR est maintenant fait côté client avec Tesseract.js depuis le CDN
    // Le serveur ne fait plus d'OCR, juste l'upload vers Google Drive
    console.log("✅ [OCR] OCR déplacé côté client - Upload vers Google Drive uniquement");
    
    // Retourner des données vides car l'OCR est fait côté client
    return { success: true, extractedData: {} };
  } catch (e) {
    console.error("💥 [OCR] Erreur:", e);
    return { success: false, error: "Erreur lors de l'OCR" };
  }
}

// Fonctions utilitaires pour l'extraction robuste
function pick1(patterns: RegExp[], text: string): string | undefined {
  for (const r of patterns) {
    const m = text.match(r);
    if (m?.[1]) return m[1];
  }
  return undefined;
}

function oneLine(s: string): string {
  return s.replace(/\r?\n/g, " ").replace(/\s{2,}/g, " ").trim();
}

function toISO(input: string): string {
  // Accepte ISO déjà propre
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
  // DD/MM/YYYY | DD-MM-YYYY | DD.MM.YYYY
  const m = input.match(/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/);
  if (!m) return input;
  const dd = m[1].padStart(2, "0");
  const mm = m[2].padStart(2, "0");
  let yy = m[3];
  if (yy.length === 2) yy = "20" + yy;
  console.log(`🔍 [toISO] Input: "${input}" → Output: "${yy}-${mm}-${dd}"`);
  return `${yy}-${mm}-${dd}`;
}

/**
 * Extraction robuste (regex adaptées PPS FFA)
 */
function extractPPSData(text: string): PPSExtractedData {
  console.log("🔍 [Extraction] Début de l'extraction des données PPS");
  console.log("📝 [Extraction] Texte original:");
  console.log("=".repeat(50));
  console.log(text);
  console.log("=".repeat(50));

  const t = oneLine(text);
  console.log("📝 [Extraction] Texte normalisé (une ligne):");
  console.log(t);
  console.log("=".repeat(50));

  const out: PPSExtractedData = {};

  // NOM - Pattern tolérant au bruit entre "Nom" et la valeur
  console.log("🔍 [Extraction] Recherche du nom...");
  out.nom = pick1([
    // Pattern très tolérant : Nom suivi de n'importe quoi puis capture des majuscules
    /(?:\bNom\b)[^A-Z]*([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ]{2,})/,
    // Pattern de fallback : chercher des mots en majuscules après "Nom"
    /(?:\bNom\b).*?([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ]{2,})/,
  ], t)?.toUpperCase()?.trim();
  console.log(`✅ [Extraction] Nom extrait: "${out.nom}"`);

  // PRÉNOM - Pattern tolérant au bruit entre "Prénom" et la valeur
  console.log("🔍 [Extraction] Recherche du prénom...");
  out.prenom = pick1([
    // Pattern très tolérant : Prénom suivi de n'importe quoi puis capture des lettres (peut commencer par plusieurs majuscules)
    /(?:\bPr[ée]nom\b)[^A-Za-z]*([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ]+[a-zàâäéèêëïîôöùûüÿç]+)/,
    // Pattern pour prénoms avec plusieurs majuscules au début (comme FLorian)
    /(?:\bPr[ée]nom\b)[^A-Za-z]*([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ]{2,}[a-zàâäéèêëïîôöùûüÿç]+)/,
    // Pattern de fallback : chercher des prénoms après "Prénom"
    /(?:\bPr[ée]nom\b).*?([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ]+[a-zàâäéèêëïîôöùûüÿç]+)/,
    // Pattern encore plus tolérant : n'importe quel mot avec lettres mixtes après "Prénom"
    /(?:\bPr[ée]nom\b).*?([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ][A-Za-zàâäéèêëïîôöùûüÿç]+)/,
  ], t)?.toUpperCase()?.trim();
  console.log(`✅ [Extraction] Prénom extrait: "${out.prenom}"`);

  // DATE NAISSANCE → ISO
  console.log("🔍 [Extraction] Recherche de la date de naissance...");
  const dn = pick1([
    // Pattern tolérant : Date de naissance suivi de n'importe quoi puis capture de date
    /(?:Date\s+de\s+naissance)[^\d]*(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})/,
    // Pattern de fallback : chercher des dates après "Date de naissance"
    /(?:Date\s+de\s+naissance).*?(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})/,
  ], t);
  if (dn) {
    out.dateNaissance = toISO(dn);
    console.log(`✅ [Extraction] Date de naissance extraite: "${out.dateNaissance}"`);
  }

  // NUMÉRO PPS - Pattern tolérant au bruit entre libellés et valeur
  console.log("🔍 [Extraction] Recherche du numéro PPS...");
  out.numeroPps = pick1([
    // Pattern très tolérant : Numéro de PPS suivi de n'importe quoi puis capture du code
    /(?:Num[ée]ro\s+de\s+PPS)[^A-Z0-9]*([A-Z0-9]{6,})/,
    // Pattern pour "Numéro PPS" sans "de"
    /(?:Num[ée]ro\s+PPS)[^A-Z0-9]*([A-Z0-9]{6,})/,
    // Pattern pour "PPS" seul
    /(?:\bPPS\b)[^A-Z0-9]*([A-Z0-9]{6,})/,
    // Pattern de fallback : chercher des codes après "PPS"
    /(?:\bPPS\b).*?([A-Z0-9]{6,})/,
  ], t)?.toUpperCase()?.trim();
  console.log(`✅ [Extraction] Numéro PPS extrait: "${out.numeroPps}"`);

  // VALIDITÉ → ISO
  console.log("🔍 [Extraction] Recherche de la validité PPS...");
  const val = pick1([
    // Pattern tolérant : Valable jusqu'au suivi de n'importe quoi puis capture de date
    /(?:Valable\s+jusqu['']au)[^\d]*(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})/,
    // Pattern de fallback : chercher des dates après "Valable"
    /(?:Valable).*?(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})/,
  ], t);
  if (val) {
    out.validitePps = toISO(val);
    console.log(`✅ [Extraction] Validité PPS extraite: "${out.validitePps}"`);
  }

  console.log("🎯 [Extraction] Résumé des données extraites:", out);
  return out;
}


// Fonctions utilitaires pour la validation
function need(value: any): boolean {
  return value !== undefined && value !== null && value !== "";
}

function isNameMatch(extracted: string, user: string): boolean {
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-zàâäéèêëïîôöùûüÿç]/g, "");
  return normalize(extracted) === normalize(user);
}

function isSameDate(extracted: string, user: string): boolean {
  // Les deux sont déjà en ISO (YYYY-MM-DD)
  console.log(`🔍 [Date Comparison] Extracted: "${extracted}" vs User: "${user}"`);
  const isSame = extracted === user;
  console.log(`🔍 [Date Comparison] Result: ${isSame}`);
  return isSame;
}

/**
 * Validation robuste des infos extraites vs infos saisies
 */
function validateExtractedData(
  extracted: PPSExtractedData,
  user: { nom: string; prenom: string; dateNaissance: string }
): { success: boolean; extractedData?: PPSExtractedData; error?: string } {
  console.log("🔍 [Validation] Début de la validation");
  console.log("📄 [Validation] Données extraites:", extracted);
  console.log("👤 [Validation] Données utilisateur:", user);

  const errs: string[] = [];

  // Champs requis
  if (!need(extracted.nom)) errs.push("❌ Le nom n'a pas pu être lu sur votre attestation PPS. Veuillez vérifier que le document est bien lisible.");
  if (!need(extracted.prenom)) errs.push("❌ Le prénom n'a pas pu être lu sur votre attestation PPS. Veuillez vérifier que le document est bien lisible.");
  if (!need(extracted.dateNaissance)) errs.push("❌ La date de naissance n'a pas pu être lue sur votre attestation PPS. Veuillez vérifier que le document est bien lisible.");
  if (!need(extracted.numeroPps)) errs.push("❌ Le numéro PPS n'a pas pu être lu sur votre attestation PPS. Veuillez vérifier que le document est bien lisible.");
  if (!need(extracted.validitePps)) errs.push("❌ La date de validité PPS n'a pas pu être lue sur votre attestation PPS. Veuillez vérifier que le document est bien lisible.");

  // Si requis manquants → on arrête
  if (errs.length) return { success: false, error: errs.join("\n"), extractedData: extracted };

  // Comparaisons
  if (!isNameMatch(extracted.nom!, user.nom)) {
    errs.push(`❌ Le nom sur votre attestation PPS ("${extracted.nom}") ne correspond pas au nom que vous avez saisi ("${user.nom}"). Veuillez vérifier vos informations.`);
  }
  if (!isNameMatch(extracted.prenom!, user.prenom)) {
    errs.push(`❌ Le prénom sur votre attestation PPS ("${extracted.prenom}") ne correspond pas au prénom que vous avez saisi ("${user.prenom}"). Veuillez vérifier vos informations.`);
  }
  if (!isSameDate(extracted.dateNaissance!, user.dateNaissance)) {
    const formatDate = (dateStr: string) => {
      // Éviter les problèmes de fuseau horaire en créant la date manuellement
      const parts = dateStr.split('-'); // Format ISO: YYYY-MM-DD
      if (parts.length === 3) {
        const year = parts[0];
        const month = parts[1];
        const day = parts[2];
        return `${day}/${month}/${year}`;
      }
      // Si ce n'est pas au format ISO, retourner tel quel
      return dateStr;
    };
    errs.push(`❌ La date de naissance sur votre attestation PPS (${formatDate(extracted.dateNaissance!)}) ne correspond pas à la date que vous avez saisie (${formatDate(user.dateNaissance)}). Veuillez vérifier vos informations.`);
  }

  if (errs.length) {
    console.log("❌ [Validation] Erreurs de correspondance:", errs);
    return { success: false, error: errs.join("\n"), extractedData: extracted };
  }

  console.log("✅ [Validation] Toutes les validations sont passées");
  return { success: true, extractedData: extracted };
}

