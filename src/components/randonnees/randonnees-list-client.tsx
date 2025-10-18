"use client";

import { useState, useMemo } from "react";
import { RandonneeCard } from "./randonnee-card";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface Randonnee {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  start_at: string;
  end_at: string;
  reg_start_at: string;
  reg_end_at: string;
  flyer_url?: string | null;
  is_free: boolean;
  price_cents?: number | null;
  currency: string;
  meeting_point?: string | null;
  max_participants?: number | null;
  inscriptions_count?: number;
  created_at: string;
  updated_at: string;
}

interface RandonneesListClientProps {
  randonnees: Randonnee[];
}

export function RandonneesListClient({
  randonnees,
}: RandonneesListClientProps) {
  const [filter, setFilter] = useState<"all" | "free" | "paid">("all");

  // Filtrer les randonnées selon le filtre sélectionné
  const filteredRandonnees = useMemo(() => {
    if (filter === "free") {
      return randonnees.filter((r) => r.is_free);
    }
    if (filter === "paid") {
      return randonnees.filter((r) => !r.is_free);
    }
    return randonnees;
  }, [randonnees, filter]);

  // Grouper les randonnées par mois
  const randonneesParMois = useMemo(() => {
    const grouped = new Map<string, Randonnee[]>();

    filteredRandonnees.forEach((randonnee) => {
      const date = new Date(randonnee.start_at);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthLabel = new Intl.DateTimeFormat("fr-FR", {
        year: "numeric",
        month: "long",
      }).format(date);

      if (!grouped.has(monthKey)) {
        grouped.set(monthKey, []);
      }
      grouped.get(monthKey)?.push(randonnee);
    });

    // Convertir en tableau et trier par date
    return Array.from(grouped.entries())
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, randonnees]) => ({
        monthKey: key,
        monthLabel: randonnees[0]
          ? new Intl.DateTimeFormat("fr-FR", {
              year: "numeric",
              month: "long",
            }).format(new Date(randonnees[0].start_at))
          : "",
        randonnees: randonnees.sort(
          (a, b) =>
            new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
        ),
      }));
  }, [filteredRandonnees]);

  return (
    <div>
      {/* Filtres */}
      <div className="mb-8 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filtrer par :</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
          >
            Toutes
          </Button>
          <Button
            variant={filter === "free" ? "default" : "outline"}
            onClick={() => setFilter("free")}
            size="sm"
            className={
              filter === "free" ? "bg-green-600 hover:bg-green-700" : ""
            }
          >
            Gratuites
          </Button>
          <Button
            variant={filter === "paid" ? "default" : "outline"}
            onClick={() => setFilter("paid")}
            size="sm"
            className={
              filter === "paid" ? "bg-orange-600 hover:bg-orange-700" : ""
            }
          >
            Payantes
          </Button>
        </div>
      </div>

      {/* Message si aucune randonnée */}
      {randonneesParMois.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            Aucune randonnée disponible pour le moment.
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            Revenez bientôt pour découvrir nos prochaines sorties !
          </p>
        </div>
      )}

      {/* Liste groupée par mois */}
      {randonneesParMois.map(({ monthKey, monthLabel, randonnees }) => (
        <div key={monthKey} className="mb-12">
          {/* Titre du mois */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold capitalize text-primary border-b-2 border-primary pb-2 inline-block">
              {monthLabel}
            </h2>
          </div>

          {/* Grid des randonnées */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {randonnees.map((randonnee) => (
              <RandonneeCard key={randonnee.id} {...randonnee} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

