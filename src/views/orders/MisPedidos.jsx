import { useMemo, useState } from "react";

const STATUS_CONFIG = {
  all: { label: "Todos" },
  pending: {
    label: "Pendiente",
    badgeClasses:
      "bg-[#ffc10733] text-[#1A202C] border border-[#ffc10780]",
  },
  in_process: {
    label: "En proceso",
    badgeClasses:
      "bg-[#38ced633] text-[#1A202C] border border-[#38ced680]",
  },
  review: {
    label: "En revisión",
    badgeClasses:
      "bg-[#5834b733] text-[#1A202C] border border-[#5834b780]",
  },
  delivered: {
    label: "Finalizado",
    badgeClasses:
      "bg-[#28a74533] text-[#1A202C] border border-[#28a74580]",
  },
};

// Datos falsos de prueba
const MOCK_ORDERS = [
  {
    id: "ORD-0001",
    serviceTitle: "Diseño de logo minimalista",
    serviceImage:
      "https://images.pexels.com/photos/4348403/pexels-photo-4348403.jpeg?auto=compress&cs=tinysrgb&w=600",
    freelancerName: "Ana Pérez",
    freelancerAvatar:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200",
    createdAt: "2025-12-01",
    estimatedDelivery: "2025-12-05",
    price: 8500,
    status: "pending",
    lastUpdate: "Esperando que el freelancer acepte el pedido.",
  },
  {
    id: "ORD-0002",
    serviceTitle: "Edición de video para redes sociales",
    serviceImage:
      "https://images.pexels.com/photos/6898859/pexels-photo-6898859.jpeg?auto=compress&cs=tinysrgb&w=600",
    freelancerName: "Lucas Gómez",
    freelancerAvatar:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200",
    createdAt: "2025-11-28",
    estimatedDelivery: "2025-12-03",
    price: 12500,
    status: "in_process",
    lastUpdate: "El freelancer está trabajando en tu pedido.",
  },
  {
    id: "ORD-0003",
    serviceTitle: "Redacción de texto para landing page",
    serviceImage:
      "https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&w=600",
    freelancerName: "María López",
    freelancerAvatar:
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200",
    createdAt: "2025-11-25",
    estimatedDelivery: "2025-11-29",
    price: 6000,
    status: "review",
    lastUpdate: "Hay un entregable listo para revisar.",
  },
  {
    id: "ORD-0004",
    serviceTitle: "Página web simple para portfolio",
    serviceImage:
      "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=600",
    freelancerName: "Pedro Silva",
    freelancerAvatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200",
    createdAt: "2025-11-15",
    estimatedDelivery: "2025-11-22",
    price: 18000,
    status: "delivered",
    lastUpdate: "Trabajo entregado y pago liberado al freelancer.",
  },
];

