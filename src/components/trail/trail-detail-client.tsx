"use client";

import { TrailWithCoursesAndStats } from "@/app/actions/trails";
import { TrailEditDialog } from "@/components/trail/trail-edit-dialog";
import { ReglementDialog } from "@/components/trail/reglement-dialog";
import { CreateCourseDialog } from "@/components/trail/create-course-dialog";
import { ExportCSVButton } from "@/components/trail/export-csv-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Users, Clock, FileText, Eye, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useRouter } from "next/navigation";

interface TrailDetailClientProps {
  trail: TrailWithCoursesAndStats;
}

export function TrailDetailClient({ trail }: TrailDetailClientProps) {
  const router = useRouter();

  const handleTrailUpdated = () => {
    router.refresh();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/ghost/trail">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{trail.nom}</h1>
          <p className="text-muted-foreground">
            Gérez les détails de votre événement de trail
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {trail.inscriptions_count} inscrits
          </Badge>
          <ExportCSVButton trailId={trail.id} trailName={trail.nom} />
          <TrailEditDialog trail={trail} onTrailUpdated={handleTrailUpdated} />
        </div>
      </div>

      {/* Card unique avec toutes les informations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Informations générales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Informations de base */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Date de l'événement
              </label>
              <p className="text-sm font-semibold">
                {format(new Date(trail.date_evenement), "PPP", { locale: fr })}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Horaires
              </label>
              <p className="text-sm font-semibold">
                {trail.heure_debut} - {trail.heure_fin}
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
          </div>

          {/* Période d'inscription */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Période d'inscription
            </label>
            <p className="text-sm">
              Du {format(new Date(trail.debut_inscription), "dd/MM/yyyy HH:mm", { locale: fr })} au {format(new Date(trail.fin_inscription), "dd/MM/yyyy HH:mm", { locale: fr })}
            </p>
          </div>

          {/* Description */}
          {trail.description && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Description
              </label>
              <p className="text-sm">{trail.description}</p>
            </div>
          )}

          {/* Lieux */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Lieux
            </h3>
            
            <div className="grid gap-4 md:grid-cols-2">
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
            </div>
          </div>

          {/* Courses */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5" />
                Courses ({trail.courses.length})
              </h3>
              <CreateCourseDialog 
                trailId={trail.id} 
                onCourseCreated={handleTrailUpdated} 
              />
            </div>
            
            {trail.courses.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Aucune course créée pour ce trail
                </p>
                <CreateCourseDialog 
                  trailId={trail.id} 
                  onCourseCreated={handleTrailUpdated} 
                />
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {trail.courses.map((course) => (
                  <div key={course.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{course.nom}</h4>
                      <Badge variant="outline">
                        {(trail.prix_cents / 100).toFixed(2)} €
                      </Badge>
                    </div>
                    {course.description && (
                      <div 
                        className="text-sm text-muted-foreground mt-1 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: course.description }}
                      />
                    )}
                    <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                      {course.distance_km && <span>{course.distance_km} km</span>}
                      {course.denivele_positif && <span>+{course.denivele_positif}m</span>}
                    </div>
                    
                    {/* Statistiques des inscriptions */}
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-medium">{course.inscriptions_valide}</span>
                          <span className="text-muted-foreground">validées</span>
                        </div>
                        <div className="flex items-center gap-1 text-orange-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="font-medium">{course.inscriptions_incomplet}</span>
                          <span className="text-muted-foreground">incomplètes</span>
                        </div>
                        <div className="text-muted-foreground">
                          <span className="font-medium">{course.total_inscriptions}</span> total
                        </div>
                      </div>
                    </div>
                    
                    {/* Bouton pour voir les détails */}
                    <div className="mt-3 pt-3 border-t">
                      <Button asChild size="sm" className="w-full">
                        <Link href={`/ghost/course/${course.id}`}>
                          Voir les détails et participants
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Documents */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documents
            </h3>
            
            <div className="flex gap-4">
              <ReglementDialog reglementHtml={trail.reglement_html} />
              
              {trail.flyer_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={trail.flyer_url} target="_blank" rel="noopener noreferrer">
                    <Eye className="mr-2 h-4 w-4" />
                    Voir le flyer
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
