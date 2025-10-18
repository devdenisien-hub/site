"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface Trail {
  id: string;
  nom: string;
  description?: string;
  date_evenement: string;
  heure_debut: string;
  heure_fin: string;
  debut_inscription: string;
  fin_inscription: string;
  prix_cents: number;
  currency: string;
  flyer_url?: string;
  reglement_html?: string;
  lieu_adresse: string;
  lieu_description?: string;
  map_iframe?: string;
  lieu_recup_dossard?: string;
  heure_debut_recup_dossard?: string;
  heure_fin_recup_dossard?: string;
  map_iframe_recup_dossard?: string;
  actif: boolean;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  trail_id: string;
  nom: string;
  description?: string;
  distance_km?: number;
  denivele_positif?: number;
  difficulte?: string;
  created_at: string;
  updated_at: string;
}

export interface CourseWithStats extends Course {
  inscriptions_valide: number;
  inscriptions_incomplet: number;
  total_inscriptions: number;
}

export interface Participant {
  id: string;
  civilite: string;
  nom: string;
  prenom: string;
  date_naissance: string;
  email: string;
  email_confirmation: string;
  nationalite: string;
  licencie_ffa: boolean;
  federation_appartenance?: string;
  numero_licence?: string;
  attestation_pps_url?: string;
  numero_pps?: string;
  validite_pps?: string;
  numero_dossard?: string;
  numero_rue: string;
  nom_rue: string;
  complement_adresse?: string;
  code_postal: string;
  ville: string;
  pays: string;
  telephone_mobile: string;
  telephone_fixe?: string;
  taille_tshirt: string;
  accepte_reglement: boolean;
  accepte_liste_publique: boolean;
  statut: 'valide' | 'incomplet';
  created_at: string;
  updated_at: string;
}

export interface CourseWithParticipants {
  id: string;
  trail_id: string;
  nom: string;
  description?: string;
  distance_km?: number;
  denivele_positif?: number;
  difficulte?: string;
  created_at: string;
  updated_at: string;
  participants: Participant[];
  stats: {
    total_inscriptions: number;
    inscriptions_valide: number;
    inscriptions_incomplet: number;
    licencies_ffa: number;
    non_licencies: number;
    tailles_tshirt: {
      s: number;
      m: number;
      l: number;
      xl: number;
      xxl: number;
    };
  };
}

export async function getTrailsWithStats(): Promise<TrailWithCoursesAndStats[]> {
  const supabase = await createClient();
  
  const { data: trails, error } = await supabase
    .from("trail")
    .select(`
      *,
      courses (
        id,
        nom,
        description,
        distance_km,
        denivele_positif,
        difficulte,
        created_at,
        updated_at
      )
    `)
    .order("date_evenement", { ascending: false });

  if (error) {
    console.error("Error fetching trails:", error);
    return [];
  }

  // Compter les inscriptions pour chaque course avec les statuts
  const trailsWithStats = await Promise.all(
    trails.map(async (trail) => {
      // Compter toutes les inscriptions du trail
      const { data: allInscriptions } = await supabase
        .from("trail_inscriptions")
        .select("course_id")
        .eq("trail_id", trail.id);

      const totalInscriptionsCount = allInscriptions?.length || 0;

      // Compter les inscriptions par course avec statuts
      const coursesWithStats = await Promise.all(
        trail.courses.map(async (course) => {
          const { data: inscriptions } = await supabase
            .from("trail_inscriptions")
            .select("statut")
            .eq("course_id", course.id);

          const valideCount = inscriptions?.filter(i => i.statut === 'valide').length || 0;
          const incompletCount = inscriptions?.filter(i => i.statut === 'incomplet').length || 0;
          const totalCount = inscriptions?.length || 0;

          return {
            ...course,
            inscriptions_valide: valideCount,
            inscriptions_incomplet: incompletCount,
            total_inscriptions: totalCount,
          };
        })
      );

      return {
        ...trail,
        courses: coursesWithStats,
        inscriptions_count: totalInscriptionsCount,
      };
    })
  );

  return trailsWithStats;
}

