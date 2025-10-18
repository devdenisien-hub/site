"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/slugify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createRandonnee } from "@/app/actions/randonnees";
import { Plus } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";

const formSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  slug: z.string().min(1, "Le slug est requis"),
  description: z.string().optional(),
  start_at: z.string().min(1, "La date de début est requise"),
  end_at: z.string().min(1, "La date de fin est requise"),
  reg_start_at: z.string().min(1, "La date d'ouverture des inscriptions est requise"),
  reg_end_at: z.string().min(1, "La date de clôture des inscriptions est requise"),
  flyer_url: z.string().optional(),
  is_free: z.boolean(),
  price_cents: z.number().optional(),
  currency: z.string().default("EUR"),
  max_participants: z.number().optional(),
  meeting_point: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateRandonneeForm() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      flyer_url: "",
      is_free: true,
      currency: "EUR",
    },
  });

  const isFree = form.watch("is_free");
  const name = form.watch("name");

  // Générer automatiquement le slug à partir du nom
  useEffect(() => {
    if (!slugManuallyEdited && name) {
      const generatedSlug = slugify(name);
      form.setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [name, slugManuallyEdited, form]);

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createRandonnee({
        ...values,
        price_cents: values.is_free ? 0 : (values.price_cents || 0),
      });

      if (result.success) {
        setOpen(false);
        form.reset();
        setSlugManuallyEdited(false);
        window.location.reload(); // Recharger pour voir la nouvelle randonnée
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

  const handleDialogChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Réinitialiser quand on ferme le dialog
      form.reset();
      setSlugManuallyEdited(false);
      setError(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Créer une randonnée
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle randonnée</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer un nouvel événement
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Nom */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la randonnée *</FormLabel>
                  <FormControl>
                    <Input placeholder="Exemple: Randonnée Morne Jacob" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug (identifiant URL)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="exemple: randonnee-morne-jacob"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setSlugManuallyEdited(true);
                      }}
                      className="font-mono text-sm"
                    />
                  </FormControl>
                  <FormDescription>
                    Généré automatiquement à partir du nom. Vous pouvez le modifier si besoin.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez la randonnée..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Flyer Upload */}
            <FormField
              control={form.control}
              name="flyer_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Flyer de la randonnée</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value || undefined}
                      onChange={(url) => field.onChange(url || "")}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Glissez-déposez ou cliquez pour uploader l'affiche de la randonnée (optionnel)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dates de l'événement */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Début de l'événement *</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fin de l'événement *</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Dates d'inscription */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="reg_start_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ouverture inscriptions *</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reg_end_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clôture inscriptions *</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Gratuit / Payant */}
            <FormField
              control={form.control}
              name="is_free"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type d'événement</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === "true")}
                    defaultValue={field.value ? "true" : "false"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Gratuit</SelectItem>
                      <SelectItem value="false">Payant</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Prix si payant */}
            {!isFree && (
              <FormField
                control={form.control}
                name="price_cents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix (en euros)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="10.00"
                        onChange={(e) => field.onChange(Math.round(parseFloat(e.target.value) * 100))}
                        value={field.value ? field.value / 100 : ""}
                      />
                    </FormControl>
                    <FormDescription>Le prix sera en euros (EUR)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Nombre maximum de participants */}
            <FormField
              control={form.control}
              name="max_participants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre maximum de participants</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Laissez vide pour illimité"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Point de rendez-vous */}
            <FormField
              control={form.control}
              name="meeting_point"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Point de rendez-vous</FormLabel>
                  <FormControl>
                    <Input placeholder="Exemple: Parking de l'église Fonds Saint-Denis" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogChange(false)}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Création..." : "Créer la randonnée"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

