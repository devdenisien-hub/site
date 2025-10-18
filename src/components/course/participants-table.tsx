"use client";

import { useState, useMemo } from "react";
import { Participant } from "@/app/actions/trails";
import { ParticipantDetailsDialog } from "@/components/course/participant-details-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronLeft, ChevronRight, Mail, Phone } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ParticipantsTableProps {
  participants: Participant[];
}

export function ParticipantsTable({ participants }: ParticipantsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  // Filtrer et trier les participants
  const filteredParticipants = useMemo(() => {
    let filtered = participants;

    // Filtrage par recherche
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(participant => 
        participant.nom.toLowerCase().includes(search) ||
        participant.prenom.toLowerCase().includes(search) ||
        participant.email.toLowerCase().includes(search) ||
        (participant.numero_dossard && participant.numero_dossard.toLowerCase().includes(search))
      );
    }

    // Filtrage par statut
    if (statusFilter !== "all") {
      filtered = filtered.filter(participant => participant.statut === statusFilter);
    }

    return filtered;
  }, [participants, searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentParticipants = filteredParticipants.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusBadge = (statut: string) => {
    if (statut === 'valide') {
      return <Badge variant="default" className="bg-green-600">Validé</Badge>;
    }
    return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Incomplet</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* Barre de recherche et filtres */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, prénom, email ou numéro de dossard..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset à la première page lors de la recherche
            }}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={(value) => {
          setStatusFilter(value);
          setCurrentPage(1); // Reset à la première page lors du changement de filtre
        }}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="valide">Validé</SelectItem>
            <SelectItem value="incomplet">Incomplet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tableau */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Taille T-shirt</TableHead>
              <TableHead>Dossard</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date d'inscription</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentParticipants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Aucun participant trouvé
                </TableCell>
              </TableRow>
            ) : (
              currentParticipants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell className="font-medium">{participant.nom}</TableCell>
                  <TableCell>{participant.prenom}</TableCell>
                  <TableCell>
                    <a 
                      href={`mailto:${participant.email}`}
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <Mail className="h-3 w-3" />
                      {participant.email}
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <a 
                        href={`tel:${participant.telephone_mobile}`}
                        className="flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <Phone className="h-3 w-3" />
                        {participant.telephone_mobile}
                      </a>
                      {participant.telephone_fixe && (
                        <a 
                          href={`tel:${participant.telephone_fixe}`}
                          className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
                        >
                          <Phone className="h-3 w-3" />
                          {participant.telephone_fixe}
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{participant.taille_tshirt.toUpperCase()}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {participant.numero_dossard || '-'}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(participant.statut)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(participant.created_at), "dd/MM/yyyy", { locale: fr })}
                  </TableCell>
                  <TableCell>
                    <ParticipantDetailsDialog participant={participant} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Affichage de {startIndex + 1} à {Math.min(endIndex, filteredParticipants.length)} sur {filteredParticipants.length} participants
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
