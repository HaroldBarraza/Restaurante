import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export function RoleRoute({allow}: {allow: string[]}){
    const rol = useAuthStore((s) => s.usuarioRol)
    return rol && allow.includes(rol) ? <Outlet/> : <Navigate to="/unauthorized" replace/>
}