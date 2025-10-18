import { TrailWithCourses } from "@/app/actions/trails";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock, FileText, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";

interface TrailInfoCardProps {
  trail: TrailWithCourses;
}

export function TrailInfoCard({ trail }: TrailInfoCardProps) {
  return (
    <div className="space-y-6">
      {/* Informations générales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Informations générales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Date de l'événement
            </label>
            <p className="text-sm">
              {format(new Date(trail.date_evenement), "PPP", { locale: fr })}
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Horaires
            </label>
            <p className="text-sm">
              {trail.heure_debut} - {trail.heure_fin}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Période d'inscription
            </label>
            <p className="text-sm">
              Du {format(new Date(trail.debut_inscription), "dd/MM/yyyy HH:mm", { locale: fr })}<br />
              Au {format(new Date(trail.fin_inscription), "dd/MM/yyyy HH:mm", { locale: fr })}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Prix de base
            </label>
            <p className="text-sm font-semibold">
              {(trail.prix_cents / 100).toFixed(2)} €
            </p>
          </div>

          {trail.description && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Description
              </label>
              <p className="text-sm">{trail.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lieux */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Lieux
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Lieu de RDV
            </label>
            <p className="text-sm">{trail.lieu_adresse}</p>
            {trail.lieu_description && (
              <p className="text-xs text-muted-foreground mt-1">{trail.lieu_description}</p>
            )}
          </div>
          
          {trail.lieu_recup_dossard && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Récupération des dossards
              </label>
              <p className="text-sm">{trail.lieu_recup_dossard}</p>
              {trail.heure_debut_recup_dossard && trail.heure_fin_recup_dossard && (
                <p className="text-xs text-muted-foreground mt-1">
                  <Clock className="inline h-3 w-3 mr-1" />
                  {trail.heure_debut_recup_dossard} - {trail.heure_fin_recup_dossard}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Courses ({trail.courses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {trail.courses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucune course créée pour ce trail
            </p>
          ) : (
            <div className="space-y-3">
              {trail.courses.map((course) => (
                <div key={course.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{course.nom}</h4>
                    <Badge variant="outline">
                      {(course.prix_cents / 100).toFixed(2)} €
                    </Badge>
                  </div>
                  {course.description && (
                    <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
                  )}
                  {course.distance_km && (
                    <p className="text-sm text-muted-foreground">
                      {course.distance_km} km
                      {course.denivele_positif && ` • +${course.denivele_positif}m`}
                    </p>
                  )}
                  {course.max_participants && (
                    <p className="text-xs text-muted-foreground">
                      Max {course.max_participants} participants
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trail.flyer_url && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Flyer
              </label>
              <div className="mt-2">
                <Image
                  src={trail.flyer_url}
                  alt="Flyer du trail"
                  width={200}
                  height={150}
                  className="rounded-lg border"
                />
              </div>
            </div>
          )}
          
          {trail.reglement_html && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Règlement
              </label>
              <div 
                className="mt-2 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: trail.reglement_html }}
              />
            </div>
          )}

          {!trail.flyer_url && !trail.reglement_html && (
            <p className="text-sm text-muted-foreground">
              Aucun document ajouté
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}




