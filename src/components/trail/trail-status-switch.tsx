"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toggleTrailStatus } from "@/app/actions/trails";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface TrailStatusSwitchProps {
  trailId: string;
  trailName: string;
  initialStatus: boolean;
}

export function TrailStatusSwitch({ trailId, trailName, initialStatus }: TrailStatusSwitchProps) {
  const [isActive, setIsActive] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async (checked: boolean) => {
    setIsLoading(true);
    try {
      await toggleTrailStatus(trailId, checked);
      setIsActive(checked);
      toast.success(
        checked 
          ? `Le trail "${trailName}" est maintenant actif` 
          : `Le trail "${trailName}" est maintenant inactif`
      );
      router.refresh();
    } catch (error: any) {
      console.error("Error toggling trail status:", error);
      toast.error(error.message || "Erreur lors de la modification du statut");
      // Revert the switch state on error
      setIsActive(!checked);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={`trail-status-${trailId}`}
        checked={isActive}
        onCheckedChange={handleToggle}
        disabled={isLoading}
      />
      <Label 
        htmlFor={`trail-status-${trailId}`} 
        className="text-sm font-medium cursor-pointer"
      >
        {isActive ? "Actif" : "Inactif"}
      </Label>
    </div>
  );
}




