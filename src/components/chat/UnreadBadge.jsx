
const UnreadBadge = ({count}) => {
  if (!count || count <= 0) return null

  return (
    <div className="flex items-center justify-center min-w-5 h-5 px-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full shadow-sm animate-pulse shrink-0">
      {count > 99 ? '+99' : count}
    </div>
  )
}

export default UnreadBadge