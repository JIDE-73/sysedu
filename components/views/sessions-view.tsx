'use client'

import { useState, useMemo } from 'react'
import type { Session, Course } from '@/lib/types'
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
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2 } from 'lucide-react'

interface SessionsViewProps {
  sessions: Session[]
  courses: Course[]
  onAdd: (session: Omit<Session, 'id'>) => void
  onUpdate: (id: number, session: Partial<Session>) => void
  onDelete: (id: number) => void
}

export function SessionsView({
  sessions,
  courses,
  onAdd,
  onUpdate,
  onDelete,
}: SessionsViewProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSession, setEditingSession] = useState<Session | null>(null)
  const [formData, setFormData] = useState({
    classId: 0,
    date_init: '',
    date_end: '',
    hours_day: 0,
    total_hours: 0,
    status: '',
  })

  // Calculate hours when dates change
  const calculateHours = (dateInit: string, dateEnd: string) => {
    if (!dateInit || !dateEnd) return { hours_day: 0, total_hours: 0 }
    
    const start = new Date(dateInit)
    const end = new Date(dateEnd)
    const diffMs = end.getTime() - start.getTime()
    const diffHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)))
    
    return {
      hours_day: diffHours,
      total_hours: diffHours,
    }
  }

  const handleDateChange = (field: 'date_init' | 'date_end', value: string) => {
    const newFormData = { ...formData, [field]: value }
    const calculatedHours = calculateHours(
      field === 'date_init' ? value : formData.date_init,
      field === 'date_end' ? value : formData.date_end
    )
    setFormData({
      ...newFormData,
      hours_day: calculatedHours.hours_day,
      total_hours: calculatedHours.total_hours,
    })
  }

  const handleOpenCreate = () => {
    setEditingSession(null)
    setFormData({
      classId: 0,
      date_init: '',
      date_end: '',
      hours_day: 0,
      total_hours: 0,
      status: 'pendiente',
    })
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (session: Session) => {
    setEditingSession(session)
    const dateInit = typeof session.date_init === 'string' 
      ? session.date_init.slice(0, 16) 
      : new Date(session.date_init).toISOString().slice(0, 16)
    const dateEnd = typeof session.date_end === 'string'
      ? session.date_end.slice(0, 16)
      : new Date(session.date_end).toISOString().slice(0, 16)
    
    setFormData({
      classId: session.classId,
      date_init: dateInit,
      date_end: dateEnd,
      hours_day: session.hours_day,
      total_hours: session.total_hours,
      status: session.status,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    if (editingSession) {
      onUpdate(editingSession.id, formData)
    } else {
      onAdd(formData)
    }
    setIsDialogOpen(false)
  }

  const getCourseName = (classId: number) => {
    const course = courses.find((c) => c.id === classId)
    return course?.name || 'No asignado'
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completada':
        return 'default'
      case 'en_progreso':
        return 'secondary'
      case 'pendiente':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sesiones</h1>
          <p className="text-muted-foreground">Gestion de sesiones de clase</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 size-4" />
          Nueva Sesion
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Fecha Inicio</TableHead>
              <TableHead>Fecha Fin</TableHead>
              <TableHead>Horas/Dia</TableHead>
              <TableHead>Total Horas</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No hay sesiones registradas
                </TableCell>
              </TableRow>
            ) : (
              sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{session.id}</TableCell>
                  <TableCell>{getCourseName(session.classId)}</TableCell>
                  <TableCell>{formatDate(session.date_init)}</TableCell>
                  <TableCell>{formatDate(session.date_end)}</TableCell>
                  <TableCell>{session.hours_day}h</TableCell>
                  <TableCell>{session.total_hours}h</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(session.status)}>
                      {session.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(session)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(session.id)}
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingSession ? 'Editar Sesion' : 'Crear Sesion'}
            </DialogTitle>
            <DialogDescription>
              {editingSession
                ? 'Modifica los datos de la sesion'
                : 'Ingresa los datos de la nueva sesion'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="classId">Curso</Label>
              <Select
                value={formData.classId.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, classId: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un curso" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date_init">Fecha/Hora Inicio</Label>
                <Input
                  id="date_init"
                  type="datetime-local"
                  value={formData.date_init}
                  onChange={(e) => handleDateChange('date_init', e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="date_end">Fecha/Hora Fin</Label>
                <Input
                  id="date_end"
                  type="datetime-local"
                  value={formData.date_end}
                  onChange={(e) => handleDateChange('date_end', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="hours_day">Horas/Dia (calculado)</Label>
                <Input
                  id="hours_day"
                  type="number"
                  value={formData.hours_day}
                  onChange={(e) =>
                    setFormData({ ...formData, hours_day: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="total_hours">Total Horas</Label>
                <Input
                  id="total_hours"
                  type="number"
                  value={formData.total_hours}
                  onChange={(e) =>
                    setFormData({ ...formData, total_hours: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="en_progreso">En Progreso</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {editingSession ? 'Guardar Cambios' : 'Crear Sesion'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
