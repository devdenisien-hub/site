"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { createInscription } from "@/app/actions/randonnees";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  first_name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres"),
  show_public_name: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface InscriptionFormProps {
  randoId: string;
  randoSlug: string;
  randoName: string;
  isFree: boolean;
  priceCents?: number | null;
}

export function InscriptionForm({
  randoId,
  randoSlug,
  randoName,
  isFree,
  priceCents,
}: InscriptionFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      show_public_name: false,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createInscription({
        rando_id: randoId,
        ...values,
      });

      if (result.success) {
        setSuccess(true);
        
        // Rediriger après 2 secondes
        setTimeout(() => {
          router.push(`/randonnees/${randoSlug}`);
        }, 2000);
      } else {
        setError(result.error || "Une erreur est survenue");
      }
    } catch (err) {
      setError("Une erreur inattendue est survenue");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const formatPrice = (cents: number | null | undefined) => {
    if (!cents) return "0,00 €";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(cents / 100);
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Inscription confirmée !</h2>
        <p className="text-muted-foreground mb-4">
          Votre inscription à la randonnée <strong>{randoName}</strong> a été
          enregistrée avec succès.
        </p>
        {!isFree && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4 max-w-md mx-auto">
            <p className="text-sm text-orange-900">
              Vous recevrez prochainement un email avec les instructions de
              paiement ({formatPrice(priceCents)}).
            </p>
          </div>
        )}
        <p className="text-sm text-muted-foreground">
          Un email de confirmation vous a été envoyé.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Prénom */}
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom *</FormLabel>
                <FormControl>
                  <Input placeholder="Jean" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nom */}
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom *</FormLabel>
                <FormControl>
                  <Input placeholder="Dupont" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="jean.dupont@example.com"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Vous recevrez un email de confirmation à cette adresse
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Téléphone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone *</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="0696123456"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Pour vous contacter en cas de besoin
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Afficher nom publiquement */}
        <FormField
          control={form.control}
          name="show_public_name"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Afficher mon nom dans la liste des participants</FormLabel>
                <FormDescription>
                  Votre nom et prénom seront visibles sur la page de la
                  randonnée
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* Informations de paiement si payante */}
        {!isFree && priceCents && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Paiement requis</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Cette randonnée est payante : <strong>{formatPrice(priceCents)}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Après validation de votre inscription, vous recevrez un email avec
              les instructions de paiement.
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Inscription en cours...
              </>
            ) : (
              "Confirmer l'inscription"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

