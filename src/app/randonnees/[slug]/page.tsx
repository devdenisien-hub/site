import { getPublicRandonneeBySlug, getPublicInscriptionsBySlug } from "@/app/actions/randonnees";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Euro,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { InscritsList } from "@/components/randonnees/inscrits-list";

interface RandonneeDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: RandonneeDetailPageProps) {
  const { slug } = await params;
  const { randonnee } = await getPublicRandonneeBySlug(slug);

  if (!randonnee) {
    return {
      title: "Randonnée non trouvée - Les Mornes Denisien",
    };
  }

  return {
    title: `${randonnee.name} - Les Mornes Denisien`,
    description: randonnee.description || `Détails de la randonnée ${randonnee.name}`,
  };
}

export default async function RandonneeDetailPage({
  params,
}: RandonneeDetailPageProps) {
  const { slug } = await params;
  const { randonnee } = await getPublicRandonneeBySlug(slug);
  const { inscriptions } = await getPublicInscriptionsBySlug(slug);

  if (!randonnee) {
    notFound();
  }

  const formatDateTime = (dateString: string) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
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

  const placesRestantes = randonnee.max_participants
    ? randonnee.max_participants - (randonnee.inscriptions_count || 0)
    : null;

  const now = new Date();
  const regStartDate = new Date(randonnee.reg_start_at);
  const regEndDate = new Date(randonnee.reg_end_at);
  const eventDate = new Date(randonnee.start_at);

  const inscriptionsOuvertes = now >= regStartDate && now <= regEndDate;
  const inscriptionsFermees = now > regEndDate;
  const evenementPasse = now > eventDate;
  const complet =
    placesRestantes !== null && placesRestantes <= 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Bouton retour */}
        <Link href="/randonnees">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux randonnées
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image/Flyer */}
            {randonnee.flyer_url && (
              <div className="relative h-96 w-full rounded-lg overflow-hidden">
                <Image
                  src={randonnee.flyer_url}
                  alt={randonnee.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Titre et badges */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge
                  variant={randonnee.is_free ? "default" : "secondary"}
                  className={
                    randonnee.is_free
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-orange-600 hover:bg-orange-700"
                  }
                >
                  {randonnee.is_free
                    ? "GRATUIT"
                    : formatPrice(randonnee.price_cents)}
                </Badge>
                {evenementPasse && (
                  <Badge variant="outline">Événement passé</Badge>
                )}
                {complet && !evenementPasse && (
                  <Badge variant="destructive">Complet</Badge>
                )}
                {placesRestantes !== null &&
                  placesRestantes > 0 &&
                  placesRestantes <= 10 &&
                  !evenementPasse && (
                    <Badge variant="destructive">
                      Plus que {placesRestantes} places
                    </Badge>
                  )}
              </div>
              <h1 className="text-4xl font-bold mb-4">{randonnee.name}</h1>
            </div>

            {/* Description */}
            {randonnee.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {randonnee.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Informations pratiques */}
            <Card>
              <CardHeader>
                <CardTitle>Informations pratiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">Date de l'événement</div>
                    <div className="text-muted-foreground capitalize">
                      {formatDateTime(randonnee.start_at)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">Durée estimée</div>
                    <div className="text-muted-foreground">
                      De {formatTime(randonnee.start_at)} à{" "}
                      {formatTime(randonnee.end_at)}
                    </div>
                  </div>
                </div>

                {randonnee.meeting_point && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium">Point de rendez-vous</div>
                      <div className="text-muted-foreground">
                        {randonnee.meeting_point}
                      </div>
                    </div>
                  </div>
                )}

                {randonnee.max_participants && (
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium">Participants</div>
                      <div className="text-muted-foreground">
                        {randonnee.inscriptions_count || 0} /{" "}
                        {randonnee.max_participants} inscrits
                        {placesRestantes !== null && placesRestantes > 0 && (
                          <span className="text-green-600 ml-2">
                            ({placesRestantes}{" "}
                            {placesRestantes > 1 ? "places restantes" : "place restante"})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {!randonnee.is_free && (
                  <div className="flex items-start gap-3">
                    <Euro className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium">Tarif</div>
                      <div className="text-muted-foreground">
                        {formatPrice(randonnee.price_cents)} par personne
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Liste des participants */}
            <InscritsList inscriptions={inscriptions || []} />
          </div>

          {/* Colonne latérale - Inscription */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Inscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">
                      Ouverture des inscriptions :
                    </span>
                    <div className="font-medium">
                      {formatDate(randonnee.reg_start_at)}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Clôture des inscriptions :
                    </span>
                    <div className="font-medium">
                      {formatDate(randonnee.reg_end_at)}
                    </div>
                  </div>
                </div>

                {evenementPasse && (
                  <div className="bg-muted p-4 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      Cet événement est terminé. Consultez nos autres randonnées
                      disponibles.
                    </p>
                  </div>
                )}

                {!evenementPasse && inscriptionsFermees && (
                  <div className="bg-muted p-4 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      Les inscriptions sont fermées pour cette randonnée.
                    </p>
                  </div>
                )}

                {!evenementPasse && !inscriptionsOuvertes && !inscriptionsFermees && (
                  <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-900">
                      Les inscriptions ouvriront le{" "}
                      {formatDate(randonnee.reg_start_at)}.
                    </p>
                  </div>
                )}

                {!evenementPasse && complet && inscriptionsOuvertes && (
                  <div className="bg-red-50 p-4 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-900">
                      Cette randonnée est complète. Les inscriptions ne sont plus
                      possibles.
                    </p>
                  </div>
                )}

                {!evenementPasse &&
                  inscriptionsOuvertes &&
                  !complet && (
                    <>
                      <Link href={`/randonnees/${randonnee.slug}/inscription`} className="w-full">
                        <Button className="w-full" size="lg">
                          S'inscrire maintenant
                        </Button>
                      </Link>
                      {placesRestantes !== null && placesRestantes <= 10 && (
                        <p className="text-sm text-center text-orange-600 font-medium">
                          Attention : plus que {placesRestantes} place
                          {placesRestantes > 1 ? "s" : ""} !
                        </p>
                      )}
                    </>
                  )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

