import { getPublicRandonneeBySlug } from "@/app/actions/randonnees";
import { notFound } from "next/navigation";
import { InscriptionForm } from "@/components/randonnees/inscription-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Euro, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface InscriptionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: InscriptionPageProps) {
  const { slug } = await params;
  const { randonnee } = await getPublicRandonneeBySlug(slug);

  if (!randonnee) {
    return {
      title: "Randonnée non trouvée - Les Mornes Denisien",
    };
  }

  return {
    title: `Inscription - ${randonnee.name} - Les Mornes Denisien`,
    description: `Inscrivez-vous à la randonnée ${randonnee.name}`,
  };
}

export default async function InscriptionPage({ params }: InscriptionPageProps) {
  const { slug } = await params;
  const { randonnee } = await getPublicRandonneeBySlug(slug);

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

  const formatPrice = (cents: number | null | undefined) => {
    if (!cents) return "0,00 €";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(cents / 100);
  };

  const now = new Date();
  const regStartDate = new Date(randonnee.reg_start_at);
  const regEndDate = new Date(randonnee.reg_end_at);
  const eventDate = new Date(randonnee.start_at);

  const inscriptionsOuvertes = now >= regStartDate && now <= regEndDate;
  const inscriptionsFermees = now > regEndDate;
  const evenementPasse = now > eventDate;

  const placesRestantes = randonnee.max_participants
    ? randonnee.max_participants - (randonnee.inscriptions_count || 0)
    : null;
  const complet = placesRestantes !== null && placesRestantes <= 0;

  // Vérifier si l'inscription est possible
  const canRegister = inscriptionsOuvertes && !complet && !evenementPasse;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Bouton retour */}
        <Link href={`/randonnees/${slug}`}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la randonnée
          </Button>
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">Inscription</h1>
            <p className="text-xl text-muted-foreground">{randonnee.name}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulaire d'inscription */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Vos informations</CardTitle>
                </CardHeader>
                <CardContent>
                  {!canRegister ? (
                    <div className="space-y-4">
                      {evenementPasse && (
                        <div className="bg-muted p-4 rounded-lg flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Événement terminé</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Cet événement est terminé. Consultez nos autres
                              randonnées disponibles.
                            </p>
                          </div>
                        </div>
                      )}

                      {!evenementPasse && inscriptionsFermees && (
                        <div className="bg-muted p-4 rounded-lg flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Inscriptions fermées</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Les inscriptions sont fermées pour cette
                              randonnée.
                            </p>
                          </div>
                        </div>
                      )}

                      {!evenementPasse && complet && inscriptionsOuvertes && (
                        <div className="bg-red-50 p-4 rounded-lg flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-900">
                              Randonnée complète
                            </p>
                            <p className="text-sm text-red-800 mt-1">
                              Cette randonnée est complète. Il n'y a plus de
                              places disponibles.
                            </p>
                          </div>
                        </div>
                      )}

                      {!evenementPasse &&
                        !inscriptionsOuvertes &&
                        !inscriptionsFermees && (
                          <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-blue-900">
                                Inscriptions pas encore ouvertes
                              </p>
                              <p className="text-sm text-blue-800 mt-1">
                                Les inscriptions ouvriront le{" "}
                                {formatDateTime(randonnee.reg_start_at)}.
                              </p>
                            </div>
                          </div>
                        )}

                      <Link href={`/randonnees/${slug}`}>
                        <Button variant="outline" className="w-full">
                          Retour aux détails de la randonnée
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <InscriptionForm
                      randoId={randonnee.id}
                      randoSlug={randonnee.slug}
                      randoName={randonnee.name}
                      isFree={randonnee.is_free}
                      priceCents={randonnee.price_cents}
                    />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Résumé de la randonnée */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Résumé</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">{randonnee.name}</h3>
                    <div className="flex flex-wrap gap-2">
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
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Date</div>
                        <div className="text-muted-foreground capitalize">
                          {formatDateTime(randonnee.start_at)}
                        </div>
                      </div>
                    </div>

                    {randonnee.meeting_point && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium">Rendez-vous</div>
                          <div className="text-muted-foreground">
                            {randonnee.meeting_point}
                          </div>
                        </div>
                      </div>
                    )}

                    {!randonnee.is_free && (
                      <div className="flex items-start gap-2">
                        <Euro className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium">Tarif</div>
                          <div className="text-muted-foreground">
                            {formatPrice(randonnee.price_cents)} par personne
                          </div>
                        </div>
                      </div>
                    )}

                    {placesRestantes !== null && (
                      <div className="pt-3 border-t">
                        <div className="font-medium mb-1">Places restantes</div>
                        <div
                          className={`text-lg font-bold ${
                            placesRestantes <= 5
                              ? "text-orange-600"
                              : "text-green-600"
                          }`}
                        >
                          {placesRestantes} / {randonnee.max_participants}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

