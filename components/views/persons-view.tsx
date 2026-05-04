'use client'

import { useState } from 'react'
import type { Person } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { Plus, Pencil, Trash2, Clock } from 'lucide-react'

interface PersonsViewProps {
  persons: Person[]
  onAdd: (person: Omit<Person, 'id'>) => void
  onUpdate: (id: number, person: Partial<Person>) => void
  onDelete: (id: number) => void
}

export function PersonsView({ persons, onAdd, onUpdate, onDelete }: PersonsViewProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isWorkHoursDialogOpen, setIsWorkHoursDialogOpen] = useState(false)
  const [editingPerson, setEditingPerson] = useState<Person | null>(null)
  const [viewingWorkHours, setViewingWorkHours] = useState<Person | null>(null)
  const [formData, setFormData] = useState({
    userId: 0,
    name: '',
    phone: '',
    email: '',
    institution: '',
    work_hours: '',
  })

  const handleOpenCreate = () => {
    setEditingPerson(null)
    setFormData({
      userId: Date.now(),
      name: '',
      phone: '',
      email: '',
      institution: '',
      work_hours: '',
    })
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (person: Person) => {
    setEditingPerson(person)
    setFormData({
      userId: person.userId,
      name: person.name,
      phone: person.phone || '',
      email: person.email,
      institution: person.institution || '',
      work_hours: person.work_hours ? JSON.stringify(person.work_hours, null, 2) : '',
    })
    setIsDialogOpen(true)
  }

  const handleViewWorkHours = (person: Person) => {
    setViewingWorkHours(person)
    setIsWorkHoursDialogOpen(true)
  }

  const handleSubmit = () => {
    let workHoursJson = null
    if (formData.work_hours.trim()) {
      try {
        workHoursJson = JSON.parse(formData.work_hours)
      } catch {
        alert('El formato de work_hours debe ser JSON valido')
        return
      }
    }

    if (editingPerson) {
      onUpdate(editingPerson.id, {
        userId: formData.userId,
        name: formData.name,
        phone: formData.phone || null,
        email: formData.email,
        institution: formData.institution || null,
        work_hours: workHoursJson,
      })
    } else {
      onAdd({
        userId: formData.userId,
        name: formData.name,
        phone: formData.phone || null,
        email: formData.email,
        institution: formData.institution || null,
        work_hours: workHoursJson,
      })
    }
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Personas</h1>
          <p className="text-muted-foreground">Gestion de datos personales</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 size-4" />
          Nueva Persona
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefono</TableHead>
              <TableHead>Institucion</TableHead>
              <TableHead>Horarios</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {persons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No hay personas registradas
                </TableCell>
              </TableRow>
            ) : (
              persons.map((person) => (
                <TableRow key={person.id}>
                  <TableCell className="font-medium">{person.id}</TableCell>
                  <TableCell>{person.name}</TableCell>
                  <TableCell>{person.email}</TableCell>
                  <TableCell>{person.phone || '-'}</TableCell>
                  <TableCell>{person.institution || '-'}</TableCell>
                  <TableCell>
                    {person.work_hours ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewWorkHours(person)}
                      >
                        <Clock className="mr-1 size-4" />
                        Ver
                      </Button>
                    ) : (
                      <span className="text-muted-foreground">No definido</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(person)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(person.id)}
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

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPerson ? 'Editar Persona' : 'Crear Persona'}
            </DialogTitle>
            <DialogDescription>
              {editingPerson
                ? 'Modifica los datos de la persona'
                : 'Ingresa los datos de la nueva persona'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="institution">Institucion</Label>
                <Input
                  id="institution"
                  value={formData.institution}
                  onChange={(e) =>
                    setFormData({ ...formData, institution: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="work_hours">
                Horarios de Trabajo (JSON)
              </Label>
              <Textarea
                id="work_hours"
                className="font-mono text-sm"
                rows={6}
                value={formData.work_hours}
                onChange={(e) =>
                  setFormData({ ...formData, work_hours: e.target.value })
                }
                placeholder='{"lunes": "08:00-17:00", "martes": "08:00-17:00"}'
              />
              <p className="text-xs text-muted-foreground">
                Formato JSON. Ejemplo: {`{"lunes": "08:00-17:00", "martes": "09:00-18:00"}`}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {editingPerson ? 'Guardar Cambios' : 'Crear Persona'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Work Hours View Dialog */}
      <Dialog open={isWorkHoursDialogOpen} onOpenChange={setIsWorkHoursDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Horarios de Trabajo</DialogTitle>
            <DialogDescription>
              {viewingWorkHours?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-md bg-muted p-4">
            <pre className="text-sm">
              {viewingWorkHours?.work_hours
                ? JSON.stringify(viewingWorkHours.work_hours, null, 2)
                : 'No hay horarios definidos'}
            </pre>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsWorkHoursDialogOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
