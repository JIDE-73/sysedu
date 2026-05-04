'use client'

import { useState } from 'react'
import type { User, Person } from '@/lib/types'
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

interface UsersViewProps {
  users: User[]
  persons: Person[]
  onAdd: (user: Omit<User, 'id'>) => void
  onUpdate: (id: number, user: Partial<User>) => void
  onDelete: (id: number) => void
}

export function UsersView({ users, persons, onAdd, onUpdate, onDelete }: UsersViewProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    personId: 0,
    username: '',
    password: '',
    role: '',
    image: '',
  })

  const handleOpenCreate = () => {
    setEditingUser(null)
    setFormData({
      personId: 0,
      username: '',
      password: '',
      role: '',
      image: '',
    })
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      personId: user.personId,
      username: user.username,
      password: '',
      role: user.role || '',
      image: user.image || '',
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    if (editingUser) {
      onUpdate(editingUser.id, {
        ...formData,
        role: formData.role || null,
        image: formData.image || null,
      })
    } else {
      onAdd({
        ...formData,
        role: formData.role || null,
        image: formData.image || null,
      })
    }
    setIsDialogOpen(false)
  }

  const getPersonName = (personId: number) => {
    const person = persons.find(p => p.id === personId)
    return person?.name || 'No asignado'
  }

  const getRoleBadgeVariant = (role: string | null) => {
    switch (role) {
      case 'admin':
        return 'destructive'
      case 'tutor':
        return 'default'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Usuarios</h1>
          <p className="text-muted-foreground">Gestion de credenciales y roles</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 size-4" />
          Nuevo Usuario
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Persona</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Imagen</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No hay usuarios registrados
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{getPersonName(user.personId)}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role || 'Sin rol'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.image ? (
                      <span className="text-green-600">Configurada</span>
                    ) : (
                      <span className="text-muted-foreground">Sin imagen</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(user)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(user.id)}
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
              {editingUser ? 'Editar Usuario' : 'Crear Usuario'}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? 'Modifica los datos del usuario'
                : 'Ingresa los datos del nuevo usuario'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="personId">Persona</Label>
              <Select
                value={formData.personId.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, personId: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una persona" />
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

            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">
                Password {editingUser && '(dejar vacio para no cambiar)'}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Rol</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="tutor">Tutor</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">URL de Imagen</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
