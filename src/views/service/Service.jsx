import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { MdKeyboardArrowLeft } from "react-icons/md"
import { LuClock2 } from "react-icons/lu"
import Gallery from "../../components/service/Gallery"
import Badge from "../../components/service/Badge"
import PricingCard from "../../components/service/PricingCard"
import FreelancerProfile from "../../components/service/FreelancerProfile"
import ReactMarkdown from 'react-markdown';
import ClientChat from "../../components/chat/ClientChat"
import { getServiceById } from "../../API/service/serviceApi"
import Spinner from "../../components/Spinner"
import { LuSearchX } from "react-icons/lu"
import { Link, useParams } from "react-router"
import { useAuth } from "../../hooks/useAuth"

const Service = () => {
  const { data } = useAuth()
  const { id } = useParams()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('description') // description | freelancer

  const isFreelancer = data?.user?.role === "freelancer"

  useEffect(() => {
    async function getService(){
      try {
        if(id){
          // const data = await getServiceById(id)
          const data = await getServiceById("6921cbf4b391f426bcd87156")
          setService(data)
        }

      } catch (error) {
        console.error("Error cargando servicio", error)
        toast.error("Error al cargar el servicio", error)

      } finally {
        setLoading(false)
      }
    }
    getService()
  },[id])

  if (loading) {
    return <Spinner />
  }

  if (!service) {
    return (
      <div className="flex h-[calc(100vh-340px)] items-center justify-center px-4 text-center">
        <div className="max-w-md space-y-6">

          <div className="mx-auto bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center">
            <LuSearchX className="w-10 h-10 text-gray-400" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-text-primary">
              Servicio no encontrado
            </h2>
            <p className="text-text-secondary-dark">
              Parece que el servicio que buscas ha sido eliminado o el enlace es incorrecto.
            </p>
          </div>

          <Link 
            to="/" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors shadow-sm w-full sm:w-auto"
          >
            Volver a explorar
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20 font-sans text-text-primary">

      <nav className="border-b border-gray-100 py-4 px-4 md:px-8 mb-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-text-secondary-dark cursor-pointer hover:text-primary transition-colors">
          <MdKeyboardArrowLeft size={16} />
          <Link to="/">
            <span>Volver a servicios</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* COLUMNA IZQUIERDA */}
        <div className="lg:col-span-2 space-y-8">
          
          
          <Gallery images={service.images} />

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              {service.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-text-secondary-dark mb-4">
              <LuClock2 size={16} />
              <span>Entrega en {service.deliveryTime} días</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {service.categories.map((c) => (
                <Badge key={c._id} text={c.name} />
              ))}
            </div>
          </div>

          
          <div className="border rounded-lg overflow-hidden bg-gray-50 flex">
            <button 
              onClick={() => setActiveTab('description')}
              className={`flex-1 py-3 font-medium text-sm transition-colors cursor-pointer ${activeTab === 'description' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary-dark hover:bg-gray-100'}`}
            >
              Descripción
            </button>
            <button 
              onClick={() => setActiveTab('freelancer')}
              className={`flex-1 py-3 font-medium text-sm transition-colors cursor-pointer ${activeTab === 'freelancer' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary-dark hover:bg-gray-100'}`}
            >
              Freelancer
            </button>
          </div>

          
          <div>
            {activeTab === 'description' ? (
              <div className="prose prose-slate max-w-none text-text-secondary-dark whitespace-pre-line">
               <ReactMarkdown>
                    {service.description}
                </ReactMarkdown>
              </div>
            ) : (
              <FreelancerProfile freelancer={service.usuarioId} />
            )}
          </div>
          
        </div>

        {/* COLUMNA DERECHA*/}
        <div className="lg:col-span-1">
            <PricingCard id={id} price={service.price} features={service.features} deliveryTime={service.deliveryTime} title={service.title} />
        </div>
      </div>

      {/* Botón de chat (solo visible para clientes) */}
      {data && !isFreelancer  && (
        <ClientChat freelancer={service.usuarioId}/>
      )}
    </div>
  )
}

export default Service