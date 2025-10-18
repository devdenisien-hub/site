import { getTrailByIdWithStats, getCourseById } from "@/app/actions/trails";
import { notFound } from "next/navigation";
import { TrailInscriptionForm } from "@/components/trail/trail-inscription-form";

interface TrailInscriptionFormPageProps {
  params: {
    id: string; // trailId
    courseId: string;
  };
}

export default async function TrailInscriptionFormPage({ params }: TrailInscriptionFormPageProps) {
  const { id: trailId, courseId } = await params;
  
  const [trail, course] = await Promise.all([
    getTrailByIdWithStats(trailId),
    getCourseById(courseId)
  ]);

  if (!trail || !course) {
    notFound();
  }

  // Vérifier que la course appartient au trail
  if (course.trail_id !== trailId) {
    notFound();
  }

  return <TrailInscriptionForm trail={trail} course={course} />;
}




