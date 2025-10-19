"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { createTrailInscription } from "@/app/actions/trails";
import { createClient } from "@/lib/supabase/client";
import { TrailWithCoursesAndStats, CourseWithParticipants } from "@/app/actions/trails";
import { PPSUpload } from "@/components/ui/pps-upload";
import { toast } from "sonner";

interface TrailInscriptionFormProps {
  trail: TrailWithCoursesAndStats;
  course: CourseWithParticipants;
}

export function TrailInscriptionForm({ trail, course }: TrailInscriptionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // État pour les champs conditionnels
  const [isLicencieFfa, setIsLicencieFfa] = useState(false);
  const [attestationPpsUrl, setAttestationPpsUrl] = useState<string>("");
  const [dateNaissance, setDateNaissance] = useState<string>("");
  const [numeroPps, setNumeroPps] = useState<string>("");
  const [validitePps, setValiditePps] = useState<string>("");
  const [nom, setNom] = useState<string>("");
  const [prenom, setPrenom] = useState<string>("");
  
  // États pour tous les champs du formulaire
  const [civilite, setCivilite] = useState<string>("");
  const [nationalite, setNationalite] = useState<string>("Française");
  const [email, setEmail] = useState<string>("");
  const [confirmationEmail, setConfirmationEmail] = useState<string>("");
  const [telephoneMobile, setTelephoneMobile] = useState<string>("");
  const [telephoneFixe, setTelephoneFixe] = useState<string>("");
  const [numeroRue, setNumeroRue] = useState<string>("");
  const [nomRue, setNomRue] = useState<string>("");
  const [complementAdresse, setComplementAdresse] = useState<string>("");
  const [codePostal, setCodePostal] = useState<string>("");
  const [ville, setVille] = useState<string>("");
  const [pays, setPays] = useState<string>("Martinique");
  const [tailleTshirt, setTailleTshirt] = useState<string>("");
  const [accepteReglement, setAccepteReglement] = useState<boolean>(false);
  const [accepteListePublique, setAccepteListePublique] = useState<boolean>(false);
  const [reglementHtml, setReglementHtml] = useState<string>("");

  // Récupérer le règlement au chargement
  useEffect(() => {
    const fetchReglement = async () => {
      const supabase = createClient();
      const { data: trailData, error } = await supabase
        .from("trail")
        .select("reglement_html")
        .eq("id", trail.id)
        .single();
      
      if (!error && trailData?.reglement_html) {
        setReglementHtml(trailData.reglement_html);
      }
    };
    
    fetchReglement();
  }, [trail.id]);

  // Fonction pour vérifier l'âge
  const checkAge = (dateNaissance: string): boolean => {
    if (!dateNaissance) return true; // Pas encore rempli
    
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Vérifier si l'anniversaire n'a pas encore eu lieu cette année
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }
    
    return age >= 18;
  };

  const handleDateNaissanceChange = (value: string) => {
    setDateNaissance(value);
    if (value && !checkAge(value)) {
      setError("Vous devez avoir au moins 18 ans pour vous inscrire à cette course.");
    } else {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Vérifier l'âge avant de soumettre
      if (!checkAge(dateNaissance)) {
        setError("Vous devez avoir au moins 18 ans pour vous inscrire à cette course.");
        setIsSubmitting(false);
        return;
      }

      // Créer un FormData avec les valeurs des états
      const formData = new FormData();
      formData.append("course_id", course.id);
      formData.append("civilite", civilite);
      formData.append("prenom", prenom);
      formData.append("nom", nom);
      formData.append("date_naissance", dateNaissance);
      formData.append("nationalite", nationalite);
      formData.append("email", email);
      formData.append("confirmation_email", confirmationEmail);
      formData.append("telephone_mobile", telephoneMobile);
      formData.append("telephone_fixe", telephoneFixe);
      formData.append("numero_pps", numeroPps);
      formData.append("validite_pps", validitePps);
      formData.append("numero_rue", numeroRue);
      formData.append("nom_rue", nomRue);
      formData.append("complement_adresse", complementAdresse);
      formData.append("code_postal", codePostal);
      formData.append("ville", ville);
      formData.append("pays", pays);
      formData.append("taille_tshirt", tailleTshirt);
      formData.append("licencie_ffa", isLicencieFfa.toString());
      formData.append("attestation_pps_url", attestationPpsUrl);
      formData.append("accepte_reglement", accepteReglement ? "on" : "");
      formData.append("accepte_liste_publique", accepteListePublique ? "on" : "");


      const result = await createTrailInscription(formData);

      if (result.success) {
        setSuccess(true);
        toast.success("Inscription créée avec succès !");
        
        // Rediriger après 2 secondes
        setTimeout(() => {
          router.push(`/inscription/${trail.id}`);
        }, 2000);
      } else {
        setError(result.error || "Une erreur est survenue");
        toast.error(result.error || "Une erreur est survenue");
      }
    } catch (err) {
      setError("Une erreur inattendue est survenue");
      toast.error("Une erreur inattendue est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-8">
                <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Inscription réussie !
                </h2>
                <p className="text-gray-600 mb-6">
                  Votre inscription à la course "{course.nom}" a été créée avec succès.
                  Vous recevrez un email de confirmation sous peu.
                </p>
                <Button asChild>
                  <Link href={`/inscription/${trail.id}`}>
                    Retour au trail
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/inscription/${trail.id}/course`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux courses
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Inscription</h1>
              <p className="text-gray-600">{course.nom}</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">Erreur</span>
                  </div>
                  <p className="text-red-700 mt-1">{error}</p>
                </CardContent>
              </Card>
            )}

            {/* Informations personnelles */}
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Renseignez vos informations personnelles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="civilite">Civilité *</Label>
                    <Select 
                      name="civilite" 
                      required
                      value={civilite}
                      onValueChange={setCivilite}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Monsieur</SelectItem>
                        <SelectItem value="Mme">Madame</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="prenom">Prénom *</Label>
                    <Input 
                      id="prenom" 
                      name="prenom" 
                      value={prenom || ""}
                      onChange={(e) => setPrenom(e.target.value)}
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="nom">Nom *</Label>
                    <Input 
                      id="nom" 
                      name="nom" 
                      value={nom || ""}
                      onChange={(e) => setNom(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date_naissance">Date de naissance *</Label>
                    <Input 
                      id="date_naissance" 
                      name="date_naissance" 
                      type="date" 
                      value={dateNaissance || ""}
                      onChange={(e) => handleDateNaissanceChange(e.target.value)}
                      required 
                    />
                    {dateNaissance && !checkAge(dateNaissance) && (
                      <p className="text-sm text-red-600 mt-1">
                        ⚠️ Vous devez avoir au moins 18 ans pour vous inscrire
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="nationalite">Nationalité *</Label>
                    <Input 
                      id="nationalite" 
                      name="nationalite" 
                      placeholder="Française" 
                      required 
                      value={nationalite}
                      onChange={(e) => setNationalite(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
                <CardDescription>
                  Vos informations de contact
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmation_email">Confirmation email *</Label>
                    <Input 
                      id="confirmation_email" 
                      name="confirmation_email" 
                      type="email" 
                      required 
                      value={confirmationEmail}
                      onChange={(e) => setConfirmationEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="telephone_mobile">Téléphone mobile *</Label>
                    <Input 
                      id="telephone_mobile" 
                      name="telephone_mobile" 
                      type="tel" 
                      required 
                      value={telephoneMobile}
                      onChange={(e) => setTelephoneMobile(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="telephone_fixe">Téléphone fixe</Label>
                    <Input 
                      id="telephone_fixe" 
                      name="telephone_fixe" 
                      type="tel" 
                      value={telephoneFixe}
                      onChange={(e) => setTelephoneFixe(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Licence FFA */}
            <Card>
              <CardHeader>
                <CardTitle>Licence FFA</CardTitle>
                <CardDescription>
                  Êtes-vous licencié de la Fédération Française d'Athlétisme ?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="licencie_ffa" 
                    checked={isLicencieFfa}
                    onCheckedChange={(checked) => setIsLicencieFfa(checked as boolean)}
                  />
                  <Label htmlFor="licencie_ffa">Oui, je suis licencié FFA</Label>
                </div>

                {isLicencieFfa && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="federation_appartenance">Fédération d'appartenance *</Label>
                      <Input id="federation_appartenance" name="federation_appartenance" />
                    </div>
                    <div>
                      <Label htmlFor="numero_licence">Numéro de licence *</Label>
                      <Input id="numero_licence" name="numero_licence" />
                    </div>
                  </div>
                )}

                {!isLicencieFfa && (
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-800 mb-2">
                        <AlertCircle className="h-5 w-5" />
                        <span className="font-medium">Attestation PPS requise</span>
                      </div>
                      <p className="text-yellow-700 text-sm">
                        Vous devez fournir une attestation PPS valable à la date de l'événement.{" "}
                        <a 
                          href="https://pps.athle.fr/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-yellow-800 underline hover:text-yellow-900 font-medium"
                        >
                          Créer une attestation PPS gratuitement
                        </a>
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="numero_pps">Numéro de PPS *</Label>
                        <Input 
                          id="numero_pps" 
                          name="numero_pps" 
                          value={numeroPps || ""}
                          readOnly
                          placeholder="Sera rempli automatiquement par l'OCR"
                          className="bg-gray-50 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <Label htmlFor="validite_pps">Validité PPS *</Label>
                        <Input 
                          id="validite_pps" 
                          name="validite_pps" 
                          type="date" 
                          value={validitePps || ""}
                          readOnly
                          className="bg-gray-50 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Attestation PPS *</Label>
                      <PPSUpload
                        currentPath={attestationPpsUrl}
                        onPathChange={setAttestationPpsUrl}
                        onValidationSuccess={(data) => {
                          // Pré-remplir tous les champs avec les données extraites
                          if (data.nom) {
                            setNom(data.nom);
                          }
                          if (data.prenom) {
                            setPrenom(data.prenom);
                          }
                          if (data.dateNaissance) {
                            setDateNaissance(data.dateNaissance);
                          }
                          if (data.numeroPps) {
                            setNumeroPps(data.numeroPps);
                          }
                          if (data.validitePps) {
                            setValiditePps(data.validitePps);
                          }
                        }}
                        userData={{
                          nom: nom,
                          prenom: prenom,
                          dateNaissance: dateNaissance
                        }}
                        className="mt-2"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Formats acceptés : PDF, JPG, PNG (max 10MB). 
                        Le document sera analysé automatiquement pour extraire les informations PPS.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Adresse */}
            <Card>
              <CardHeader>
                <CardTitle>Adresse</CardTitle>
                <CardDescription>
                  Votre adresse de résidence
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="numero_rue">Numéro</Label>
                    <Input 
                      id="numero_rue" 
                      name="numero_rue" 
                      value={numeroRue}
                      onChange={(e) => setNumeroRue(e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="nom_rue">Nom de la rue *</Label>
                    <Input 
                      id="nom_rue" 
                      name="nom_rue" 
                      required 
                      value={nomRue}
                      onChange={(e) => setNomRue(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="complement_adresse">Complément d'adresse</Label>
                  <Textarea 
                    id="complement_adresse" 
                    name="complement_adresse"
                    placeholder="Entrée, Bâtiment, Immeuble, Résidence, Lieu-dit..."
                    value={complementAdresse}
                    onChange={(e) => setComplementAdresse(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="code_postal">Code postal *</Label>
                    <Input 
                      id="code_postal" 
                      name="code_postal" 
                      required 
                      value={codePostal}
                      onChange={(e) => setCodePostal(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ville">Ville *</Label>
                    <Input 
                      id="ville" 
                      name="ville" 
                      required 
                      value={ville}
                      onChange={(e) => setVille(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pays">Pays *</Label>
                    <Input 
                      id="pays" 
                      name="pays" 
                      required 
                      value={pays}
                      onChange={(e) => setPays(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* T-shirt */}
            <Card>
              <CardHeader>
                <CardTitle>T-shirt</CardTitle>
                <CardDescription>
                  Sélectionnez votre taille de T-shirt
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="taille_tshirt">Taille *</Label>
                  <Select 
                    name="taille_tshirt" 
                    required
                    value={tailleTshirt}
                    onValueChange={setTailleTshirt}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre taille" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="s">S</SelectItem>
                      <SelectItem value="m">M</SelectItem>
                      <SelectItem value="l">L</SelectItem>
                      <SelectItem value="xl">XL</SelectItem>
                      <SelectItem value="xxl">XXL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Acceptations */}
            <Card>
              <CardHeader>
                <CardTitle>Acceptations</CardTitle>
                <CardDescription>
                  Veuillez accepter les conditions suivantes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="accepte_reglement" 
                    name="accepte_reglement" 
                    required 
                    checked={accepteReglement}
                    onCheckedChange={(checked) => setAccepteReglement(checked === true)}
                  />
                  <Label htmlFor="accepte_reglement" className="text-sm">
                    Je certifie avoir lu le{" "}
                    <Dialog>
                      <DialogTrigger asChild>
                        <button 
                          type="button"
                          className="text-primary underline hover:text-primary/80 cursor-pointer"
                        >
                          règlement
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Règlement officiel de l'épreuve</DialogTitle>
                        </DialogHeader>
                        <div 
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: reglementHtml || "Aucun règlement disponible." }}
                        />
                      </DialogContent>
                    </Dialog>
                    {" "}et m'engage à le respecter intégralement. *
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="accepte_liste_publique" 
                    name="accepte_liste_publique" 
                    checked={accepteListePublique}
                    onCheckedChange={(checked) => setAccepteListePublique(checked === true)}
                  />
                  <Label htmlFor="accepte_liste_publique" className="text-sm">
                    J'accepte d'apparaître sur la liste publique des participants et dans les résultats/classements publics de cet événement.
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Bouton de soumission */}
            <div className="flex justify-center">
              <Button 
                type="submit" 
                size="lg" 
                disabled={isSubmitting || (dateNaissance && !checkAge(dateNaissance))}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création de l'inscription...
                  </>
                ) : (
                  "Créer l'inscription"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
