"use client";

import { useState, useEffect } from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { LoginForm } from "@/components/login-form";
import { DashboardView } from "@/components/views/dashboard-view";
import { UsersView } from "@/components/views/users-view";
import { PersonsView } from "@/components/views/persons-view";
import { CoursesView } from "@/components/views/courses-view";
import { PlacesView } from "@/components/views/places-view";
import { SessionsView } from "@/components/views/sessions-view";
import { MyCoursesView } from "@/components/views/my-courses-view";
import { MyTeachersView } from "@/components/views/my-teachers-view";
import {
  mockUsers,
  mockPersons,
  mockCourses,
  mockPlaces,
  mockSessions,
  currentPersonId,
} from "@/lib/mock-data";
import { getStorage } from "@/lib/req";
import { logout } from "@/hooks/auth";
import type { User, Person, Course, Place, Session } from "@/lib/types";

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState("dashboard");

  // Auth state
  const [userAuth, setUserAuth] = useState<any>(null);

  // Local state for CRUD operations
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [persons, setPersons] = useState<Person[]>(mockPersons);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [places, setPlaces] = useState<Place[]>(mockPlaces);
  const [sessions, setSessions] = useState<Session[]>(mockSessions);

  useEffect(() => {
    const savedUser = getStorage("user");
    if (savedUser) {
      setUserAuth(savedUser);
    }
  }, []);

  // Users CRUD
  const handleAddUser = (user: Omit<User, "id">) => {
    const newUser = { ...user, id: Date.now() };
    setUsers([...users, newUser]);
  };

  const handleUpdateUser = (id: number, data: Partial<User>) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, ...data } : u)));
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  // Persons CRUD
  const handleAddPerson = (person: Omit<Person, "id">) => {
    const newPerson = { ...person, id: Date.now() };
    setPersons([...persons, newPerson]);
  };

  const handleUpdatePerson = (id: number, data: Partial<Person>) => {
    setPersons(persons.map((p) => (p.id === id ? { ...p, ...data } : p)));
  };

  const handleDeletePerson = (id: number) => {
    setPersons(persons.filter((p) => p.id !== id));
  };

  // Courses CRUD
  const handleAddCourse = (course: Omit<Course, "id">) => {
    const newCourse = { ...course, id: Date.now() };
    setCourses([...courses, newCourse]);
  };

  const handleUpdateCourse = (id: number, data: Partial<Course>) => {
    setCourses(courses.map((c) => (c.id === id ? { ...c, ...data } : c)));
  };

  const handleDeleteCourse = (id: number) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  // Places CRUD
  const handleAddPlace = (place: Omit<Place, "id">) => {
    const newPlace = { ...place, id: Date.now() };
    setPlaces([...places, newPlace]);
  };

  const handleUpdatePlace = (id: number, data: Partial<Place>) => {
    setPlaces(places.map((p) => (p.id === id ? { ...p, ...data } : p)));
  };

  const handleDeletePlace = (id: number) => {
    setPlaces(places.filter((p) => p.id !== id));
  };

  // Sessions CRUD
  const handleAddSession = (session: Omit<Session, "id">) => {
    const newSession = { ...session, id: Date.now() };
    setSessions([...sessions, newSession]);
  };

  const handleUpdateSession = (id: number, data: Partial<Session>) => {
    setSessions(sessions.map((s) => (s.id === id ? { ...s, ...data } : s)));
  };

  const handleDeleteSession = (id: number) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };

  const handleLoginSuccess = () => {
    setUserAuth(getStorage("user"));
  };

  const handleLogout = async () => {
    const response = await logout();
    if (response.status === 200) {
      setUserAuth(null);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <DashboardView
            stats={{
              users: users.length,
              persons: persons.length,
              courses: courses.length,
              places: places.length,
              sessions: sessions.length,
            }}
            courses={courses}
            persons={persons}
            places={places}
            sessions={sessions}
            currentPersonId={currentPersonId}
          />
        );
      case "my-courses":
        return (
          <MyCoursesView
            courses={courses}
            places={places}
            persons={persons}
            sessions={sessions}
            currentPersonId={currentPersonId}
          />
        );
      case "my-teachers":
        return (
          <MyTeachersView
            courses={courses}
            persons={persons}
            currentPersonId={currentPersonId}
          />
        );
      case "users":
        return (
          <UsersView
            users={users}
            persons={persons}
            onAdd={handleAddUser}
            onUpdate={handleUpdateUser}
            onDelete={handleDeleteUser}
          />
        );
      case "persons":
        return (
          <PersonsView
            persons={persons}
            onAdd={handleAddPerson}
            onUpdate={handleUpdatePerson}
            onDelete={handleDeletePerson}
          />
        );
      case "courses":
        return (
          <CoursesView
            courses={courses}
            places={places}
            persons={persons}
            onAdd={handleAddCourse}
            onUpdate={handleUpdateCourse}
            onDelete={handleDeleteCourse}
          />
        );
      case "places":
        return (
          <PlacesView
            places={places}
            onAdd={handleAddPlace}
            onUpdate={handleUpdatePlace}
            onDelete={handleDeletePlace}
          />
        );
      case "sessions":
        return (
          <SessionsView
            sessions={sessions}
            courses={courses}
            onAdd={handleAddSession}
            onUpdate={handleUpdateSession}
            onDelete={handleDeleteSession}
          />
        );
      default:
        return null;
    }
  };

  if (!userAuth) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <SidebarProvider>
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
      />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <span className="text-sm text-muted-foreground">
            Panel de Administracion
          </span>
        </header>
        <main className="flex-1 p-6">{renderContent()}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
