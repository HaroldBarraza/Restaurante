import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  usuarioNombre: string | null;
  usuarioRol: string | null;
  autenticado: boolean;

  login: (token: string, nombre: string, rol: string) => void;
  logout: () => void;
  esAdmin: () => boolean;
  esCocina: () => boolean;
  esCliente: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist((set, get) => ({
    token: null,
    usuarioNombre: null,
    usuarioRol: null,
    autenticado: false,
    login: (token, nombre, rol) => {
      set({
        token: token,
        usuarioNombre: nombre,
        usuarioRol: rol,
        autenticado: true,
      });
    },
    logout : () => {
        set({
        token: null,
        usuarioNombre: null,
        usuarioRol: null,
        autenticado: false,
        })
    },
    esAdmin : () => {
        return get().usuarioRol === "Administrador"
    },
    esCocina: () => {
        return get().usuarioRol === "Cocina"
    },
    esCliente:() =>  {
        return get().usuarioRol === "Cliente" 
    },
  }),
{
    name: "mercado-auth-storage"
}
),
);
