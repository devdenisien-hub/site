"use client";

import { CourseWithParticipants } from "@/app/actions/trails";
import { CourseEditDialog } from "@/components/course/course-edit-dialog";
import { ParticipantsTable } from "@/components/course/participants-table";
import { ExportCourseCSVButton } from "@/components/course/export-course-csv-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, CheckCircle, AlertCircle, Shirt } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CourseDetailClientProps {
  course: CourseWithParticipants;
}

export function CourseDetailClient({ course }: CourseDetailClientProps) {
  const router = useRouter();

  const handleCourseUpdated = () => {
    router.refresh();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/ghost/trail/${course.trail_id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au trail
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{course.nom}</h1>
          <p className="text-muted-foreground">
            Gérez les détails et participants de cette course
          </p>
        </div>
        <div className="flex gap-2">
          <ExportCourseCSVButton courseId={course.id} courseName={course.nom} />
          <CourseEditDialog course={course} onCourseUpdated={handleCourseUpdated} />
        </div>
      </div>

      {/* Statistiques générales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total inscrits</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{course.stats.total_inscriptions}</div>
            <div className="text-xs text-muted-foreground mt-1 space-y-1">
              <div className="flex justify-between">
                <span>Licenciés FFA:</span>
                <span className="font-medium text-blue-600">{course.stats.licencies_ffa}</span>
              </div>
              <div className="flex justify-between">
                <span>Non-licenciés:</span>
                <span className="font-medium text-orange-600">{course.stats.non_licencies}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inscriptions validées</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{course.stats.inscriptions_valide}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inscriptions incomplètes</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{course.stats.inscriptions_incomplet}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">T-shirts</CardTitle>
            <Shirt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>S:</span>
                <span className="font-medium">{course.stats.tailles_tshirt.s}</span>
              </div>
              <div className="flex justify-between">
                <span>M:</span>
                <span className="font-medium">{course.stats.tailles_tshirt.m}</span>
              </div>
              <div className="flex justify-between">
                <span>L:</span>
                <span className="font-medium">{course.stats.tailles_tshirt.l}</span>
              </div>
              <div className="flex justify-between">
                <span>XL:</span>
                <span className="font-medium">{course.stats.tailles_tshirt.xl}</span>
              </div>
              <div className="flex justify-between">
                <span>XXL:</span>
                <span className="font-medium">{course.stats.tailles_tshirt.xxl}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informations de la course */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de la course</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {course.description && (
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
            </div>
          )}
          
          <div className="grid gap-4 md:grid-cols-3">
            {course.distance_km && (
              <div>
                <h4 className="font-medium mb-1">Distance</h4>
                <p className="text-muted-foreground">{course.distance_km} km</p>
              </div>
            )}
            
            {course.denivele_positif && (
              <div>
                <h4 className="font-medium mb-1">Dénivelé positif</h4>
                <p className="text-muted-foreground">+{course.denivele_positif}m</p>
              </div>
            )}
            
            {course.difficulte && (
              <div>
                <h4 className="font-medium mb-1">Difficulté</h4>
                <Badge variant="outline">{course.difficulte}</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tableau des participants */}
      <Card>
        <CardHeader>
          <CardTitle>Participants ({course.stats.total_inscriptions})</CardTitle>
          <CardDescription>
            Liste des participants inscrits à cette course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ParticipantsTable participants={course.participants} />
        </CardContent>
      </Card>
    </div>
  );
}
