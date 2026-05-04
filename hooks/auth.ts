import { request, setStorage, getStorage } from "@/lib/req";

const login = async (body: { username: string; password: string }) => {
    const response = await request("/auth/login", "POST", body);
    if (response.status === 200) {
        setStorage("user", response.user);
    }
};

export { login,  };