import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-5xl font-bold mb-6">Politique de Confidentialité</h1>
          <p className="text-xl opacity-90">
            Protection de vos données personnelles
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>
                L'association Les Mornes Denisien accorde une grande importance à la protection de 
                vos données personnelles. Cette politique de confidentialité vous informe de la 
                manière dont nous collectons, utilisons et protégeons vos données.
              </p>
              <p className="text-sm text-muted-foreground">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Données collectées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>Nous collectons les données suivantes :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone</li>
                <li>Informations fournies via le formulaire de contact</li>
                <li>Informations d'adhésion via HelloAsso</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Utilisation des données</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>Vos données personnelles sont utilisées pour :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Gérer votre adhésion à l'association</li>
                <li>Vous informer de nos activités et randonnées</li>
                <li>Répondre à vos demandes de contact</li>
                <li>Assurer la gestion administrative de l'association</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Base légale du traitement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>
                Le traitement de vos données personnelles repose sur les bases légales suivantes :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Votre consentement lors de l'adhésion ou du contact</li>
                <li>L'exécution du contrat d'adhésion</li>
                <li>Le respect de nos obligations légales</li>
                <li>Notre intérêt légitime à gérer l'association</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conservation des données</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Vos données personnelles sont conservées pendant la durée de votre adhésion à 
                l'association, puis archivées conformément aux obligations légales. Les données 
                de contact sont conservées jusqu'à ce que vous demandiez leur suppression.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Partage des données</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>
                Vos données personnelles ne sont pas vendues, louées ou échangées. Elles peuvent 
                être partagées uniquement avec :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>HelloAsso pour la gestion des adhésions</li>
                <li>Les autorités compétentes en cas d'obligation légale</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sécurité des données</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées 
                pour protéger vos données personnelles contre la perte, le vol, l'accès non autorisé, 
                la divulgation ou la modification.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vos droits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
                <li><strong>Droit de rectification :</strong> corriger vos données inexactes</li>
                <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
                <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
                <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
                <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
              </ul>
              <p className="mt-4">
                Pour exercer ces droits, contactez-nous à : <a href="mailto:lesmornesdenisiens@gmail.com" className="text-primary hover:underline">lesmornesdenisiens@gmail.com</a>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookies</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Ce site utilise des cookies techniques nécessaires à son bon fonctionnement. 
                Aucun cookie de tracking ou publicitaire n'est utilisé sans votre consentement.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Nous nous réservons le droit de modifier cette politique de confidentialité à tout 
                moment. Toute modification sera publiée sur cette page avec une nouvelle date de 
                mise à jour.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                Pour toute question concernant cette politique de confidentialité ou pour exercer 
                vos droits, vous pouvez nous contacter :
              </p>
              <p><strong>Email :</strong> <a href="mailto:lesmornesdenisiens@gmail.com" className="text-primary hover:underline">lesmornesdenisiens@gmail.com</a></p>
              <p><strong>Téléphone :</strong> <a href="tel:0696388738" className="text-primary hover:underline">0696.38.87.38</a></p>
              <p><strong>Adresse :</strong> Fond Saint-Denis, Martinique</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}



