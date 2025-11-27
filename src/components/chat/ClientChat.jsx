import { useState, useRef, useEffect } from 'react'
import { LuMessageCircle } from "react-icons/lu"
import { MdClose } from "react-icons/md"
import BubbleMessage from './BubbleMessage'
import ChatInput from './ChatInput'
import { useAuth } from '../../hooks/useAuth'
import { socket } from '../../libs/socket'
import { getConversationByParticipants, sendMessage, markAsRead } from '../../API/chatApi'
import UnreadBadge from './UnreadBadge'


const ClientChat = ({ freelancer }) => {
  const { data: authData } = useAuth()
  const currentUser = authData?.user || authData
  const currentUserId = currentUser?.id || currentUser?._id

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [conversationId, setConversationId] = useState(null)
   const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  
  const messagesEndRef = useRef(null)
  const processedMessageIds = useRef(new Set())

  useEffect(() => {
    if (freelancer?._id && currentUserId) {
      const loadConversation = async () => {
        setLoading(true)
        try {
          const data = await getConversationByParticipants(freelancer._id)

          if (data) {
            setConversationId(data._id)
            setMessages(data.messages || [])

            processedMessageIds.current = new Set(data.messages.map(m => String(m._id)))

            socket.emit("join_chat", data._id)

            const isMeClient = true
            
            const initialUnread = isMeClient ? (data.clientUnread || 0) : (data.freelancerUnread || 0)
            setUnreadCount(initialUnread)
          } else {
            setMessages([])
            setConversationId(null)
          }

        } catch (error) {
          console.error("Error cargando historial:", error)

        } finally {
          setLoading(false);
        }
      }

      loadConversation()
    }
  }, [freelancer, currentUserId])

  useEffect(() => {
    const handleReceiveMessage = (incomingMessage) => {
      if (conversationId && incomingMessage.conversationId === conversationId) {
          setMessages((prev) => {
            [...prev, incomingMessage.newMessage]

            if (!isOpen) {
              setUnreadCount(prev => prev + 1)
            }

            return [...prev, incomingMessage.newMessage]
          })
      }
    }

    socket.on("receive_message", handleReceiveMessage)

    return () => {
      socket.off("receive_message", handleReceiveMessage)
    }
  }, [conversationId, isOpen])

  // Autoscroll para los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isOpen])

  const handleSendMessage = async (text) => {
    try {
      const newMessage = { 
        freelancerId: freelancer._id,
        clientId: currentUserId,
        message: text,
        from: currentUserId,
        createdAt: new Date().toISOString()
      }

      const response = await sendMessage(newMessage)

      if (!conversationId) {
        // CASO: Conversación nueva
        setConversationId(response._id)
        socket.emit("join_chat", response._id)
        
        setMessages(response.messages || []) 
      } 

    } catch (error) {
      console.error("Error al enviar el mensaje", error)
    }
  }

  const toggleChat = async () => {
      const newIsOpen = !isOpen;
      setIsOpen(newIsOpen);

      if (newIsOpen) {
          setUnreadCount(0)
          if (conversationId) {
            await markAsRead(conversationId)
          }
      }
  }

  const formatMessageForUI = (msg) => {
    const isMe = msg.from === currentUserId
    return {
        id: msg._id || Date.now() + Math.random(), 
        text: msg.message,
        isMe: isMe,
        time: msg.date 
            ? new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
            : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    }
  }

  return (
    <>
    {/* Botón flotante */}
      {!isOpen && (
        <button
            onClick={toggleChat} 
            className="fixed bottom-6 right-6 bg-secondary hover:bg-hover-morado text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 z-50 cursor-pointer">
            <LuMessageCircle size={24} />

            {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 z-50">
                    <UnreadBadge count={unreadCount} />
                </div>
            )}
        </button>
      )}

      {/* Chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[90vw] md:w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-100 animate-fade-in-up">
          
          <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between shadow-sm z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                {freelancer.firstname.charAt(0)}{freelancer.lastname.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-text-primary text-sm">{freelancer.firstname} {freelancer.lastname}</h4>
                <p className="text-xs text-text-secondary-dark">{freelancer.title}</p>
              </div>
            </div>
            <button 
                onClick={() => setIsOpen(false)} 
                className="text-gray-400 cursor-pointer">
              <MdClose size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 scrollbar-thin">
            {loading ? (
                <div className="flex flex-col justify-center items-center h-full text-gray-400 text-sm animate-pulse">
                    <p>Cargando chat...</p>
                </div>
            ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 px-6">
                    <p className="text-sm font-medium text-gray-500">¡Comienza el proyecto!</p>
                    <p className="text-xs mt-1">Envía un mensaje a {freelancer?.firstname} para empezar.</p>
                </div>
            ) : (
                <div className="flex flex-col space-y-2">
                    {messages.map((msg) => {
                        const uiMsg = formatMessageForUI(msg);
                        return (
                            <BubbleMessage key={uiMsg.id} text={uiMsg.text} isMe={uiMsg.isMe} time={uiMsg.time} />
                        )
                    })}
                    <div ref={messagesEndRef} />
                </div>
            )}
          </div>

          <ChatInput onSend={handleSendMessage} />
        </div>
      )}
    </>
  )
}

export default ClientChat