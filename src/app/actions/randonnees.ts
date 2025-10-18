"use server";

import { createClient } from "@/lib/supabase/server";
import { checkIsAdmin } from "./auth";

export async function getAllRandonnees() {
  try {
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
      return { success: false, error: "Permission refusée", randonnees: [] };
    }

    const supabase = await createClient();

    // Récupérer toutes les randonnées avec le nombre d'inscriptions
    const { data: randonnees, error } = await supabase
      .from("randonnees")
      .select(`
        *,
        inscriptions:inscriptions(count)
      `)
      .order("start_at", { ascending: false });

    if (error) {
      console.error("Erreur récupération randonnées:", error);
      return { success: false, error: error.message, randonnees: [] };
    }

    // Formater les données pour inclure le count
    const randonneesWithCount = randonnees?.map((rando) => ({
      ...rando,
      inscriptions_count: rando.inscriptions?.[0]?.count || 0,
      inscriptions: undefined, // Retirer l'objet inscriptions
    })) || [];

    return { success: true, randonnees: randonneesWithCount };
  } catch (error) {
    console.error("Erreur:", error);
    return { success: false, error: "Une erreur est survenue", randonnees: [] };
  }
}

export async function getRandonneeById(id: string) {
  try {
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
      return { success: false, error: "Permission refusée", randonnee: null };
    }

    const supabase = await createClient();

    // Récupérer la randonnée
    const { data: randonnee, error: randoError } = await supabase
      .from("randonnees")
      .select("*")
      .eq("id", id)
      .single();

    if (randoError || !randonnee) {
      console.error("Erreur récupération randonnée:", randoError);
      return { success: false, error: "Randonnée non trouvée", randonnee: null };
    }

    // Récupérer les inscriptions
    const { data: inscriptions, error: inscError } = await supabase
      .from("inscriptions")
      .select("*")
      .eq("rando_id", id)
      .order("created_at", { ascending: false });

    if (inscError) {
      console.error("Erreur récupération inscriptions:", inscError);
      return {
        success: true,
        randonnee: { ...randonnee, inscriptions: [] },
      };
    }

    return {
      success: true,
      randonnee: {
        ...randonnee,
        inscriptions: inscriptions || [],
      },
    };
  } catch (error) {
    console.error("Erreur:", error);
    return { success: false, error: "Une erreur est survenue", randonnee: null };
  }
}

export async function getInscriptionsByRandonneeId(randonneeId: string) {
  try {
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
      return { success: false, error: "Permission refusée", inscriptions: [] };
    }

    const supabase = await createClient();

    const { data: inscriptions, error } = await supabase
      .from("inscriptions")
      .select("*")
      .eq("rando_id", randonneeId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur récupération inscriptions:", error);
      return { success: false, error: error.message, inscriptions: [] };
    }

    return { success: true, inscriptions: inscriptions || [] };
  } catch (error) {
    console.error("Erreur:", error);
    return { success: false, error: "Une erreur est survenue", inscriptions: [] };
  }
}

export async function createRandonnee(data: {
  name: string;
  slug: string;
  description?: string;
  start_at: string;
  end_at: string;
  reg_start_at: string;
  reg_end_at: string;
  flyer_url?: string;
  is_free: boolean;
  price_cents?: number;
  currency?: string;
  max_participants?: number;
  meeting_point?: string;
}) {
  try {
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
      return { success: false, error: "Permission refusée" };
    }

    const supabase = await createClient();

    const { data: randonnee, error } = await supabase
      .from("randonnees")
      .insert({
        name: data.name,
        slug: data.slug,
        description: data.description,
        start_at: data.start_at,
        end_at: data.end_at,
        reg_start_at: data.reg_start_at,
        reg_end_at: data.reg_end_at,
        flyer_url: data.flyer_url || null,
        is_free: data.is_free,
        price_cents: data.price_cents || 0,
        currency: data.currency || "EUR",
        max_participants: data.max_participants || null,
        meeting_point: data.meeting_point || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur création randonnée:", error);
      return { success: false, error: error.message };
    }

    return { success: true, randonnee };
  } catch (error) {
    console.error("Erreur:", error);
    return { success: false, error: "Une erreur est survenue" };
  }
}

export async function exportInscriptionsToCSV(randonneeId: string) {
  try {
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
      return { success: false, error: "Permission refusée", csv: "" };
    }

    const supabase = await createClient();

    // Récupérer la randonnée
    const { data: randonnee } = await supabase
      .from("randonnees")
      .select("name")
      .eq("id", randonneeId)
      .single();

    // Récupérer les inscriptions
    const { data: inscriptions, error } = await supabase
      .from("inscriptions")
      .select("*")
      .eq("rando_id", randonneeId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur récupération inscriptions:", error);
      return { success: false, error: error.message, csv: "" };
    }

    if (!inscriptions || inscriptions.length === 0) {
      return { success: false, error: "Aucune inscription à exporter", csv: "" };
    }

    // Générer le CSV
    const headers = [
      "Prénom",
      "Nom",
      "Email",
      "Téléphone",
      "Statut Paiement",
      "Date de paiement",
      "Date d'inscription",
      "Nom public visible",
    ];

    const rows = inscriptions.map((inscription) => [
      inscription.first_name,
      inscription.last_name,
      inscription.email,
      inscription.phone || "",
      inscription.payment_status === "paid" ? "Payé" :
        inscription.payment_status === "pending" ? "En attente" : "Non requis",
      inscription.paid_at ? new Date(inscription.paid_at).toLocaleString("fr-FR") : "",
      new Date(inscription.created_at).toLocaleString("fr-FR"),
      inscription.show_public_name ? "Oui" : "Non",
    ]);

    // Construire le CSV
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    return {
      success: true,
      csv: csvContent,
      filename: `inscriptions_${randonnee?.name || "randonnee"}_${new Date().toISOString().split("T")[0]}.csv`,
    };
  } catch (error) {
    console.error("Erreur:", error);
    return { success: false, error: "Une erreur est survenue", csv: "" };
  }
}

