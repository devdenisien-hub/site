import { getCurrentUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function MessagesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/ghost/login");
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Messages de Contact</h1>
          <p className="text-muted-foreground">
            Consultez les messages envoyés via le formulaire de contact
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>📧 Fonctionnalité à venir</CardTitle>
            <CardDescription>
              Cette section sera disponible prochainement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚧</div>
              <p className="text-lg font-medium mb-2">Bientôt disponible</p>
              <p className="text-muted-foreground mb-6">
                L'interface de gestion des messages de contact sera accessible ici une fois configurée.
              </p>
              
              <div className="bg-muted p-6 rounded-lg text-left max-w-2xl mx-auto">
                <h3 className="font-semibold mb-3">Configuration requise :</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>
                    Créer la table <code className="bg-background px-2 py-1 rounded">messages_contact</code> dans Supabase
                  </li>
                  <li>
                    Connecter le formulaire de contact (<code className="bg-background px-2 py-1 rounded">/contact</code>) à Supabase
                  </li>
                  <li>
                    Configurer Resend pour l'envoi d'emails (optionnel)
                  </li>
                </ol>
                
                <div className="mt-4 p-4 bg-background rounded border">
                  <p className="text-xs font-mono text-muted-foreground">
                    Consultez : INTEGRATION_RESEND.md et EXEMPLE_SUPABASE_CONTACT.md
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