export async function getCourseById(courseId: string): Promise<CourseWithParticipants | null> {
  const supabase = await createClient();
  
  // Récupérer la course
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (courseError || !course) {
    console.error("Error fetching course:", courseError);
    return null;
  }

  // Récupérer les participants
  const { data: participants, error: participantsError } = await supabase
    .from("trail_inscriptions")
    .select("*")
    .eq("course_id", courseId)
    .order("created_at", { ascending: false });

  if (participantsError) {
    console.error("Error fetching participants:", participantsError);
    return null;
  }

  // Calculer les statistiques
  const totalInscriptions = participants?.length || 0;
  const inscriptionsValide = participants?.filter(p => p.statut === 'valide').length || 0;
  const inscriptionsIncomplet = participants?.filter(p => p.statut === 'incomplet').length || 0;
  const licenciesFfa = participants?.filter(p => p.licencie_ffa === true).length || 0;
  const nonLicencies = participants?.filter(p => p.licencie_ffa === false).length || 0;

  // Compter les tailles de t-shirt
  const taillesTshirt = {
    s: participants?.filter(p => p.taille_tshirt === 's').length || 0,
    m: participants?.filter(p => p.taille_tshirt === 'm').length || 0,
    l: participants?.filter(p => p.taille_tshirt === 'l').length || 0,
    xl: participants?.filter(p => p.taille_tshirt === 'xl').length || 0,
    xxl: participants?.filter(p => p.taille_tshirt === 'xxl').length || 0,
  };

  return {
    ...course,
    participants: participants || [],
    stats: {
      total_inscriptions: totalInscriptions,
      inscriptions_valide: inscriptionsValide,
      inscriptions_incomplet: inscriptionsIncomplet,
      licencies_ffa: licenciesFfa,
      non_licencies: nonLicencies,
      tailles_tshirt: taillesTshirt,
    },
  };
}

export async function exportTrailInscriptionsCSV(trailId: string): Promise<string> {
  const supabase = await createClient();
  
  // Récupérer toutes les inscriptions du trail avec les détails des courses
  const { data: inscriptions, error } = await supabase
    .from("trail_inscriptions")
    .select(`
      *,
      courses!inner (
        nom as course_nom
      )
    `)
    .eq("trail_id", trailId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching inscriptions:", error);
    throw new Error("Erreur lors de la récupération des inscriptions");
  }

  if (!inscriptions || inscriptions.length === 0) {
    throw new Error("Aucune inscription trouvée pour ce trail");
  }

  // En-têtes CSV
  const headers = [
    "ID",
    "Course",
    "Civilité",
    "Nom",
    "Prénom",
    "Date de naissance",
    "Email",
    "Email confirmation",
    "Nationalité",
    "Licencié FFA",
    "Fédération d'appartenance",
    "Numéro de licence",
    "Numéro de PPS",
    "Validité PPS",
    "Attestation PPS URL",
    "Numéro de dossard",
    "Numéro rue",
    "Nom rue",
    "Complément adresse",
    "Code postal",
    "Ville",
    "Pays",
    "Téléphone mobile",
    "Téléphone fixe",
    "Taille T-shirt",
    "Accepte règlement",
    "Accepte liste publique",
    "Statut",
    "Date d'inscription"
  ];

  // Conversion des données en lignes CSV
  const csvRows = inscriptions.map(inscription => [
    inscription.id,
    inscription.course_nom,
    inscription.civilite,
    inscription.nom,
    inscription.prenom,
    inscription.date_naissance,
    inscription.email,
    inscription.email_confirmation,
    inscription.nationalite,
    inscription.licencie_ffa ? "Oui" : "Non",
    inscription.federation_appartenance || "",
    inscription.numero_licence || "",
    inscription.numero_pps || "",
    inscription.validite_pps || "",
    inscription.attestation_pps_url || "",
    inscription.numero_dossard || "",
    inscription.numero_rue,
    inscription.nom_rue,
    inscription.complement_adresse || "",
    inscription.code_postal,
    inscription.ville,
    inscription.pays,
    inscription.telephone_mobile,
    inscription.telephone_fixe || "",
    inscription.taille_tshirt.toUpperCase(),
    inscription.accepte_reglement ? "Oui" : "Non",
    inscription.accepte_liste_publique ? "Oui" : "Non",
    inscription.statut,
    new Date(inscription.created_at).toLocaleString("fr-FR")
  ]);

  // Création du contenu CSV
  const csvContent = [
    headers.join(","),
    ...csvRows.map(row => 
      row.map(field => {
        // Échapper les guillemets et virgules dans les champs
        const stringField = String(field || "");
        if (stringField.includes(",") || stringField.includes('"') || stringField.includes("\n")) {
          return `"${stringField.replace(/"/g, '""')}"`;
        }
        return stringField;
      }).join(",")
    )
  ].join("\n");

  return csvContent;
}

