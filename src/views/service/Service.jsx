import { useState } from "react"
import { MdKeyboardArrowLeft } from "react-icons/md"
import { LuClock2 } from "react-icons/lu"
import { LuMessageCircle } from "react-icons/lu"
import Gallery from "../../components/service/Gallery"
import Badge from "../../components/service/Badge"
import PricingCard from "../../components/service/PricingCard"
import FreelancerProfile from "../../components/service/FreelancerProfile"
import ReactMarkdown from 'react-markdown';

const serviceData = {
  title: "Diseño de Logo Profesional",
  deliveryTime: "3 días",
  tags: ["Logo", "Branding", "Identidad Visual", "Diseño Gráfico"],
  price: 100,
  features: [
    "3 conceptos de logo",
    "Revisiones ilimitadas",
    "Todos los formatos (PNG, JPG, SVG, PDF)",
    "Guía de marca básica",
    "Versiones en color y B&N"
  ],
  images: [
    "https://venngage-wordpress.s3.amazonaws.com/uploads/2021/12/section-3-logos.png",
    "https://static-cse.canva.com/blob/1112244/logo.jpg",
    "https://img.freepik.com/vector-gratis/plantilla-diseno-logotipo-monograma-ap-diseno-plano_23-2150155857.jpg?t=st=1763593985~exp=1763597585~hmac=7fa660c167ed322793ae9c3a75bcf3772209becda51f5e425306f423d7566e12",
    "https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/125595779/original/6c5bcaa59692ab691312b869a92a0aa3e5faab0b/design-professional-business-logo.jpg",
  ],
  freelancer: {
    firstname: "María",
    lastname: "González",
    title: "Diseñadora Gráfica Profesional",
    location: "Madrid, España",
    bio: "Diseñadora gráfica apasionada con más de 8 años de experiencia en branding y diseño de identidad visual. He trabajado con startups, pequeñas empresas y grandes corporaciones, siempre entregando resultados que superan las expectativas.",
  },
  description: `¿Necesitas un logo que represente perfectamente tu marca?
  
  Soy María González, diseñadora gráfica con más de 8 años de experiencia creando identidades visuales para empresas de todos los tamaños. Mi especialidad es crear logos que no solo se ven increíbles, sino que también comunican efectivamente los valores de tu marca.
  
  **¿Qué incluye este servicio?**
  3 conceptos de logo únicos y originales
  Revisiones ilimitadas hasta tu satisfacción total
  Archivos en alta resolución (PNG, JPG, SVG, PDF)
  Guía de uso del logo con colores y tipografías
  Versiones en color, blanco y negro
  Entrega en 3 días laborables
  
  **Mi proceso de trabajo:**
  **Briefing inicial:** Conversamos sobre tu marca, valores y preferencias.
  **Investigación:** Analizo tu industria y competencia.
  **Conceptualización:** Creo 3 propuestas únicas.
  **Refinamiento:** Trabajamos juntos en las revisiones.
  **Entrega final:** Recibes todos los archivos y documentación.
  
  **¿Por qué elegirme?**
   Más de 500 logos creados
   100% de clientes satisfechos
   Respuesta en menos de 1 hora
   Garantía de satisfacción total`
}

const Service = () => {
  const [activeTab, setActiveTab] = useState('description') // description | freelancer

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
          
          
          <Gallery images={serviceData.images} />

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              {serviceData.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-text-secondary-dark mb-4">
              <LuClock2 size={16} />
              <span>Entrega en {serviceData.deliveryTime}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {serviceData.tags.map((tag) => (
                <Badge key={tag} text={tag} />
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
                    {serviceData.description}
                </ReactMarkdown>
              </div>
            ) : (
              <FreelancerProfile freelancer={serviceData.freelancer} />
            )}
          </div>
          
        </div>

        {/* COLUMNA DERECHA*/}
        <div className="lg:col-span-1">
            <PricingCard price={serviceData.price} features={serviceData.features} />
        </div>
      </div>

      {/* Botón de chat */}
      <button className="fixed bottom-6 right-6 bg-secondary hover:bg-hover-morado text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 z-50 cursor-pointer">
        <LuMessageCircle size={24} />
      </button>
    </div>
  )
}

export default Service