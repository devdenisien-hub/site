import { getCourseById } from "@/app/actions/trails";
import { notFound } from "next/navigation";
import { CourseDetailClient } from "@/components/course/course-detail-client";

interface CourseDetailPageProps {
  params: {
    id: string;
  };
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = await params;
  const course = await getCourseById(id);

  if (!course) {
    notFound();
  }

  return <CourseDetailClient course={course} />;
}
