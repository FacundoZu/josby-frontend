import { isAxiosError } from "axios";
import api from "../libs/axios"

export const getConversationByParticipants = async (freelancerId) => {
    try{
        const response = await api.get(`chat/check/${freelancerId}`)
        return response.data
    }catch(error){
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data)
        }
    }
}

export const getConversations = async () => {
    try{
        const response = await api.get('/chat')
        return response.data
    }catch(error){
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data)
        }
    }
}

export const searchConversations = async (query) => {
    try{
        const response = await api.get(`/chat/search?q=${query}`)
        return response.data
    }catch(error){
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data)
        }
    }
}

export const getConversationById = async (id) => {
    try{
        const response = await api.get(`/chat/${id}`)
        return response.data
    }catch(error){
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data)
        }
    }
}


//El backend espera { freelancerId, clientId, message }
export const sendMessage = async (data) => {
    try{
        const response = await api.post('/chat', data)
        return response.data
    }catch(error){
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data)
        }
    }
}

export const markAsRead = async (chatId) => {
    try {
        const response = await api.put(`/chat/read/${chatId}`)
        return response.data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data)
        }
    }
}