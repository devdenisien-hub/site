"use client";

import { useState, useCallback } from "react";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadAttestation, deleteAttestation } from "@/app/actions/upload";
import Image from "next/image";

interface FileUploadProps {
  currentPath?: string;
  onPathChange: (path: string | null) => void;
  bucketName: "attestations";
  accept?: string;
  maxSize?: number;
  className?: string;
  disabled?: boolean;
}

export function FileUpload({
  currentPath,
  onPathChange,
  bucketName,
  accept = ".pdf,.jpg,.jpeg,.png",
  maxSize = 5 * 1024 * 1024, // 5MB
  className = "",
  disabled = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      // Vérifier la taille du fichier
      if (file.size > maxSize) {
        setError(`Le fichier est trop volumineux. Taille maximale : ${Math.round(maxSize / 1024 / 1024)}MB.`);
        setIsUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadAttestation(formData);

      if (result.success && result.path) {
        onPathChange(result.path);
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
    if (!currentPath) return;

    setIsUploading(true);
    setError(null);

    try {
      const result = await deleteAttestation(currentPath);
      if (!result.success) {
        setError(result.error || "Erreur lors de la suppression");
        setIsUploading(false);
        return;
      }

      onPathChange(null);
    } catch (err) {
      setError("Une erreur inattendue est survenue");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      return 'image';
    }
    return 'file';
  };

  const getFileUrl = (path: string) => {
    // Pour les attestations, on utilise l'URL publique de Supabase
    return `https://wokpbajmuatqykbcsjmv.supabase.co/storage/v1/object/public/attestations/${path}`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Zone d'upload */}
      {!currentPath && !isUploading && (
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
            accept={accept}
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
                Glissez-déposez un fichier ici ou cliquez pour sélectionner
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {accept} (max. {Math.round(maxSize / 1024 / 1024)}MB)
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
      {currentPath && !isUploading && (
        <div className="relative group">
          <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-muted bg-gray-50">
            {getFileIcon(currentPath) === 'image' ? (
              <Image
                src={getFileUrl(currentPath)}
                alt="Fichier uploadé"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {currentPath.split('/').pop()}
                  </p>
                </div>
              </div>
            )}
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

          {/* Info sur le fichier */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 text-xs">
              <FileText className="h-3 w-3" />
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




