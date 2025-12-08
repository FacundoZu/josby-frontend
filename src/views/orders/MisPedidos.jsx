import { useEffect } from "react";
import { useMemo, useState } from "react";
import { getOrderByUser } from "../../API/orderApi";
import { Link, useSearchParams } from "react-router";
import Spinner from "../../components/Spinner";

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

const MisPedidos = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [statusFilter, setStatusFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, hasMore: false })
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderToConfirm, setOrderToConfirm] = useState(null);
    const [orderToRequestChanges, setOrderToRequestChanges] = useState(null);
    const [loading, setLoading] = useState(true)

    const mapStatus = (estado) => {
        switch (estado) {
            case "pendiente":
                return "pending"
            case "proceso":
                return "in_process"
            case "revision":
                return "review"
            case "finalizado":
                return "delivered"
            default:
                return "pending"
        }
    }      

    useEffect(() => {
        const getOrders = async () => {
            try{
                const search = searchParams.get("search") || ""
                const status = searchParams.get("status") || ""
                const page = searchParams.get("page") || 1
                const limit = searchParams.get("limit") || 9

                const data = await getOrderByUser({ search, status, page, limit })
                console.log(data)
                setOrders(
                    data.orders.map(order => ({
                        id: order._id,
                        serviceId: order.serviceId._id,
                        serviceTitle: order.serviceId.title,
                        serviceImage: order.serviceId.images[0],
                        freelancerName: `${order.freelancerId.firstname} ${order.freelancerId.lastname}`,
                        freelancerAvatar: order.freelancerId.image || "",
                        createdAt: order.createdAt,
                        estimatedDelivery: order.fechaEntrega,
                        price: order.precio,
                        status: mapStatus(order.estado),
                        lastUpdate: order.lastUpdateInfo || "Sin actualizaciones aún",
                        deliverables: order.entregables || []
                    }))
                )
                setPagination(data.pagination)
            }catch(error){
                console.error("Error cargando pedidos", error)
            }finally{
                setLoading(false)
            }
        }

        getOrders()
    }, [])

    
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

    if (loading) {
        return <Spinner />
    }

    const handlePageChange = async (newPage) => {
        if (newPage < 1 || newPage > pagination.totalPages) return;

        setLoading(true);

        try {
            const search = searchParams.get("search") || "";
            const status = searchParams.get("status") || "";
            const limit = searchParams.get("limit") || 9;

            setSearchParams({
                search,
                status,
                limit,
                page: newPage,
            });

            const data = await getOrderByUser({
                search,
                status,
                page: newPage,
                limit,
            });

            setOrders(
                data.orders.map(order => ({
                    id: order._id,
                    serviceId: order.serviceId._id,
                    serviceTitle: order.serviceId.title,
                    serviceImage: order.serviceId.images[0],
                    freelancerName: `${order.freelancerId.firstname} ${order.freelancerId.lastname}`,
                    freelancerAvatar: order.freelancerId.image || "",
                    createdAt: order.createdAt,
                    estimatedDelivery: order.fechaEntrega,
                    price: order.precio,
                    status: mapStatus(order.estado),
                    lastUpdate: order.lastUpdateInfo || "Sin actualizaciones aún",
                    deliverables: order.entregables || []
                }))
            );

            setPagination(data.pagination);

        } catch (error) {
            console.error("Error cambiando página:", error);
        } finally {
            setLoading(false);
        }
    }


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
        <div className="min-h-screen">
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
                                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition cursor-pointer ${statusFilter === "all"
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
                                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition cursor-pointer ${statusFilter === key
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
                        <Link
                            to="/"
                        >
                            <button
                                type="button"
                                className="mt-4 inline-flex items-center justify-center rounded-full bg-[#38ced6] px-5 py-2.5 text-sm font-semibold text-[#1A202C] shadow-sm transition hover:bg-[#2aa8b0] cursor-pointer"
                            >
                                Explorar servicios
                            </button>
                        </Link>
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

            {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 my-8">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                  >
                    Anterior
                  </button>

                  <span className="text-gray-600">
                    Página {pagination.page} de {pagination.totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasMore}
                    className="cursor-pointer px-4 py-2 bg-primary-dark text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark/90 transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
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
                        className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${statusCfg?.badgeClasses ?? ""
                            }`}
                    >
                        {statusCfg?.label}
                    </span>
                </div>

                {/* Freelancer + Fechas */}
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#718096] sm:text-sm">
                    <div className="flex items-center gap-2">
                        {order.freelancerAvatar ? (
                            <img
                                src={order.freelancerAvatar}
                                alt={order.freelancerName}
                                className="h-7 w-7 rounded-full object-cover"
                            />
                        ): (
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                                {order.freelancerName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        
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
            <div className="flex flex-col justify-between gap-3 border-t border-[#E2E8F0] pt-3 md:w-64 md:border-l md:border-t-0 md:pl-4 md:pt-0">
                {/* Precio */}
                <div className="flex items-baseline justify-between md:flex-col md:items-end md:gap-1">
                    <span className="text-xs text-[#718096]">Total</span>
                    <span className="text-lg font-semibold text-[#1A202C] md:text-xl">
                        AR$ {order.price.toLocaleString("es-AR")}
                    </span>
                </div>

                {/* Botones principales + acciones extra */}
                <div className="flex flex-col gap-2 md:items-end">
                    {/* Botón Ver detalles */}
                    <button
                        type="button"
                        onClick={() => onViewDetails(order)}
                        className="cursor-pointer inline-flex w-full items-center justify-center rounded-full bg-[#5834b7] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6a44c9] md:w-auto"
                    >
                        Ver detalles
                    </button>

                    {/* Botón Ir al chat */}
                    <Link 
                        to={`/service/${order.serviceId}`}
                    >
                        <button
                            type="button"
                            className="cursor-pointer inline-flex w-full items-center justify-center rounded-full bg-[#38ced6] px-4 py-2 text-sm font-semibold text-[#1A202C] shadow-sm transition hover:bg-[#2aa8b0] md:w-auto"
                        >
                            Ir al chat
                        </button>
                    </Link>

                    {/* Acciones extra en revisión */}
                    {order.status === "review" && (
                        <div className="flex w-full flex-col gap-2 pt-1 md:items-end">
                            <div className="flex flex-col gap-2 md:flex-row md:justify-end md:w-full">
                                <button
                                    type="button"
                                    onClick={() => onAskAccept(order)}
                                    className="cursor-pointer inline-flex w-full items-center justify-center rounded-full border border-[#5834b7] px-4 py-1.5 text-xs font-medium text-[#5834b7] transition hover:bg-[#5834b70d] md:w-auto"
                                >
                                    Aceptar entrega
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onAskRequestChanges(order)}
                                    className="cursor-pointer inline-flex w-full items-center justify-center rounded-full border border-[#E2E8F0] px-4 py-1.5 text-xs font-medium text-[#718096] transition hover:bg-[#F7FAFC] md:w-auto"
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
                        className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E2E8F0] text-sm font-semibold text-[#718096] hover:bg-[#F7FAFC]"
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
                            AR$ {order.price.toLocaleString("es-AR")}
                        </span>
                    </p>
                </div>

                <div className="mt-5 flex justify-end gap-3">
                    <button
                        type="button"
                        className="cursor-pointer inline-flex items-center justify-center rounded-full border border-[#E2E8F0] px-4 py-2 text-sm font-medium text-[#718096] hover:bg-[#EDF2F7]"
                        onClick={onClose}
                    >
                        No, volver
                    </button>
                    <button
                        type="button"
                        className="cursor-pointer inline-flex items-center justify-center rounded-full bg-[#5834b7] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6a44c9]"
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
                        className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E2E8F0] text-sm font-semibold text-[#718096] hover:bg-[#F7FAFC]"
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
                        className="cursor-pointer block w-full text-xs text-[#718096] file:mr-2 file:rounded-full file:border-0 file:bg-[#E2E8F0] file:px-3 file:py-1 file:text-xs file:font-medium file:text-[#1A202C] hover:file:bg-[#CBD5E0]"
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
                        className="cursor-pointer inline-flex items-center justify-center rounded-full border border-[#E2E8F0] px-4 py-2 text-sm font-medium text-[#718096] hover:bg-[#EDF2F7]"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className="cursor-pointer inline-flex items-center justify-center rounded-full bg-[#5834b7] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6a44c9]"
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
    const statusCfg = STATUS_CONFIG[order.status];
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
                        className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E2E8F0] text-sm font-semibold text-[#718096] hover:bg-[#F7FAFC]"
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
                                className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${statusCfg?.badgeClasses ?? ""
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
                                                        {formatDate(file.uploadedAt)}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                className="cursor-pointer ml-3 inline-flex items-center justify-center rounded-full border border-[#E2E8F0] px-3 py-1 text-xs font-medium text-[#5834b7] hover:bg-[#F7FAFC]"
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
                                AR$ {order.price.toLocaleString("es-AR")}
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
                            className="cursor-pointer inline-flex w-full items-center justify-center rounded-full bg-[#38ced6] px-4 py-2 text-sm font-semibold text-[#1A202C] shadow-sm transition hover:bg-[#2aa8b0] sm:w-auto"
                        >
                            Ir al chat
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowDeliverables((prev) => !prev)}
                            className="cursor-pointer inline-flex w-full items-center justify-center rounded-full bg-[#5834b7] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6a44c9] sm:w-auto"
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
