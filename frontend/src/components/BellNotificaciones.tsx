// src/components/BellNotificaciones.tsx
import { useNotificaciones } from "../hooks/useNotificaciones";
import { useState } from "react";

export default function BellNotificaciones() {
  const { notificaciones, cantidad, marcarLeidasFn } = useNotificaciones();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);

    // marcar todas como leídas al abrir
    if (!open && cantidad > 0) {
      const ids = notificaciones.map((n: any) => n.id);
      marcarLeidasFn(ids);
    }
  };

  return (
    <div className="relative">
      {/* 🔔 ICONO */}
      <button
        onClick={handleOpen}
        className="relative text-gray-700 hover:text-gray-900"
      >
        <span className="text-3xl">🔔</span>

        {cantidad > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
            {cantidad}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white shadow-xl rounded-lg p-4 z-50 max-h-80 overflow-y-auto">
          <h3 className="font-semibold text-gray-800 mb-3">Notificaciones</h3>

          {notificaciones.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay notificaciones nuevas</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {notificaciones.map((n: any) => (
                <li
                  key={n.id}
                  className="p-3 bg-gray-100 rounded-lg border border-gray-200"
                >
                  <p className="font-medium">{n.mensaje}</p>
                  <p className="text-xs text-gray-500">{n.tipo}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
