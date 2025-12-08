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