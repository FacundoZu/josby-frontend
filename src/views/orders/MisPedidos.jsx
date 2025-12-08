import { useMemo, useState } from "react";
import { formatDateEs, formatPriceArs } from "../../utils/formatters";
import { ORDER_STATUS_CONFIG } from "../../constants/orderStatus";

// TODO: Reemplazar MOCK_ORDERS con datos reales del backend de Josby
// cuando el endpoint de "mis pedidos" esté disponible.
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
    description:
      "Logo minimalista para emprendimiento de cosmética natural. Incluye 2 propuestas y hasta 3 rondas de ajustes.",
    deliverables: [
      {
        id: "DEL-0001-1",
        name: "Brief_logo.pdf",
        type: "Documento",
        uploadedAt: "2025-12-01",
        url: "#",
      },
      {
        id: "DEL-0001-2",
        name: "Propuesta_logo_v1.png",
        type: "Imagen",
        uploadedAt: "2025-12-03",
        url: "#",
      },
    ],
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
    description:
      "Edición de 5 videos cortos para Instagram y TikTok a partir de material bruto enviado por el cliente.",
    deliverables: [
      {
        id: "DEL-0002-1",
        name: "Reel_IG_v1.mp4",
        type: "Video",
        uploadedAt: "2025-11-30",
        url: "#",
      },
      {
        id: "DEL-0002-2",
        name: "Reel_TikTok_v1.mp4",
        type: "Video",
        uploadedAt: "2025-12-01",
        url: "#",
      },
    ],
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
    freelancerName: "Pedro Silva",
    freelancerAvatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200",
    createdAt: "2025-11-15",
    estimatedDelivery: "2025-11-22",
    price: 18000,
    status: "delivered",
    lastUpdate: "Trabajo entregado y pago liberado al freelancer.",
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

