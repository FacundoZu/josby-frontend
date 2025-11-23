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