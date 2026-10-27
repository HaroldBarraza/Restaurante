import { useEffect, useState } from "react";
import { api } from "../libs/axios";
import { useAuthStore } from "../store/authStore";
import { StatusPill } from "../componentes/StatusPill";

const photos = [
  "https://images.unsplash.com/photo-1663530761401-15eefb544889?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1555243896-c709bfa0b564?auto=format&fit=crop&w=800&q=85",
];

const fechaLarga = (f: string) =>
  new Date(f).toLocaleDateString("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

const fechaCorta = (f: string) =>
  new Date(f).toLocaleDateString("es-PE", {
    weekday: "short",
    day: "numeric",
  });

export function ClienteCatalogo() {
  const nombre = useAuthStore((s) => s.usuarioNombre);
  const [hoy, setHoy] = useState<any>(null);
  const [semana, setSemana] = useState<any[]>([]);

  useEffect(() => {
    api.get("/catalogo/menu-hoy").then((r) => setHoy(r.data)).catch(() => {});
    api.get("/catalogo/menu-semanal").then((r) => setSemana(r.data)).catch(() => {});
  }, []);

  const primerNombre = nombre?.split(" ")[0] ?? "cliente";

  return (
    <>
      <header className="mb-8">
        <h1 className="font-serif text-[38px] leading-tight text-cacao-900 max-lg:text-3xl">
          ¡Hola {primerNombre}!
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Ingresaste como Cliente 👋
        </p>
      </header>

      {hoy && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-2xl">Menú de hoy</h2>
            <span className="text-[13px] text-stone-500">
              Quedan {hoy.cantidad_disponible} porciones
            </span>
          </div>
          <article className="grid min-h-100 grid-cols-[42%_58%] overflow-hidden rounded-3xl bg-white shadow-[0_12px_40px_rgba(15,23,42,0.09)] max-lg:flex max-lg:flex-col">
            <img
              src={hoy.imagen_url || photos[0]}
              alt="Menú del día"
              className="h-full w-full object-cover max-lg:h-57.5"
            />
            <div className="relative flex flex-col p-10 max-lg:p-6">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta-600">
                {fechaLarga(hoy.fecha)}
              </span>
              <div className="absolute right-10 top-9 text-lg font-extrabold text-terracotta-600 max-lg:static max-lg:mt-3">
                S/ {hoy.precio_menu}
              </div>
              <h2 className="mb-5 mt-5 font-serif text-2xl text-cacao-900 max-lg:mb-4 max-lg:mt-2 max-lg:text-xl">
                {hoy.plato_principal?.nombre ?? "Menú del día"}
              </h2>
              <div className="flex flex-col gap-3">
                <p className="text-sm text-stone-600">
                  <b className="inline-block w-20 text-cacao-900">Principal</b>{" "}
                  {hoy.plato_principal?.nombre}
                </p>
                <p className="text-sm text-stone-600">
                  <b className="inline-block w-20 text-cacao-900">Bebida</b>{" "}
                  {hoy.bebida?.nombre}
                </p>
                <p className="text-sm text-stone-600">
                  <b className="inline-block w-20 text-cacao-900">Postre</b>{" "}
                  {hoy.postre?.nombre}
                </p>
              </div>
              <div className="mt-auto flex items-center justify-between pt-6 max-lg:mt-6">
                <span className="rounded-full bg-terracotta-50 px-2.5 py-1.5 text-xs font-bold text-terracotta-600">
                  {hoy.cantidad_disponible} disponibles
                </span>
                <button className="inline-flex h-12 items-center rounded-xl bg-terracotta-500 px-6 text-sm font-bold text-white hover:bg-terracotta-700">
                  Pedir ahora
                </button>
              </div>
            </div>
          </article>
        </section>
      )}

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-2xl">Menú de la semana</h2>
        </div>
        <div className="grid grid-cols-3 gap-4.5 max-lg:grid-cols-1 max-lg:gap-3.5">
          {semana.length === 0 && (
            <div className="col-span-full px-6 py-10 text-center text-stone-500">
              Aún no hay menús publicados esta semana.
            </div>
          )}
          {semana.map((m, i) => (
            <article
              key={m.menu_dia_id}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(15,23,42,0.08)]"
            >
              <div className="relative h-47.5 max-lg:h-52.5">
                <img
                  src={m.imagen_url || photos[(i % 3) + 1]}
                  alt="Plato"
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-3.5 top-3.5 rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-bold text-stone-700 shadow">
                  {fechaCorta(m.fecha)}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-serif text-base text-cacao-900">
                  {m.plato_principal?.nombre ?? "Menú del día"}
                </h3>
                <p className="mb-3.5 mt-1.5 text-[13px] text-stone-500">
                  {m.bebida?.nombre} · {m.postre?.nombre}
                </p>
                <b className="text-terracotta-600">S/ {m.precio_menu}</b>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export function ClientePedidos() {
  const [pedidos, setPedidos] = useState<any[]>([]);

  useEffect(() => {
    api.get("/pedidos/mis-pedidos").then((r) => setPedidos(r.data)).catch(() => {});
  }, []);

  return (
    <>
      <header className="mb-6">
        <h1 className="font-serif text-[38px] leading-tight text-cacao-900 max-lg:text-3xl">
          Mis pedidos
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          {pedidos.length} pedidos en tu historial
        </p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        {pedidos.length === 0 && (
          <div className="px-6 py-10 text-center text-sm text-stone-500">
            Todavía no tienes pedidos. ¡Pide tu menú de hoy!
          </div>
        )}
        {pedidos.map((p) => (
          <div
            key={p.pedido_id}
            className="flex min-h-17 items-center justify-between border-b border-stone-100 px-5 py-3 last:border-b-0 hover:bg-cream-50 max-lg:flex-wrap"
          >
            <div className="flex items-center gap-3 max-lg:w-full max-lg:flex-wrap">
              <strong className="text-cacao-900">#{p.pedido_id}</strong>
              <StatusPill status={p.estado} />
              <span className="text-[13px] text-stone-500">
                {p.items_count} ítems · Token {p.token_recoger}
              </span>
            </div>
            <strong className="text-sm text-cacao-900">
              S/ {p.total_pedido}
            </strong>
          </div>
        ))}
      </div>
    </>
  );
}