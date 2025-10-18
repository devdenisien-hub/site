"use client";

import { useState } from "react";
import { updateCourse, CourseWithParticipants } from "@/app/actions/trails";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { WysiwygEditor } from "@/components/ui/wysiwyg-editor";
import { Edit, Save } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CourseEditDialogProps {
  course: CourseWithParticipants;
  onCourseUpdated: () => void;
}

export function CourseEditDialog({ course, onCourseUpdated }: CourseEditDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [descriptionHtml, setDescriptionHtml] = useState(course.description || "");
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      // Ajouter la description HTML au FormData
      if (descriptionHtml) {
        formData.set("description", descriptionHtml);
      }
      
      await updateCourse(course.id, formData);
      toast.success("Course mise à jour avec succès");
      setIsOpen(false);
      router.refresh();
      onCourseUpdated();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la course");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="mr-2 h-4 w-4" />
          Modifier la course
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier la course</DialogTitle>
          <DialogDescription>
            Modifiez les informations de cette course
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom de la course *</Label>
            <Input 
              id="nom" 
              name="nom" 
              defaultValue={course.nom}
              required 
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <WysiwygEditor
              content={descriptionHtml}
              onChange={setDescriptionHtml}
              placeholder="Décrivez cette course avec du formatage..."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="distance_km">Distance (km)</Label>
              <Input 
                id="distance_km" 
                name="distance_km" 
                type="number" 
                step="0.1" 
                defaultValue={course.distance_km || ""}
                placeholder="10.5"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="denivele_positif">Dénivelé positif (m)</Label>
              <Input 
                id="denivele_positif" 
                name="denivele_positif" 
                type="number" 
                defaultValue={course.denivele_positif || ""}
                placeholder="500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulte">Difficulté</Label>
            <Select name="difficulte" defaultValue={course.difficulte || ""}>
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
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sauvegarde..." : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}




