import { useState } from 'react'
import BubbleMessage from '../../components/chat/BubbleMessage'
import ChatInput from '../../components/chat/ChatInput'
import { LuMessageCircle } from "react-icons/lu"
import { GoSearch } from "react-icons/go"
import { MdKeyboardArrowLeft } from "react-icons/md"

const MOCK_CHATS = [
  {
    id: 1,
    clientName: "Juan Pérez",
    lastMessage: "Hola, ¿podrías enviarme el boceto?",
    time: "10:30",
    unread: 2,
    avatar: "JP",
    messages: [
      { id: 1, text: "Hola María, me interesa el servicio de logo.", sender: "other", time: "10:00" },
      { id: 2, text: "¡Hola! Claro que sí, cuéntame más sobre tu marca.", sender: "me", time: "10:05" },
      { id: 3, text: "Es una tienda de café de especialidad.", sender: "other", time: "10:10" },
    ]
  },
  {
    id: 2,
    clientName: "Ana García",
    lastMessage: "Perfecto, quedo a la espera.",
    time: "Ayer",
    unread: 0,
    avatar: "AG",
    messages: [
        { id: 1, text: "Gracias por el envío.", sender: "other", time: "18:20" },
        { id: 2, text: "De nada, Ana. Avísame si necesitas cambios.", sender: "me", time: "18:26" },
    ]
  }
]

const ChatFreelancer = () => {
  const [selectedChatId, setSelectedChatId] = useState()

  const activeChat = MOCK_CHATS.find(c => c.id === selectedChatId)

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
              placeholder="Buscar cliente..." 
              className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        
        <div className="flex-1 overflow-y-auto">
          {MOCK_CHATS.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => {
                setSelectedChatId(chat.id)
              }}
              className={`p-4 flex items-start gap-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 ${selectedChatId === chat.id ? 'bg-blue-50/50 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold shrink-0">
                {chat.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className={`text-sm truncate ${chat.unread > 0 ? 'font-bold text-text-primary' : 'font-medium text-text-secondary-primary'}`}>
                    {chat.clientName}
                  </h3>
                  <span className="text-[10px] text-gray-400 shrink-0">{chat.time}</span>
                </div>
                <p className={`text-xs truncate ${chat.unread > 0 ? 'font-semibold text-text-primary' : 'text-text-secondary-dark'}`}>
                  {chat.lastMessage}
                </p>
              </div>
              {chat.unread > 0 && (
                <span className="w-5 h-5 rounded-full bg-secondary text-white text-[10px] flex items-center justify-center font-bold">
                  {chat.unread}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Area del chat abierto */}
      <div className={`flex-1 flex flex-col ${!selectedChatId ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
          <>
            
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white h-[73px]">
               <div className="flex items-center gap-3">
                 
                 <button className="md:hidden text-gray-500" onClick={() => setSelectedChatId(null)}>
                   <MdKeyboardArrowLeft />
                 </button>
                 <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                    {activeChat.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary">{activeChat.clientName}</h3>
                  </div>
               </div>
            </div>

            
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
              {activeChat.messages.map((msg) => (
                 <BubbleMessage key={msg.id} text={msg.text} isMe={msg.sender === 'me'} time={msg.time} />
              ))}
            </div>

            
            <div className="bg-white">
              <ChatInput onSend={(text) => console.log("Enviando a", activeChat.clientName, ":", text)} />
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