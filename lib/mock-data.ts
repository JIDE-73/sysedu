import type { User, Person, Course, Place, Session } from './types'

export const mockPlaces: Place[] = [
  { id: 1, name: 'Sala A101', busy: false },
  { id: 2, name: 'Sala B202', busy: true },
  { id: 3, name: 'Laboratorio 1', busy: false },
  { id: 4, name: 'Auditorio Principal', busy: false },
]

export const mockPersons: Person[] = [
  {
    id: 1,
    userId: 1,
    name: 'Juan Perez',
    phone: '+1234567890',
    email: 'juan@email.com',
    work_hours: { lunes: '08:00-17:00', martes: '08:00-17:00' },
    institution: 'Universidad Nacional',
  },
  {
    id: 2,
    userId: 2,
    name: 'Maria Garcia',
    phone: '+0987654321',
    email: 'maria@email.com',
    work_hours: { lunes: '09:00-18:00', miercoles: '09:00-18:00' },
    institution: 'Instituto Tecnologico',
  },
  {
    id: 3,
    userId: 3,
    name: 'Carlos Lopez',
    phone: '+1122334455',
    email: 'carlos@email.com',
    work_hours: null,
    institution: 'Centro de Capacitacion',
  },
  {
    id: 4,
    userId: 4,
    name: 'Ana Martinez',
    phone: '+5566778899',
    email: 'ana@email.com',
    work_hours: { lunes: '07:00-15:00', viernes: '07:00-15:00' },
    institution: 'Universidad Nacional',
  },
]

export const mockUsers: User[] = [
  {
    id: 1,
    personId: 1,
    username: 'jperez',
    password: '********',
    role: 'admin',
    image: null,
  },
  {
    id: 2,
    personId: 2,
    username: 'mgarcia',
    password: '********',
    role: 'tutor',
    image: null,
  },
  {
    id: 3,
    personId: 3,
    username: 'clopez',
    password: '********',
    role: 'student',
    image: null,
  },
  {
    id: 4,
    personId: 4,
    username: 'amartinez',
    password: '********',
    role: 'student',
    image: null,
  },
]

// Courses with participants array (person IDs enrolled in each course)
export const mockCourses: Course[] = [
  {
    id: 1,
    placeId: 1,
    tutorId: 1,
    name: 'Introduccion a React',
    period: '2024-Q1',
    participantIds: [3, 4], // Carlos and Ana are enrolled
  },
  {
    id: 2,
    placeId: 2,
    tutorId: 2,
    name: 'Bases de Datos Avanzadas',
    period: '2024-Q1',
    participantIds: [3], // Carlos is enrolled
  },
  {
    id: 3,
    placeId: 3,
    tutorId: 1,
    name: 'Desarrollo Web Full Stack',
    period: '2024-Q2',
    participantIds: [4], // Ana is enrolled
  },
]

// Sessions with person IDs who attended
export const mockSessions: Session[] = [
  {
    id: 1,
    classId: 1,
    date_init: '2024-03-01T08:00:00',
    date_end: '2024-03-01T12:00:00',
    hours_day: 4,
    total_hours: 4,
    status: 'completada',
    personIds: [3, 4],
  },
  {
    id: 2,
    classId: 1,
    date_init: '2024-03-05T08:00:00',
    date_end: '2024-03-05T12:00:00',
    hours_day: 4,
    total_hours: 8,
    status: 'pendiente',
    personIds: [3, 4],
  },
  {
    id: 3,
    classId: 2,
    date_init: '2024-03-10T14:00:00',
    date_end: '2024-03-10T18:00:00',
    hours_day: 4,
    total_hours: 4,
    status: 'en_progreso',
    personIds: [3],
  },
  {
    id: 4,
    classId: 3,
    date_init: '2024-04-01T09:00:00',
    date_end: '2024-04-01T13:00:00',
    hours_day: 4,
    total_hours: 4,
    status: 'pendiente',
    personIds: [4],
  },
]

// Current logged in user (simulated - person ID 3, Carlos Lopez, a student)
export const currentUserId = 3
export const currentPersonId = 3
