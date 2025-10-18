import { getCourseById } from "@/app/actions/trails";
import { notFound } from "next/navigation";
import { CourseParticipantsClient } from "@/components/course/course-participants-client";

interface CourseParticipantsPageProps {
  params: {
    id: string;
  };
}

export default async function CourseParticipantsPage({ params }: CourseParticipantsPageProps) {
  const { id } = await params;
  const course = await getCourseById(id);

  if (!course) {
    notFound();
  }

  return <CourseParticipantsClient course={course} />;
}




