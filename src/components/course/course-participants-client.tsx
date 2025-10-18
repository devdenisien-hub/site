"use client";

import { CourseWithParticipants } from "@/app/actions/trails";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Users, CheckCircle, AlertCircle, MapPin, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface CourseParticipantsClientProps {
  course: CourseWithParticipants;
}

export function CourseParticipantsClient({ course }: CourseParticipantsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Filtrer les participants qui acceptent d'apparaître sur la liste publique et sont validés
  const publicParticipants = useMemo(() => {
    return course.participants.filter(participant => 
      participant.accepte_liste_publique === true && 
      participant.statut === 'valide'
    );
  }, [course.participants]);

  // Filtrer par recherche
  const filteredParticipants = useMemo(() => {
    if (!searchTerm) return publicParticipants;
    
    const search = searchTerm.toLowerCase();
    return publicParticipants.filter(participant => 
      participant.nom.toLowerCase().includes(search) ||
      participant.prenom.toLowerCase().includes(search)
    );
  }, [publicParticipants, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedParticipants = filteredParticipants.slice(startIndex, endIndex);

  // Reset page when search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/inscription/${course.trail_id}/course`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la sélection
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{course.nom}</h1>
              <p className="text-muted-foreground">Liste des participants</p>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {publicParticipants.length} participants
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Informations de la course */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Informations de la course</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="h-4 w-4" />
                  <span>{course.distance_km} km</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <TrendingUp className="h-4 w-4" />
                  <span>+{course.denivele_positif}m</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="h-4 w-4" />
                  <span>{course.difficulte}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Users className="h-4 w-4" />
                  <span>{course.stats.total_inscriptions} inscrits</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>{course.stats.inscriptions_valide} validées</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recherche et liste des participants */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des participants</CardTitle>
              <CardDescription>
                Participants ayant accepté d'apparaître sur la liste publique
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Barre de recherche */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom ou prénom..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Liste des participants */}
              {filteredParticipants.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    {searchTerm ? "Aucun participant trouvé" : "Aucun participant public"}
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm 
                      ? "Essayez avec d'autres termes de recherche"
                      : "Les participants n'ont pas encore accepté d'apparaître sur la liste publique"
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {paginatedParticipants.map((participant) => (
                    <div 
                      key={participant.id} 
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                            {participant.prenom.charAt(0).toUpperCase()}{participant.nom.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-medium">
                              {participant.prenom} {participant.nom}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Inscrit le {format(new Date(participant.created_at), "dd/MM/yyyy", { locale: fr })}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {participant.numero_dossard && (
                          <Badge variant="default" className="text-xs font-mono">
                            #{participant.numero_dossard}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Indicateur de pagination */}
              {filteredParticipants.length > 0 && (
                <div className="mt-4 text-sm text-gray-600 text-center">
                  Affichage de {startIndex + 1} à {Math.min(endIndex, filteredParticipants.length)} sur {filteredParticipants.length} participant{filteredParticipants.length > 1 ? 's' : ''}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) {
                              setCurrentPage(currentPage - 1);
                            }
                          }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                            }}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) {
                              setCurrentPage(currentPage + 1);
                            }
                          }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
