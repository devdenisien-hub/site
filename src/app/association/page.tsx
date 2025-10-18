import Link from "next/link";
import NextImage from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function AssociationPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="text-white py-20" style={{ backgroundColor: '#888973' }}>
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-5xl font-bold mb-6">L'Association</h1>
          <p className="text-xl opacity-90 max-w-3xl">
            Les Mornes Denisien : Une communauté de randonneurs passionnés par la découverte des magnifiques paysages de la Martinique
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* About Section */}
        <section className="mb-16">
          <div className="flex items-center gap-8 mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Qui sommes-nous ?</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-bold text-primary">16</span>
                <span className="text-xl text-muted-foreground">ans de vie associative</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Colonne gauche - Texte */}
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Les Mornes Denisien est une communauté de randonneurs passionnés par la découverte des 
                magnifiques paysages de la Martinique. Notre association a été créée pour offrir à ses 
                membres l'opportunité de partir à la découverte des sentiers de l'île et de partager 
                leur amour pour la nature.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Nous organisons régulièrement des sorties à Fond Saint-Denis mais aussi sur tout le 
                territoire de la Martinique, avec des niveaux de difficulté adaptés à tous les types 
                de randonneurs, qu'ils soient débutants ou confirmés. Sur ce site, vous trouverez toutes 
                les informations utiles pour nous rejoindre et découvrir les beautés de notre île en 
                notre compagnie.
              </p>
            </div>

            {/* Colonne droite - Photo du président */}
            <div className="flex flex-col items-center">
              <div className="relative w-80 h-80 rounded-lg overflow-hidden shadow-lg">
                <NextImage
                  src="/Albert-Delbe.jpeg"
                  alt="Albert Delbé - Président fondateur"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-xl font-semibold mb-2">Albert Delbé</h3>
                <p className="text-muted-foreground">Président fondateur</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Créateur de l'association Les Mornes Denisien
                </p>
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Objective */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Notre Objectif</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Colonne gauche - Image */}
            <div className="order-2 lg:order-1">
              <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
                <NextImage
                  src="/morne-denisien-randonnee.jpeg"
                  alt="Randonnée aux Mornes Denisien"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Colonne droite - Texte */}
            <div className="order-1 lg:order-2">
              <Card className="bg-accent h-full">
                <CardContent className="pt-6">
                  <p className="text-lg leading-relaxed">
                    La découverte des plus beaux circuits de Fonds Saint-Denis et de l'île aux fleurs, 
                    la Martinique. Notre objectif est de vous faire voyager à travers les paysages variés 
                    et magnifiques de notre région et de l'île, en vous proposant des circuits adaptés à 
                    tous les niveaux et à toutes les envies. Que vous soyez amateur de randonnée, de balade 
                    en nature ou simplement en quête de nouveaux horizons, notre équipe est là pour vous 
                    guider et vous faire découvrir les trésors cachés de notre belle Martinique. Venez avec 
                    nous explorer notre île aux mille couleurs et saveurs !
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Nos Valeurs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-3xl">🤝</span>
                  Respect
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Respect de la nature, des sentiers, et de chaque membre du groupe. Nous valorisons 
                  l'harmonie entre les randonneurs et l'environnement exceptionnel de la Martinique.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-3xl">🤗</span>
                  Solidarité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  L'entraide et le soutien mutuel sont au cœur de nos randonnées. Personne ne reste 
                  derrière, nous avançons ensemble au rythme du groupe.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-3xl">☀️</span>
                  Convivialité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Partager des moments de joie et créer des liens amicaux autour de notre passion 
                  commune pour la randonnée et la découverte de notre île.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-3xl">💪</span>
                  Esprit Sportif
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Cultiver le dépassement de soi dans la bonne humeur, tout en respectant les capacités 
                  de chacun avec des parcours adaptés à tous les niveaux.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Activities */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Nos Activités</h2>
          <div className="space-y-6">
            <Card className="shadow-none border-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:order-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">🥾</span>
                      Randonnées Régulières
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Sorties hebdomadaires et mensuelles à Fond Saint-Denis et sur tout le territoire 
                      de la Martinique, avec des parcours variés pour tous les niveaux.
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                      <li>Randonnées débutants : sentiers accessibles et découverte en douceur</li>
                      <li>Niveau intermédiaire : parcours sportifs avec dénivelés modérés</li>
                      <li>Randonnées confirmées : circuits techniques et exigeants</li>
                      <li>Sorties thématiques : faune, flore, patrimoine local</li>
                    </ul>
                  </CardContent>
                </div>
                <div className="lg:order-1">
                  <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg">
                    <NextImage
                      src="/Randonnes-Regulieres.jpeg"
                      alt="Randonnées régulières"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="shadow-none border-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:order-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">🌴</span>
                      Découverte de la Martinique
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Exploration des paysages variés de l'île aux fleurs : mornes, forêts tropicales, 
                      littoral, cascades et sites naturels exceptionnels.
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                      <li>Les mornes de Fond Saint-Denis</li>
                      <li>La Montagne Pelée et le Piton Lacroix</li>
                      <li>Les Gorges de la Falaise et la Trace des Jésuites</li>
                      <li>Les presqu'îles de la Caravelle et de la Presqu'île</li>
                    </ul>
                  </CardContent>
                </div>
                <div className="lg:order-2">
                  <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg">
                    <NextImage
                      src="/DecouverteMartinique.jpeg"
                      alt="Découverte de la Martinique"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="shadow-none border-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:order-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">🌱</span>
                      Écotourisme
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Actions de préservation de notre patrimoine naturel et sensibilisation aux 
                      bonnes pratiques de randonnée responsable.
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                      <li>Respect de la faune et de la flore locale</li>
                      <li>Nettoyage des sentiers et espaces naturels</li>
                      <li>Découverte de la biodiversité martiniquaise</li>
                      <li>Promotion de l'écotourisme</li>
                    </ul>
                  </CardContent>
                </div>
                <div className="lg:order-1">
                  <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg">
                    <NextImage
                      src="/ecotourisme.jpg"
                      alt="Écotourisme"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="shadow-none border-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:order-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">🎉</span>
                      Moments Conviviaux
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Au-delà de la randonnée, nous cultivons l'esprit de convivialité qui fait 
                      la richesse de notre association.
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                      <li>Pique-niques et repas partagés en nature</li>
                      <li>Assemblée générale et moments festifs</li>
                      <li>Échanges et partages d'expériences</li>
                      <li>Découverte de la gastronomie locale</li>
                    </ul>
                  </CardContent>
                </div>
                <div className="lg:order-2">
                  <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg">
                    <NextImage
                      src="/Moments-Conviviaux.jpg"
                      alt="Moments conviviaux"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Join Us */}
        <section className="mb-16">
          <Card className="bg-muted">
            <CardHeader>
              <CardTitle className="text-2xl">Rejoignez l'aventure !</CardTitle>
              <CardDescription>
                Envie de découvrir la Martinique autrement ?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Que vous soyez débutant ou randonneur confirmé, Les Mornes Denisien vous accueille 
                chaleureusement ! Venez partager notre passion pour les sentiers martiniquais et 
                profiter de nos sorties en groupe dans une ambiance conviviale et respectueuse de 
                la nature. L'adhésion à l'association vous donne accès à toutes nos randonnées et 
                activités tout au long de l'année.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/adhesion">
                  <Button size="lg">
                    Adhérer à l'association
                  </Button>
                </Link>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/randonnees">
                    Voir le calendrier des sorties
                  </Link>
                </Button>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    Nous contacter
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

