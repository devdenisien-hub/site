import { getTrailsWithStats } from "@/app/actions/trails";
import { TrailsListClient } from "@/components/trail/trails-list-client";

export default async function TrailsPage() {
  const trails = await getTrailsWithStats();

  return <TrailsListClient trails={trails} />;
}
