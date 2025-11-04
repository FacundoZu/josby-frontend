import api from "../libs/axios";

export async function registerUser(userData) {
  try {
    const url = `/user/register`
    const response = await api.post(url, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error en la petición" };
  }
};