import { isAxiosError } from "axios";
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

export async function setAsFreelancer(userId) {
  try {
    const url = `/user/set-as-freelancer/${userId}`;
    const response = await api.put(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error en la petición" };
  }
}

export async function getProfile() {
  try {
    const { data } = await api.get("/user/profile");
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

export async function updateProfile(profileData) {
  try {
    const { data } = await api.put("/user/profile", profileData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

export async function getUserServices() {
  try {
    const { data } = await api.get("/user/profile/services");
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}
