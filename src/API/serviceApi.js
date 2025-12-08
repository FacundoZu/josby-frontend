import { isAxiosError } from "axios";
import api from "../libs/axios";

export async function getServices({ search = "", category = "", page = 1, limit = 6 }) {
    try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (category) params.append("category", category);
        params.append("page", page);
        params.append("limit", limit);

        const url = `service?${params.toString()}`;
        const { data } = await api.get(url);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error || "Error al obtener servicios");
        }
        throw error;
    }
}
