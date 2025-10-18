"use client";

import { TrailWithCoursesAndStats } from "@/app/actions/trails";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, MapPin, Users, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { TrailStatusSwitch } from "@/components/trail/trail-status-switch";

interface TrailsListClientProps {
  trails: TrailWithCoursesAndStats[];
}

export function TrailsListClient({ trails }: TrailsListClientProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Trails</h1>
          <p className="text-muted-foreground">
            Gérez vos événements de trail et leurs courses
          </p>
        </div>
        <Button asChild>
          <Link href="/ghost/trail/nouveau">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Trail
          </Link>
        </Button>
      </div>

      {trails.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Aucun trail créé</h3>
                <p className="text-muted-foreground">
                  Commencez par créer votre premier événement de trail
                </p>
              </div>
              <Button asChild>
                <Link href="/ghost/trail/nouveau">
                  <Plus className="mr-2 h-4 w-4" />
                  Créer un trail
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trails.map((trail) => (
            <Card key={trail.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{trail.nom}</CardTitle>
                    <CardDescription>
                      {format(new Date(trail.date_evenement), "PPP", { locale: fr })}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">
                      {trail.inscriptions_count} inscrits
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {trail.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {trail.description}
                  </p>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span className="truncate">{trail.lieu_adresse}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-2 h-4 w-4" />
                    <span>{trail.courses.length} course{trail.courses.length > 1 ? 's' : ''}</span>
                  </div>
                  
                  {/* Statistiques des courses */}
                  {trail.courses.length > 0 && (
                    <div className="space-y-1">
                      {trail.courses.map((course) => (
                        <div key={course.id} className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{course.nom}</span>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="h-3 w-3" />
                              <span>{course.inscriptions_valide}</span>
                            </div>
                            <div className="flex items-center gap-1 text-orange-600">
                              <AlertCircle className="h-3 w-3" />
                              <span>{course.inscriptions_incomplet}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Switch pour activer/désactiver */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <TrailStatusSwitch 
                    trailId={trail.id}
                    trailName={trail.nom}
                    initialStatus={trail.actif}
                  />
                  <Button asChild size="sm">
                    <Link href={`/ghost/trail/${trail.id}`}>
                      Détails
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}




