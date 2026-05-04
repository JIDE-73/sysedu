'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Mail, Phone, Building2, BookOpen, Clock } from 'lucide-react'
import type { Course, Person } from '@/lib/types'

interface MyTeachersViewProps {
  courses: Course[]
  persons: Person[]
  currentPersonId: number
}

export function MyTeachersView({
  courses,
  persons,
  currentPersonId,
}: MyTeachersViewProps) {
  // Get courses where current person is enrolled
  const myCourses = courses.filter(
    (course) => course.participantIds?.includes(currentPersonId)
  )

  // Get unique tutor IDs from my courses
  const myTutorIds = [...new Set(myCourses.map((c) => c.tutorId))]

  // Get tutor details
  const myTutors = persons.filter((p) => myTutorIds.includes(p.id))

  const getTutorCourses = (tutorId: number) =>
    myCourses.filter((c) => c.tutorId === tutorId)

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

  const formatWorkHours = (workHours: Record<string, unknown> | null) => {
    if (!workHours) return null
    return Object.entries(workHours).map(([day, hours]) => ({
      day: day.charAt(0).toUpperCase() + day.slice(1),
      hours: String(hours),
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mis Maestros</h1>
        <p className="text-muted-foreground">
          Tutores de los cursos en los que estas inscrito
        </p>
      </div>

      {myTutors.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">
              No tienes maestros asignados actualmente.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {myTutors.map((tutor) => {
            const tutorCourses = getTutorCourses(tutor.id)
            const workHours = formatWorkHours(tutor.work_hours)

            return (
              <Card key={tutor.id}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="size-16">
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                        {getInitials(tutor.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{tutor.name}</CardTitle>
                      {tutor.institution && (
                        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                          <Building2 className="size-4" />
                          <span>{tutor.institution}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {tutor.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="size-4 text-muted-foreground" />
                        <a
                          href={`mailto:${tutor.email}`}
                          className="text-primary hover:underline"
                        >
                          {tutor.email}
                        </a>
                      </div>
                    )}
                    {tutor.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="size-4 text-muted-foreground" />
                        <a
                          href={`tel:${tutor.phone}`}
                          className="text-primary hover:underline"
                        >
                          {tutor.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <BookOpen className="size-4" />
                      <span>Cursos que imparte</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tutorCourses.map((course) => (
                        <Badge key={course.id} variant="secondary">
                          {course.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {workHours && workHours.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Clock className="size-4" />
                        <span>Horario de trabajo</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {workHours.map(({ day, hours }) => (
                          <div
                            key={day}
                            className="flex justify-between rounded-md bg-muted px-3 py-2"
                          >
                            <span className="font-medium">{day}</span>
                            <span className="text-muted-foreground">{hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
