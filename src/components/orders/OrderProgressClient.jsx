const ORDER_STEPS_CLIENT = [
  { key: "pending", label: "Pedido enviado" },
  { key: "in_process", label: "En proceso" },
  { key: "review", label: "En revisión" },
  { key: "delivered", label: "Finalizado" },
];

export function OrderProgressClient({ status }) {
  const index = Math.max(
    ORDER_STEPS_CLIENT.findIndex((step) => step.key === status),
    0
  );
  const total = ORDER_STEPS_CLIENT.length;
  const progressPercent = ((index + 1) / total) * 100;

  return (
    <section className="my-4">
      <div className="mb-1 flex items-center justify-between text-[11px] text-[#718096]">
        <span className="font-semibold text-[#1A202C]">
          Progreso del pedido
        </span>
        <span>
          Paso {index + 1} de {total}
        </span>
      </div>

      <div className="relative h-1.5 w-full rounded-full bg-[#E2E8F0]">
        <div
          className="absolute left-0 top-0 h-1.5 rounded-full bg-[#5834b7] transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="mt-1 flex justify-between text-[10px] text-[#A0AEC0]">
        {ORDER_STEPS_CLIENT.map((step, i) => (
          <span
            key={step.key}
            className={
              i === index ? "font-semibold text-[#4C51BF]" : undefined
            }
          >
            {step.label}
          </span>
        ))}
      </div>
    </section>
  );
}