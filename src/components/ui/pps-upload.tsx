"use client";

import { useState, useCallback } from "react";
import { Upload, X, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadAndValidatePPS } from "@/app/actions/pps-validation";
import { PDFToPNGConverter } from "@/components/pdf-to-png-wrapper";
import { toast } from "sonner";

interface PPSUploadProps {
  currentPath?: string;
  onPathChange: (path: string | null) => void;
  onValidationSuccess: (data: { numeroPps: string; validitePps: string }) => void;
  userData: {
    nom: string;
    prenom: string;
    dateNaissance: string;
  };
  className?: string;
  disabled?: boolean;
}

export function PPSUpload({
  currentPath,
  onPathChange,
  onValidationSuccess,
  userData,
  className = "",
  disabled = false,
}: PPSUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'converting' | 'analyzing' | 'validating' | 'success' | 'error'>('idle');
  const [selectedPDF, setSelectedPDF] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState<string>("");

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
    setError(null);

    try {
      // Vérifier le type de fichier
      const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setError("Type de fichier non autorisé. Utilisez PDF, JPG ou PNG.");
        setValidationStatus('error');
        return;
      }

      // Vérifier la taille du fichier (max 10MB pour OCR)
      if (file.size > 10 * 1024 * 1024) {
        setError("Le fichier est trop volumineux. Taille maximale : 10MB.");
        setValidationStatus('error');
        return;
      }

      // Si c'est un PDF, on le stocke pour conversion côté client
      if (file.type === "application/pdf") {
        setSelectedPDF(file);
        setValidationStatus('converting');
        setCurrentStep("Conversion du PDF en image...");
        return;
      }

      // Pour les images, on procède directement à l'upload
      await processImageFile(file);
    } catch (err) {
      setError("Une erreur inattendue est survenue");
      setValidationStatus('error');
      toast.error("Une erreur inattendue est survenue");
      console.error(err);
    }
  };

  const processImageFile = async (file: File) => {
    setIsUploading(true);
    setValidationStatus('validating');

    try {
      // Upload et validation PPS
      const result = await uploadAndValidatePPS(file, userData, undefined);

      if (result.success && result.extractedData) {
        setValidationStatus('success');
        onPathChange(result.googleDriveUrl || '');
        onValidationSuccess({
          numeroPps: result.extractedData.numeroPps!,
          validitePps: result.extractedData.validitePps!
        });
        toast.success("Attestation PPS validée avec succès !");
      } else {
        setError(result.error || "Erreur lors de la validation");
        setValidationStatus('error');
        toast.error(result.error || "Erreur lors de la validation");
      }
    } catch (err) {
      setError("Une erreur inattendue est survenue");
      setValidationStatus('error');
      toast.error("Une erreur inattendue est survenue");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePDFConverted = async (imageFile: File, extractedData?: any) => {
    
    // Si on a des données extraites côté client, les utiliser
    if (extractedData && Object.keys(extractedData).length > 0) {
      
      // Pré-remplir les champs avec les données extraites
      if (extractedData.nom) {
      }
      if (extractedData.prenom) {
      }
      if (extractedData.dateNaissance) {
      }
      if (extractedData.numeroPps) {
      }
      if (extractedData.validitePps) {
      }
      
      // Automatiquement passer à l'étape de validation
      setValidationStatus('validating');
      setCurrentStep("Validation des données...");
      
      try {
        const result = await uploadAndValidatePPS(selectedPDF!, userData, extractedData);
        
        if (result.success && result.extractedData) {
          setValidationStatus('success');
          setCurrentStep("Attestation validée avec succès !");
          onPathChange(result.googleDriveUrl || '');
          onValidationSuccess({
            numeroPps: result.extractedData.numeroPps!,
            validitePps: result.extractedData.validitePps!
          });
          toast.success("Attestation PPS validée avec succès !");
        } else {
          setError(result.error || "Erreur lors de la validation");
          setValidationStatus('error');
          setCurrentStep("");
          toast.error(result.error || "Erreur lors de la validation");
        }
      } catch (err) {
        setError("Une erreur inattendue est survenue");
        setValidationStatus('error');
        setCurrentStep("");
        toast.error("Une erreur inattendue est survenue");
        console.error(err);
      } finally {
        setIsUploading(false);
      }
    }
    
    setSelectedPDF(null);
  };

  const handlePDFError = (error: string) => {
    setError(error);
    setValidationStatus('error');
    setSelectedPDF(null);
  };

  const handleDelete = async () => {
    setError(null);
    setValidationStatus('idle');
    setSelectedPDF(null);
    onPathChange(null);
  };

  const getStatusIcon = () => {
    switch (validationStatus) {
      case 'validating':
        return <Loader2 className="h-8 w-8 animate-spin text-blue-600" />;
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-8 w-8 text-red-600" />;
      default:
        return <Upload className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const getStatusMessage = () => {
    switch (validationStatus) {
      case 'validating':
        return "Validation en cours...";
      case 'success':
        return "Attestation PPS validée ✓";
      case 'error':
        return "Erreur de validation";
      default:
        return "Glissez-déposez votre attestation PPS ici ou cliquez pour sélectionner";
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Conversion PDF */}
      {selectedPDF && (
        <PDFToPNGConverter
          file={selectedPDF}
          onImageGenerated={handlePDFConverted}
          onError={handlePDFError}
          onStatusChange={(status) => {
            if (status === 'converting') {
              setValidationStatus('converting');
              setCurrentStep("Conversion du PDF en image...");
            } else if (status === 'analyzing') {
              setValidationStatus('analyzing');
              setCurrentStep("Analyse du document...");
            }
          }}
        />
      )}

      {/* Zone d'upload */}
      {!currentPath && !isUploading && !selectedPDF && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-8
            transition-colors cursor-pointer
            ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
            ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary hover:bg-accent"}
            ${validationStatus === 'success' ? "border-green-500 bg-green-50" : ""}
            ${validationStatus === 'error' ? "border-red-500 bg-red-50" : ""}
          `}
        >
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="p-4 rounded-full bg-muted">
              {getStatusIcon()}
            </div>
            <div>
              <p className="font-medium">
                {getStatusMessage()}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                PDF, JPG, PNG (max. 10MB)
              </p>
              {validationStatus === 'success' && (
                <p className="text-sm text-green-600 mt-1">
                  Les informations ont été extraites et validées
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload en cours */}
      {(isUploading || validationStatus === 'converting' || validationStatus === 'analyzing' || validationStatus === 'validating') && (
        <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              {validationStatus === 'converting' && "Conversion du PDF en image..."}
              {validationStatus === 'analyzing' && "Analyse du document..."}
              {validationStatus === 'validating' && "Validation des données..."}
              {isUploading && "Upload et validation en cours..."}
            </p>
            <p className="text-xs text-muted-foreground">
              {currentStep || "Le document est analysé pour extraire les informations PPS"}
            </p>
          </div>
        </div>
      )}

      {/* Preview avec statut */}
      {currentPath && !isUploading && (
        <div className="relative group">
          <div className={`
            relative rounded-lg border-2 p-6
            ${validationStatus === 'success' ? "border-green-500 bg-green-50" : ""}
            ${validationStatus === 'error' ? "border-red-500 bg-red-50" : "border-muted"}
          `}>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Attestation PPS uploadée
                </p>
                {validationStatus === 'success' && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Validée
                  </p>
                )}
                {validationStatus === 'error' && (
                  <p className="text-xs text-red-600 mt-1">
                    ✗ Erreur
                  </p>
                )}
              </div>
            </div>
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
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Erreur de validation</p>
              <p className="text-sm mt-1 whitespace-pre-line">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

