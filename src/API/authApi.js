
import { isAxiosError } from "axios";
import api from "../libs/axios"

export const login = async (formData) => {
  try {
    const url = "auth/login"
    const { data } = await api.post(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data)
    }
  }
};
