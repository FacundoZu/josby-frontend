
const Categories = () => {
    const categories = [
        { name: "Diseño web", icon: "🖥️" },
        { name: "Diseño gráfico", icon: "🎨" },
        { name: "Marketing digital", icon: "📈" },
        { name: "Asesoría legal", icon: "⚖️" },
        { name: "Edición de video", icon: "🎬" },
    ];

    return (
        <section className="max-w-7xl mx-auto mt-16 px-4">
            <h2 className="sub-title">
                Categorías Populares
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {categories.map((cat, i) => (
                    <a
                        key={i}
                        href="#"
                        className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow-md border border-gray-100 cursor-pointer hover:shadow-lg transition"
                    >
                        <span className="text-2xl">{cat.icon}</span>
                        <p className="font-medium text-text-primary">{cat.name}</p>
                    </a>
                ))}
            </div>
        </section>
    )
}

export default Categories