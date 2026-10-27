const STATUS_STYLES: Record<string, string> = {
  Pendiente: "bg-amber-100 text-amber-800",
  Confirmado: "bg-sky-100 text-sky-800",
  "En Cocina": "bg-violet-100 text-violet-800",
  "Listo para Entrega": "bg-emerald-100 text-emerald-800",
  "En Reparto": "bg-blue-100 text-blue-800",
  Entregado: "bg-stone-100 text-stone-700",
  Cancelado: "bg-rose-100 text-rose-700",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex h-6 items-center whitespace-nowrap rounded-full px-2.5 text-[11px] font-bold ${
        STATUS_STYLES[status] ?? "bg-stone-100 text-stone-700"
      }`}
    >
      {status}
    </span>
  );
}