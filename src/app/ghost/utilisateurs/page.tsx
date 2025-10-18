import { getCurrentUser } from "@/app/actions/auth";
import { getAllUsers } from "@/app/actions/users";
import { redirect } from "next/navigation";
import CreateUserForm from "@/components/admin/create-user-form";
import UsersList from "@/components/admin/users-list";

export default async function UtilisateursPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/ghost/login");
  }

  const { users } = await getAllUsers();

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground">
            Créez et gérez les comptes administrateurs
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire de création */}
          <div className="lg:col-span-1">
            <CreateUserForm />
          </div>

          {/* Liste des utilisateurs */}
          <div className="lg:col-span-2">
            <UsersList users={users} currentUserId={user.id} />
          </div>
        </div>

        {/* Information importante */}
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            ⚠️ Note importante sur la création d'utilisateurs
          </h3>
          <p className="text-yellow-800 dark:text-yellow-200 mb-4">
            Pour que la création d'utilisateurs fonctionne correctement, vous devez utiliser
            la <strong>Service Role Key</strong> de Supabase dans votre client serveur.
          </p>
          <div className="bg-yellow-100 dark:bg-yellow-900 rounded p-4 text-sm">
            <p className="text-yellow-800 dark:text-yellow-200 mb-2">
              <strong>Solution temporaire :</strong> Créez les utilisateurs manuellement via le
              Dashboard Supabase :
            </p>
            <ol className="list-decimal list-inside space-y-1 text-yellow-800 dark:text-yellow-200 ml-4">
              <li>Allez dans <strong>Authentication</strong> {'>'} <strong>Users</strong></li>
              <li>Cliquez sur <strong>Add user</strong></li>
              <li>Créez l'utilisateur</li>
              <li>
                Ensuite, exécutez dans SQL Editor :<br />
                <code className="bg-yellow-200 dark:bg-yellow-950 px-2 py-1 rounded mt-1 inline-block">
                  UPDATE profiles SET role = 'admin' WHERE email = 'email@exemple.com';
                </code>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}


