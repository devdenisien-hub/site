"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Eye } from "lucide-react";

interface ReglementDialogProps {
  reglementHtml?: string;
}

export function ReglementDialog({ reglementHtml }: ReglementDialogProps) {
  if (!reglementHtml) {
    return (
      <Button variant="outline" size="sm" disabled>
        <FileText className="mr-2 h-4 w-4" />
        Aucun règlement
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="mr-2 h-4 w-4" />
          Voir le règlement
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Règlement de l'épreuve
          </DialogTitle>
          <DialogDescription>
            Consultez le règlement officiel de l'événement
          </DialogDescription>
        </DialogHeader>
        
        <div className="prose prose-sm max-w-none">
          <div 
            dangerouslySetInnerHTML={{ __html: reglementHtml }}
            className="prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}