export async function exportCourseInscriptionsCSV(courseId: string): Promise<string> {
  const supabase = await createClient();
  
  // Récupérer toutes les inscriptions de la course
  const { data: inscriptions, error } = await supabase
    .from("trail_inscriptions")
    .select(`
      *,
      courses!inner (
        nom as course_nom
      )
    `)
    .eq("course_id", courseId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching inscriptions:", error);
    throw new Error("Erreur lors de la récupération des inscriptions");
  }

  if (!inscriptions || inscriptions.length === 0) {
    throw new Error("Aucune inscription trouvée pour cette course");
  }

  // En-têtes CSV
  const headers = [
    "ID",
    "Course",
    "Civilité",
    "Nom",
    "Prénom",
    "Date de naissance",
    "Email",
    "Email confirmation",
    "Nationalité",
    "Licencié FFA",
    "Fédération d'appartenance",
    "Numéro de licence",
    "Numéro de PPS",
    "Validité PPS",
    "Attestation PPS URL",
    "Numéro de dossard",
    "Numéro rue",
    "Nom rue",
    "Complément adresse",
    "Code postal",
    "Ville",
    "Pays",
    "Téléphone mobile",
    "Téléphone fixe",
    "Taille T-shirt",
    "Accepte règlement",
    "Accepte liste publique",
    "Statut",
    "Date d'inscription"
  ];

  // Conversion des données en lignes CSV
  const csvRows = inscriptions.map(inscription => [
    inscription.id,
    inscription.course_nom,
    inscription.civilite,
    inscription.nom,
    inscription.prenom,
    inscription.date_naissance,
    inscription.email,
    inscription.email_confirmation,
    inscription.nationalite,
    inscription.licencie_ffa ? "Oui" : "Non",
    inscription.federation_appartenance || "",
    inscription.numero_licence || "",
    inscription.numero_pps || "",
    inscription.validite_pps || "",
    inscription.attestation_pps_url || "",
    inscription.numero_dossard || "",
    inscription.numero_rue,
    inscription.nom_rue,
    inscription.complement_adresse || "",
    inscription.code_postal,
    inscription.ville,
    inscription.pays,
    inscription.telephone_mobile,
    inscription.telephone_fixe || "",
    inscription.taille_tshirt.toUpperCase(),
    inscription.accepte_reglement ? "Oui" : "Non",
    inscription.accepte_liste_publique ? "Oui" : "Non",
    inscription.statut,
    new Date(inscription.created_at).toLocaleString("fr-FR")
  ]);

  // Création du contenu CSV
  const csvContent = [
    headers.join(","),
    ...csvRows.map(row => 
      row.map(field => {
        // Échapper les guillemets et virgules dans les champs
        const stringField = String(field || "");
        if (stringField.includes(",") || stringField.includes('"') || stringField.includes("\n")) {
          return `"${stringField.replace(/"/g, '""')}"`;
        }
        return stringField;
      }).join(",")
    )
  ].join("\n");

  return csvContent;
}

