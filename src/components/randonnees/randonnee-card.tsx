"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface RandonneeCardProps {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  start_at: string;
  end_at: string;
  flyer_url?: string | null;
  is_free: boolean;
  price_cents?: number | null;
  meeting_point?: string | null;
  max_participants?: number | null;
  inscriptions_count?: number;
}

export function RandonneeCard({
  name,
  slug,
  description,
  start_at,
  flyer_url,
  is_free,
  price_cents,
  meeting_point,
  max_participants,
  inscriptions_count = 0,
}: RandonneeCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatPrice = (cents: number | null | undefined) => {
    if (!cents) return "0,00 €";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(cents / 100);
  };

  const placesRestantes = max_participants
    ? max_participants - inscriptions_count
    : null;

  return (
    <Link href={`/randonnees/${slug}`} className="block group">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 md:min-h-[550px] flex flex-col">
        {/* Image/Flyer */}
        <div className="relative h-48 w-full bg-muted overflow-hidden">
          {flyer_url ? (
            <Image
              src={flyer_url}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-700">
              <span className="text-white text-4xl font-bold opacity-50">
                {name.charAt(0)}
              </span>
            </div>
          )}

          {/* Badge Gratuit/Payant */}
          <div className="absolute top-3 right-3">
            <Badge
              variant={is_free ? "default" : "secondary"}
              className={
                is_free
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-orange-600 hover:bg-orange-700"
              }
            >
              {is_free ? "GRATUIT" : formatPrice(price_cents)}
            </Badge>
          </div>

          {/* Badge places restantes si limité */}
          {placesRestantes !== null && placesRestantes <= 10 && (
            <div className="absolute bottom-3 left-3">
              <Badge
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                {placesRestantes > 0
                  ? `Plus que ${placesRestantes} places`
                  : "Complet"}
              </Badge>
            </div>
          )}
        </div>

        {/* Contenu */}
        <CardContent className="p-4 flex-1 flex flex-col">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {name}
          </h3>

          {description && (
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {description}
            </p>
          )}

          <div className="space-y-2 text-sm flex-1">
            <div className="flex items-start gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="capitalize">{formatDate(start_at)}</span>
            </div>

            {meeting_point && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-1">{meeting_point}</span>
              </div>
            )}

            {max_participants && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4 flex-shrink-0" />
                <span>
                  {inscriptions_count} / {max_participants} participants
                </span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0">
          <div className="w-full text-center text-sm text-primary font-medium group-hover:underline">
            Voir les détails →
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}



