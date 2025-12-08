import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { getFreelancers, getCategories, getSkills } from "../../API/freelancerApi";
import FreelancerCard from "./FreelancerCard";
import FreelancerCardSkeleton from "./FreelancerCardSkeleton";
import FreelancerFilters from "./FreelancerFilters";
import { toSlug, findBySlug, slugsToIds, idsToSlugs } from "../../utils/urlHelpers";

export default function FreelancerList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: skills = [] } = useQuery({
    queryKey: ["skills"],
    queryFn: getSkills,
  });

  const categorySlug = searchParams.get("category") || "";
  const skillSlugs = searchParams.get("skills") ? searchParams.get("skills").split(",") : [];

  const categoryId = categorySlug ? findBySlug(categories, categorySlug)?._id || "" : "";
  const skillIds = slugsToIds(skills, skillSlugs);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: categoryId,
    skills: skillIds,
    page: parseInt(searchParams.get("page")) || 1,
  });

  useEffect(() => {
    const newCategoryId = categorySlug ? findBySlug(categories, categorySlug)?._id || "" : "";
    const newSkillIds = slugsToIds(skills, skillSlugs);

    setFilters(prev => ({
      ...prev,
      category: newCategoryId,
      skills: newSkillIds,
    }));
  }, [categories, skills, categorySlug, skillSlugs.join(",")]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["freelancers", filters],
    queryFn: () => getFreelancers(filters),
  });

  const freelancers = data?.freelancers || [];
  const pagination = data?.pagination || {};

  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.search) params.set("search", filters.search);

    if (filters.category) {
      const category = categories.find(cat => cat._id === filters.category);
      if (category) {
        params.set("category", toSlug(category.name));
      }
    }

    if (filters.skills.length > 0) {
      const skillSlugs = idsToSlugs(skills, filters.skills);
      if (skillSlugs.length > 0) {
        params.set("skills", skillSlugs.join(","));
      }
    }

    if (filters.page > 1) params.set("page", filters.page);

    setSearchParams(params, { replace: true });
  }, [filters, categories, skills]);

  const handleFilterChange = (newFilters) => {
    setFilters({
      ...newFilters,
      page: 1,
    });
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters = filters.search || filters.category || filters.skills.length > 0;

  return (
    <div>
      <FreelancerFilters filters={filters} onFilterChange={handleFilterChange} />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, index) => (
            <FreelancerCardSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar freelancers</h3>
          <p className="text-gray-600">Por favor, intenta nuevamente más tarde.</p>
        </div>
      ) : (
        <>
          {pagination.total > 0 && (
            <p className="text-gray-600 mb-6">
              {pagination.total} freelancer{pagination.total !== 1 ? "s" : ""} encontrado{pagination.total !== 1 ? "s" : ""}
            </p>
          )}

          {!freelancers.length ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No se encontraron freelancers
              </h3>
              <p className="text-gray-600 mb-4">
                {hasActiveFilters
                  ? "Intenta ajustar los filtros para ver más resultados."
                  : "No hay freelancers disponibles en este momento."}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {freelancers.map((freelancer) => (
                  <FreelancerCard key={freelancer._id} data={freelancer} />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                  >
                    Anterior
                  </button>

                  <span className="text-gray-600">
                    Página {pagination.page} de {pagination.totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={!pagination.hasMore}
                    className="cursor-pointer px-4 py-2 bg-primary-dark text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark/90 transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
