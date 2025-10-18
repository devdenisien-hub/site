"use server";

import { createClient } from "@/lib/supabase/server";
import { checkIsAdmin } from "./auth";

const BUCKET_NAME = "flyers";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadFlyer(formData: FormData) {
  try {
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
      return { success: false, error: "Permission refusée" };
    }

    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "Aucun fichier fourni" };
    }

    // Vérifier le type de fichier
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: "Type de fichier non autorisé. Utilisez JPG, PNG ou WebP.",
      };
    }

    // Vérifier la taille du fichier
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: "Le fichier est trop volumineux. Taille maximale : 5MB.",
      };
    }

    const supabase = await createClient();

    // Générer un nom de fichier unique
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Upload le fichier
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Erreur upload:", error);
      return { success: false, error: error.message };
    }

    // Obtenir l'URL publique
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

    return {
      success: true,
      url: publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error("Erreur:", error);
    return { success: false, error: "Une erreur est survenue lors de l'upload" };
  }
}

export async function deleteFlyer(filePath: string) {
  try {
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
      return { success: false, error: "Permission refusée" };
    }

    if (!filePath) {
      return { success: false, error: "Aucun fichier à supprimer" };
    }

    const supabase = await createClient();

    // Supprimer le fichier
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);

    if (error) {
      console.error("Erreur suppression:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Erreur:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la suppression",
    };
  }
}

export async function uploadAttestation(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "Aucun fichier fourni" };
    }

    // Vérifier le type de fichier
    const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: "Type de fichier non autorisé. Utilisez PDF, JPG ou PNG.",
      };
    }

    // Vérifier la taille du fichier
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: "Le fichier est trop volumineux. Taille maximale : 5MB.",
      };
    }

    const supabase = await createClient();

    // Générer un nom de fichier unique
    const fileExt = file.name.split(".").pop();
    const fileName = `attestation-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Upload le fichier
    const { data, error } = await supabase.storage
      .from("attestations")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Erreur upload attestation:", error);
      return { success: false, error: error.message };
    }

    // Obtenir l'URL publique
    const {
      data: { publicUrl },
    } = supabase.storage.from("attestations").getPublicUrl(data.path);

    return {
      success: true,
      url: publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error("Erreur:", error);
    return { success: false, error: "Une erreur est survenue lors de l'upload" };
  }
}

export async function deleteAttestation(filePath: string) {
  try {
    if (!filePath) {
      return { success: false, error: "Aucun fichier à supprimer" };
    }

    const supabase = await createClient();

    // Supprimer le fichier
    const { error } = await supabase.storage.from("attestations").remove([filePath]);

    if (error) {
      console.error("Erreur suppression attestation:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Erreur:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la suppression",
    };
  }
}


