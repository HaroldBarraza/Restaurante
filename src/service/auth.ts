import { api } from "../libs/axios";
import type { LoginFormData } from "../schema/loginSchema";
import { RegisterFormData } from "../schema/registerSchema";

const ROLES: Record<number, string> = {
  1: "Administrador",
  2: "Cocina",
  4: "Cliente",
};

interface TokenResponse {
  access_token: string;
  token_type: string;
  usuario_id: string;
  rol_id: string;
  nombre_completo: string;
  email: string;
}

export interface LoginResponse {
  access_token: string;
  nombre: string;
  rol: string;
}

export const authService = {
  login: async (datos: LoginFormData): Promise<LoginResponse> => {
    const { data } = await api.post<TokenResponse>("/auth/login", datos);
    return {
      access_token: data.access_token,
      nombre: data.nombre_completo,
      rol: ROLES[data.rol_id] ?? "Cliente",
    };
  },
  register: async (datos: RegisterFormData): Promise<LoginResponse> => {
    const { data } = await api.post<TokenResponse>("/auth/register", datos);
    return {
      access_token: data.access_token,
      nombre: data.nombre_completo,
      rol: ROLES[data.rol_id] ?? "Cliente",
    };
  },
};
