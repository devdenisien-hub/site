import { getCurrentUser } from "@/app/actions/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function GhostDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/ghost/login");
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Bienvenue, {user.email}</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">👥</span>
                Utilisateurs
              </CardTitle>
              <CardDescription>Gestion des comptes admin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">--</div>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/ghost/utilisateurs">Gérer les utilisateurs</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📧</span>
                Messages
              </CardTitle>
              <CardDescription>Formulaire de contact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">--</div>
              <Button variant="outline" className="w-full" disabled>
                Voir les messages
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🥾</span>
                Randonnées
              </CardTitle>
              <CardDescription>Gestion des événements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">--</div>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/ghost/randonnees">Gérer les randonnées</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sections principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
              <CardDescription>Raccourcis vers les fonctions principales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline" asChild>
                <Link href="/ghost/utilisateurs">👥 Gérer les utilisateurs</Link>
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/ghost/randonnees">🥾 Voir les randonnées</Link>
              </Button>
              <Button className="w-full" variant="outline" disabled>
                📝 Gérer les adhésions
              </Button>
              <Button className="w-full" variant="outline" disabled>
                📊 Voir les statistiques
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
              <CardDescription>Dernières actions sur le site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucune activité récente</p>
                <p className="text-sm mt-2">Les données s'afficheront ici une fois configurées</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Information importante */}
        <Card className="mt-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <CardHeader>
            <CardTitle className="text-yellow-800 dark:text-yellow-200">
              ⚠️ Configuration requise
            </CardTitle>
          </CardHeader>
          <CardContent className="text-yellow-800 dark:text-yellow-200">
            <p className="mb-4">
              Pour activer toutes les fonctionnalités du dashboard, assurez-vous que les tables
              nécessaires existent dans Supabase.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">profiles</code> - Profils utilisateurs avec rôles</li>
              <li><code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">messages_contact</code> - Messages du formulaire de contact</li>
              <li><code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">randonnees</code> - Événements et sorties</li>
              <li><code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">inscriptions</code> - Inscriptions aux randonnées</li>
            </ul>
            <p className="mt-4 text-sm">
              Consultez le fichier <code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">SUPABASE_TABLES.md</code> pour
              les scripts SQL de création des tables.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
