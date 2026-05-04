'use client'

import { useState } from 'react'
import type { Course, Place, Person } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Pencil, Trash2 } from 'lucide-react'

interface CoursesViewProps {
  courses: Course[]
  places: Place[]
  persons: Person[]
  onAdd: (course: Omit<Course, 'id'>) => void
  onUpdate: (id: number, course: Partial<Course>) => void
  onDelete: (id: number) => void
}

export function CoursesView({
  courses,
  places,
  persons,
  onAdd,
  onUpdate,
  onDelete,
}: CoursesViewProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    period: '',
    placeId: 0,
    tutorId: 0,
  })

  const handleOpenCreate = () => {
    setEditingCourse(null)
    setFormData({
      name: '',
      period: '',
      placeId: 0,
      tutorId: 0,
    })
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (course: Course) => {
    setEditingCourse(course)
    setFormData({
      name: course.name,
      period: course.period,
      placeId: course.placeId,
      tutorId: course.tutorId,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    if (editingCourse) {
      onUpdate(editingCourse.id, formData)
    } else {
      onAdd(formData)
    }
    setIsDialogOpen(false)
  }

  const getPlaceName = (placeId: number) => {
    const place = places.find((p) => p.id === placeId)
    return place?.name || 'No asignado'
  }

  const getTutorName = (tutorId: number) => {
    const tutor = persons.find((p) => p.id === tutorId)
    return tutor?.name || 'No asignado'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cursos</h1>
          <p className="text-muted-foreground">Gestion de cursos y clases</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 size-4" />
          Nuevo Curso
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Periodo</TableHead>
              <TableHead>Lugar</TableHead>
              <TableHead>Tutor</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No hay cursos registrados
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.id}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.period}</TableCell>
                  <TableCell>{getPlaceName(course.placeId)}</TableCell>
                  <TableCell>{getTutorName(course.tutorId)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(course)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(course.id)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCourse ? 'Editar Curso' : 'Crear Curso'}
            </DialogTitle>
            <DialogDescription>
              {editingCourse
                ? 'Modifica los datos del curso'
                : 'Ingresa los datos del nuevo curso'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre del Curso</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="period">Periodo</Label>
              <Input
                id="period"
                value={formData.period}
                onChange={(e) =>
                  setFormData({ ...formData, period: e.target.value })
                }
                placeholder="Ej: 2024-Q1"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="placeId">Lugar</Label>
              <Select
                value={formData.placeId.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, placeId: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un lugar" />
                </SelectTrigger>
                <SelectContent>
                  {places.map((place) => (
                    <SelectItem key={place.id} value={place.id.toString()}>
                      {place.name} {place.busy && '(Ocupado)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tutorId">Tutor</Label>
              <Select
                value={formData.tutorId.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, tutorId: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tutor" />
                </SelectTrigger>
                <SelectContent>
                  {persons.map((person) => (
                    <SelectItem key={person.id} value={person.id.toString()}>
                      {person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {editingCourse ? 'Guardar Cambios' : 'Crear Curso'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
