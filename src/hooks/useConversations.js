import { useQuery } from '@tanstack/react-query'
import { getConversations } from '../API/chatApi'

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
    refetchOnWindowFocus: true
  })
}