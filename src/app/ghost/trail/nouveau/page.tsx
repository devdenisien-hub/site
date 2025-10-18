import { createTrail } from "@/app/actions/trails";
import { TrailCreateForm } from "@/components/trail/trail-create-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateTrailPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/ghost/trail">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Nouveau Trail</h1>
          <p className="text-muted-foreground">
            Créez un nouvel événement de trail
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du trail</CardTitle>
          <CardDescription>
            Remplissez les informations de base pour votre événement de trail
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TrailCreateForm />
        </CardContent>
      </Card>
    </div>
  );
}




