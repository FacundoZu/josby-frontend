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

const Service = () => {
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('description') // description | freelancer

  useEffect(() => {
    async function getService(){
      try {
        const data = await getServiceById("6921c1a5a2940041df04e489")
        setService(data)

      } catch (error) {
        console.error("Error cargando servicio", error)
        toast.error("Error al cargar el servicio")

      } finally {
        setLoading(false)
      }
    }
    getService()
  },[])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando servicio...</div>
  }

  if (!service) {
    return <div>No se encontró el servicio.</div>
  }

  return (
    <div className="min-h-screen bg-background pb-20 font-sans text-text-primary">

      <nav className="border-b border-gray-100 py-4 px-4 md:px-8 mb-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-text-secondary-dark cursor-pointer hover:text-primary transition-colors">
          <MdKeyboardArrowLeft size={16} />
          <span>Volver a servicios</span>
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
            <PricingCard price={service.price} features={service.features} deliveryTime={service.deliveryTime} title={service.title} />
        </div>
      </div>

      {/* Botón de chat */}
      <ClientChat freelancer={service.usuarioId}/>
    </div>
  )
}

export default Service