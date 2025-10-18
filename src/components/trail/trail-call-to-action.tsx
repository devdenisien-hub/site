"use client";

import { useState, useEffect } from "react";
import { Trail } from "@/app/actions/trails";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, MapPin } from "lucide-react";
import { format, differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";

interface TrailCallToActionProps {
  trail: Trail;
}

export function TrailCallToAction({ trail }: TrailCallToActionProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  // Calculer le temps restant jusqu'à l'événement
  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!trail.date_evenement) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const now = new Date();
      const eventDate = new Date(trail.date_evenement);
      
      // Vérifier si la date est valide
      if (isNaN(eventDate.getTime())) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const diff = eventDate.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [trail.date_evenement]);

  // Vérifier si les inscriptions sont ouvertes
  useEffect(() => {
    if (!trail.debut_inscription || !trail.fin_inscription) {
      setIsRegistrationOpen(false);
      return;
    }

    const now = new Date();
    const debutInscription = new Date(trail.debut_inscription);
    const finInscription = new Date(trail.fin_inscription);

    // Vérifier si les dates sont valides
    if (isNaN(debutInscription.getTime()) || isNaN(finInscription.getTime())) {
      setIsRegistrationOpen(false);
      return;
    }

    setIsRegistrationOpen(now >= debutInscription && now <= finInscription);
  }, [trail.debut_inscription, trail.fin_inscription]);

  const getRegistrationStatus = () => {
    if (!trail.debut_inscription || !trail.fin_inscription) {
      return {
        status: "unknown",
        text: "Inscriptions à confirmer",
        variant: "secondary" as const,
        color: "text-gray-600"
      };
    }

    const now = new Date();
    const debutInscription = new Date(trail.debut_inscription);
    const finInscription = new Date(trail.fin_inscription);

    // Vérifier si les dates sont valides
    if (isNaN(debutInscription.getTime()) || isNaN(finInscription.getTime())) {
      return {
        status: "unknown",
        text: "Inscriptions à confirmer",
        variant: "secondary" as const,
        color: "text-gray-600"
      };
    }

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
    <Card className="w-full max-w-4xl mx-auto overflow-hidden">
      <div className="grid md:grid-cols-2 gap-0">
        {/* Image du flyer */}
        <div className="relative h-64 md:h-auto">
          {trail.flyer_url ? (
            <Image
              src={trail.flyer_url}
              alt={`Flyer ${trail.nom}`}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <div className="text-center text-white">
                <Calendar className="h-16 w-16 mx-auto mb-4 opacity-80" />
                <h3 className="text-xl font-bold">{trail.nom}</h3>
              </div>
            </div>
          )}
        </div>

        {/* Contenu */}
        <CardContent className="p-6 space-y-6">
          {/* En-tête avec nom et badge */}
          <div className="space-y-3">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{trail.nom}</h2>
              <Badge 
                variant={registrationStatus.variant}
                className={`${registrationStatus.color} font-medium`}
              >
                {registrationStatus.text}
              </Badge>
            </div>
            
            {trail.description && (
              <p className="text-gray-600 text-sm line-clamp-2">
                {trail.description}
              </p>
            )}
          </div>

          {/* Informations de l'événement */}
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
                  
                  // Les heures sont au format "HH:mm:ss" ou "HH:mm"
                  // On peut les utiliser directement ou les convertir
                  try {
                    // Si c'est déjà au format HH:mm, on l'utilise directement
                    if (trail.heure_debut.match(/^\d{2}:\d{2}$/) && trail.heure_fin.match(/^\d{2}:\d{2}$/)) {
                      return `${trail.heure_debut} - ${trail.heure_fin}`;
                    }
                    
                    // Sinon on essaie de créer une date avec l'heure
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
              <Users className="h-4 w-4" />
              <span className="text-sm">
                {trail.prix_cents ? `${(trail.prix_cents / 100).toFixed(2)} €` : "Prix à confirmer"}
              </span>
            </div>
          </div>

          {/* Compte à rebours */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3 text-center">
              Temps restant avant l'événement
            </h3>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-white rounded p-2">
                <div className="text-lg font-bold text-gray-900">{timeLeft.days}</div>
                <div className="text-xs text-gray-500">Jours</div>
              </div>
              <div className="bg-white rounded p-2">
                <div className="text-lg font-bold text-gray-900">{timeLeft.hours}</div>
                <div className="text-xs text-gray-500">Heures</div>
              </div>
              <div className="bg-white rounded p-2">
                <div className="text-lg font-bold text-gray-900">{timeLeft.minutes}</div>
                <div className="text-xs text-gray-500">Minutes</div>
              </div>
              <div className="bg-white rounded p-2">
                <div className="text-lg font-bold text-gray-900">{timeLeft.seconds}</div>
                <div className="text-xs text-gray-500">Secondes</div>
              </div>
            </div>
          </div>

          {/* Période d'inscription */}
          <div className="text-sm text-gray-600 space-y-1">
            <div>
              <span className="font-medium">Ouverture des inscriptions :</span>{" "}
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
            </div>
            <div>
              <span className="font-medium">Fermeture des inscriptions :</span>{" "}
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
            </div>
          </div>

          {/* Bouton d'action */}
          <div className="pt-2">
            {registrationStatus.status === "open" ? (
              <Button asChild className="w-full" size="lg">
                <Link href={`/inscription/${trail.id}`}>
                  S'inscrire maintenant
                </Link>
              </Button>
            ) : registrationStatus.status === "soon" ? (
              <Button asChild className="w-full" size="lg" variant="outline">
                <Link href={`/inscription/${trail.id}`}>
                  Voir les détails
                </Link>
              </Button>
            ) : (
              <Button asChild className="w-full" size="lg" variant="outline">
                <Link href={`/inscription/${trail.id}`}>
                  Voir les détails
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
