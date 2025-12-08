import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getSkills } from "../../API/freelancerApi";
import { useDebounce } from "../../hooks/useDebounce";

export default function FreelancerFilters({ filters, onFilterChange }) {
    const [searchInput, setSearchInput] = useState(filters?.search || "");
    const [category, setCategory] = useState(filters?.category || "");
    const [selectedSkills, setSelectedSkills] = useState(filters?.skills || []);
    const [showAllSkills, setShowAllSkills] = useState(false);

    const debouncedSearch = useDebounce(searchInput, 500);

    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    const { data: skills = [] } = useQuery({
        queryKey: ["skills"],
        queryFn: getSkills,
    });

    useEffect(() => {
        onFilterChange({ search: debouncedSearch, category, skills: selectedSkills });
    }, [debouncedSearch, category, selectedSkills]);

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const handleSkillToggle = (skillId) => {
        setSelectedSkills((prev) =>
            prev.includes(skillId)
                ? prev.filter((id) => id !== skillId)
                : [...prev, skillId]
        );
    };

    const displayedSkills = showAllSkills ? skills : skills.slice(0, 10);
    const hasMoreSkills = skills.length > 10;

    return (
        <div className="space-y-4 my-6">
            <div className="flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Buscar por nombre o ciudad..."
                    className="filter-input flex-1"
                    value={searchInput}
                    onChange={handleSearchChange}
                />
                <select
                    className="filter-input md:w-64"
                    value={category}
                    onChange={handleCategoryChange}
                >
                    <option value="">Todas las categorías</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            {skills.length > 0 && (
                <div className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-gray-700">
                            Filtrar por habilidades:
                        </p>
                        {selectedSkills.length > 0 && (
                            <button
                                onClick={() => setSelectedSkills([])}
                                className="text-sm text-text-primary hover:text-text-primary/75 transition-colors cursor-pointer"
                            >
                                Limpiar ({selectedSkills.length})
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {displayedSkills.map((skill) => (
                            <button
                                key={skill._id}
                                onClick={() => handleSkillToggle(skill._id)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedSkills.includes(skill._id)
                                    ? "bg-primary-dark text-white shadow-sm cursor-pointer"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
                                    }`}
                            >
                                {skill.name}
                            </button>
                        ))}

                        {hasMoreSkills && (
                            <button
                                onClick={() => setShowAllSkills(!showAllSkills)}
                                className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-50 text-text-primary hover:bg-text-primary/30 border border-text-primary/20 transition-colors cursor-pointer"
                            >
                                {showAllSkills ? "Ver menos" : `Ver todas (${skills.length})`}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
