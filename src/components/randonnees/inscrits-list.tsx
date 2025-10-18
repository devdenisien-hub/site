"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Inscription {
  first_name: string;
  last_name: string;
  created_at: string;
}

interface InscritsListProps {
  inscriptions: Inscription[];
}

const ITEMS_PER_PAGE = 10;

export function InscritsList({ inscriptions }: InscritsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrer les inscriptions selon le terme de recherche
  const filteredInscriptions = useMemo(() => {
    if (!searchTerm.trim()) {
      return inscriptions;
    }

    const term = searchTerm.toLowerCase().trim();
    return inscriptions.filter(
      (inscription) =>
        inscription.first_name.toLowerCase().includes(term) ||
        inscription.last_name.toLowerCase().includes(term)
    );
  }, [inscriptions, searchTerm]);

  // Réinitialiser la page quand on change la recherche
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Calculer la pagination
  const totalPages = Math.ceil(filteredInscriptions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentInscriptions = filteredInscriptions.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (inscriptions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Liste des participants
          </CardTitle>
          <Badge variant="secondary">
            {inscriptions.length} participant{inscriptions.length > 1 ? "s" : ""}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Barre de recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher par nom ou prénom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Liste des inscrits */}
        {currentInscriptions.length > 0 ? (
          <>
            <div className="space-y-2">
              {currentInscriptions.map((inscription, index) => (
                <div
                  key={`${inscription.first_name}-${inscription.last_name}-${index}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold">
                      {inscription.first_name.charAt(0)}
                      {inscription.last_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">
                        {inscription.first_name} {inscription.last_name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} sur {totalPages}
                  <span className="ml-2">
                    ({startIndex + 1}-{Math.min(endIndex, filteredInscriptions.length)} sur{" "}
                    {filteredInscriptions.length})
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>
              {searchTerm
                ? `Aucun participant trouvé pour "${searchTerm}"`
                : "Aucun participant inscrit"}
            </p>
          </div>
        )}

        {/* Compteur de résultats si recherche active */}
        {searchTerm && filteredInscriptions.length > 0 && (
          <p className="text-sm text-muted-foreground text-center">
            {filteredInscriptions.length} résultat
            {filteredInscriptions.length > 1 ? "s" : ""} sur{" "}
            {inscriptions.length} participant
            {inscriptions.length > 1 ? "s" : ""}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

