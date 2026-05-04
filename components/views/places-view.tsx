'use client'

import { useState } from 'react'
import type { Place } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2 } from 'lucide-react'

interface PlacesViewProps {
  places: Place[]
  onAdd: (place: Omit<Place, 'id'>) => void
  onUpdate: (id: number, place: Partial<Place>) => void
  onDelete: (id: number) => void
}

export function PlacesView({ places, onAdd, onUpdate, onDelete }: PlacesViewProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPlace, setEditingPlace] = useState<Place | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    busy: false,
  })

  const handleOpenCreate = () => {
    setEditingPlace(null)
    setFormData({
      name: '',
      busy: false,
    })
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (place: Place) => {
    setEditingPlace(place)
    setFormData({
      name: place.name,
      busy: place.busy,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    if (editingPlace) {
      onUpdate(editingPlace.id, formData)
    } else {
      onAdd(formData)
    }
    setIsDialogOpen(false)
  }

  const handleToggleBusy = (place: Place) => {
    onUpdate(place.id, { busy: !place.busy })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lugares</h1>
          <p className="text-muted-foreground">Gestion de espacios y salas</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 size-4" />
          Nuevo Lugar
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Ocupado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {places.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No hay lugares registrados
                </TableCell>
              </TableRow>
            ) : (
              places.map((place) => (
                <TableRow key={place.id}>
                  <TableCell className="font-medium">{place.id}</TableCell>
                  <TableCell>{place.name}</TableCell>
                  <TableCell>
                    <Badge variant={place.busy ? 'destructive' : 'secondary'}>
                      {place.busy ? 'Ocupado' : 'Disponible'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={place.busy}
                      onCheckedChange={() => handleToggleBusy(place)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(place)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(place.id)}
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
              {editingPlace ? 'Editar Lugar' : 'Crear Lugar'}
            </DialogTitle>
            <DialogDescription>
              {editingPlace
                ? 'Modifica los datos del lugar'
                : 'Ingresa los datos del nuevo lugar'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre del Lugar</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="busy"
                checked={formData.busy}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, busy: checked })
                }
              />
              <Label htmlFor="busy">Marcar como ocupado</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {editingPlace ? 'Guardar Cambios' : 'Crear Lugar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
