import { request, setStorage } from "@/lib/req";

const login = async (body: { username: string; password: string }) => {
  const response = await request("/auth/login", "POST", body);
  if (response.status === 200 && response.data) {
    setStorage("user", response.data);
    return response;
  }
  return response;
};

export { login };
