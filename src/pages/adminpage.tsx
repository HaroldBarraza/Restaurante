import { useEffect, useState } from "react";
import { api } from "../libs/axios";
import { StatusPill } from "../componentes/StatusPill";

export function AdminDashboard() {
  const [kpis, setKpis] = useState<any>(null);

  useEffect(() => {
    api.get("/admin/kpis").then((r) => setKpis(r.data)).catch(() => {});
  }, []);

  return (
    <>
      <header className="mb-8">
        <h1 className="font-serif text-[38px] leading-tight text-cacao-900 max-lg:text-3xl">
          Panel de Administración
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Hoy,{" "}
          {new Date().toLocaleDateString("es-PE", {
            day: "2-digit",
            month: "short",
          })}
        </p>
      </header>

      <section className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-lg:gap-3">
        {[
          ["Pedidos hoy", kpis?.total_pedidos ?? "-"],
          ["Ventas", `S/ ${kpis?.ventas_totales ?? "-"}`],
          ["T. prep. (min)", kpis?.tiempo_promedio_preparacion ?? "-"],
          ["T. entrega (min)", kpis?.tiempo_promedio_entrega ?? "-"],
        ].map(([label, value]) => (
          <div
            key={label as string}
            className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm max-lg:p-4"
          >
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              {label}
            </span>
            <strong className="mt-2 block text-[28px] tracking-tight text-cacao-900 max-lg:text-xl">
              {value}
            </strong>
          </div>
        ))}
      </section>
    </>
  );
}

export function AdminPedidos() {
  const [pedidos, setPedidos] = useState<any[]>([]);

  const cargar = () => {
    api.get("/admin/pedidos").then((r) => setPedidos(r.data)).catch(() => {});
  };

  useEffect(cargar, []);

  const confirmar = async (id: number) => {
    try {
      await api.patch(`/admin/pedidos/${id}/confirmar`);
      cargar();
    } catch {
      alert("No se pudo confirmar el pedido");
    }
  };

  return (
    <>
      <header className="mb-6">
        <h1 className="font-serif text-[38px] leading-tight text-cacao-900 max-lg:text-3xl">
          Pedidos
        </h1>
        <p className="mt-1 text-sm text-stone-500">{pedidos.length} pedidos</p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        {pedidos.length === 0 && (
          <div className="px-6 py-10 text-center text-sm text-stone-500">
            Sin pedidos aún.
          </div>
        )}
        {pedidos.map((p) => (
          <div
            key={p.pedido_id}
            className="flex min-h-17 items-center justify-between border-b border-stone-100 px-5 py-3 transition last:border-b-0 hover:bg-cream-50 max-lg:flex-wrap"
          >
            <div className="flex items-center gap-3 max-lg:w-full max-lg:flex-wrap">
              <strong className="text-cacao-900">#{p.pedido_id}</strong>
              <StatusPill status={p.estado} />
              <span className="text-[13px] text-stone-500">
                {p.cliente_nombre ?? "-"}
              </span>
              <span className="border-l border-stone-200 pl-3 text-[13px] text-stone-500 max-lg:border-0 max-lg:pl-0">
                {p.zona_nombre ?? "-"}
              </span>
            </div>
            <div className="flex items-center gap-3 max-lg:mt-2 max-lg:w-full max-lg:justify-end">
              <strong className="text-sm text-cacao-900">
                S/ {p.total_pedido}
              </strong>
              {p.estado === "Pendiente" && (
                <button
                  onClick={() => confirmar(p.pedido_id)}
                  className="inline-flex h-9 items-center rounded-lg bg-terracotta-500 px-3.5 text-xs font-bold text-white hover:bg-terracotta-700"
                >
                  Confirmar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function AdminMenus() {
  const [menus, setMenus] = useState<any[]>([]);

  useEffect(() => {
    api.get("/admin/menu").then((r) => setMenus(r.data)).catch(() => {});
  }, []);

  return (
    <>
      <header className="mb-6">
        <h1 className="font-serif text-[38px] leading-tight text-cacao-900 max-lg:text-3xl">
          Menús
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          {menus.length} menús registrados
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
        {menus.length === 0 && (
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <strong className="block text-cacao-900">Sin menús creados</strong>
            <span className="mt-1.5 block text-xs text-stone-500">
              Ve al panel admin del backend para crear
            </span>
          </div>
        )}
        {menus.map((m) => (
          <div
            key={m.menu_dia_id}
            className="flex justify-between rounded-xl border border-stone-200 bg-white p-5"
          >
            <div className="flex flex-col gap-1.5">
              <strong className="text-cacao-900">{m.fecha}</strong>
              <span className="text-xs text-stone-500">
                {m.cantidad_disponible} porciones
              </span>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <b className="text-terracotta-600">S/ {m.precio_menu}</b>
              <span
                className={`text-xs font-medium ${
                  m.publicado ? "text-terracotta-600" : "text-stone-500"
                }`}
              >
                {m.publicado ? "Publicado" : "Borrador"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}