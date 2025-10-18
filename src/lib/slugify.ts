/**
 * Génère un slug à partir d'une chaîne de caractères
 * - Convertit en minuscules
 * - Remplace les espaces par des tirets
 * - Supprime les caractères spéciaux
 * - Gère les accents français
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Remplacer les caractères accentués
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // Remplacer les espaces et underscores par des tirets
    .replace(/[\s_]+/g, "-")
    // Supprimer tous les caractères non-alphanumériques sauf les tirets
    .replace(/[^\w\-]+/g, "")
    // Remplacer les tirets multiples par un seul
    .replace(/\-\-+/g, "-")
    // Supprimer les tirets au début et à la fin
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}


