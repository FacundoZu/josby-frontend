import { isAxiosError } from "axios";
import api from "../libs/axios";

export async function getFreelancers({ search = "", category = "", skills = [], page = 1, limit = 9 }) {
    try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (category) params.append("category", category);
        if (skills.length > 0) params.append("skills", skills.join(","));
        params.append("page", page);
        params.append("limit", limit);

        const url = `freelancer?${params.toString()}`;
        const { data } = await api.get(url);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error || "Error al obtener freelancers");
        }
        throw error;
    }
}

export async function getCategories() {
    try {
        const url = "category";
        const { data } = await api.get(url);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error || "Error al obtener categorías");
        }
        throw error;
    }
}

export async function getSkills() {
    try {
        const url = "skill";
        const { data } = await api.get(url);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error || "Error al obtener skills");
        }
        throw error;
    }
}
