import { request, setStorage } from "@/lib/req";

const login = async (body: { username: string; password: string }) => {
  const response = await request("/auth/login", "POST", body);
    if (response.status === 200 && response.data) {
      console.log("login paso")
    setStorage("user", response.data);
    return response;
  }
  return response;
};

const logout = async () => {
  const response = await request("/auth/logout", "POST");
  if (response.status === 200) {
    localStorage.removeItem("user");
  }
  return response;
};

export { login, logout };
