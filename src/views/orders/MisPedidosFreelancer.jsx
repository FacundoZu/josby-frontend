import { useMemo, useState } from "react";
import { formatDateEs, formatPriceArs } from "../../utils/formatters";

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

// Datos mock pensados desde el lado del FREELANCER
const MOCK_FREELANCER_ORDERS = [
  {
    id: "ORD-0001",
    serviceTitle: "Diseño de logo minimalista",
    serviceImage:
      "https://images.pexels.com/photos/4348403/pexels-photo-4348403.jpeg?auto=compress&cs=tinysrgb&w=600",
    clientName: "Cosmética Natural Alma",
    createdAt: "2025-12-01",
    estimatedDelivery: "2025-12-05",
    price: 8500,
    status: "pending",
    lastUpdate: "El cliente envió el pedido. Aún no lo aceptaste.",
    description:
      "Logo minimalista para emprendimiento de cosmética natural. Incluye 2 propuestas y hasta 3 rondas de ajustes.",
    deliverables: [],
  },
  {
    id: "ORD-0002",
    serviceTitle: "Edición de video para redes sociales",
    serviceImage:
      "https://images.pexels.com/photos/6898859/pexels-photo-6898859.jpeg?auto=compress&cs=tinysrgb&w=600",
    clientName: "Emprendimiento FitVibes",
    createdAt: "2025-11-28",
    estimatedDelivery: "2025-12-03",
    price: 12500,
    status: "in_process",
    lastUpdate: "Estás trabajando en el material enviado por el cliente.",
    description:
      "Edición de 5 videos cortos para Instagram y TikTok a partir de material bruto enviado por el cliente.",
    deliverables: [],
  },
  {
    id: "ORD-0003",
    serviceTitle: "Redacción de texto para landing page",
    serviceImage:
      "https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&w=600",
    clientName: "Plataforma de cursos online",
    createdAt: "2025-11-25",
    estimatedDelivery: "2025-11-29",
    price: 6000,
    status: "review",
    lastUpdate:
      "Subiste un entregable y está esperando revisión del cliente.",
    description:
      "Texto persuasivo para una landing de venta de cursos online. Incluye secciones hero, beneficios y FAQ.",
    deliverables: [
      {
        id: "DEL-0003-1",
        name: "Copy_landing_v1.docx",
        type: "Documento",
        uploadedAt: "2025-11-28",
        url: "#",
      },
    ],
  },
  {
    id: "ORD-0004",
    serviceTitle: "Página web simple para portfolio",
    serviceImage:
      "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=600",
    clientName: "Ilustradora freelance",
    createdAt: "2025-11-15",
    estimatedDelivery: "2025-11-22",
    price: 18000,
    status: "delivered",
    lastUpdate:
      "Pedido finalizado. El cliente aceptó la entrega y el pago fue liberado.",
    description:
      "Desarrollo de un portfolio one-page responsive con sección de proyectos, sobre mí y formulario de contacto.",
    deliverables: [
      {
        id: "DEL-0004-1",
        name: "Link_sitio_producción.txt",
        type: "Link",
        uploadedAt: "2025-11-22",
        url: "https://google.com",
      },
      {
        id: "DEL-0004-2",
        name: "Código_fuente.zip",
        type: "Archivo comprimido",
        uploadedAt: "2025-11-21",
        url: "#",
      },
    ],
  },
];

