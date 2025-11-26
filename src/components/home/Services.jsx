import { forwardRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getServices } from "../../API/serviceApi";
import { getCategories } from "../../API/freelancerApi";
import { findBySlug } from "../../utils/urlHelpers";
import ServiceCard from "./ServiceCard";
import ServiceCardSkeleton from "./ServiceCardSkeleton";

const Services = forwardRef(({ filters, onPageChange }, ref) => {
    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    const categoryName = filters.category
        ? findBySlug(categories, filters.category)?.name || ""
        : "";

    const { data, isLoading, isError } = useQuery({
        queryKey: ["services", filters.search, categoryName, filters.page],
        queryFn: () => getServices({
            search: filters.search,
            category: categoryName,
            page: filters.page,
            limit: 6
        }),
        enabled: categories.length > 0 || !filters.category,
    });

    const services = data?.services || [];
    const pagination = data?.pagination || {};

    const hasActiveFilters = filters.search || filters.category;

    if (isLoading) {
        return (
            <section ref={ref} className="max-w-7xl mx-auto my-16 px-4">
                <h2 className="sub-title">
                    Servicios Populares
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <ServiceCardSkeleton key={i} />
                    ))}
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section ref={ref} className="max-w-7xl mx-auto my-16 px-4">
                <h2 className="sub-title">
                    Servicios Populares
                </h2>
                <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar servicios</h3>
                    <p className="text-gray-600">Por favor, intenta nuevamente más tarde.</p>
                </div>
            </section>
        );
    }

    return (
        <section ref={ref} className="max-w-7xl mx-auto my-16 px-4">
            <h2 className="sub-title">
                {hasActiveFilters ? "Resultados de búsqueda" : "Servicios Populares"}
            </h2>

            {pagination.total > 0 && (
                <p className="text-gray-600 mb-6">
                    {pagination.total} servicio{pagination.total !== 1 ? "s" : ""} encontrado{pagination.total !== 1 ? "s" : ""}
                </p>
            )}

            {!services.length ? (
                <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No se encontraron servicios
                    </h3>
                    <p className="text-gray-600 mb-4">
                        {hasActiveFilters
                            ? "Intenta ajustar los filtros para ver más resultados."
                            : "No hay servicios disponibles en este momento."}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {services.map((s) => (
                            <ServiceCard key={s._id} service={s} />
                        ))}
                    </div>

                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <button
                                onClick={() => onPageChange(filters.page - 1)}
                                disabled={filters.page === 1}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                            >
                                Anterior
                            </button>

                            <span className="text-gray-600">
                                Página {pagination.page} de {pagination.totalPages}
                            </span>

                            <button
                                onClick={() => onPageChange(filters.page + 1)}
                                disabled={!pagination.hasMore}
                                className="px-4 py-2 bg-primary-dark text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark/90 transition-colors"
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
});

Services.displayName = "Services";

export default Services;