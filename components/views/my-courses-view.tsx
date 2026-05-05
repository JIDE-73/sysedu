"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users } from "lucide-react";
import { getMyCourses, type CourseWithTutor } from "@/hooks/course";
import type { Course, Place, Person, Session } from "@/lib/types";

interface MyCoursesViewProps {
  courses: Course[];
  places: Place[];
  persons: Person[];
  sessions: Session[];
  currentPersonId: number;
}

export function MyCoursesView({
  courses,
  places,
  persons,
  sessions,
  currentPersonId,
}: MyCoursesViewProps) {
  const [myCourses, setMyCourses] = useState<CourseWithTutor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await getMyCourses();
        if (res.data) {
          setMyCourses(res.data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyCourses();
  }, [currentPersonId]);

  const getPlace = (placeId: number) => places.find((p) => p.id === placeId);
  const getTutor = (tutorId: number) => persons.find((p) => p.id === tutorId);
  const getCourseSessions = (courseId: number) =>
    sessions.filter((s) => s.classId === courseId);
  const getParticipantCount = (course: Course) =>
    course.participantIds?.length || 0;

  const getNextSession = (courseId: number) => {
    const courseSessions = getCourseSessions(courseId);
    const now = new Date();
    return courseSessions
      .filter((s) => new Date(s.date_init) > now)
      .sort(
        (a, b) =>
          new Date(a.date_init).getTime() - new Date(b.date_init).getTime(),
      )[0];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completada":
        return "bg-green-100 text-green-800";
      case "en_progreso":
        return "bg-blue-100 text-blue-800";
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mis Cursos</h1>
        <p className="text-muted-foreground">
          Cursos en los que estas inscrito
        </p>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Cargando tus cursos...</p>
          </CardContent>
        </Card>
      ) : myCourses.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">
              No estas inscrito en ningun curso actualmente.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {myCourses.map((course) => {
            const place = getPlace(course.tutorId); // Fallback local o usar course.place del API
            const courseSessions = getCourseSessions(course.id);
            const nextSession = getNextSession(course.id);
            const completedSessions = courseSessions.filter(
              (s) => s.status === "completada",
            ).length;

            return (
              <Card key={course.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{course.name}</CardTitle>
                    <Badge variant="outline">{course.period}</Badge>
                  </div>
                  <CardDescription>
                    Tutor: {course.tutor?.name || "Sin asignar"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="size-4" />
                    <span>{course.place || "Sin lugar"}</span>
                    {/* {place?.busy && (
                      <Badge variant="destructive" className="text-xs">
                        Ocupado
                      </Badge>
                    )} */}
                  </div>

                  {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="size-4" />
                    <span>{getParticipantCount(course)} participantes</span>
                  </div> */}

                  {/* <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-medium">
                        {completedSessions} / {courseSessions.length} sesiones
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{
                          width: `${
                            courseSessions.length > 0
                              ? (completedSessions / courseSessions.length) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div> */}

                  {nextSession && (
                    <div className="rounded-lg border bg-muted/50 p-3">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Clock className="size-4" />
                        <span>Proxima sesion</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {new Date(nextSession.date_init).toLocaleDateString(
                          "es-ES",
                          {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          },
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(nextSession.date_init).toLocaleTimeString(
                          "es-ES",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}{" "}
                        -{" "}
                        {new Date(nextSession.date_end).toLocaleTimeString(
                          "es-ES",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                      <Badge
                        className={`mt-2 ${getStatusColor(nextSession.status)}`}
                      >
                        {nextSession.status}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