export async function getNextUpcomingTrail(): Promise<Trail | null> {
  const supabase = await createClient();
  
  const now = new Date().toISOString();
  
  const { data: trail, error } = await supabase
    .from("trail")
    .select("*")
    .eq("actif", true)
    .gte("date_evenement", now)
    .order("date_evenement", { ascending: true })
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching next upcoming trail:", error);
    return null;
  }

  return trail;
}

export async function toggleTrailStatus(id: string, actif: boolean): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("trail")
    .update({ actif })
    .eq("id", id);

  if (error) {
    console.error("Error toggling trail status:", error);
    throw new Error("Erreur lors de la modification du statut du trail");
  }

  revalidatePath("/ghost/trail");
}

export async function getTrailByIdWithStats(id: string): Promise<TrailWithCoursesAndStats | null> {
  const supabase = await createClient();
  
  const { data: trail, error } = await supabase
    .from("trail")
    .select(`
      *,
      courses (
        id,
        nom,
        description,
        distance_km,
        denivele_positif,
        difficulte,
        created_at,
        updated_at
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching trail:", error);
    return null;
  }

  // Compter toutes les inscriptions du trail
  const { data: allInscriptions } = await supabase
    .from("trail_inscriptions")
    .select("course_id")
    .eq("trail_id", id);

  const totalInscriptionsCount = allInscriptions?.length || 0;

  // Compter les inscriptions par course avec statuts
  const coursesWithStats = await Promise.all(
    trail.courses.map(async (course) => {
      const { data: inscriptions } = await supabase
        .from("trail_inscriptions")
        .select("statut")
        .eq("course_id", course.id);

      const valideCount = inscriptions?.filter(i => i.statut === 'valide').length || 0;
      const incompletCount = inscriptions?.filter(i => i.statut === 'incomplet').length || 0;
      const totalCount = inscriptions?.length || 0;

      return {
        ...course,
        inscriptions_valide: valideCount,
        inscriptions_incomplet: incompletCount,
        total_inscriptions: totalCount,
      };
    })
  );

  return {
    ...trail,
    courses: coursesWithStats,
    inscriptions_count: totalInscriptionsCount,
  };
}

export async function createTrail(formData: FormData) {
  const supabase = await createClient();
  
  const trailData = {
    nom: formData.get("nom") as string,
    description: formData.get("description") as string || null,
    date_evenement: formData.get("date_evenement") as string,
    heure_debut: formData.get("heure_debut") as string,
    heure_fin: formData.get("heure_fin") as string,
    debut_inscription: formData.get("debut_inscription") as string,
    fin_inscription: formData.get("fin_inscription") as string,
    prix_cents: parseInt(formData.get("prix_cents") as string) || 0,
    currency: formData.get("currency") as string || "EUR",
    flyer_url: formData.get("flyer_url") as string || null,
    reglement_html: formData.get("reglement_html") as string || null,
    lieu_adresse: formData.get("lieu_adresse") as string,
    lieu_description: formData.get("lieu_description") as string || null,
    map_iframe: formData.get("map_iframe") as string || null,
    lieu_recup_dossard: formData.get("lieu_recup_dossard") as string || null,
    heure_debut_recup_dossard: formData.get("heure_debut_recup_dossard") as string || null,
    heure_fin_recup_dossard: formData.get("heure_fin_recup_dossard") as string || null,
    map_iframe_recup_dossard: formData.get("map_iframe_recup_dossard") as string || null,
    actif: formData.get("actif") === "on",
  };

  const { data: trail, error } = await supabase
    .from("trail")
    .insert(trailData)
    .select()
    .single();

  if (error) {
    console.error("Error creating trail:", error);
    throw new Error("Erreur lors de la création du trail");
  }

  revalidatePath("/ghost/trail");
  return trail;
}

export async function updateTrail(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const trailData = {
    nom: formData.get("nom") as string,
    description: formData.get("description") as string || null,
    date_evenement: formData.get("date_evenement") as string,
    heure_debut: formData.get("heure_debut") as string,
    heure_fin: formData.get("heure_fin") as string,
    debut_inscription: formData.get("debut_inscription") as string,
    fin_inscription: formData.get("fin_inscription") as string,
    prix_cents: parseInt(formData.get("prix_cents") as string) || 0,
    currency: formData.get("currency") as string || "EUR",
    flyer_url: formData.get("flyer_url") as string || null,
    reglement_html: formData.get("reglement_html") as string || null,
    lieu_adresse: formData.get("lieu_adresse") as string,
    lieu_description: formData.get("lieu_description") as string || null,
    map_iframe: formData.get("map_iframe") as string || null,
    lieu_recup_dossard: formData.get("lieu_recup_dossard") as string || null,
    heure_debut_recup_dossard: formData.get("heure_debut_recup_dossard") as string || null,
    heure_fin_recup_dossard: formData.get("heure_fin_recup_dossard") as string || null,
    map_iframe_recup_dossard: formData.get("map_iframe_recup_dossard") as string || null,
    actif: formData.get("actif") === "on",
  };

  const { error } = await supabase
    .from("trail")
    .update(trailData)
    .eq("id", id);

  if (error) {
    console.error("Error updating trail:", error);
    throw new Error("Erreur lors de la mise à jour du trail");
  }

  revalidatePath("/ghost/trail");
  revalidatePath(`/ghost/trail/${id}`);
}

export async function deleteTrail(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("trail")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting trail:", error);
    throw new Error("Erreur lors de la suppression du trail");
  }

  revalidatePath("/ghost/trail");
  redirect("/ghost/trail");
}

export async function createCourse(trailId: string, formData: FormData) {
  const supabase = await createClient();
  
  const courseData = {
    trail_id: trailId,
    nom: formData.get("nom") as string,
    description: formData.get("description") as string || null,
    distance_km: formData.get("distance_km") ? parseFloat(formData.get("distance_km") as string) : null,
    denivele_positif: formData.get("denivele_positif") ? parseInt(formData.get("denivele_positif") as string) : null,
    difficulte: formData.get("difficulte") as string || null,
  };

  const { data: course, error } = await supabase
    .from("courses")
    .insert(courseData)
    .select()
    .single();

  if (error) {
    console.error("Error creating course:", error);
    throw new Error("Erreur lors de la création de la course");
  }

  revalidatePath(`/ghost/trail/${trailId}`);
  return course;
}

export async function updateCourse(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const courseData = {
    nom: formData.get("nom") as string,
    description: formData.get("description") as string || null,
    distance_km: formData.get("distance_km") ? parseFloat(formData.get("distance_km") as string) : null,
    denivele_positif: formData.get("denivele_positif") ? parseInt(formData.get("denivele_positif") as string) : null,
    difficulte: formData.get("difficulte") as string || null,
  };

  const { error } = await supabase
    .from("courses")
    .update(courseData)
    .eq("id", id);

  if (error) {
    console.error("Error updating course:", error);
    throw new Error("Erreur lors de la mise à jour de la course");
  }

  revalidatePath("/ghost/trail");
}

export async function deleteCourse(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("courses")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting course:", error);
    throw new Error("Erreur lors de la suppression de la course");
  }

  revalidatePath("/ghost/trail");
}

export async function createTrailInscription(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  try {
    // Récupérer les données du formulaire
    const courseId = formData.get("course_id") as string;
    const civilite = formData.get("civilite") as string;
    const nom = formData.get("nom") as string;
    const prenom = formData.get("prenom") as string;
    const dateNaissance = formData.get("date_naissance") as string;
    const email = formData.get("email") as string;
    const confirmationEmail = formData.get("confirmation_email") as string;
    const nationalite = formData.get("nationalite") as string;
    const licencieFfa = formData.get("licencie_ffa") === "true";
    const federationAppartenance = formData.get("federation_appartenance") as string;
    const numeroLicence = formData.get("numero_licence") as string;
    const attestationPpsUrl = formData.get("attestation_pps_url") as string;
    const numeroRue = formData.get("numero_rue") as string;
    const nomRue = formData.get("nom_rue") as string;
    const complementAdresse = formData.get("complement_adresse") as string;
    const codePostal = formData.get("code_postal") as string;
    const ville = formData.get("ville") as string;
    const pays = formData.get("pays") as string;
    const telephoneMobile = formData.get("telephone_mobile") as string;
    const telephoneFixe = formData.get("telephone_fixe") as string;
    const tailleTshirt = formData.get("taille_tshirt") as string;
    const accepteReglement = formData.get("accepte_reglement") === "true";
    const accepteListePublique = formData.get("accepte_liste_publique") === "true";
    const numeroPps = formData.get("numero_pps") as string;
    const validitePps = formData.get("validite_pps") as string;

    // Validation des champs obligatoires
    if (!courseId || !nom || !prenom || !dateNaissance || !email || !confirmationEmail || 
        !nationalite || !numeroRue || !nomRue || !codePostal || !ville || !pays || 
        !telephoneMobile || !tailleTshirt || !accepteReglement || !accepteListePublique) {
      return { success: false, error: "Tous les champs obligatoires doivent être remplis" };
    }

    // Validation de l'âge (minimum 18 ans)
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Vérifier si l'anniversaire n'a pas encore eu lieu cette année
    const actualAge = (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) 
      ? age - 1 
      : age;
    
    if (actualAge < 18) {
      return { success: false, error: "Vous devez avoir au moins 18 ans pour vous inscrire à cette course" };
    }

    // Validation email
    if (email !== confirmationEmail) {
      return { success: false, error: "Les adresses email ne correspondent pas" };
    }

    // Validation licence FFA
    if (licencieFfa && (!federationAppartenance || !numeroLicence)) {
      return { success: false, error: "Les informations de licence FFA sont obligatoires" };
    }

    // Validation PPS
    if (!licencieFfa && (!attestationPpsUrl || !numeroPps || !validitePps)) {
      return { success: false, error: "Les informations PPS sont obligatoires pour les non-licenciés" };
    }

    // Générer un numéro de dossard unique
    const { data: lastInscription } = await supabase
      .from("trail_inscriptions")
      .select("numero_dossard")
      .order("numero_dossard", { ascending: false })
      .limit(1);

    const nextNumeroDossard = lastInscription && lastInscription.length > 0 
      ? (parseInt(lastInscription[0].numero_dossard || "0") + 1).toString()
      : "1";

    // Insérer l'inscription
    const { data, error } = await supabase
      .from("trail_inscriptions")
      .insert({
        course_id: courseId,
        civilite,
        nom,
        prenom,
        date_naissance: dateNaissance,
        email,
        nationalite,
        licencie_ffa: licencieFfa,
        federation_appartenance: licencieFfa ? federationAppartenance : null,
        numero_licence: licencieFfa ? numeroLicence : null,
        attestation_pps_url: !licencieFfa ? attestationPpsUrl : null,
        numero_rue: numeroRue,
        nom_rue: nomRue,
        complement_adresse: complementAdresse || null,
        code_postal: codePostal,
        ville,
        pays,
        telephone_mobile: telephoneMobile,
        telephone_fixe: telephoneFixe || null,
        taille_tshirt: tailleTshirt,
        accepte_reglement: accepteReglement,
        accepte_liste_publique: accepteListePublique,
        statut: "incomplet", // Statut initial
        numero_pps: !licencieFfa ? numeroPps : null,
        validite_pps: !licencieFfa ? validitePps : null,
        numero_dossard: nextNumeroDossard,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating trail inscription:", error);
      return { success: false, error: "Erreur lors de la création de l'inscription" };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "Une erreur inattendue est survenue" };
  }
}