const MisPedidos = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToConfirm, setOrderToConfirm] = useState(null);
  const [orderToRequestChanges, setOrderToRequestChanges] = useState(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchStatus =
        statusFilter === "all" || order.status === statusFilter;

      const matchSearch =
        search.trim().length === 0 ||
        order.serviceTitle.toLowerCase().includes(search.toLowerCase()) ||
        order.freelancerName.toLowerCase().includes(search.toLowerCase());

      return matchStatus && matchSearch;
    });
  }, [orders, statusFilter, search]);

  const handleAcceptDelivery = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "delivered",
              lastUpdate:
                "Entrega aceptada. El pago fue liberado al freelancer.",
            }
          : order
      )
    );
  };

  const handleRequestChanges = (orderId, message, files) => {
    const trimmed = message.trim();
    if (!trimmed) return;

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "in_process",
              lastUpdate: `Solicitaste cambios: "${trimmed}"`,
            }
          : order
      )
    );

    console.log("Solicitud de cambios para", orderId, "=>", trimmed);

    if (files && files.length > 0) {
      console.log(
        "Archivos adjuntos:",
        files.map((f) => f.name)
      );
    }
  };

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
            {Object.entries(ORDER_STATUS_CONFIG).map(([key, cfg]) =>
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
            {orders.length === 0 ? (
              <>
                <p className="text-lg font-semibold text-[#1A202C]">
                  Todavía no tenés pedidos.
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
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={setSelectedOrder}
                onAskAccept={setOrderToConfirm}
                onAskRequestChanges={setOrderToRequestChanges}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {/* Modal de confirmación de aceptación */}
      {orderToConfirm && (
        <AcceptDeliveryModal
          order={orderToConfirm}
          onClose={() => setOrderToConfirm(null)}
          onConfirm={(id) => {
            handleAcceptDelivery(id);
            setOrderToConfirm(null);
          }}
        />
      )}

      {/* Modal de solicitud de cambios */}
      {orderToRequestChanges && (
        <RequestChangesModal
          order={orderToRequestChanges}
          onClose={() => setOrderToRequestChanges(null)}
          onSubmit={(id, message, files) => {
            handleRequestChanges(id, message, files);
            setOrderToRequestChanges(null);
          }}
        />
      )}
    </div>
  );
};

function OrderCard({
  order,
  onViewDetails,
  onAskAccept,
  onAskRequestChanges,
}) {
  const statusCfg = ORDER_STATUS_CONFIG[order.status];

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

        {/* Botones principales + acciones extra */}
        <div className="flex flex-col gap-2 md:items-end">
          {/* Botón Ver detalles */}
          <button
            type="button"
            onClick={() => onViewDetails(order)}
            aria-label={`Ver detalles del pedido ${order.id}`}
            className="inline-flex w-full items-center justify-center rounded-full bg-[#5834b7] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6a44c9] md:w-auto"
          >
            Ver detalles
          </button>

          {/* Botón Ir al chat */}
          <button
            type="button"
            className="inline-flex w-full items-center justify-center rounded-full bg-[#38ced6] px-4 py-2 text-sm font-semibold text-[#1A202C] shadow-sm transition hover:bg-[#2aa8b0] md:w-auto"
            aria-label={`Ir al chat del pedido ${order.id}`}
            onClick={() => {
              // TODO: conectar con chat cuando esté integrado
              console.log("Ir al chat del pedido:", order.id);
            }}
          >
            Ir al chat
          </button>

          {/* Acciones extra en revisión */}
          {order.status === "review" && (
            <div className="flex w-full flex-col gap-2 pt-1 md:items-end">
              <div className="flex flex-col gap-2 md:flex-row md:justify-end md:w-full">
                <button
                  type="button"
                  onClick={() => onAskAccept(order)}
                  aria-label={`Aceptar entrega del pedido ${order.id}`}
                  className="inline-flex w-full items-center justify-center rounded-full border border-[#5834b7] px-4 py-1.5 text-xs font-medium text-[#5834b7] transition hover:bg-[#5834b70d] md:w-auto"
                >
                  Aceptar entrega
                </button>

                <button
                  type="button"
                  onClick={() => onAskRequestChanges(order)}
                  aria-label={`Solicitar cambios del pedido ${order.id}`}
                  className="inline-flex w-full items-center justify-center rounded-full border border-[#E2E8F0] px-4 py-1.5 text-xs font-medium text-[#718096] transition hover:bg-[#F7FAFC] md:w-auto"
                >
                  Solicitar cambios
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function AcceptDeliveryModal({ order, onConfirm, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
      onClick={onClose} // 👈 click en el fondo cierra
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="accept-delivery-title"
        onClick={(e) => e.stopPropagation()} // 👈 evita que el click adentro cierre
      >
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <h2
              id="accept-delivery-title"
              className="text-lg font-semibold text-[#1A202C]"
            >
              Confirmar aceptación de entrega
            </h2>
            <p className="mt-1 text-sm text-[#718096]">
              Pedido{" "}
              <span className="font-medium text-[#1A202C]">
                {order.id}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal de aceptación de entrega"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E2E8F0] text-sm font-semibold text-[#718096] hover:bg-[#F7FAFC]"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-[#4A5568]">
          Al aceptar la entrega, el pedido se dará por{" "}
          <span className="font-semibold">finalizado</span> y el pago
          será liberado al freelancer. Si todavía necesitás ajustar
          algo, te conviene primero{" "}
          <span className="font-semibold">solicitar cambios</span>.
        </p>

        <div className="mt-4 rounded-2xl bg-[#F7FAFC] p-3 text-sm">
          <p className="font-semibold text-[#1A202C]">
            {order.serviceTitle}
          </p>
          <p className="mt-1 text-xs text-[#718096]">
            Freelancer:{" "}
            <span className="font-medium text-[#1A202C]">
              {order.freelancerName}
            </span>
          </p>
          <p className="mt-1 text-xs text-[#718096]">
            Total:{" "}
            <span className="font-semibold text-[#1A202C]">
              AR$ {formatPriceArs(order.price)}
            </span>
          </p>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-[#E2E8F0] px-4 py-2 text-sm font-medium text-[#718096] hover:bg-[#EDF2F7]"
            onClick={onClose}
          >
            No, volver
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full bg-[#5834b7] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6a44c9]"
            onClick={() => onConfirm(order.id)}
          >
            Sí, aceptar entrega
          </button>
        </div>
      </div>
    </div>
  );
}

function RequestChangesModal({ order, onSubmit, onClose }) {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);

  const handleFilesChange = (e) => {
    const filesArray = Array.from(e.target.files || []);
    setFiles(filesArray);
  };

  const handleSend = () => {
    if (!message.trim()) return;
    onSubmit(order.id, message, files);
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
        aria-labelledby="request-changes-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <h2
              id="request-changes-title"
              className="text-lg font-semibold text-[#1A202C]"
            >
              Solicitar cambios
            </h2>
            <p className="mt-1 text-sm text-[#718096]">
              Pedido{" "}
              <span className="font-medium text-[#1A202C]">
                {order.id}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal de solicitud de cambios"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E2E8F0] text-sm font-semibold text-[#718096] hover:bg-[#F7FAFC]"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-[#4A5568]">
          Contale al freelancer qué te gustaría ajustar. Podés incluir
          referencias, detalles específicos o adjuntar archivos de
          ejemplo.
        </p>

        <div className="mt-3">
          <label className="mb-1 block text-xs font-semibold text-[#4A5568]">
            Detalles de los cambios
          </label>
          <textarea
            className="w-full resize-none rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#1A202C] placeholder:text-[#A0AEC0] focus:border-[#5834b7] focus:outline-none focus:ring-1 focus:ring-[#5834b733]"
            rows={4}
            placeholder="Ejemplo: Me gustaría que el tono del texto sea más informal y que el botón principal tenga otro color..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="mt-3">
          <label className="mb-1 block text-xs font-semibold text-[#4A5568]">
            Adjuntar archivos (opcional)
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
            onClick={handleSend}
          >
            Enviar solicitud
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderDetailModal({ order, onClose }) {
  const statusCfg = ORDER_STATUS_CONFIG[order.status];
  const [showDeliverables, setShowDeliverables] = useState(true);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-detail-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2
              id="order-detail-title"
              className="text-xl font-semibold text-[#1A202C]"
            >
              Detalles del pedido
            </h2>
            <p className="mt-1 text-sm text-[#718096]">
              ID:{" "}
              <span className="font-medium text-[#1A202C]">
                {order.id}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal de detalles del pedido"
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
              <div className="flex items-center gap-2">
                <img
                  src={order.freelancerAvatar}
                  alt={order.freelancerName}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="font-medium text-[#1A202C]">
                    {order.freelancerName}
                  </span>
                  <span>Freelancer</span>
                </div>
              </div>

              <span className="hidden h-1 w-1 rounded-full bg-[#E2E8F0] sm:inline-block" />

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
                  Entregables del pedido
                </h4>
                <span className="text-xs text-[#718096]">
                  {order.deliverables.length}{" "}
                  {order.deliverables.length === 1
                    ? "archivo"
                    : "archivos"}
                </span>
              </div>

              {showDeliverables ? (
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
              ) : (
                <p className="text-xs text-[#718096]">
                  Los entregables están ocultos. Volvé a presionar{" "}
                  <span className="font-semibold">
                    “Ver entregables”
                  </span>{" "}
                  para mostrarlos.
                </p>
              )}
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

          <section className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="inline-flex w-full items-center justify-center rounded-full bg-[#38ced6] px-4 py-2 text-sm font-semibold text-[#1A202C] shadow-sm transition hover:bg-[#2aa8b0] sm:w-auto"
            >
              Ir al chat
            </button>

            <button
              type="button"
              onClick={() => setShowDeliverables((prev) => !prev)}
              className="inline-flex w-full items-center justify-center rounded-full bg-[#5834b7] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6a44c9] sm:w-auto"
            >
              {showDeliverables
                ? "Ocultar entregables"
                : "Ver entregables"}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

export default MisPedidos;