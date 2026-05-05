"use client";

import { useState, useEffect } from "react";
import type { Course, Place, Person } from "@/lib/types";
import { getAllCourses, searchCourses, CourseFromAPI } from "@/hooks/course";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

interface CoursesViewProps {
  courses: Course[];
  places: Place[];
  persons: Person[];
  onAdd: (course: Omit<Course, "id">) => void;
  onUpdate: (id: number, course: Partial<Course>) => void;
  onDelete: (id: number) => void;
}

export function CoursesView({
  courses,
  places,
  persons,
  onAdd,
  onUpdate,
  onDelete,
}: CoursesViewProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [apiCourses, setApiCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const res = searchTerm.trim()
        ? await searchCourses(searchTerm)
        : await getAllCourses();

      if (res.data && res.data.courses) {
        const mapped: Course[] = res.data.courses.map((c: CourseFromAPI) => ({
          id: c.id,
          name: c.name,
          period: c.period,
          place: c.place,
          tutorId: c.tutorId,
        }));
        setApiCourses(mapped);
      }
    } catch (error) {
      console.error("Error al obtener cursos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCourses();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const displayedCourses =
    searchTerm || apiCourses.length > 0 ? apiCourses : courses;

  const [formData, setFormData] = useState({
    name: "",
    period: "",
    place: "",
    tutorId: 0,
  });

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setFormData({
      name: "",
      period: "",
      place: "",
      tutorId: 0,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      period: course.period,
      place: course.place,
      tutorId: course.tutorId,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingCourse) {
      onUpdate(editingCourse.id, formData);
    } else {
      onAdd(formData);
    }
    setIsDialogOpen(false);
  };

  const getPlaceName = (placeId: number) => {
    const place = places.find((p) => p.id === placeId);
    return place?.name || "No asignado";
  };

  const getTutorName = (tutorId: number) => {
    const tutor = persons.find((p) => p.id === tutorId);
    return tutor?.name || "No asignado";
  };

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

      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          placeholder="Buscar cursos por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm pl-9"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Periodo</TableHead>
              <TableHead>Lugar</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedCourses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  {isLoading
                    ? "Cargando cursos..."
                    : "No hay cursos registrados"}
                </TableCell>
              </TableRow>
            ) : (
              displayedCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.id}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.period}</TableCell>
                  <TableCell>{course.place}</TableCell>
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
              {editingCourse ? "Editar Curso" : "Crear Curso"}
            </DialogTitle>
            <DialogDescription>
              {editingCourse
                ? "Modifica los datos del curso"
                : "Ingresa los datos del nuevo curso"}
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
              <Label htmlFor="place">Lugar</Label>
              <Select
                value={formData.place}
                onValueChange={(value) =>
                  setFormData({ ...formData, place: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un lugar" />
                </SelectTrigger>
                <SelectContent>
                  {places.map((place) => (
                    <SelectItem key={place.id} value={place.name}>
                      {place.name} {place.busy && "(Ocupado)"}
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
              {editingCourse ? "Guardar Cambios" : "Crear Curso"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
