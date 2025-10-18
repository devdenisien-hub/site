"use client";

import { useState } from "react";
import { updateTrail, createCourse, updateCourse, deleteCourse, TrailWithCourses } from "@/app/actions/trails";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ImageUpload } from "@/components/ui/image-upload";
import { WysiwygEditor } from "@/components/ui/wysiwyg-editor";
import { Plus, Edit, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

interface TrailDetailFormProps {
  trail: TrailWithCourses;
}

export function TrailDetailForm({ trail }: TrailDetailFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState(trail.courses);
  const [flyerUrl, setFlyerUrl] = useState<string | null>(trail.flyer_url || null);
  const [reglementHtml, setReglementHtml] = useState(trail.reglement_html || "");

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
      
      await updateTrail(trail.id, formData);
      toast.success("Trail mis à jour avec succès");
      setIsEditing(false);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du trail");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCourse = async (formData: FormData) => {
    try {
      const newCourse = await createCourse(trail.id, formData);
      setCourses([...courses, newCourse]);
      toast.success("Course créée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la création de la course");
    }
  };

  const handleUpdateCourse = async (courseId: string, formData: FormData) => {
    try {
      await updateCourse(courseId, formData);
      const updatedCourses = courses.map(course => 
        course.id === courseId 
          ? { ...course, ...Object.fromEntries(formData.entries()) }
          : course
      );
      setCourses(updatedCourses);
      toast.success("Course mise à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la course");
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteCourse(courseId);
      setCourses(courses.filter(course => course.id !== courseId));
      toast.success("Course supprimée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression de la course");
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulaire principal du trail */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Informations du trail</CardTitle>
              <CardDescription>
                Modifiez les détails de votre événement de trail
              </CardDescription>
            </div>
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom du trail *</Label>
                <Input
                  id="nom"
                  name="nom"
                  defaultValue={trail.nom}
                  disabled={!isEditing}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date_evenement">Date de l'événement *</Label>
                <Input
                  id="date_evenement"
                  name="date_evenement"
                  type="date"
                  defaultValue={trail.date_evenement}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={trail.description || ""}
                disabled={!isEditing}
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
                  defaultValue={trail.heure_debut}
                  disabled={!isEditing}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="heure_fin">Heure de fin *</Label>
                <Input
                  id="heure_fin"
                  name="heure_fin"
                  type="time"
                  defaultValue={trail.heure_fin}
                  disabled={!isEditing}
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
                  defaultValue={new Date(trail.debut_inscription).toISOString().slice(0, 16)}
                  disabled={!isEditing}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fin_inscription">Fin des inscriptions *</Label>
                <Input
                  id="fin_inscription"
                  name="fin_inscription"
                  type="datetime-local"
                  defaultValue={new Date(trail.fin_inscription).toISOString().slice(0, 16)}
                  disabled={!isEditing}
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
                  defaultValue={trail.prix_cents}
                  disabled={!isEditing}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">Devise</Label>
                <Select name="currency" defaultValue={trail.currency} disabled={!isEditing}>
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
                defaultValue={trail.lieu_adresse}
                disabled={!isEditing}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lieu_description">Description du lieu</Label>
              <Textarea
                id="lieu_description"
                name="lieu_description"
                defaultValue={trail.lieu_description || ""}
                disabled={!isEditing}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="map_iframe">Iframe de la carte (RDV)</Label>
              <Textarea
                id="map_iframe"
                name="map_iframe"
                defaultValue={trail.map_iframe || ""}
                disabled={!isEditing}
                rows={3}
                placeholder="<iframe src='...' width='100%' height='300'></iframe>"
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
                  defaultValue={trail.lieu_recup_dossard || ""}
                  disabled={!isEditing}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="heure_debut_recup_dossard">Heure début récupération</Label>
                  <Input
                    id="heure_debut_recup_dossard"
                    name="heure_debut_recup_dossard"
                    type="time"
                    defaultValue={trail.heure_debut_recup_dossard || ""}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="heure_fin_recup_dossard">Heure fin récupération</Label>
                  <Input
                    id="heure_fin_recup_dossard"
                    name="heure_fin_recup_dossard"
                    type="time"
                    defaultValue={trail.heure_fin_recup_dossard || ""}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="map_iframe_recup_dossard">Iframe de la carte (récupération)</Label>
                <Textarea
                  id="map_iframe_recup_dossard"
                  name="map_iframe_recup_dossard"
                  defaultValue={trail.map_iframe_recup_dossard || ""}
                  disabled={!isEditing}
                  rows={3}
                  placeholder="<iframe src='...' width='100%' height='300'></iframe>"
                />
              </div>
            </div>

            {/* Statut */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Statut</h3>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="actif" 
                  name="actif" 
                  defaultChecked={trail.actif}
                  disabled={!isEditing}
                />
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
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Règlement de l'épreuve</Label>
                  <WysiwygEditor
                    content={reglementHtml}
                    onChange={setReglementHtml}
                    placeholder="Rédigez le règlement de l'épreuve..."
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Gestion des courses */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Courses ({courses.length})</CardTitle>
              <CardDescription>
                Gérez les courses de ce trail
              </CardDescription>
            </div>
            <CreateCourseDialog onCreateCourse={handleCreateCourse} />
          </div>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Aucune course créée pour ce trail
              </p>
              <CreateCourseDialog onCreateCourse={handleCreateCourse} />
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onUpdate={handleUpdateCourse}
                  onDelete={handleDeleteCourse}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Composant pour créer une nouvelle course
function CreateCourseDialog({ onCreateCourse }: { onCreateCourse: (formData: FormData) => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle course
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle course</DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle course à ce trail
          </DialogDescription>
        </DialogHeader>
        <form action={onCreateCourse} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom de la course *</Label>
              <Input id="nom" name="nom" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="prix_cents">Prix (en centimes) *</Label>
              <Input id="prix_cents" name="prix_cents" type="number" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={3} />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="distance_km">Distance (km)</Label>
              <Input id="distance_km" name="distance_km" type="number" step="0.1" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="denivele_positif">Dénivelé positif (m)</Label>
              <Input id="denivele_positif" name="denivele_positif" type="number" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="max_participants">Max participants</Label>
              <Input id="max_participants" name="max_participants" type="number" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulte">Difficulté</Label>
            <Select name="difficulte">
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une difficulté" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Facile">Facile</SelectItem>
                <SelectItem value="Moyen">Moyen</SelectItem>
                <SelectItem value="Difficile">Difficile</SelectItem>
                <SelectItem value="Très difficile">Très difficile</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <DialogTrigger asChild>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </DialogTrigger>
            <Button type="submit">
              Créer la course
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Composant pour afficher et modifier une course
function CourseCard({ 
  course, 
  onUpdate, 
  onDelete 
}: { 
  course: any; 
  onUpdate: (id: string, formData: FormData) => void;
  onDelete: (id: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (formData: FormData) => {
    onUpdate(course.id, formData);
    setIsEditing(false);
  };

  return (
    <div className="border rounded-lg p-4">
      {isEditing ? (
        <form action={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`nom-${course.id}`}>Nom *</Label>
              <Input 
                id={`nom-${course.id}`}
                name="nom" 
                defaultValue={course.nom} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`prix_cents-${course.id}`}>Prix (centimes) *</Label>
              <Input 
                id={`prix_cents-${course.id}`}
                name="prix_cents" 
                type="number" 
                defaultValue={course.prix_cents} 
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`description-${course.id}`}>Description</Label>
            <Textarea 
              id={`description-${course.id}`}
              name="description" 
              defaultValue={course.description || ""} 
              rows={2} 
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor={`distance_km-${course.id}`}>Distance (km)</Label>
              <Input 
                id={`distance_km-${course.id}`}
                name="distance_km" 
                type="number" 
                step="0.1" 
                defaultValue={course.distance_km || ""} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`denivele_positif-${course.id}`}>Dénivelé (m)</Label>
              <Input 
                id={`denivele_positif-${course.id}`}
                name="denivele_positif" 
                type="number" 
                defaultValue={course.denivele_positif || ""} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`max_participants-${course.id}`}>Max participants</Label>
              <Input 
                id={`max_participants-${course.id}`}
                name="max_participants" 
                type="number" 
                defaultValue={course.max_participants || ""} 
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Sauvegarder
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-medium">{course.nom}</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              {course.description && <p>{course.description}</p>}
              <div className="flex gap-4">
                {course.distance_km && <span>{course.distance_km} km</span>}
                {course.denivele_positif && <span>+{course.denivele_positif}m</span>}
                {course.difficulte && <span>{course.difficulte}</span>}
                {course.max_participants && <span>Max {course.max_participants}</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{(course.prix_cents / 100).toFixed(2)} €</span>
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer la course</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir supprimer la course "{course.nom}" ? 
                    Cette action est irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(course.id)}>
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
    </div>
  );
}
