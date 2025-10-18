"use client";

import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdhesionPage() {
  useEffect(() => {
    // Gestionnaire pour le redimensionnement de l'iframe HelloAsso
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.height) {
        const haWidgetElement = document.getElementById('haWidget') as HTMLIFrameElement;
        if (haWidgetElement) {
          haWidgetElement.style.height = e.data.height + 'px';
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-5xl font-bold mb-6">Adhésion</h1>
          <p className="text-xl opacity-90 max-w-3xl">
            Rejoignez Les Mornes Denisien et participez à nos randonnées tout au long de l'année
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Introduction */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Pourquoi adhérer ?</CardTitle>
              <CardDescription className="text-base">
                Soutenez nos actions et participez à la vie de notre communauté
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg leading-relaxed">
                L'adhésion à notre association est une manière concrète de soutenir nos actions et 
                de participer à la vie de notre communauté. En devenant membre de notre association, 
                vous rejoignez une communauté engagée et dynamique qui œuvre pour la promotion du sport, 
                de la culture, de l'environnement et du développement local.
              </p>
              <p className="text-lg leading-relaxed">
                Découvrez les avantages de devenir membre et rejoignez-nous dans notre action pour 
                faire de notre commune et de notre île un lieu de vie toujours plus agréable et solidaire.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Avantages */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Les avantages de l'adhésion</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🥾</span>
                  Accès aux randonnées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Participez à toutes nos sorties hebdomadaires et mensuelles organisées à travers 
                  la Martinique, avec des niveaux adaptés à tous.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🎉</span>
                  Événements exclusifs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Accédez en priorité à nos événements spéciaux, assemblées générales et moments 
                  conviviaux organisés tout au long de l'année.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🤝</span>
                  Communauté engagée
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Rejoignez une famille de passionnés de randonnée et créez des liens durables 
                  avec des personnes partageant les mêmes valeurs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🌱</span>
                  Soutien aux actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Votre adhésion contribue directement au financement de nos actions pour la 
                  préservation de l'environnement et la promotion du sport.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Formulaire HelloAsso */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Formulaire d'adhésion</h2>
          <Card>
            <CardHeader>
              <CardTitle>Adhérer en ligne</CardTitle>
              <CardDescription>
                Remplissez le formulaire ci-dessous pour devenir membre de l'association
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full">
                <iframe 
                  id="haWidget" 
                  allowTransparency={true}
                  src="https://www.helloasso.com/associations/les-mornes-denisiens/adhesions/inscription/widget" 
                  style={{ 
                    width: '100%', 
                    height: '800px',
                    border: 'none',
                    minHeight: '800px'
                  }}
                  title="Formulaire d'adhésion HelloAsso"
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Informations complémentaires */}
        <section>
          <Card className="bg-muted">
            <CardHeader>
              <CardTitle>Besoin d'aide ?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Si vous rencontrez des difficultés pour remplir le formulaire d'adhésion ou si 
                vous avez des questions, n'hésitez pas à nous contacter :
              </p>
              <div className="space-y-2">
                <div>
                  <p className="font-semibold">Par téléphone :</p>
                  <a 
                    href="tel:0696388738" 
                    className="text-primary hover:underline"
                  >
                    0696.38.87.38
                  </a>
                </div>
                <div>
                  <p className="font-semibold">Par email :</p>
                  <a 
                    href="mailto:lesmornesdenisiens@gmail.com"
                    className="text-primary hover:underline"
                  >
                    lesmornesdenisiens@gmail.com
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}



