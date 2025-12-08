import { isAxiosError } from "axios"
import api from "../libs/axios.js"

export async function createOrder(serviceId){
    try{
        const url = `/order`

        const response = await api.post(url, {serviceId})
        return { status: response.status, data: response.data }

    }catch(error){
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data)
        }
    }
}

export async function getOrderByUser({ search = "", status, page = 1, limit = 9 }) {
    try{
        
        const { data } = await api.get("order", { params: { search, status, page, limit } })
        return data

    }catch(error){
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error || "Error al obtener los pedidos")
        }
        throw error
    }
}

export async function getOrderById(id) {
    try{
        const url = `order/${id}`

        const { data } = await api.get(url)
        return data

    }catch(error){
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error || "Error al obtener el pedido")
        }
        throw error
    }
}