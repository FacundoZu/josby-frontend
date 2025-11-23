import { useEffect, useRef, useState } from 'react'
import BubbleMessage from '../../components/chat/BubbleMessage'
import ChatInput from '../../components/chat/ChatInput'
import { LuMessageCircle } from "react-icons/lu"
import { GoSearch } from "react-icons/go"
import { MdKeyboardArrowLeft, MdClose } from "react-icons/md"
import { useAuth } from '../../hooks/useAuth'
import { socket } from '../../libs/socket'
import { getConversations, getConversationById, sendMessage, searchConversations, markAsRead } from '../../API/chatApi'
import { toast } from 'react-toastify'
import UnreadBadge from '../../components/chat/UnreadBadge'

const ChatFreelancer = () => {
  const { data: authData } = useAuth()
  const currentUser = authData?.user || authData
  const currentUserId = currentUser?.id || currentUser?._id
  const [conversations, setConversations] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [selectedChatId, setSelectedChatId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  const chatContainerRef = useRef(null)
  const sidebarProcessedIds = useRef(new Set())

  // Auto-scroll
  useEffect(() => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      
      
      chatContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth'
      });
    }
  }, [activeChat?.messages])


  const fetchConversations = async () => {
    try {
      const data = await getConversations()

      // Asignar el último mensaje a lastMessage para el sidebar
      const conversationsWithLast = (data || []).map(conv => ({
        ...conv,
        unread: conv.unread || 0,
        lastMessage: conv.messages && conv.messages.length > 0 ? conv.messages[conv.messages.length - 1].message : ''
      }))
      setConversations(conversationsWithLast)

      // Unirse a todas las salas de las conversaciones
      if (Array.isArray(data)) {
        data.forEach(conv => {
          if (conv._id) socket.emit("join_chat", conv._id)
        })
      }

    } catch (error) {
      console.error("Error cargando las conversaciones:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConversations()
  }, [])

  const handleSelectChat = async (chatId) => {
      setSelectedChatId(chatId)

      if (chatId) {
          
        setConversations(prev => prev.map(c => 
          c._id === chatId ? { ...c, unread: 0 } : c
        ))
          
        try {
          await markAsRead(chatId)
        } catch (error) {
            console.error("Error al marcar mensajes como leido", error);
        }
      }
  }

  useEffect(() => {
    if (selectedChatId) {
      const loadChatDetails = async () => {
        try {
          const data = await getConversationById(selectedChatId)
          setActiveChat(data)
          socket.emit("join_chat", selectedChatId)
        } catch (error) {
          console.error("Error cargando chat:", error)
        }
      }
      loadChatDetails()
    } else {
      setActiveChat(null)
    }
  }, [selectedChatId])

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      
      if (searchTerm.trim() === "") {
        fetchConversations()
      } else {
        try {
          const results = await searchConversations(searchTerm)
          
          const formattedResults = (results || []).map(conv => ({
             ...conv,
             unread: conv.unread || 0,
             lastMessage: conv.messages && conv.messages.length > 0 ? conv.messages[conv.messages.length - 1].message : ''
          }))

          setConversations(formattedResults)
        } catch (error) {
          console.error("Error en la búsqueda:", error)
          toast.error("Error al buscar conversaciones")
        }
      }
    }, 500) 

    return () => clearTimeout(delayDebounceFn)

  }, [searchTerm])

  useEffect(() => {
    const handleReceiveMessage = (incomingMessage) => {

      if (selectedChatId && incomingMessage.conversationId === selectedChatId) {
        setActiveChat(prev => {
          if (!prev) return prev
          return {
            ...prev,
            messages: [...prev.messages, incomingMessage.newMessage]
          }
        })
      }

      updateSidebar(incomingMessage)
    }


    const handleListUpdate = (incomingMessage) => {
      updateSidebar(incomingMessage)
    }

    const updateSidebar = (incomingMessage) => {
        if (sidebarProcessedIds.current.has(incomingMessage.newMessage?._id)) {
          return
        }
        
        sidebarProcessedIds.current.add(incomingMessage.newMessage?._id)

        setConversations(prev => {
          const chatIndex = prev.findIndex(c => String(c._id) === String(incomingMessage.conversationId))
            
          if (chatIndex === -1) {
            if(searchTerm === "") fetchConversations() 
            return prev
          }

          const isChatOpen = selectedChatId === incomingMessage.conversationId
          const currentUnread = prev[chatIndex].unread || 0
          const newUnread = isChatOpen ? 0 : currentUnread + 1
    
          const updatedChat = {
            ...prev[chatIndex],
            lastMessage: incomingMessage.newMessage.message,
            updatedAt: new Date().toISOString(),
            unread: newUnread
          }
    
          return [updatedChat, ...prev.filter((_, i) => i !== chatIndex)]
        })
    }


    socket.on("receive_message", handleReceiveMessage)
    socket.on("chat_list_update", handleListUpdate) 
    
    return () => {
        socket.off("receive_message", handleReceiveMessage)
        socket.off("chat_list_update", handleListUpdate)
    }
  }, [selectedChatId, searchTerm])

  const handleSendMessage = async (text) => {
    if (!activeChat) return

    try {
      const otherUserId = activeChat.clientId?._id || activeChat.clientId

      const newMessagePayload = {
        freelancerId: currentUserId, 
        clientId: otherUserId,       
        message: text,
        from: currentUserId,        
        updatedAt: new Date().toISOString()
      }

      await sendMessage(newMessagePayload)

      setConversations(prev => {
         const chatIndex = prev.findIndex(c => c._id === activeChat._id)
         if (chatIndex === -1) return prev
         
         const updatedChat = {
           ...prev[chatIndex],
           lastMessage: text,
           updatedAt: new Date().toISOString(),
           unread: 0
         }
         return [updatedChat, ...prev.filter((_, i) => i !== chatIndex)]
      })

    } catch (error) {
      console.error("Error enviando mensaje:", error)
      toast.error("Error al enviar el mensaje")
    }
  }

  const formatTime = (dateString) => {
    if(!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-120px)] my-2 mx-2 bg-white rounded-lg shadow-sm overflow-hidden border border-text-secondary-light">
      
      {/* Lista de chats*/}
      <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-gray-100 flex flex-col ${selectedChatId ? 'hidden md:flex' : 'flex h-full'}`}>
        
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-bold text-lg text-text-primary mb-3">Mensajes</h2>
          <div className="relative">
            <GoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar cliente..." 
              className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-400 text-sm">Cargando chats...</div>
          ) : conversations.length === 0 ? (
             <div className="p-4 text-center text-gray-400 text-sm">
                {searchTerm ? "No se encontraron resultados." : "No tienes mensajes aún."}
             </div>
          ) : (
            conversations.map((chat) => (
              <div 
                key={chat._id}
                onClick={() => handleSelectChat(chat._id)}
                className={`p-4 flex items-start gap-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 ${selectedChatId === chat._id ? 'bg-blue-50/50 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
              >
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shrink-0">
                  {chat.clientId.firstname.charAt(0).toUpperCase()}{chat.clientId.lastname.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0 relative">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={`text-sm truncate ${chat.unread > 0 ? 'font-bold text-text-primary' : 'font-medium text-text-secondary-primary'}`}>
                      {chat.clientId.firstname} {chat.clientId.lastname}
                    </h3>
                    <span className="text-[10px] text-gray-400 shrink-0">{formatTime(chat.updatedAt)}</span>
                  </div>
                  <p className={`text-xs truncate ${chat.unread > 0 ? 'font-semibold text-text-primary' : 'text-text-secondary-dark'}`}>
                    {chat.lastMessage}
                    <div className="absolute top-5 -right-1 z-50">
                      {chat.unread > 0 && (
                          <UnreadBadge count={chat.unread} />
                      )}
                    </div>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Area del chat abierto */}
      <div className={`flex-1 flex flex-col ${!selectedChatId ? 'hidden md:flex' : 'flex'}`}>
        {activeChat && selectedChatId ? (
          <>
            
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white h-[73px]">
               <div className="flex items-center gap-3">
                 
                 <button className="md:hidden text-gray-500" onClick={() => setSelectedChatId(null)}>
                   <MdKeyboardArrowLeft />
                 </button>
                 <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                    {activeChat.clientId.firstname.charAt(0).toUpperCase()}{activeChat.clientId.lastname.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary">{activeChat.clientId.firstname} {activeChat.clientId.lastname}</h3>
                  </div>
               </div>
               <button 
                  onClick={() => setSelectedChatId(null)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
               >
                  <MdClose size={24} />
               </button>
            </div>

            
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
              {activeChat.messages && activeChat.messages.length > 0 ? (
                  activeChat.messages.map((msg) => {
                    return (
                        <BubbleMessage 
                            key={msg._id || Math.random()} 
                            text={msg.message} 
                            isMe={msg.from === currentUserId} 
                            time={formatTime(msg.date)} 
                        />
                    )
                  })
              ) : (
                <div className="text-center text-gray-400 mt-10">Comienza la conversación...</div>
              )}
            </div>

            
            <div className="bg-white">
              <ChatInput onSend={(text) => handleSendMessage(text)} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-primary bg-gray-50">
            <LuMessageCircle size={200} className="mb-4 opacity-20" />
            <p>Selecciona un chat para comenzar</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatFreelancer