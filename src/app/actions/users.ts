"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function createAdminUser(formData: FormData) {
  try {
    const supabase = await createClient();

    // Vérifier que l'utilisateur actuel est admin
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) {
      return { success: false, error: "Non authentifié" };
    }

    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", currentUser.id)
      .single();

    if (!currentProfile || currentProfile.role !== "admin") {
      return { success: false, error: "Permission refusée" };
    }

    // Récupérer les données du formulaire
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const nom = formData.get("nom") as string;
    const prenom = formData.get("prenom") as string;
    const role = formData.get("role") as string;

    if (!email || !password) {
      return { success: false, error: "Email et mot de passe requis" };
    }

    // Créer l'utilisateur avec le client admin (service_role_key)
    const supabaseAdmin = createAdminClient();

    // Créer l'utilisateur
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      console.error("Erreur création utilisateur:", authError);
      return { success: false, error: "Erreur lors de la création de l'utilisateur: " + authError.message };
    }

    if (!authData.user) {
      return { success: false, error: "Utilisateur non créé" };
    }

    // Mettre à jour le profil avec les informations supplémentaires
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        nom: nom || null,
        prenom: prenom || null,
        role: role || "membre",
      })
      .eq("id", authData.user.id);

    if (profileError) {
      console.error("Erreur mise à jour profil:", profileError);
      // L'utilisateur est créé mais le profil n'est pas mis à jour
      // On peut continuer quand même
    }

    revalidatePath("/ghost/utilisateurs");
    
    return { 
      success: true, 
      message: "Utilisateur créé avec succès",
      user: authData.user 
    };
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    return { 
      success: false, 
      error: "Une erreur est survenue lors de la création de l'utilisateur" 
    };
  }
}

export async function getAllUsers() {
  try {
    const supabase = await createClient();

    // Vérifier que l'utilisateur actuel est admin
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) {
      return { success: false, error: "Non authentifié", users: [] };
    }

    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", currentUser.id)
      .single();

    if (!currentProfile || currentProfile.role !== "admin") {
      return { success: false, error: "Permission refusée", users: [] };
    }

    // Récupérer tous les utilisateurs
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur récupération utilisateurs:", error);
      return { success: false, error: error.message, users: [] };
    }

    return { success: true, users: profiles || [] };
  } catch (error) {
    console.error("Erreur:", error);
    return { 
      success: false, 
      error: "Une erreur est survenue", 
      users: [] 
    };
  }
}

export async function updateUserRole(userId: string, newRole: string) {
  try {
    const supabase = await createClient();

    // Vérifier que l'utilisateur actuel est admin
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) {
      return { success: false, error: "Non authentifié" };
    }

    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", currentUser.id)
      .single();

    if (!currentProfile || currentProfile.role !== "admin") {
      return { success: false, error: "Permission refusée" };
    }

    // Empêcher de se retirer le rôle admin à soi-même
    if (userId === currentUser.id && newRole !== "admin") {
      return { 
        success: false, 
        error: "Vous ne pouvez pas retirer votre propre rôle admin" 
      };
    }

    // Mettre à jour le rôle
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);

    if (error) {
      console.error("Erreur mise à jour rôle:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/ghost/utilisateurs");
    
    return { success: true, message: "Rôle mis à jour avec succès" };
  } catch (error) {
    console.error("Erreur:", error);
    return { success: false, error: "Une erreur est survenue" };
  }
}

export async function deleteUser(userId: string) {
  try {
    const supabase = await createClient();

    // Vérifier que l'utilisateur actuel est admin
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) {
      return { success: false, error: "Non authentifié" };
    }

    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", currentUser.id)
      .single();

    if (!currentProfile || currentProfile.role !== "admin") {
      return { success: false, error: "Permission refusée" };
    }

    // Empêcher de se supprimer soi-même
    if (userId === currentUser.id) {
      return { 
        success: false, 
        error: "Vous ne pouvez pas supprimer votre propre compte" 
      };
    }

    // Supprimer l'utilisateur avec le client admin
    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      console.error("Erreur suppression utilisateur:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/ghost/utilisateurs");
    
    return { success: true, message: "Utilisateur supprimé avec succès" };
  } catch (error) {
    console.error("Erreur:", error);
    return { success: false, error: "Une erreur est survenue" };
  }
}

