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
