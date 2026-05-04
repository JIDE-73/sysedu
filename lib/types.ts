// Types based on Prisma schema

export interface User {
  id: number
  personId: number
  username: string
  password: string
  role: string | null
  image: string | null
  person?: Person
}

export interface Person {
  id: number
  userId: number
  name: string
  phone: string | null
  email: string
  work_hours: Record<string, unknown> | null
  institution: string | null
  courses?: Course[]
  tutorCourses?: Course[]
  sessions?: Session[]
  user?: User
}

export interface Course {
  id: number
  placeId: number
  tutorId: number
  name: string
  period: string
  session?: Session[]
  participants?: Person[]
  participantIds?: number[] // For mock data tracking
  place?: Place
  tutor?: Person
}

export interface Place {
  id: number
  name: string
  busy: boolean
  courses?: Course[]
}

export interface Session {
  id: number
  classId: number
  date_init: Date | string
  date_end: Date | string
  hours_day: number
  total_hours: number
  status: string
  persons?: Person[]
  personIds?: number[] // For mock data tracking
  courses?: Course
}
