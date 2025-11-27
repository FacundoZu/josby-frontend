import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { socket } from '../libs/socket' 
import { toast } from 'react-toastify'
import { useLocation } from 'react-router'

const GlobalSocketListener = () => {
  const queryClient = useQueryClient()
  const location = useLocation()

  useEffect(() => {
    const handleDataRefresh = () => {
        queryClient.invalidateQueries(["conversations"])
    }

    const handleNotification = (data) => {
        handleDataRefresh()

        if (!location.pathname.includes('/chat')) {
            toast.info(`Tienes un mensaje nuevo`, {
                toastId: data.convesationId + "notification"
            })
        }
    }

    socket.on('notification', handleNotification)
    socket.on('chat_list_update', handleDataRefresh)

    return () => {
      socket.off('notification', handleNotification)
      socket.off('chat_list_update', handleDataRefresh)
    }

  }, [queryClient, location.pathname])

  return null
}

export default GlobalSocketListener