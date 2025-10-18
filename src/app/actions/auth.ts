"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function loginAdmin(email: string, password: string) {
  try {
    const supabase = await createClient();

    // Se connecter avec Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return {
        success: false,
        error: "Email ou mot de passe incorrect",
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: "Erreur lors de la connexion",
      };
    }

    // Vérifier que l'utilisateur a le rôle admin
    // On va chercher dans la table user_roles ou dans les métadonnées
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .single();

    // Si la table n'existe pas encore, on accepte la connexion pour le setup initial
    // Sinon on vérifie le rôle
    if (profile && profile.role !== "admin") {
      await supabase.auth.signOut();
      return {
        success: false,
        error: "Accès non autorisé - rôle admin requis",
      };
    }

    return {
      success: true,
      user: authData.user,
    };
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la connexion",
    };
  }
}

export async function logoutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/ghost/login");
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Vérifier le rôle admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // Si la table n'existe pas encore, on considère l'utilisateur comme admin
  if (!profile || profile.role === "admin") {
    return user;
  }

  return null;
}

export async function checkIsAdmin() {
  const user = await getCurrentUser();
  return !!user;
}

