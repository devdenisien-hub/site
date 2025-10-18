import { getCurrentUser } from "@/app/actions/auth";
import { getAllRandonnees } from "@/app/actions/randonnees";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateRandonneeForm } from "@/components/randonnees/create-randonnee-form";

export default async function RandonneesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/ghost/login");
  }

  const { randonnees } = await getAllRandonnees();

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Randonnées</h1>
            <p className="text-muted-foreground">
              Gérez les événements et les inscriptions
            </p>
          </div>
          <CreateRandonneeForm />
        </div>
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Total Randonnées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{randonnees.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                À venir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {randonnees.filter(r => new Date(r.start_at) > new Date()).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Total Inscrits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {randonnees.reduce((acc, r) => acc + (r.inscriptions_count || 0), 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des randonnées */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Randonnées</CardTitle>
            <CardDescription>
              Cliquez sur une randonnée pour voir les inscriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {randonnees.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg mb-2">Aucune randonnée trouvée</p>
                <p className="text-sm">
                  Les randonnées créées via HelloAsso apparaîtront ici
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {randonnees.map((randonnee) => {
                  const isUpcoming = new Date(randonnee.start_at) > new Date();
                  const isPast = new Date(randonnee.end_at) < new Date();
                  const isOngoing = !isUpcoming && !isPast;
                  const regOpen = new Date(randonnee.reg_start_at) <= new Date() &&
                    new Date(randonnee.reg_end_at) >= new Date();

                  return (
                    <Link key={randonnee.id} href={`/ghost/randonnees/${randonnee.id}`}>
                      <Card className="hover:bg-accent transition-colors cursor-pointer">
                        <CardContent className="pt-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold">
                                  {randonnee.name}
                                </h3>
                                <div className="flex gap-2">
                                  {isUpcoming && (
                                    <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                      À venir
                                    </span>
                                  )}
                                  {isOngoing && (
                                    <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                                      En cours
                                    </span>
                                  )}
                                  {isPast && (
                                    <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
                                      Terminée
                                    </span>
                                  )}
                                  {regOpen && (
                                    <span className="text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                                      Inscriptions ouvertes
                                    </span>
                                  )}
                                  {!randonnee.is_free && (
                                    <span className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                                      Payante
                                    </span>
                                  )}
                                </div>
                              </div>

                              {randonnee.description && (
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                  {randonnee.description}
                                </p>
                              )}

                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Date :</span>{" "}
                                  {new Date(randonnee.start_at).toLocaleDateString("fr-FR", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Horaire :</span>{" "}
                                  {new Date(randonnee.start_at).toLocaleTimeString("fr-FR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Inscriptions :</span>{" "}
                                  {new Date(randonnee.reg_start_at).toLocaleDateString("fr-FR")}
                                  {" → "}
                                  {new Date(randonnee.reg_end_at).toLocaleDateString("fr-FR")}
                                </div>
                                {!randonnee.is_free && randonnee.price_cents && (
                                  <div>
                                    <span className="text-muted-foreground">Prix :</span>{" "}
                                    {(randonnee.price_cents / 100).toFixed(2)} {randonnee.currency}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              <div className="text-center">
                                <div className="text-3xl font-bold text-primary">
                                  {randonnee.inscriptions_count || 0}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {randonnee.inscriptions_count === 0 || randonnee.inscriptions_count > 1
                                    ? "inscrits"
                                    : "inscrit"}
                                </div>
                              </div>
                              <Button size="sm" variant="outline">
                                Voir les inscrits →
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

