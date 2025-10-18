import { getPublicRandonnees } from "@/app/actions/randonnees";
import { RandonneesListClient } from "@/components/randonnees/randonnees-list-client";

export const metadata = {
  title: "Randonnées - Les Mornes Denisien",
  description: "Découvrez toutes nos randonnées en Martinique",
};

export default async function RandonneesPage() {
  const { randonnees } = await getPublicRandonnees();


  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="text-white py-20" style={{ backgroundColor: '#888973' }}>
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-5xl font-bold mb-6">Nos Randonnées</h1>
          <p className="text-xl opacity-90 max-w-3xl">
            Découvrez nos prochaines randonnées à travers les plus beaux sites de la Martinique. 
            Rejoignez-nous pour explorer l'île aux fleurs !
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Liste des randonnées avec filtres (client component) */}
        <RandonneesListClient randonnees={randonnees} />
      </div>
    </div>
  );
}



