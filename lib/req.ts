// Import toast from sonner for error handling
import { toast } from "sonner";

const baseUrl = `${process.env.NEXT_PUBLIC_BU}`;

const setStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getStorage = (key: string) => {
  const item = localStorage.getItem(key);
  if (!item) return null;
  try {
    return JSON.parse(item);
  } catch {
    return null;
  }
};

const request = async (url: string, method: string, body?: any) => {
  const hasJsonBody = body !== undefined && method !== "GET";

  const response = await fetch(`${baseUrl}${url}`, {
    method,
    body: hasJsonBody ? JSON.stringify(body) : undefined,
    headers: hasJsonBody
      ? {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getStorage("user")?.token || ""}`,
        }
      : undefined,
  });

  const raw = await response.text();
  let data: any = {};

  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = { raw };
    }
  }

  // Handle toast notifications based on status
  if (response.status > 200 && response.status < 300) {
    const successMessage = data.message || "Operación realizada exitosamente";
    toast.success(successMessage);
  } else if (response.status >= 400) {
    const errorMessage =
      data.message || data.error || "Ha ocurrido un error en la solicitud";
    toast.error(errorMessage, {
      description:
        response.status >= 400 && response.status < 500
          ? "Error de validación"
          : "Error del servidor",
    });
  }

  return { status: response.status, ...data };
};
export { request, setStorage, getStorage };
