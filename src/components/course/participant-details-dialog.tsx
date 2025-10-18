"use client";

import { useState } from "react";
import { Participant } from "@/app/actions/trails";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Eye, Mail, Phone, MapPin, Calendar, User, FileText } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ParticipantDetailsDialogProps {
  participant: Participant;
}

export function ParticipantDetailsDialog({ participant }: ParticipantDetailsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusBadge = (statut: string) => {
    if (statut === 'valide') {
      return <Badge variant="default" className="bg-green-600">Validé</Badge>;
    }
    return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Incomplet</Badge>;
  };

  const getCiviliteText = (civilite: string) => {
    switch (civilite) {
      case 'M': return 'Monsieur';
      case 'Mme': return 'Madame';
      case 'Autre': return 'Autre';
      default: return civilite;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="mr-2 h-4 w-4" />
          Voir les détails
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Détails de l'inscription
          </DialogTitle>
          <DialogDescription>
            Informations complètes de {participant.prenom} {participant.nom}
          </DialogDescription>
          {participant.numero_dossard && (
            <div className="flex justify-center mt-2">
              <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-mono text-lg font-bold">
                Dossard #{participant.numero_dossard}
              </div>
            </div>
          )}
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations personnelles */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Informations personnelles
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Civilité</label>
                  <p className="text-sm">{getCiviliteText(participant.civilite)}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nom</label>
                  <p className="text-sm font-medium">{participant.nom}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Prénom</label>
                  <p className="text-sm font-medium">{participant.prenom}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date de naissance</label>
                  <p className="text-sm">{format(new Date(participant.date_naissance), "PPP", { locale: fr })}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nationalité</label>
                  <p className="text-sm">{participant.nationalite}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="flex items-center gap-2">
                    <a 
                      href={`mailto:${participant.email}`}
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Mail className="h-3 w-3" />
                      {participant.email}
                    </a>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email de confirmation</label>
                  <p className="text-sm">{participant.email_confirmation}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Téléphone mobile</label>
                  <div className="flex items-center gap-2">
                    <a 
                      href={`tel:${participant.telephone_mobile}`}
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Phone className="h-3 w-3" />
                      {participant.telephone_mobile}
                    </a>
                  </div>
                </div>
                
                {participant.telephone_fixe && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Téléphone fixe</label>
                    <div className="flex items-center gap-2">
                      <a 
                        href={`tel:${participant.telephone_fixe}`}
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Phone className="h-3 w-3" />
                        {participant.telephone_fixe}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Adresse */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Adresse
            </h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Numéro et nom de rue</label>
                  <p className="text-sm">{participant.numero_rue} {participant.nom_rue}</p>
                </div>
                
                {participant.complement_adresse && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Complément d'adresse</label>
                    <p className="text-sm">{participant.complement_adresse}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Code postal</label>
                  <p className="text-sm">{participant.code_postal}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Ville</label>
                  <p className="text-sm">{participant.ville}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Pays</label>
                  <p className="text-sm">{participant.pays}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Licence FFA */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Licence FFA
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Licencié FFA</label>
                <p className="text-sm">{participant.licencie_ffa ? 'Oui' : 'Non'}</p>
              </div>
              
              {participant.licencie_ffa ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Fédération d'appartenance</label>
                    <p className="text-sm">{participant.federation_appartenance}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Numéro de licence</label>
                    <p className="text-sm font-mono">{participant.numero_licence}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Numéro de PPS</label>
                    <p className="text-sm font-mono">{participant.numero_pps || 'Non renseigné'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Validité PPS</label>
                    <p className="text-sm">
                      {participant.validite_pps 
                        ? format(new Date(participant.validite_pps), "PPP", { locale: fr })
                        : 'Non renseignée'
                      }
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Attestation PPS</label>
                    <p className="text-sm">
                      <a 
                        href={participant.attestation_pps_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Voir l'attestation
                      </a>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Informations de l'inscription */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Informations de l'inscription
            </h3>
            
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Taille T-shirt</label>
                <div className="mt-1">
                  <Badge variant="outline">{participant.taille_tshirt.toUpperCase()}</Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Numéro de dossard</label>
                <p className="text-sm font-mono">{participant.numero_dossard || 'Non attribué'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Statut</label>
                <div className="mt-1">
                  {getStatusBadge(participant.statut)}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date d'inscription</label>
                <p className="text-sm">{format(new Date(participant.created_at), "PPP à HH:mm", { locale: fr })}</p>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Accepte le règlement</label>
                <p className="text-sm">{participant.accepte_reglement ? 'Oui' : 'Non'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Accepte la liste publique</label>
                <p className="text-sm">{participant.accepte_liste_publique ? 'Oui' : 'Non'}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
