import { request } from "@/lib/req";

export interface UserByRole {
  id: number;
  userId: number;
  name: string;
  phone: string | null;
  email: string;
  work_hours: string | null;
  institution: string | null;
  role: string;
}

export interface GetUsersByRoleResponse {
  message: string;
  data: UserByRole[];
  pagination: {
    page: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const getUsersByRole = async (
  role: string = "Estudiante",
  page: number = 1,
): Promise<GetUsersByRoleResponse> => {
  const response = await request(
    `/users/get-by-role/${role}?page=${page}`,
    "GET",
  );
  return response as GetUsersByRoleResponse;
};

export interface CourseFromAPI {
  id: number;
  tutorId: number;
  name: string;
  period: string;
  place: string;
  date_init: string;
  date_end: string;
  hours_day: number;
  total_hours: number;
  status: string;
}

export interface GetCoursesResponse {
  message: string;
  data: {
    courses: CourseFromAPI[];
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const getAllCourses = async (
  page: number = 1,
): Promise<GetCoursesResponse> => {
  const response = await request(`/courses/get-all?page=${page}`, "GET");
  return response as GetCoursesResponse;
};

export const searchCourses = async (
  search: string,
  page: number = 1,
): Promise<GetCoursesResponse> => {
  const response = await request(
    `/courses/search/${search}?page=${page}`,
    "GET",
  );
  return response as GetCoursesResponse;
};
