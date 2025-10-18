"use server";

import { z } from "zod";

// Schéma de validation
const contactFormSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  email: z.string().min(1, "L'email est requis").email("Email invalide"),
  telephone: z.string().min(1, "Le téléphone est requis"),
  sujet: z.string().min(1, "Le sujet est requis"),
  message: z.string().min(1, "Le message est requis").min(10, "Le message doit contenir au moins 10 caractères"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export async function sendContactEmail(data: ContactFormData) {
  try {
    // Validation des données
    const validatedData = contactFormSchema.parse(data);

    // TODO: Intégration avec Resend
    // Exemple d'intégration avec Resend (à décommenter et configurer plus tard):
    /*
    import { Resend } from 'resend';
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Les Mornes Denisien <onboarding@resend.dev>',
      to: ['lesmornesdenisiens@gmail.com', 'trail.denisiens@gmail.com'],
      subject: `Nouveau message: ${validatedData.sujet}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${validatedData.nom} ${validatedData.prenom}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Téléphone:</strong> ${validatedData.telephone}</p>
        <p><strong>Sujet:</strong> ${validatedData.sujet}</p>
        <p><strong>Message:</strong></p>
        <p>${validatedData.message}</p>
      `,
    });
    */

    // Pour le moment, on log juste les données
    console.log("Message de contact reçu:", validatedData);

    return {
      success: true,
      message: "Votre message a été envoyé avec succès !",
    };
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Données du formulaire invalides",
        errors: error.errors,
      };
    }

    return {
      success: false,
      message: "Une erreur s'est produite lors de l'envoi du message",
    };
  }
}



