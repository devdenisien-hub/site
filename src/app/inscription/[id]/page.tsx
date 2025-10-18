import { getTrailByIdWithStats } from "@/app/actions/trails";
import { notFound } from "next/navigation";
import { TrailInscriptionClient } from "@/components/trail/trail-inscription-client";

interface TrailInscriptionPageProps {
  params: {
    id: string;
  };
}

export default async function TrailInscriptionPage({ params }: TrailInscriptionPageProps) {
  const { id } = await params;
  const trail = await getTrailByIdWithStats(id);

  if (!trail) {
    notFound();
  }

  return <TrailInscriptionClient trail={trail} />;
}
