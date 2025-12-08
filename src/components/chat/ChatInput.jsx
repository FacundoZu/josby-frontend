import { useState } from "react"
import { IoMdSend } from "react-icons/io"

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!text.trim()) return

    onSend(text)
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe un mensaje..."
        className="flex-1 bg-transparent border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary text-text-primary placeholder-gray-400"
      />
      <button 
        type="submit" 
        className="bg-primary hover:bg-primary-dark text-white p-2 rounded-lg shadow-sm transition-colors flex items-center justify-center cursor-pointer"
      >
        <IoMdSend size={18} />
      </button>
    </form>
  )
}

export default ChatInput