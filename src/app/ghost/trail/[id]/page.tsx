import { getTrailByIdWithStats } from "@/app/actions/trails";
import { notFound } from "next/navigation";
import { TrailDetailClient } from "@/components/trail/trail-detail-client";

interface TrailDetailPageProps {
  params: {
    id: string;
  };
}

export default async function TrailDetailPage({ params }: TrailDetailPageProps) {
  const { id } = await params;
  const trail = await getTrailByIdWithStats(id);

  if (!trail) {
    notFound();
  }

  return <TrailDetailClient trail={trail} />;
}
