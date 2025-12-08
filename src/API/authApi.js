
import { isAxiosError } from "axios";
import api from "../libs/axios"

export async function login(formData) {
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

export async function logoutUser() {
    try {
      const url = "auth/logout"
        const { data } = await api.post(url)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function getUser() {
    try {
      const url = "auth/authUser"
        const { data } = await api.get(url)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}