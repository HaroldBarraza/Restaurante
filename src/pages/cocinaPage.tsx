import { useEffect, useState } from "react";
import { api } from "../libs/axios";
import { StatusPill } from "../componentes/StatusPill";

export function CocinaPendientes() {
  const [pendientes, setPendientes] = useState<any[]>([]);

  const cargar = () => {
    api.get("/cocina/pendientes").then((r) => setPendientes(r.data)).catch(() => {});
  };

  useEffect(cargar, []);

  const marcarListo = async (id: number) => {
    try {
      await api.patch(`/cocina/pedidos/${id}/estado`, {
        estado: "Listo para Entrega",
      });
      cargar();
    } catch {
      alert("No se pudo actualizar el pedido");
    }
  };

  const hora = (fecha?: string) =>
    fecha
      ? new Date(fecha).toLocaleTimeString("es-PE", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  return (
    <>
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="font-serif text-[38px] leading-tight text-cacao-900 max-lg:text-3xl">
            Cocina — Pendientes
          </h1>
          <p className="mt-1 text-sm text-stone-500">Turno actual</p>
        </div>
        <span className="whitespace-nowrap rounded-full bg-amber-100 px-3.5 py-2 text-[13px] text-amber-800">
          Pendientes <b className="ml-1">{pendientes.length}</b>
        </span>
      </header>

      {pendientes.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-white px-6 py-16 text-center text-stone-500">
          Todo al día 🎉
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
          {pendientes.map((p) => (
            <article
              key={p.pedido_id}
              className="rounded-xl border border-stone-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <strong className="font-serif text-xl text-cacao-900">
                  #{p.pedido_id}
                </strong>
                <StatusPill status={p.estado} />
              </div>
              <p className="mt-3 font-semibold text-stone-700">
                {p.cliente_nombre ?? "Cliente"}
              </p>
              <span className="mt-1 block text-xs text-stone-500">
                {hora(p.fecha_pedido)
                  ? `pedido a las ${hora(p.fecha_pedido)}`
                  : ""}
              </span>
              <div className="my-4 flex flex-col gap-1 border-y border-stone-100 py-3 text-[13px] text-stone-700">
                <span>Menú del día</span>
                <small className="text-stone-500">
                  Ver detalle en el backend
                </small>
              </div>
              <button
                onClick={() => marcarListo(p.pedido_id)}
                className="inline-flex h-9 items-center rounded-lg bg-terracotta-500 px-3.5 text-xs font-bold text-white hover:bg-terracotta-700"
              >
                Marcar listo
              </button>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

export function CocinaHistorial() {
  const [historial, setHistorial] = useState<any[]>([]);

  useEffect(() => {
    api.get("/cocina/historial").then((r) => setHistorial(r.data)).catch(() => {});
  }, []);

  const hora = (fecha?: string) =>
    fecha
      ? new Date(fecha).toLocaleTimeString("es-PE", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  return (
    <>
      <header className="mb-6">
        <h1 className="font-serif text-[38px] leading-tight text-cacao-900 max-lg:text-3xl">
          Historial de Cocina
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          {historial.length} pedidos preparados
        </p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        {historial.length === 0 && (
          <div className="px-6 py-10 text-center text-sm text-stone-500">
            Sin historial aún.
          </div>
        )}
        {historial.map((p) => (
          <div
            key={p.pedido_id}
            className="flex min-h-17 items-center justify-between border-b border-stone-100 px-5 py-3 last:border-b-0 hover:bg-cream-50"
          >
            <div className="flex items-center gap-3">
              <strong className="text-cacao-900">#{p.pedido_id}</strong>
              <StatusPill status={p.estado} />
              <span className="text-[13px] text-stone-500">
                {p.cliente_nombre ?? "-"}
              </span>
            </div>
            <strong className="text-sm text-cacao-900">
              {hora(p.fecha_pedido)}
            </strong>
          </div>
        ))}
      </div>
    </>
  );
}