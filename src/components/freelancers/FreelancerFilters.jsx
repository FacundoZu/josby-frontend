export default function FreelancerFilters() {
    const categories = [
        "Diseño Gráfico",
        "Desarrollo Web",
        "Marketing Digital"
    ];

    return (
        <div className="flex flex-col md:flex-row gap-4 md:gap-2 my-6">
            <input
                type="text"
                placeholder="Buscar por nombre o ciudad..."
                className="filter-input flex-1"
            />
            <select
                className="filter-input"
            >
                <option value="">Todas las categorías</option>
                {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
            <select
                className="filter-input"
            >
                <option value="">Ordenar por precio</option>
                <option value="asc">Precio (menor a mayor)</option>
                <option value="desc">Precio (mayor a menor)</option>
            </select>
        </div>
    );
}
