"use client";

import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadFlyer, deleteFlyer } from "@/app/actions/upload";
import Image from "next/image";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | null) => void;
  onPathChange?: (path: string | null) => void;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  onPathChange,
  disabled = false,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        await uploadFile(files[0]);
      }
    },
    [disabled]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        await uploadFile(files[0]);
      }
    },
    []
  );

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadFlyer(formData);

      if (result.success && result.url) {
        onChange(result.url);
        if (result.path && onPathChange) {
          setCurrentPath(result.path);
          onPathChange(result.path);
        }
      } else {
        setError(result.error || "Erreur lors de l'upload");
      }
    } catch (err) {
      setError("Une erreur inattendue est survenue");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentPath && !value) return;

    setIsUploading(true);
    setError(null);

    try {
      // Si on a un path, on supprime du storage
      if (currentPath) {
        const result = await deleteFlyer(currentPath);
        if (!result.success) {
          setError(result.error || "Erreur lors de la suppression");
          setIsUploading(false);
          return;
        }
      }

      // Réinitialiser les valeurs
      onChange(null);
      if (onPathChange) {
        onPathChange(null);
      }
      setCurrentPath(null);
    } catch (err) {
      setError("Une erreur inattendue est survenue");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Zone d'upload */}
      {!value && !isUploading && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-8
            transition-colors cursor-pointer
            ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
            ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary hover:bg-accent"}
          `}
        >
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="p-4 rounded-full bg-muted">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">
                Glissez-déposez une image ici ou cliquez pour sélectionner
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                JPG, PNG ou WebP (max. 5MB)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload en cours */}
      {isUploading && (
        <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Upload en cours...</p>
          </div>
        </div>
      )}

      {/* Preview */}
      {value && !isUploading && (
        <div className="relative group">
          <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-muted">
            <Image
              src={value}
              alt="Flyer preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          {/* Bouton de suppression */}
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleDelete}
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          {/* Info sur l'image */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 text-xs">
              <ImageIcon className="h-3 w-3" />
              <span>Cliquez sur X pour supprimer</span>
            </div>
          </div>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}


