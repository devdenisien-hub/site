"use client";

import { useState } from "react";
import { createTrail } from "@/app/actions/trails";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/ui/image-upload";
import { WysiwygEditor } from "@/components/ui/wysiwyg-editor";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function TrailCreateForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [flyerUrl, setFlyerUrl] = useState<string | null>(null);
  const [reglementHtml, setReglementHtml] = useState("");
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      // Ajouter les valeurs des composants personnalisés
      if (flyerUrl) {
        formData.set("flyer_url", flyerUrl);
      }
      if (reglementHtml) {
        formData.set("reglement_html", reglementHtml);
      }
      
      const trail = await createTrail(formData);
      toast.success("Trail créé avec succès");
      router.push(`/ghost/trail/${trail.id}`);
    } catch (error) {
      toast.error("Erreur lors de la création du trail");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nom">Nom du trail *</Label>
          <Input
            id="nom"
            name="nom"
            placeholder="Ex: Trail des Mornes Denisien 2024"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date_evenement">Date de l'événement *</Label>
          <Input
            id="date_evenement"
            name="date_evenement"
            type="date"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Décrivez votre événement de trail..."
          rows={3}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="heure_debut">Heure de début *</Label>
          <Input
            id="heure_debut"
            name="heure_debut"
            type="time"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="heure_fin">Heure de fin *</Label>
          <Input
            id="heure_fin"
            name="heure_fin"
            type="time"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="debut_inscription">Début des inscriptions *</Label>
          <Input
            id="debut_inscription"
            name="debut_inscription"
            type="datetime-local"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fin_inscription">Fin des inscriptions *</Label>
          <Input
            id="fin_inscription"
            name="fin_inscription"
            type="datetime-local"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="prix_cents">Prix de base (en centimes) *</Label>
          <Input
            id="prix_cents"
            name="prix_cents"
            type="number"
            placeholder="2500 (pour 25€)"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="currency">Devise</Label>
          <Select name="currency" defaultValue="EUR">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="lieu_adresse">Lieu de RDV *</Label>
        <Input
          id="lieu_adresse"
          name="lieu_adresse"
          placeholder="Ex: Place de la Mairie, Fort-de-France"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lieu_description">Description du lieu</Label>
        <Textarea
          id="lieu_description"
          name="lieu_description"
          placeholder="Instructions pour se rendre au lieu de RDV..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="map_iframe">Iframe de la carte (RDV)</Label>
        <Textarea
          id="map_iframe"
          name="map_iframe"
          placeholder="<iframe src='https://www.google.com/maps/embed?pb=...' width='100%' height='300'></iframe>"
          rows={3}
        />
      </div>

      {/* Section récupération des dossards */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Récupération des dossards</h3>
        
        <div className="space-y-2">
          <Label htmlFor="lieu_recup_dossard">Lieu de récupération</Label>
          <Input
            id="lieu_recup_dossard"
            name="lieu_recup_dossard"
            placeholder="Ex: Salle des fêtes, Fort-de-France"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="heure_debut_recup_dossard">Heure début récupération</Label>
            <Input
              id="heure_debut_recup_dossard"
              name="heure_debut_recup_dossard"
              type="time"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="heure_fin_recup_dossard">Heure fin récupération</Label>
            <Input
              id="heure_fin_recup_dossard"
              name="heure_fin_recup_dossard"
              type="time"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="map_iframe_recup_dossard">Iframe de la carte (récupération)</Label>
          <Textarea
            id="map_iframe_recup_dossard"
            name="map_iframe_recup_dossard"
            placeholder="<iframe src='https://www.google.com/maps/embed?pb=...' width='100%' height='300'></iframe>"
            rows={3}
          />
        </div>
      </div>

      {/* Statut */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Statut</h3>
        
        <div className="flex items-center space-x-2">
          <Checkbox id="actif" name="actif" defaultChecked />
          <Label htmlFor="actif" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Trail actif (affiché sur la page d'accueil)
          </Label>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Décochez cette case pour désactiver l'affichage de ce trail sur la page d'accueil
        </p>
      </div>

      {/* Documents */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Documents</h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Flyer de l'événement</Label>
            <ImageUpload
              value={flyerUrl}
              onChange={setFlyerUrl}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Règlement de l'épreuve</Label>
            <WysiwygEditor
              content={reglementHtml}
              onChange={setReglementHtml}
              placeholder="Rédigez le règlement de l'épreuve..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Création..." : "Créer le trail"}
        </Button>
      </div>
    </form>
  );
}
