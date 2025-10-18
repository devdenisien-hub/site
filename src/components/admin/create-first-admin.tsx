"use client";

import { useState } from "react";
import { createFirstAdmin } from "@/app/actions/first-admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateFirstAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isHidden, setIsHidden] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    const result = await createFirstAdmin(formData);

    if (result.success) {
      setMessage({ 
        type: "success", 
        text: "✅ Admin créé avec succès ! Vous pouvez maintenant vous connecter sur /ghost/login" 
      });
      (e.target as HTMLFormElement).reset();
      
      // Cacher le composant après 5 secondes
      setTimeout(() => {
        setIsHidden(true);
      }, 5000);
    } else {
      setMessage({ type: "error", text: result.error || "Erreur lors de la création" });
    }

    setIsLoading(false);
  };

  if (isHidden) {
    return null;
  }

  return (
    <Card className="w-full max-w-2xl border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
          ⚠️ Configuration Initiale - Créer un Admin
        </CardTitle>
        <CardDescription className="text-yellow-700 dark:text-yellow-300">
          Ce formulaire est visible publiquement. <strong>À RETIRER une fois votre admin créé !</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom (optionnel)</Label>
              <Input
                id="prenom"
                name="prenom"
                placeholder="Jean"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nom">Nom (optionnel)</Label>
              <Input
                id="nom"
                name="nom"
                placeholder="Dupont"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@lesmornesdenisien.fr"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe *</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Minimum 6 caractères. Ce sera un compte administrateur.
            </p>
          </div>

          {message && (
            <div
              className={`px-4 py-3 rounded ${
                message.type === "success"
                  ? "bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-800 dark:text-green-200"
                  : "bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200"
              }`}
            >
              {message.text}
              {message.type === "success" && (
                <div className="mt-3">
                  <a
                    href="/ghost/login"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium"
                  >
                    → Se connecter maintenant
                  </a>
                </div>
              )}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Création en cours..." : "🔐 Créer mon compte admin"}
          </Button>

          <div className="bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-700 rounded p-4 text-sm">
            <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
              ⚠️ IMPORTANT - Sécurité
            </p>
            <p className="text-red-700 dark:text-red-300">
              Une fois votre admin créé, <strong>supprimez ce composant</strong> de la page d'accueil !
              <br />
              Fichier à modifier : <code className="bg-red-100 dark:bg-red-900 px-1 py-0.5 rounded">src/app/page.tsx</code>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