const MisPedidos = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredOrders = useMemo(() => {
    return MOCK_ORDERS.filter((order) => {
      const matchStatus =
        statusFilter === "all" || order.status === statusFilter;

      const matchSearch =
        search.trim().length === 0 ||
        order.serviceTitle.toLowerCase().includes(search.toLowerCase()) ||
        order.freelancerName.toLowerCase().includes(search.toLowerCase());

      return matchStatus && matchSearch;
    });
  }, [statusFilter, search]);

  return (
    <div className="min-h-screen bg-[#f6ffff]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-[#1A202C] sm:text-3xl">
            Mis pedidos
          </h1>
          <p className="mt-1 text-sm text-[#718096] sm:text-base">
            Gestioná los servicios que contrataste en Josby.
          </p>
        </header>

        {/* Filtros */}
        <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Tabs de estado */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) =>
              key === "all" ? (
                <button
                  key={key}
                  type="button"
                  onClick={() => setStatusFilter(key)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    statusFilter === "all"
                      ? "bg-[#5834b7] text-white shadow-sm"
                      : "bg-white text-[#718096] border border-[#E2E8F0] hover:bg-[#f3f4ff]"
                  }`}
                >
                  {cfg.label}
                </button>
              ) : (
                <button
                  key={key}
                  type="button"
                  onClick={() => setStatusFilter(key)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    statusFilter === key
                      ? "bg-[#5834b7] text-white shadow-sm"
                      : "bg-white text-[#718096] border border-[#E2E8F0] hover:bg-[#f3f4ff]"
                  }`}
                >
                  {cfg.label}
                </button>
              )
            )}
          </div>

          {/* Buscador */}
          <div className="w-full sm:w-72">
            <label className="sr-only" htmlFor="search-orders">
              Buscar pedidos
            </label>
            <div className="relative">
              <input
                id="search-orders"
                type="text"
                placeholder="Buscar por servicio o freelancer..."
                className="w-full rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-sm text-[#1A202C] placeholder:text-[#d4d4d4] shadow-sm focus:border-[#5834b7] focus:outline-none focus:ring-2 focus:ring-[#5834b733]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Listado / Empty state */}
        {filteredOrders.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-[#E2E8F0] bg-white px-6 py-10 text-center">
            <p className="text-lg font-semibold text-[#1A202C]">
              Todavía no tenés pedidos con este filtro
            </p>
            <p className="mt-2 text-sm text-[#718096]">
              Explora los servicios disponibles en Josby y contratá tu
              primer freelancer.
            </p>
            <button
              type="button"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-[#38ced6] px-5 py-2.5 text-sm font-semibold text-[#1A202C] shadow-sm transition hover:bg-[#2aa8b0]"
            >
              Explorar servicios
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function OrderCard({ order }) {
  const statusCfg = STATUS_CONFIG[order.status];

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm transition hover:shadow-md md:flex-row md:items-stretch">
      {/* Imagen del servicio */}
      <div className="overflow-hidden rounded-xl md:w-40 md:flex-shrink-0">
        <img
          src={order.serviceImage}
          alt={order.serviceTitle}
          className="h-32 w-full object-cover md:h-full"
        />
      </div>

      {/* Información principal */}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#1A202C] sm:text-lg">
              {order.serviceTitle}
            </h2>
            <p className="mt-1 text-xs text-[#718096] sm:text-sm">
              ID de pedido: {order.id}
            </p>
          </div>

          {/* Estado */}
          <span
            className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${
              statusCfg?.badgeClasses ?? ""
            }`}
          >
            {statusCfg?.label}
          </span>
        </div>

        {/* Freelancer + Fechas */}
        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#718096] sm:text-sm">
          <div className="flex items-center gap-2">
            <img
              src={order.freelancerAvatar}
              alt={order.freelancerName}
              className="h-7 w-7 rounded-full object-cover"
            />
            <span className="font-medium text-[#1A202C]">
              {order.freelancerName}
            </span>
          </div>

          <span className="hidden h-1 w-1 rounded-full bg-[#E2E8F0] sm:inline-block" />

          <span>
            Pedido:{" "}
            <span className="font-medium text-[#1A202C]">
              {formatDate(order.createdAt)}
            </span>
          </span>

          <span className="hidden h-1 w-1 rounded-full bg-[#E2E8F0] sm:inline-block" />

          <span>
            Entrega estimada:{" "}
            <span className="font-medium text-[#1A202C]">
              {formatDate(order.estimatedDelivery)}
            </span>
          </span>
        </div>

        {/* Última actualización */}
        <p className="mt-2 text-xs text-[#718096] sm:text-sm">
          {order.lastUpdate}
        </p>
      </div>

      {/* Precio y acciones */}
      <div className="flex flex-col justify-between gap-3 border-t border-[#E2E8F0] pt-3 md:border-l md:border-t-0 md:pl-4 md:pt-0">
        {/* Precio */}
        <div className="flex items-baseline justify-between md:flex-col md:items-end md:gap-1">
          <span className="text-xs text-[#718096]">Total</span>
          <span className="text-lg font-semibold text-[#1A202C] md:text-xl">
            AR$ {order.price.toLocaleString("es-AR")}
          </span>
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-2 md:items-end">
          {/* Botón principal: cambia según estado */}
          <button
            type="button"
            className="inline-flex w-full items-center justify-center rounded-full bg-[#5834b7] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6a44c9] md:w-auto"
          >
            {order.status === "review"
              ? "Revisar entrega"
              : "Ver detalles"}
          </button>

          {/* Botón ir al chat */}
          <button
            type="button"
            className="inline-flex w-full items-center justify-center rounded-full bg-[#38ced6] px-4 py-2 text-sm font-semibold text-[#1A202C] shadow-sm transition hover:bg-[#2aa8b0] md:w-auto"
          >
            Ir al chat
          </button>

          {/* Acciones extra en revisión */}
          {order.status === "review" && (
            <div className="flex flex-col gap-2 pt-1 md:items-end">
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-full border border-[#5834b7] px-4 py-1.5 text-xs font-medium text-[#5834b7] transition hover:bg-[#5834b70d] md:w-auto"
              >
                Aceptar entrega
              </button>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-full border border-[#E2E8F0] px-4 py-1.5 text-xs font-medium text-[#718096] transition hover:bg-[#F7FAFC] md:w-auto"
              >
                Solicitar cambios
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function formatDate(dateStr) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default MisPedidos;
