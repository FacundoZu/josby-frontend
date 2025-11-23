const BubbleMessage = ({ text, isMe, time }) => (
  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} mb-4`}>
    <div
      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
        isMe
          ? 'bg-primary text-white rounded-br-none' 
          : 'bg-gray-100 text-text-primary rounded-bl-none'
      }`}
    >
      <p>{text}</p>
    </div>
    <span className="text-[10px] text-gray-400 mt-1 px-1">{time}</span>
  </div>
)

export default BubbleMessage