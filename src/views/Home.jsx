import { useRef } from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import Hero from "../components/home/Hero"
import Categories from "../components/home/Categories"
import Services from "../components/home/Services"

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const servicesRef = useRef(null);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    page: parseInt(searchParams.get("page")) || 1,
  });

  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.page > 1) params.set("page", filters.page);

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const handleSearchChange = (search) => {
    setFilters({
      search,
      category: filters.category,
      page: 1,
    });

    if (servicesRef.current) {
      servicesRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCategoryChange = (category) => {
    setFilters({
      search: filters.search,
      category,
      page: 1,
    });
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main>
      <Hero onSearchChange={handleSearchChange} initialSearch={filters.search} />
      <Categories onCategoryChange={handleCategoryChange} selectedCategory={filters.category} />
      <Services ref={servicesRef} filters={filters} onPageChange={handlePageChange} />
    </main>
  )
}

export default Home