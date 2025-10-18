"use client";

import { useState } from "react";
import { updateUserRole, deleteUser } from "@/app/actions/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface User {
  id: string;
  email: string;
  nom: string | null;
  prenom: string | null;
  role: string;
  created_at: string;
}

interface UsersListProps {
  users: User[];
  currentUserId: string;
}

export default function UsersList({ users, currentUserId }: UsersListProps) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setIsUpdating(userId);
    setMessage(null);

    const result = await updateUserRole(userId, newRole);

    if (result.success) {
      setMessage({ type: "success", text: "Rôle mis à jour avec succès" });
    } else {
      setMessage({ type: "error", text: result.error || "Erreur lors de la mise à jour" });
    }

    setIsUpdating(null);
    
    // Masquer le message après 3 secondes
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (userId: string) => {
    setIsUpdating(userId);
    setMessage(null);

    const result = await deleteUser(userId);

    if (result.success) {
      setMessage({ type: "success", text: "Utilisateur supprimé avec succès" });
    } else {
      setMessage({ type: "error", text: result.error || "Erreur lors de la suppression" });
    }

    setIsUpdating(null);

    // Masquer le message après 3 secondes
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des utilisateurs ({users.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {message && (
          <div
            className={`px-4 py-3 rounded mb-4 ${
              message.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          {users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun utilisateur trouvé
            </div>
          ) : (
            users.map((user) => (
              <Card key={user.id} className="border">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">
                          {user.prenom && user.nom
                            ? `${user.prenom} ${user.nom}`
                            : user.email}
                        </h3>
                        {user.id === currentUserId && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            Vous
                          </span>
                        )}
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            user.role === "admin"
                              ? "bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {user.role === "admin" ? "Administrateur" : "Membre"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Créé le {new Date(user.created_at).toLocaleDateString("fr-FR")}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Select
                        value={user.role}
                        onValueChange={(value) => handleRoleChange(user.id, value)}
                        disabled={
                          isUpdating === user.id || user.id === currentUserId
                        }
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrateur</SelectItem>
                          <SelectItem value="membre">Membre</SelectItem>
                        </SelectContent>
                      </Select>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={
                              isUpdating === user.id || user.id === currentUserId
                            }
                          >
                            Supprimer
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action est irréversible. L'utilisateur{" "}
                              <strong>{user.email}</strong> sera définitivement supprimé.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(user.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}



