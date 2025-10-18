import { getNextUpcomingTrail } from "@/app/actions/trails";
import { TrailCallToAction } from "@/components/trail/trail-call-to-action";

export default async function HomePage() {
  const upcomingTrail = await getNextUpcomingTrail();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Les Mornes Denisien
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Association de randonnée et trail en Martinique
            </p>
            <p className="text-lg opacity-80 max-w-2xl mx-auto">
              Découvrez les plus beaux sentiers de la Martinique avec notre association. 
              Randonnées régulières, trails techniques et moments conviviaux vous attendent.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      {upcomingTrail && (
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Prochain Événement
            </h2>
            <p className="text-gray-600">
              Ne manquez pas notre prochain trail !
            </p>
          </div>
          
          <TrailCallToAction trail={upcomingTrail} />
        </div>
      )}

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nos Activités
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez notre programme d'activités variées pour tous les niveaux
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🥾</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Randonnées Régulières</h3>
              <p className="text-gray-600">
                Sorties hebdomadaires pour découvrir les sentiers de Martinique
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏃</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Trails Techniques</h3>
              <p className="text-gray-600">
                Courses exigeantes pour les coureurs expérimentés
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Moments Conviviaux</h3>
              <p className="text-gray-600">
                Partage et convivialité après chaque sortie
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Rejoignez-nous !
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Devenez membre de notre association et participez à toutes nos activités
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/adhesion" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Adhérer à l'association
            </a>
            <a 
              href="/contact" 
              className="border border-white hover:bg-white hover:text-gray-900 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}