const MisPedidosFreelancer = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState(MOCK_FREELANCER_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToAddDeliverable, setOrderToAddDeliverable] = useState(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchStatus =
        statusFilter === "all" || order.status === statusFilter;

      const matchSearch =
        search.trim().length === 0 ||
        order.serviceTitle.toLowerCase().includes(search.toLowerCase()) ||
        order.clientName.toLowerCase().includes(search.toLowerCase());

      return matchStatus && matchSearch;
    });
  }, [orders, statusFilter, search]);

  const updateOrderStatus = (orderId, newStatus, updateText) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              lastUpdate: updateText ?? order.lastUpdate,
            }
          : order
      )
    );
  };

  // Ahora acepta UNO o VARIOS entregables nuevos
  const handleAddDeliverable = (orderId, newDeliverableOrList) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              deliverables: [
                ...(order.deliverables || []),
                ...(Array.isArray(newDeliverableOrList)
                  ? newDeliverableOrList
                  : [newDeliverableOrList]),
              ],
              status: "review",
              lastUpdate:
                "Subiste un nuevo entregable. El cliente puede revisarlo.",
            }
          : order
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#f6ffff]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-[#1A202C] sm:text-3xl">
            Mis pedidos como freelancer
          </h1>
          <p className="mt-1 text-sm text-[#718096] sm:text-base">
            Gestioná los pedidos que recibís de tus clientes en Josby.
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
                placeholder="Buscar por servicio o cliente..."
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
            {orders.length === 0 ? (
              <>
                <p className="text-lg font-semibold text-[#1A202C]">
                  Todavía no tenés pedidos.
                </p>
                <p className="mt-2 text-sm text-[#718096]">
                  Cuando un cliente contrate uno de tus servicios, lo vas a
                  ver acá.
                </p>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold text-[#1A202C]">
                  No encontramos pedidos que coincidan con los filtros
                  actuales.
                </p>
                <p className="mt-2 text-sm text-[#718096]">
                  Probá ajustar la búsqueda o limpiar los filtros para ver
                  todos tus pedidos.
                </p>
                <button
                  type="button"
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-[#5834b7] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6a44c9]"
                  onClick={() => {
                    setStatusFilter("all");
                    setSearch("");
                  }}
                >
                  Limpiar filtros
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <FreelancerOrderCard
                key={order.id}
                order={order}
                onViewDetails={setSelectedOrder}
                onUpdateStatus={updateOrderStatus}
                onOpenAddDeliverable={setOrderToAddDeliverable}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {selectedOrder && (
        <FreelancerOrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {/* Modal para agregar entregable */}
      {orderToAddDeliverable && (
        <AddDeliverableModal
          order={orderToAddDeliverable}
          onClose={() => setOrderToAddDeliverable(null)}
          onSubmit={(id, newDeliverables) => {
            handleAddDeliverable(id, newDeliverables);
            setOrderToAddDeliverable(null);
          }}
        />
      )}
    </div>
  );
};

function FreelancerOrderCard({
  order,
  onViewDetails,
  onUpdateStatus,
  onOpenAddDeliverable,
}) {
  const statusCfg = STATUS_CONFIG[order.status];

  const canAccept = order.status === "pending";
  const canMarkInReview = order.status === "in_process";
  const canMarkDelivered = order.status === "review";

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
            <p className="mt-1 text-xs text-[#718096] sm:text-sm">
              Cliente:{" "}
              <span className="font-medium text-[#1A202C]">
                {order.clientName}
              </span>
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

        {/* Fechas */}
        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#718096] sm:text-sm">
          <span>
            Pedido:{" "}
            <span className="font-medium text-[#1A202C]">
              {formatDateEs(order.createdAt)}
            </span>
          </span>

          <span className="hidden h-1 w-1 rounded-full bg-[#E2E8F0] sm:inline-block" />

          <span>
            Entrega estimada:{" "}
            <span className="font-medium text-[#1A202C]">
              {formatDateEs(order.estimatedDelivery)}
            </span>
          </span>
        </div>

        {/* Última actualización */}
        <p className="mt-2 text-xs text-[#718096] sm:text-sm">
          {order.lastUpdate}
        </p>
      </div>

      {/* Precio y acciones */}
      <div className="flex flex-col justify-between gap-3 border-t border-[#E2E8F0] pt-3 md:w-64 md:border-l md:border-t-0 md:pl-4 md:pt-0">
        {/* Precio */}
        <div className="flex items-baseline justify-between md:flex-col md:items-end md:gap-1">
          <span className="text-xs text-[#718096]">Total</span>
          <span className="text-lg font-semibold text-[#1A202C] md:text-xl">
            AR$ {formatPriceArs(order.price)}
          </span>
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-2 md:items-end">
          <button
            type="button"
            onClick={() => onViewDetails(order)}
            aria-label={`Ver detalles del pedido ${order.id} como freelancer`}
            className="inline-flex w-full items-center justify-center rounded-full bg-[#5834b7] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6a44c9] md:w-auto"
          >
            Ver detalles
          </button>

          <button
            type="button"
            className="inline-flex w-full items-center justify-center rounded-full bg-[#38ced6] px-4 py-2 text-sm font-semibold text-[#1A202C] shadow-sm transition hover:bg-[#2aa8b0] md:w-auto"
            aria-label={`Ir al chat del pedido ${order.id} como freelancer`}
            onClick={() => {
              // TODO: conectar con chat cuando esté integrado
              console.log("Ir al chat del pedido (freelancer):", order.id);
            }}
          >
            Ir al chat
          </button>

          {/* Acciones según estado */}
          <div className="mt-1 flex w-full flex-col gap-2 md:items-end">
            {canAccept && (
              <button
                type="button"
                onClick={() =>
                  onUpdateStatus(
                    order.id,
                    "in_process",
                    "Aceptaste el pedido. El estado ahora es En proceso."
                  )
                }
                aria-label={`Aceptar pedido ${order.id}`}
                className="inline-flex w-full items-center justify-center rounded-full border border-[#5834b7] px-4 py-1.5 text-xs font-medium text-[#5834b7] transition hover:bg-[#5834b70d] md:w-auto"
              >
                Aceptar pedido
              </button>
            )}

            {canMarkInReview && (
              <button
                type="button"
                onClick={() => onOpenAddDeliverable(order)}
                aria-label={`Subir entregable para el pedido ${order.id}`}
                className="inline-flex w-full items-center justify-center rounded-full border border-[#E2E8F0] px-4 py-1.5 text-xs font-medium text-[#718096] transition hover:bg-[#F7FAFC] md:w-auto"
              >
                Subir entregable / pasar a revisión
              </button>
            )}

            {canMarkDelivered && (
              <button
                type="button"
                onClick={() =>
                  onUpdateStatus(
                    order.id,
                    "delivered",
                    "Marcaste el pedido como finalizado. Esperá a que el cliente acepte la entrega."
                  )
                }
                aria-label={`Marcar como finalizado el pedido ${order.id}`}
                className="inline-flex w-full items-center justify-center rounded-full border border-[#28a745] px-4 py-1.5 text-xs font-medium text-[#28a745] transition hover:bg-[#28a74510] md:w-auto"
              >
                Marcar como finalizado
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function AddDeliverableModal({ order, onSubmit, onClose }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Link");
  const [url, setUrl] = useState("");
  const [files, setFiles] = useState([]);

  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    const trimmedType = type.trim();
    const trimmedUrl = url.trim();

    // Si no hay archivos y tampoco nombre para el link, no hacemos nada
    if (files.length === 0 && !trimmedName) {
      return;
    }

    const todayStr = new Date().toISOString().slice(0, 10);

    let deliverablesToAdd = [];

    if (files.length > 0) {
      // Creamos un entregable por archivo
      deliverablesToAdd = files.map((file) => ({
        id: `DEL-${order.id}-${file.name}-${Date.now()}`,
        name: file.name,
        type: "Archivo",
        uploadedAt: todayStr,
        url: "#", // En la versión real, esto sería la URL devuelta por el backend
      }));

      console.log(
        "Archivos agregados como entregables para",
        order.id,
        files.map((f) => f.name)
      );
    } else {
      // Modo "solo link", como antes
      deliverablesToAdd = [
        {
          id: `DEL-${order.id}-${Date.now()}`,
          name: trimmedName,
          type: trimmedType || "Link",
          uploadedAt: todayStr,
          url: trimmedUrl || "#",
        },
      ];
    }

    onSubmit(order.id, deliverablesToAdd);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-deliverable-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <h2
              id="add-deliverable-title"
              className="text-lg font-semibold text-[#1A202C]"
            >
              Agregar entregable
            </h2>
            <p className="mt-1 text-sm text-[#718096]">
              Pedido{" "}
              <span className="font-medium text-[#1A202C]">
                {order.id}
              </span>
            </p>
            <p className="mt-1 text-xs text-[#A0AEC0]">
              Podés subir archivos o compartir un link. En una versión
              conectada, estos archivos se enviarían al backend.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal de agregar entregable"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E2E8F0] text-sm font-semibold text-[#718096] hover:bg-[#F7FAFC]"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Subir archivos */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#4A5568]">
              Subir archivos (opcional)
            </label>
            <input
              type="file"
              multiple
              className="block w-full text-xs text-[#718096] file:mr-2 file:rounded-full file:border-0 file:bg-[#E2E8F0] file:px-3 file:py-1 file:text-xs file:font-medium file:text-[#1A202C] hover:file:bg-[#CBD5E0]"
              onChange={handleFilesChange}
            />
            {files.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs text-[#4A5568]">
                {files.map((file) => (
                  <li key={file.name} className="truncate">
                    • {file.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Datos de link / referencia */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#4A5568]">
              Nombre del entregable (para link)
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm text-[#1A202C] placeholder:text-[#A0AEC0] focus:border-[#5834b7] focus:outline-none focus:ring-1 focus:ring-[#5834b733]"
              placeholder="Ej: Link a sitio en producción"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#4A5568]">
              Tipo
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm text-[#1A202C] placeholder:text-[#A0AEC0] focus:border-[#5834b7] focus:outline-none focus:ring-1 focus:ring-[#5834b733]"
              placeholder="Ej: Link, Documento, Imagen..."
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#4A5568]">
              URL o enlace (opcional)
            </label>
            <input
              type="url"
              className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm text-[#1A202C] placeholder:text-[#A0AEC0] focus:border-[#5834b7] focus:outline-none focus:ring-1 focus:ring-[#5834b733]"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-[#E2E8F0] px-4 py-2 text-sm font-medium text-[#718096] hover:bg-[#EDF2F7]"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full bg-[#5834b7] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6a44c9]"
            onClick={handleSave}
          >
            Guardar entregable
          </button>
        </div>
      </div>
    </div>
  );
}

function FreelancerOrderDetailModal({ order, onClose }) {
  const statusCfg = STATUS_CONFIG[order.status];

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="freelancer-order-detail-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2
              id="freelancer-order-detail-title"
              className="text-xl font-semibold text-[#1A202C]"
            >
              Detalles del pedido (freelancer)
            </h2>
            <p className="mt-1 text-sm text-[#718096]">
              ID:{" "}
              <span className="font-medium text-[#1A202C]">
                {order.id}
              </span>
            </p>
            <p className="mt-1 text-sm text-[#718096]">
              Cliente:{" "}
              <span className="font-medium text-[#1A202C]">
                {order.clientName}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal de detalles del pedido como freelancer"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E2E8F0] text-sm font-semibold text-[#718096] hover:bg-[#F7FAFC]"
          >
            ✕
          </button>
        </div>

        {/* Info principal */}
        <div className="mb-4 flex flex-col gap-4 sm:flex-row">
          <div className="overflow-hidden rounded-xl sm:w-40 sm:flex-shrink-0">
            <img
              src={order.serviceImage}
              alt={order.serviceTitle}
              className="h-32 w-full object-cover sm:h-full"
            />
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-[#1A202C]">
                {order.serviceTitle}
              </h3>
              <span
                className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${
                  statusCfg?.badgeClasses ?? ""
                }`}
              >
                {statusCfg?.label}
              </span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#718096] sm:text-sm">
              <span>
                Pedido:{" "}
                <span className="font-medium text-[#1A202C]">
                  {formatDateEs(order.createdAt)}
                </span>
              </span>

              <span className="hidden h-1 w-1 rounded-full bg-[#E2E8F0] sm:inline-block" />

              <span>
                Entrega estimada:{" "}
                <span className="font-medium text-[#1A202C]">
                  {formatDateEs(order.estimatedDelivery)}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <section>
            <h4 className="text-sm font-semibold text-[#1A202C]">
              Descripción del servicio
            </h4>
            <p className="mt-1 text-sm text-[#4A5568]">
              {order.description}
            </p>
          </section>

          {order.deliverables && order.deliverables.length > 0 && (
            <section>
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-[#1A202C]">
                  Entregables cargados
                </h4>
                <span className="text-xs text-[#718096]">
                  {order.deliverables.length}{" "}
                  {order.deliverables.length === 1
                    ? "archivo"
                    : "archivos"}
                </span>
              </div>

              <ul className="space-y-2">
                {order.deliverables.map((file) => (
                  <li
                    key={file.id}
                    className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-sm"
                  >
                    <div className="flex flex-1 items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7FAFC] text-xs">
                        📎
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-[#1A202C]">
                          {file.name}
                        </span>
                        <span className="text-xs text-[#718096]">
                          {file.type} · Subido el{" "}
                          {formatDateEs(file.uploadedAt)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="ml-3 inline-flex items-center justify-center rounded-full border border-[#E2E8F0] px-3 py-1 text-xs font-medium text-[#5834b7] hover:bg-[#F7FAFC]"
                      onClick={() => {
                        if (file.url && file.url !== "#") {
                          window.open(
                            file.url,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        } else {
                          alert(
                            `Este es un entregable de ejemplo (${file.name}). En la versión conectada abriría el archivo real.`
                          );
                        }
                      }}
                    >
                      Ver
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="grid gap-3 rounded-2xl bg-[#F7FAFC] p-4 text-sm text-[#1A202C] sm:grid-cols-3">
            <div>
              <p className="text-xs text-[#718096]">Estado</p>
              <p className="mt-1 font-semibold">
                {statusCfg?.label}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#718096]">Total</p>
              <p className="mt-1 text-lg font-semibold">
                AR$ {formatPriceArs(order.price)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#718096]">
                Última actualización
              </p>
              <p className="mt-1 text-sm">{order.lastUpdate}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default MisPedidosFreelancer;