// Actions publiques pour le listing des randonnées
export async function getPublicRandonnees() {
  try {
    const supabase = await createClient();

    // Récupérer toutes les randonnées futures avec le nombre d'inscriptions
    const { data: randonnees, error } = await supabase
      .from("randonnees")
      .select(`
        *,
        inscriptions:inscriptions(count)
      `)
      .order("start_at", { ascending: true });

    if (error) {
      console.error("Erreur récupération randonnées:", error);
      return { success: false, error: error.message, randonnees: [] };
    }

    // Formater les données pour inclure le count
    const randonneesWithCount = randonnees?.map((rando) => ({
      ...rando,
      inscriptions_count: rando.inscriptions?.[0]?.count || 0,
      inscriptions: undefined,
    })) || [];

    return { success: true, randonnees: randonneesWithCount };
  } catch (error) {
    console.error("Erreur:", error);
    return { success: false, error: "Une erreur est survenue", randonnees: [] };
  }
}

export async function getPublicRandonneeBySlug(slug: string) {
  try {
    const supabase = await createClient();

    // Récupérer la randonnée par slug
    const { data: randonnee, error } = await supabase
      .from("randonnees")
      .select(`
        *,
        inscriptions:inscriptions(count)
      `)
      .eq("slug", slug)
      .single();

    if (error || !randonnee) {
      console.error("Erreur récupération randonnée:", error);
      return { success: false, error: "Randonnée non trouvée", randonnee: null };
    }

    // Formater les données
    const randonneeWithCount = {
      ...randonnee,
      inscriptions_count: randonnee.inscriptions?.[0]?.count || 0,
      inscriptions: undefined,
    };

    return { success: true, randonnee: randonneeWithCount };
  } catch (error) {
    console.error("Erreur:", error);
    return { success: false, error: "Une erreur est survenue", randonnee: null };
  }
}

export async function getPublicInscriptionsBySlug(slug: string) {
  try {
    const supabase = await createClient();

    // Récupérer la randonnée par slug pour avoir l'ID
    const { data: randonnee, error: randoError } = await supabase
      .from("randonnees")
      .select("id")
      .eq("slug", slug)
      .single();

    if (randoError || !randonnee) {
      console.error("Erreur récupération randonnée:", randoError);
      return { success: false, error: "Randonnée non trouvée", inscriptions: [] };
    }

    // Récupérer uniquement les inscriptions qui acceptent d'afficher leur nom
    const { data: inscriptions, error } = await supabase
      .from("inscriptions")
      .select("first_name, last_name, created_at")
      .eq("rando_id", randonnee.id)
      .eq("show_public_name", true)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Erreur récupération inscriptions:", error);
      return { success: false, error: error.message, inscriptions: [] };
    }

    return { success: true, inscriptions: inscriptions || [] };
  } catch (error) {
    console.error("Erreur:", error);
    return { success: false, error: "Une erreur est survenue", inscriptions: [] };
  }
}

export async function createInscription(data: {
  rando_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  show_public_name: boolean;
}) {
  try {
    const supabase = await createClient();

    // Vérifier que la randonnée existe et que les inscriptions sont ouvertes
    const { data: randonnee, error: randoError } = await supabase
      .from("randonnees")
      .select("*")
      .eq("id", data.rando_id)
      .single();

    if (randoError || !randonnee) {
      console.error("Erreur récupération randonnée:", randoError);
      return { success: false, error: "Randonnée non trouvée" };
    }

    const now = new Date();
    const regStart = new Date(randonnee.reg_start_at);
    const regEnd = new Date(randonnee.reg_end_at);

    if (now < regStart) {
      return { success: false, error: "Les inscriptions ne sont pas encore ouvertes" };
    }

    if (now > regEnd) {
      return { success: false, error: "Les inscriptions sont fermées" };
    }

    // Vérifier le nombre de places disponibles
    if (randonnee.max_participants) {
      const { data: inscriptions } = await supabase
        .from("inscriptions")
        .select("id")
        .eq("rando_id", data.rando_id);

      const currentCount = inscriptions?.length || 0;
      if (currentCount >= randonnee.max_participants) {
        return { success: false, error: "Cette randonnée est complète" };
      }
    }

    // Vérifier si l'email n'est pas déjà inscrit
    const { data: existingInscription } = await supabase
      .from("inscriptions")
      .select("id")
      .eq("rando_id", data.rando_id)
      .eq("email", data.email)
      .single();

    if (existingInscription) {
      return { success: false, error: "Vous êtes déjà inscrit à cette randonnée" };
    }

    // Créer l'inscription
    const { data: inscription, error } = await supabase
      .from("inscriptions")
      .insert({
        rando_id: data.rando_id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        payment_status: randonnee.is_free ? "not_required" : "pending",
        show_public_name: data.show_public_name,
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur création inscription:", error);
      return { success: false, error: error.message };
    }

    return { 
      success: true, 
      inscription,
      needsPayment: !randonnee.is_free
    };
  } catch (error) {
    console.error("Erreur:", error);
    return { success: false, error: "Une erreur est survenue" };
  }
}

