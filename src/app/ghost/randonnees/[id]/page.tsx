import { getCurrentUser } from "@/app/actions/auth";
import { getRandonneeById } from "@/app/actions/randonnees";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ExportCSVButton from "@/components/randonnees/export-csv-button";
import InscriptionsList from "@/components/randonnees/inscriptions-list";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RandonneeDetailPage({ params }: PageProps) {
  const user = await getCurrentUser();
  const resolvedParams = await params;

  if (!user) {
    redirect("/ghost/login");
  }

  const { randonnee, error } = await getRandonneeById(resolvedParams.id);

  if (error || !randonnee) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <Button variant="outline" asChild>
              <Link href="/ghost/randonnees">← Retour aux randonnées</Link>
            </Button>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Randonnée non trouvée
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const inscriptions = randonnee.inscriptions || [];
  const isUpcoming = new Date(randonnee.start_at) > new Date();
  const isPast = new Date(randonnee.end_at) < new Date();
  const regOpen =
    new Date(randonnee.reg_start_at) <= new Date() &&
    new Date(randonnee.reg_end_at) >= new Date();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button variant="outline" asChild>
            <Link href="/ghost/randonnees">← Retour aux randonnées</Link>
          </Button>
          {inscriptions.length > 0 && (
            <ExportCSVButton randonneeId={randonnee.id} />
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Informations de la randonnée */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{randonnee.name}</CardTitle>
                <CardDescription className="text-base">
                  {randonnee.slug}
                </CardDescription>
              </div>
              <div className="flex gap-2 flex-wrap">
                {isUpcoming && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-3 py-1 rounded">
                    À venir
                  </span>
                )}
                {isPast && (
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1 rounded">
                    Terminée
                  </span>
                )}
                {regOpen && (
                  <span className="text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200 px-3 py-1 rounded">
                    Inscriptions ouvertes
                  </span>
                )}
                {randonnee.is_free ? (
                  <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 px-3 py-1 rounded">
                    Gratuite
                  </span>
                ) : (
                  <span className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded">
                    Payante
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {randonnee.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {randonnee.description}
                </p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">📅 Dates de la randonnée</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Début :</span>{" "}
                    {new Date(randonnee.start_at).toLocaleString("fr-FR", {
                      dateStyle: "full",
                      timeStyle: "short",
                    })}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fin :</span>{" "}
                    {new Date(randonnee.end_at).toLocaleString("fr-FR", {
                      dateStyle: "full",
                      timeStyle: "short",
                    })}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">✍️ Période d'inscription</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Ouverture :</span>{" "}
                    {new Date(randonnee.reg_start_at).toLocaleString("fr-FR", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fermeture :</span>{" "}
                    {new Date(randonnee.reg_end_at).toLocaleString("fr-FR", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </div>
                </div>
              </div>
            </div>

            {!randonnee.is_free && randonnee.price_cents && (
              <div>
                <h3 className="font-semibold mb-2">💰 Tarif</h3>
                <p className="text-2xl font-bold text-primary">
                  {(randonnee.price_cents / 100).toFixed(2)} {randonnee.currency}
                </p>
              </div>
            )}

            {randonnee.flyer_url && (
              <div>
                <h3 className="font-semibold mb-2">📄 Flyer</h3>
                <a
                  href={randonnee.flyer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Voir le flyer →
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Total Inscrits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{inscriptions.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Payé</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {inscriptions.filter((i) => i.payment_status === "paid").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {inscriptions.filter((i) => i.payment_status === "pending").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Gratuit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {inscriptions.filter((i) => i.payment_status === "not_required").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des inscrits */}
        <InscriptionsList inscriptions={inscriptions} />
      </main>
    </div>
  );
}


