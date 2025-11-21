import { useState, useRef, useEffect } from 'react'
import { LuMessageCircle } from "react-icons/lu"
import { MdClose } from "react-icons/md"
import BubbleMessage from './BubbleMessage'
import ChatInput from './ChatInput'


const ClientChat = ({ freelancer }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, text: `Hola, ¿En qué puedo ayudarte?`, sender: "other", time: "10:30" }
  ])
  
  const messagesEndRef = useRef(null)

  // Auto-scroll para los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isOpen])

  const handleSendMessage = (text) => {
    const newMessage = { 
        id: Date.now(), 
        text, sender: "me", 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }

    setMessages(prev => [...prev, newMessage])
  }

  return (
    <>
    {/* Botón flotante */}
      {!isOpen && (
        <button
            onClick={() => setIsOpen(true)} 
            className="fixed bottom-6 right-6 bg-secondary hover:bg-hover-morado text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 z-50 cursor-pointer">
            <LuMessageCircle size={24} />
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
            {messages.map((msg) => (
              <BubbleMessage 
                key={msg.id} 
                text={msg.text} 
                isMe={msg.sender === "me"} 
                time={msg.time} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <ChatInput onSend={handleSendMessage} />
        </div>
      )}
    </>
  )
}

export default ClientChat