import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../API/freelancerApi";
import { toSlug } from "../../utils/urlHelpers";

const Categories = ({ onCategoryChange, selectedCategory }) => {
    const [showAllCategories, setShowAllCategories] = useState(false);

    const { data: categories = [], isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    const handleCategoryClick = (categoryName) => {
        const categorySlug = toSlug(categoryName);

        if (selectedCategory === categorySlug) {
            onCategoryChange("");
        } else {
            onCategoryChange(categorySlug);
        }
    };

    if (isLoading) {
        return (
            <section className="max-w-7xl mx-auto mt-16 px-4">
                <h2 className="sub-title">
                    Categorías Populares
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 bg-gray-100 px-5 py-3 rounded-xl shadow-md border border-gray-100 animate-pulse h-12"
                        />
                    ))}
                </div>
            </section>
        );
    }

    const displayedCategories = showAllCategories ? categories : categories.slice(0, 10);
    const hasMoreCategories = categories.length > 10;

    return (
        <section className="max-w-7xl mx-auto mt-16 px-4">
            <h2 className="sub-title">
                Categorías Populares
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {displayedCategories.map((cat) => {
                    const categorySlug = toSlug(cat.name);
                    const isSelected = selectedCategory === categorySlug;

                    return (
                        <button
                            key={cat._id}
                            onClick={() => handleCategoryClick(cat.name)}
                            className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-md border transition-all cursor-pointer ${isSelected
                                ? "bg-primary-dark text-white border-primary-dark"
                                : "bg-white text-text-primary border-gray-100 hover:shadow-lg"
                                }`}
                        >
                            <span className="text-2xl">{cat.logo || "📁"}</span>
                            <p className="font-medium">{cat.name}</p>
                        </button>
                    );
                })}

                {hasMoreCategories && (
                    <button
                        onClick={() => setShowAllCategories(!showAllCategories)}
                        className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl shadow-md bg-gray-50 text-text-primary hover:bg-gray-100 border border-gray-200 transition-all cursor-pointer"
                    >
                        <span className="text-2xl">📂</span>
                        <p className="font-medium">
                            {showAllCategories ? "Ver menos" : `Ver todas (${categories.length})`}
                        </p>
                    </button>
                )}
            </div>
        </section>
    );
};

export default Categories;