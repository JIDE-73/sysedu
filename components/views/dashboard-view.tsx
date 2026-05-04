'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Users, UserCircle, BookOpen, MapPin, Calendar, Clock } from 'lucide-react'
import type { Course, Person, Place, Session } from '@/lib/types'

interface DashboardViewProps {
  stats: {
    users: number
    persons: number
    courses: number
    places: number
    sessions: number
  }
  courses: Course[]
  persons: Person[]
  places: Place[]
  sessions: Session[]
  currentPersonId: number
}

export function DashboardView({
  stats,
  courses,
  persons,
  places,
  sessions,
  currentPersonId,
}: DashboardViewProps) {
  const cards = [
    { title: 'Usuarios', value: stats.users, icon: Users, color: 'text-blue-600' },
    { title: 'Personas', value: stats.persons, icon: UserCircle, color: 'text-green-600' },
    { title: 'Cursos', value: stats.courses, icon: BookOpen, color: 'text-orange-600' },
    { title: 'Lugares', value: stats.places, icon: MapPin, color: 'text-purple-600' },
    { title: 'Sesiones', value: stats.sessions, icon: Calendar, color: 'text-red-600' },
  ]

  // Get courses where current person is enrolled
  const myCourses = courses.filter(
    (course) => course.participantIds?.includes(currentPersonId)
  )
  const myCourseIds = myCourses.map((c) => c.id)

  // Get sessions for enrolled courses
  const mySessions = sessions
    .filter((session) => myCourseIds.includes(session.classId))
    .sort((a, b) => new Date(a.date_init).getTime() - new Date(b.date_init).getTime())

  const getCourse = (classId: number) => courses.find((c) => c.id === classId)
  const getPlace = (placeId: number) => places.find((p) => p.id === placeId)
  const getTutor = (tutorId: number) => persons.find((p) => p.id === tutorId)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completada':
        return <Badge className="bg-green-100 text-green-800">Completada</Badge>
      case 'en_progreso':
        return <Badge className="bg-blue-100 text-blue-800">En Progreso</Badge>
      case 'pendiente':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateStr: string | Date) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
  }

  const formatTime = (dateStr: string | Date) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Get upcoming and recent sessions
  const now = new Date()
  const upcomingSessions = mySessions.filter(
    (s) => new Date(s.date_init) >= now || s.status === 'en_progreso'
  )
  const recentSessions = mySessions
    .filter((s) => new Date(s.date_end) < now && s.status === 'completada')
    .slice(-3)
    .reverse()

  const currentPerson = persons.find((p) => p.id === currentPersonId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido, {currentPerson?.name || 'Usuario'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`size-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-5 text-blue-600" />
              Proximas Sesiones
            </CardTitle>
            <CardDescription>
              Sesiones programadas de tus cursos inscritos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingSessions.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground">
                No tienes sesiones proximas programadas
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Curso</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Horario</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingSessions.slice(0, 5).map((session) => {
                    const course = getCourse(session.classId)
                    return (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium">
                          {course?.name || 'Sin curso'}
                        </TableCell>
                        <TableCell>{formatDate(session.date_init)}</TableCell>
                        <TableCell>
                          {formatTime(session.date_init)} - {formatTime(session.date_end)}
                        </TableCell>
                        <TableCell>{getStatusBadge(session.status)}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* My Enrolled Courses Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="size-5 text-orange-600" />
              Mis Cursos
            </CardTitle>
            <CardDescription>
              Resumen de cursos en los que estas inscrito
            </CardDescription>
          </CardHeader>
          <CardContent>
            {myCourses.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground">
                No estas inscrito en ningun curso
              </p>
            ) : (
              <div className="space-y-4">
                {myCourses.map((course) => {
                  const place = getPlace(course.placeId)
                  const tutor = getTutor(course.tutorId)
                  const courseSessions = sessions.filter(
                    (s) => s.classId === course.id
                  )
                  const completedCount = courseSessions.filter(
                    (s) => s.status === 'completada'
                  ).length

                  return (
                    <div
                      key={course.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{course.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {tutor?.name || 'Sin tutor'} | {place?.name || 'Sin lugar'}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{course.period}</Badge>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {completedCount}/{courseSessions.length} sesiones
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Completed Sessions */}
      {recentSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="size-5 text-green-600" />
              Sesiones Recientes Completadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Curso</TableHead>
                  <TableHead>Tutor</TableHead>
                  <TableHead>Lugar</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Horas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSessions.map((session) => {
                  const course = getCourse(session.classId)
                  const tutor = course ? getTutor(course.tutorId) : null
                  const place = course ? getPlace(course.placeId) : null
                  return (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">
                        {course?.name || 'Sin curso'}
                      </TableCell>
                      <TableCell>{tutor?.name || '-'}</TableCell>
                      <TableCell>{place?.name || '-'}</TableCell>
                      <TableCell>{formatDate(session.date_init)}</TableCell>
                      <TableCell>{session.hours_day}h</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
