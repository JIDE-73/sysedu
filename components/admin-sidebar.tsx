"use client";

import {
  Users,
  UserCircle,
  BookOpen,
  MapPin,
  Calendar,
  LayoutDashboard,
  GraduationCap,
  BookMarked,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const mainMenuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    value: "dashboard",
  },
  {
    title: "Mis Cursos",
    icon: BookMarked,
    value: "my-courses",
  },
  {
    title: "Mis Maestros",
    icon: GraduationCap,
    value: "my-teachers",
  },
];

const adminMenuItems = [
  {
    title: "Usuarios",
    icon: Users,
    value: "users",
  },
  // {
  //   title: "Personas",
  //   icon: UserCircle,
  //   value: "persons",
  // },
  {
    title: "Cursos",
    icon: BookOpen,
    value: "courses",
  },
  // {
  //   title: "Lugares",
  //   icon: MapPin,
  //   value: "places",
  // },
  // {
  //   title: "Sesiones",
  //   icon: Calendar,
  //   value: "sessions",
  // },
];

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout?: () => void;
}

export function AdminSidebar({
  activeSection,
  onSectionChange,
  onLogout,
}: AdminSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <h2 className="text-lg font-semibold">Panel Admin</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Mi Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    isActive={activeSection === item.value}
                    onClick={() => onSectionChange(item.value)}
                  >
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Administracion</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    isActive={activeSection === item.value}
                    onClick={() => onSectionChange(item.value)}
                  >
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {onLogout && (
        <SidebarFooter className="border-t border-sidebar-border p-4">
          <Button variant="outline" className="w-full" onClick={onLogout}>
            <LogOut className="size-4" />
            Cerrar Sesión
          </Button>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
