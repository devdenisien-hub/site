import { getTrailByIdWithStats } from "@/app/actions/trails";
import { notFound } from "next/navigation";
import { CourseSelectionClient } from "@/components/trail/course-selection-client";

interface CourseSelectionPageProps {
  params: {
    id: string;
  };
}

export default async function CourseSelectionPage({ params }: CourseSelectionPageProps) {
  const { id } = await params;
  const trail = await getTrailByIdWithStats(id);

  if (!trail) {
    notFound();
  }

  return <CourseSelectionClient trail={trail} />;
}




