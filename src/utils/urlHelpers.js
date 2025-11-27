/**
 * Convierte un string a un slug URL-friendly
 * Ejemplo: "Tecnología & Programación" -> "tecnologia-programacion"
 */
export function toSlug(text) {
    if (!text) return "";

    return text
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
}

/**
 * Encuentra un item por su slug en un array de items
 */
export function findBySlug(items, slug) {
    if (!slug || !items) return null;
    return items.find(item => toSlug(item.name) === slug);
}

/**
 * Convierte un array de slugs a IDs
 */
export function slugsToIds(items, slugs) {
    if (!slugs || !Array.isArray(slugs)) return [];

    return slugs
        .map(slug => {
            const item = findBySlug(items, slug);
            return item?._id;
        })
        .filter(Boolean);
}

/**
 * Convierte un array de IDs a slugs
 */
export function idsToSlugs(items, ids) {
    if (!ids || !Array.isArray(ids)) return [];

    return ids
        .map(id => {
            const item = items.find(item => item._id === id);
            return item ? toSlug(item.name) : null;
        })
        .filter(Boolean);
}
