"use client";

import { TrailWithCoursesAndStats } from "@/app/actions/trails";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock, TrendingUp, Users, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CourseSelectionClientProps {
  trail: TrailWithCoursesAndStats;
}

export function CourseSelectionClient({ trail }: CourseSelectionClientProps) {
  const getRegistrationStatus = () => {
    const now = new Date();
    const debutInscription = new Date(trail.debut_inscription);
    const finInscription = new Date(trail.fin_inscription);

    if (now < debutInscription) {
      return {
        status: "soon",
        text: "Inscriptions bientôt ouvertes",
        variant: "secondary" as const,
        color: "text-blue-600"
      };
    } else if (now >= debutInscription && now <= finInscription) {
      return {
        status: "open",
        text: "Inscriptions ouvertes",
        variant: "default" as const,
        color: "text-green-600"
      };
    } else {
      return {
        status: "closed",
        text: "Inscriptions fermées",
        variant: "destructive" as const,
        color: "text-red-600"
      };
    }
  };

  const registrationStatus = getRegistrationStatus();

  // Logos des courses
  const courseLogos = {
    "Raid des Denisiens": "https://wokpbajmuatqykbcsjmv.supabase.co/storage/v1/object/public/flyers/raiddenisien.png",
    "Ou sa fey": "https://wokpbajmuatqykbcsjmv.supabase.co/storage/v1/object/public/flyers/ousafey.png"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/inscription/${trail.id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux détails
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{trail.nom}</h1>
              <p className="text-muted-foreground">Choisissez votre course</p>
            </div>
            <Badge 
              variant={registrationStatus.variant}
              className={`${registrationStatus.color} font-medium`}
            >
              {registrationStatus.text}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Informations générales */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>
                {format(new Date(trail.date_evenement), "EEEE d MMMM yyyy", { locale: fr })} - 
                {trail.heure_debut} - {trail.heure_fin}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-gray-700 mb-4">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{trail.lieu_adresse}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Users className="h-4 w-4" />
                <span className="text-sm">Prix : {(trail.prix_cents / 100).toFixed(2)} €</span>
              </div>
            </CardContent>
          </Card>

          {/* Sélection des courses */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Choisissez votre course</h2>
              <p className="text-gray-600">
                Sélectionnez la course qui correspond à votre niveau et vos envies
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {trail.courses.map((course) => {
                const courseLogo = courseLogos[course.nom as keyof typeof courseLogos];
                
                return (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-center gap-4 mb-4">
                        {courseLogo && (
                          <div className="relative w-16 h-16">
                            <Image
                              src={courseLogo}
                              alt={`Logo ${course.nom}`}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <CardTitle className="text-xl">{course.nom}</CardTitle>
                          <CardDescription>
                            {course.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Détails de la course */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="h-4 w-4" />
                          <span>{course.distance_km} km</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <TrendingUp className="h-4 w-4" />
                          <span>+{course.denivele_positif}m</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="h-4 w-4" />
                          <span>{course.difficulte}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Users className="h-4 w-4" />
                          <span>{course.inscriptions_valide} inscrits</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-4">
                        {registrationStatus.status === "open" ? (
                          <Button asChild className="flex-1 group-hover:bg-primary/90">
                            <Link href={`/inscription/${trail.id}/course/${course.id}/form`}>
                              S'inscrire à cette course
                            </Link>
                          </Button>
                        ) : (
                          <Button variant="outline" className="flex-1" disabled>
                            Inscriptions fermées
                          </Button>
                        )}
                        <Button variant="outline" asChild>
                          <Link href={`/course/${course.id}/participants`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir les participants
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Informations supplémentaires */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Informations importantes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <p>• Les inscriptions sont ouvertes du {format(new Date(trail.debut_inscription), "dd/MM/yyyy", { locale: fr })} au {format(new Date(trail.fin_inscription), "dd/MM/yyyy", { locale: fr })}</p>
              <p>• Le prix est identique pour toutes les courses : {(trail.prix_cents / 100).toFixed(2)} €</p>
              <p>• Vous pouvez consulter la liste des participants pour chaque course</p>
              <p>• Assurez-vous d'avoir lu le règlement avant de vous inscrire</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
