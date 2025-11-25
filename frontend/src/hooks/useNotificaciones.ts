// src/hooks/useNotificaciones.ts
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getNotificaciones, marcarComoLeidas } from "../api/notificacionesApi";

export function useNotificaciones() {
  const { token } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    if (!token) return;

    cargar();

    const interval = setInterval(() => {
      cargar();
    }, 20000);

    return () => clearInterval(interval);
  }, [token]);

  const cargar = async () => {
    // 🔥 AHORA pedimos TODAS las notificaciones
    const data = await getNotificaciones(token!, true); // <--- CAMBIO
    setNotificaciones(data);
  };

  const marcarLeidasFn = async (ids: number[]) => {
    await marcarComoLeidas(token!, ids);
    await cargar();
  };

  return {
    notificaciones,
    // 🔥 solo contamos las no leídas
    cantidad: notificaciones.filter((n: any) => !n.leida).length,
    marcarLeidasFn,
  };
}
