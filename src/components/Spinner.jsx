import { LuLoader, LuSearchX } from "react-icons/lu"
const Spinner = () => {
  return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LuLoader className="w-12 h-12 text-primary animate-spin" />
          
          <p className="text-text-secondary-dark font-medium animate-pulse">
            Cargando detalles...
          </p>
        </div>
      </div>
    )
}

export default Spinner