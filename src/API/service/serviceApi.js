import { isAxiosError } from "axios"
import api from "../../libs/axios"

export async function getServiceById(id){
    try{
        const url = `/service/${id}`

        const { data } = await api.get(url)
        return data

    }catch(error){
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data)
        }
    }
}

export const sendServiceForm = async (formData) => {
    try{
        const url = "/service"

        const { data } = await api.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
        return data

    }catch(error){
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data)
        }
    }
}

export const getCategories = async () => {
    try{
        const url = "/category"

        const { data } = await api.get(url)
        return data

    }catch(error){
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data)
        }
    }
}

export const getSkills = async () => {
    try{
        const url = "/skill"

        const { data } = await api.get(url)
        return data
    }catch(error){
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data)
        }
    }
}