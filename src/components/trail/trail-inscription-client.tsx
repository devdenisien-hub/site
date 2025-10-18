"use client";

import { TrailWithCoursesAndStats } from "@/app/actions/trails";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, MapPin, Users, Euro, FileText, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ReglementDialog } from "@/components/trail/reglement-dialog";

interface TrailInscriptionClientProps {
  trail: TrailWithCoursesAndStats;
}

export function TrailInscriptionClient({ trail }: TrailInscriptionClientProps) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à l'accueil
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{trail.nom}</h1>
              <p className="text-muted-foreground">Inscription à l'événement</p>
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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Colonne gauche - Informations du trail */}
          <div className="flex-1 space-y-6">
            {/* Flyer */}
            <Card>
              <CardHeader>
                <CardTitle>Flyer de l'événement</CardTitle>
              </CardHeader>
              <CardContent>
                {trail.flyer_url ? (
                  <div className="relative h-96 w-full">
                    <Image
                      src={trail.flyer_url}
                      alt={`Flyer ${trail.nom}`}
                      fill
                      className="object-contain rounded-lg"
                      priority
                    />
                  </div>
                ) : (
                  <div className="h-96 w-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <div className="text-center text-white">
                      <Calendar className="h-20 w-20 mx-auto mb-4 opacity-80" />
                      <h3 className="text-2xl font-bold">{trail.nom}</h3>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informations générales */}
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
                <CardDescription>
                  Toutes les informations importantes sur l'événement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date et heure */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {(() => {
                        if (!trail.date_evenement) {
                          return "Date à confirmer";
                        }
                        
                        const eventDate = new Date(trail.date_evenement);
                        
                        if (isNaN(eventDate.getTime())) {
                          return "Date à confirmer";
                        }
                        
                        return format(eventDate, "EEEE d MMMM yyyy", { locale: fr });
                      })()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                      {(() => {
                        if (!trail.heure_debut || !trail.heure_fin) {
                          return "Horaires à confirmer";
                        }
                        
                        try {
                          if (trail.heure_debut.match(/^\d{2}:\d{2}$/) && trail.heure_fin.match(/^\d{2}:\d{2}$/)) {
                            return `${trail.heure_debut} - ${trail.heure_fin}`;
                          }
                          
                          const debutDate = new Date(`2000-01-01T${trail.heure_debut}`);
                          const finDate = new Date(`2000-01-01T${trail.heure_fin}`);
                          
                          if (isNaN(debutDate.getTime()) || isNaN(finDate.getTime())) {
                            return "Horaires à confirmer";
                          }
                          
                          return `${format(debutDate, "HH:mm")} - ${format(finDate, "HH:mm")}`;
                        } catch (error) {
                          return "Horaires à confirmer";
                        }
                      })()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{trail.lieu_adresse || "Lieu à confirmer"}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-700">
                    <Euro className="h-4 w-4" />
                    <span className="text-sm">
                      {trail.prix_cents ? `${(trail.prix_cents / 100).toFixed(2)} €` : "Prix à confirmer"}
                    </span>
                  </div>
                </div>

                {/* Description */}
                {trail.description && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-gray-600">{trail.description}</p>
                  </div>
                )}

                {/* Description du lieu */}
                {trail.lieu_description && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Informations sur le lieu</h4>
                    <p className="text-sm text-gray-600">{trail.lieu_description}</p>
                  </div>
                )}

                {/* Carte du lieu */}
                {trail.map_iframe && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Localisation</h4>
                    <div 
                      className="w-full h-48 rounded-lg overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: trail.map_iframe }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Récupération des dossards */}
            {(trail.lieu_recup_dossard || trail.heure_debut_recup_dossard || trail.heure_fin_recup_dossard) && (
              <Card>
                <CardHeader>
                  <CardTitle>Récupération des dossards</CardTitle>
                  <CardDescription>
                    Informations pour récupérer votre dossard
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trail.lieu_recup_dossard && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{trail.lieu_recup_dossard}</span>
                    </div>
                  )}
                  
                  {trail.heure_debut_recup_dossard && trail.heure_fin_recup_dossard && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">
                        {trail.heure_debut_recup_dossard} - {trail.heure_fin_recup_dossard}
                      </span>
                    </div>
                  )}

                  {/* Carte de récupération */}
                  {trail.map_iframe_recup_dossard && (
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Localisation récupération</h4>
                      <div 
                        className="w-full h-48 rounded-lg overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: trail.map_iframe_recup_dossard }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Règlement */}
            {trail.reglement_html && (
              <Card>
                <CardHeader>
                  <CardTitle>Règlement de l'épreuve</CardTitle>
                  <CardDescription>
                    Consultez le règlement avant de vous inscrire
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ReglementDialog reglementHtml={trail.reglement_html} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Colonne droite - Formulaire d'inscription */}
          <div className="w-full lg:w-80 lg:sticky lg:top-8 lg:h-fit space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Formulaire d'inscription</CardTitle>
                <CardDescription>
                  Remplissez le formulaire pour vous inscrire à cet événement
                </CardDescription>
              </CardHeader>
              <CardContent>
                {registrationStatus.status === "open" ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Inscriptions ouvertes</h3>
                    <p className="text-gray-600 mb-4">
                      Vous pouvez maintenant vous inscrire à cet événement
                    </p>
                    <Button asChild size="lg" className="w-full">
                      <Link href={`/inscription/${trail.id}/course`}>
                        Commencer l'inscription
                      </Link>
                    </Button>
                  </div>
                ) : registrationStatus.status === "soon" ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Inscriptions bientôt ouvertes</h3>
                    <p className="text-gray-600 mb-4">
                      Les inscriptions ouvriront le {format(new Date(trail.debut_inscription), "dd/MM/yyyy à HH:mm", { locale: fr })}
                    </p>
                    <Button variant="outline" size="lg" className="w-full" disabled>
                      Inscriptions fermées
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Inscriptions fermées</h3>
                    <p className="text-gray-600 mb-4">
                      Les inscriptions ont fermé le {format(new Date(trail.fin_inscription), "dd/MM/yyyy à HH:mm", { locale: fr })}
                    </p>
                    <Button variant="outline" size="lg" className="w-full" disabled>
                      Inscriptions fermées
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Période d'inscription */}
            <Card>
              <CardHeader>
                <CardTitle>Période d'inscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ouverture :</span>
                  <span>
                    {(() => {
                      if (!trail.debut_inscription) {
                        return "À confirmer";
                      }
                      
                      const debutDate = new Date(trail.debut_inscription);
                      
                      if (isNaN(debutDate.getTime())) {
                        return "À confirmer";
                      }
                      
                      return format(debutDate, "dd/MM/yyyy à HH:mm", { locale: fr });
                    })()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fermeture :</span>
                  <span>
                    {(() => {
                      if (!trail.fin_inscription) {
                        return "À confirmer";
                      }
                      
                      const finDate = new Date(trail.fin_inscription);
                      
                      if (isNaN(finDate.getTime())) {
                        return "À confirmer";
                      }
                      
                      return format(finDate, "dd/MM/yyyy à HH:mm", { locale: fr });
                    })()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
