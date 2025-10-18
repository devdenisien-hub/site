"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function createFirstAdmin(formData: FormData) {
  try {
    const supabase = await createClient();

    // Vérifier qu'aucun admin n'existe déjà (sécurité importante !)
    // On ignore les erreurs si la table n'existe pas encore
    let existingAdmins = null;
    try {
      const { data, error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "admin")
        .limit(1);

      if (!checkError) {
        existingAdmins = data;
      }
    } catch (err) {
      console.log("Table profiles n'existe pas encore, on continue...");
      // La table n'existe pas, on continue la création
    }

    // Si un admin existe déjà, bloquer la création
    if (existingAdmins && existingAdmins.length > 0) {
      return {
        success: false,
        error: "Un administrateur existe déjà. Veuillez vous connecter ou contacter l'administrateur existant.",
      };
    }

    // Récupérer les données du formulaire
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const nom = formData.get("nom") as string;
    const prenom = formData.get("prenom") as string;

    if (!email || !password) {
      return { success: false, error: "Email et mot de passe requis" };
    }

    // Créer l'utilisateur avec le client admin (service_role_key)
    const supabaseAdmin = createAdminClient();

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      console.error("Erreur création utilisateur:", authError);
      return {
        success: false,
        error: "Erreur lors de la création de l'utilisateur: " + authError.message,
      };
    }

    if (!authData.user) {
      return { success: false, error: "Utilisateur non créé" };
    }

    // Mettre à jour le profil avec le rôle admin
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        nom: nom || null,
        prenom: prenom || null,
        role: "admin",
      })
      .eq("id", authData.user.id);

    if (profileError) {
      console.error("Erreur mise à jour profil:", profileError);
      // L'utilisateur est créé mais le profil n'est pas admin
      // Essayer une insertion directe
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          email: email,
          nom: nom || null,
          prenom: prenom || null,
          role: "admin",
        });

      if (insertError) {
        console.error("Erreur insertion profil:", insertError);
        return {
          success: false,
          error: "Utilisateur créé mais impossible de définir le rôle admin. Contactez le support.",
        };
      }
    }

    return {
      success: true,
      message: "Premier administrateur créé avec succès !",
      user: authData.user,
    };
  } catch (error) {
    console.error("Erreur lors de la création du premier admin:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la création du premier administrateur",
    };
  }
}

