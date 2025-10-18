"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Inscription {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  payment_status: string;
  paid_at: string | null;
  created_at: string;
  show_public_name: boolean;
}

interface InscriptionsListProps {
  inscriptions: Inscription[];
}

export default function InscriptionsList({ inscriptions }: InscriptionsListProps) {
  if (inscriptions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Liste des Inscrits (0)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">Aucune inscription pour le moment</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 px-2 py-1 rounded">
            Payé
          </span>
        );
      case "pending":
        return (
          <span className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
            En attente
          </span>
        );
      case "not_required":
        return (
          <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
            Non requis
          </span>
        );
      default:
        return (
          <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
            {status}
          </span>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des Inscrits ({inscriptions.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold">#</th>
                <th className="text-left p-3 font-semibold">Prénom</th>
                <th className="text-left p-3 font-semibold">Nom</th>
                <th className="text-left p-3 font-semibold">Email</th>
                <th className="text-left p-3 font-semibold">Téléphone</th>
                <th className="text-left p-3 font-semibold">Statut</th>
                <th className="text-left p-3 font-semibold">Date inscription</th>
                <th className="text-left p-3 font-semibold text-center">Public</th>
              </tr>
            </thead>
            <tbody>
              {inscriptions.map((inscription, index) => (
                <tr key={inscription.id} className="border-b hover:bg-accent">
                  <td className="p-3 text-muted-foreground">{index + 1}</td>
                  <td className="p-3 font-medium">{inscription.first_name}</td>
                  <td className="p-3 font-medium">{inscription.last_name}</td>
                  <td className="p-3 text-sm">
                    <a
                      href={`mailto:${inscription.email}`}
                      className="text-primary hover:underline"
                    >
                      {inscription.email}
                    </a>
                  </td>
                  <td className="p-3 text-sm">
                    {inscription.phone ? (
                      <a
                        href={`tel:${inscription.phone}`}
                        className="text-primary hover:underline"
                      >
                        {inscription.phone}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="p-3">{getPaymentStatusBadge(inscription.payment_status)}</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    {new Date(inscription.created_at).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-3 text-center">
                    {inscription.show_public_name ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}


