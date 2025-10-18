import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-5xl font-bold mb-6">Mentions Légales</h1>
          <p className="text-xl opacity-90">
            Informations légales concernant l'association Les Mornes Denisien
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Éditeur du site</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Nom de l'association :</strong> Les Mornes Denisien</p>
              <p><strong>Forme juridique :</strong> Association loi 1901</p>
              <p><strong>Siège social :</strong> Fond Saint-Denis, Martinique</p>
              <p><strong>Email :</strong> <a href="mailto:lesmornesdenisiens@gmail.com" className="text-primary hover:underline">lesmornesdenisiens@gmail.com</a></p>
              <p><strong>Téléphone :</strong> <a href="tel:0696388738" className="text-primary hover:underline">0696.38.87.38</a></p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hébergement</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Ce site est hébergé par Vercel Inc.</p>
              <p className="mt-2">340 S Lemon Ave #4133<br />Walnut, CA 91789<br />États-Unis</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Propriété intellectuelle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>
                L'ensemble du contenu de ce site (textes, images, logos, graphismes) est la propriété 
                de l'association Les Mornes Denisien, sauf mention contraire.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication, adaptation de tout ou 
                partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, 
                sauf autorisation écrite préalable de l'association.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Responsabilité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>
                Les informations contenues sur ce site sont aussi précises que possible et le site est 
                périodiquement remis à jour, mais peut toutefois contenir des inexactitudes ou des omissions.
              </p>
              <p>
                L'association Les Mornes Denisien ne pourra être tenue responsable des dommages directs 
                ou indirects causés au matériel de l'utilisateur, lors de l'accès au site.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Liens hypertextes</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Ce site peut contenir des liens hypertextes vers d'autres sites. L'association 
                Les Mornes Denisien n'exerce aucun contrôle sur ces sites et décline toute 
                responsabilité quant à leur contenu.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Droit applicable</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Le présent site et les mentions légales sont soumis au droit français. 
                En cas de litige, les tribunaux français seront seuls compétents.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}



