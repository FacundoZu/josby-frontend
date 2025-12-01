import React, { useState } from 'react';
import { FaBriefcase, FaRegCheckCircle } from 'react-icons/fa';

// Lista de Provincias de Argentina (Sin "Remoto" ni grupos, como pediste)
const argentinaProvinces = [
  "Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Ciudad Autónoma de Buenos Aires (CABA)",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán"
];

// Base de datos REESTRUCTURADA con Logos y Habilidades
const categoriesData = {
  "Tecnología & Programación ": {
    logo: '💻',
    skills: [
      { name: 'JavaScript', color: '#F7DF1E' },
      { name: 'Python', color: '#3776AB' },
      { name: 'HTML & CSS', color: '#E34F26' },
      { name: 'Node.js', color: '#68A063' },
      { name: 'React', color: '#61DAFB' },
    ]
  },
  "Diseño & Creatividad": {
    logo: '🎨',
    skills: [
      { name: 'Figma', color: '#A259FF' },
      { name: 'Adobe Photoshop', color: '#31A8FF' },
      { name: 'Adobe Illustrator', color: '#FF9A00' },
      { name: 'Diseño UX/UI', color: '#FF6F61' },
    ]
  },
  "Marketing & Publicidad": {
    logo: '📢',
    skills: [
      { name: 'SEO', color: '#34A853' },
      { name: 'Google Ads', color: '#4285F4' },
      { name: 'Redes Sociales', color: '#E1306C' },
    ]
  },
  "Escritura & Traducción": {
    logo: '✍',
    skills: [
      { name: 'Copywriting', color: '#FFB300' },
      { name: 'Corrección de textos', color: '#795548' },
      { name: 'Traducción Español-Inglés', color: '#3F51B5' },
    ]
  },
  "Administración & Finanzas": {
    logo: '📂',
    skills: [
      { name: 'Excel', color: '#217346' },
      { name: 'Gestión de proyectos', color: '#009688' },
      { name: 'Contabilidad básica', color: '#8E24AA' },
    ]
  },
  "Asistencia Virtual": {
    logo: '🤖',
    skills: [
      { name: 'Atención al cliente', color: '#03A9F4' },
      { name: 'Data Entry', color: '#607D8B' },
      { name: 'Organización de agendas', color: '#4CAF50' },
    ]
  },
  "Audio & Música": {
    logo: '🎵',
    skills: [
      { name: 'Edición de audio', color: '#9C27B0' },
      { name: 'Producción musical', color: '#7B1FA2' },
      { name: 'Locución', color: '#D81B60' },
    ]
  },
  "Video & Animación": {
    logo: '🎬',
    skills: [
      { name: 'Edición de video', color: '#F44336' },
      { name: 'After Effects', color: '#9999FF' },
      { name: 'Animación 2D', color: '#FF7043' },
    ]
  },
  "Soporte Técnico & Mantenimiento": {
    logo: '🛠',
    skills: [
      { name: 'Hardware & Reparaciones', color: '#455A64' },
      { name: 'Soporte IT', color: '#1E88E5' },
      { name: 'Administración de sistemas', color: '#6D4C41' },
    ]
  },
  "Emprendimiento & Consultorías": {
    logo: '📈',
    skills: [
      { name: 'Mentoría', color: '#00897B' },
      { name: 'Estrategia de negocio', color: '#5E35B1' },
      { name: 'Planificación empresarial', color: '#FDD835' },
    ]
  }
};

const FormServices = () => {
  const [step, setStep] = useState(1); 
  const [selectedCategory, setSelectedCategory] = useState(""); 
  const [selectedLocation, setSelectedLocation] = useState(""); 

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      alert("Por favor selecciona un título/categoría para continuar.");
      return;
    }
    setStep(2);
    scrollToTop();
  };

  const handleBack = () => {
    setStep(1);
    scrollToTop();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado final. Categoría:", selectedCategory, "Ubicación:", selectedLocation);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="min-h-[100dvh] bg-[#fefefe] flex flex-col items-center justify-center px-4 py-8 sm:p-6 font-sans">
      
      {/* --- HEADER ICON (Maletín) --- */}
      <div className="mt-4 mb-8 flex justify-center w-full">
        <div className="bg-[#38ced6] p-4 rounded-xl shadow-lg shadow-[#cffafe]/50 text-white text-3xl">
          <FaBriefcase />
        </div>
      </div>

      {/* --- TARJETA PRINCIPAL --- */}
      <div className="bg-[#ffffff] p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-xl w-full max-w-xl mx-auto border border-gray-50">
        
        {/* =======================================================
            PASO 1: ÚNETE A NUESTRA RED DE TALENTOS
           ======================================================= */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-center mb-8 text-[#011314]">
              Únete a nuestra red de <br /> talentos
            </h2>

            <form onSubmit={handleNext} className="space-y-5">
              
              {/* Título / Categoría (CON LOGO) */}
              <div>
                <label className="block text-[#667387] text-sm mb-2 font-medium">Título / Categoría</label>
                <div className="bg-[#f7f7f9] rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#38ced6] transition">
                  <select 
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="bg-transparent border-none outline-none w-full text-[#374151] cursor-pointer placeholder-[#9ca3af]"
                    required
                  >
                    <option value="" disabled>Selecciona tu especialidad</option>
                    {/* Iteramos sobre las llaves y mostramos el logo + nombre */}
                    {Object.keys(categoriesData).map((categoryName) => (
                      <option key={categoryName} value={categoryName}>
                        {categoriesData[categoryName].logo} {categoryName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ubicación (Provincias Argentinas) */}
              <div>
                <label className="block text-[#667387] text-sm mb-2 font-medium">Ubicación</label>
                <div className="bg-[#f7f7f9] rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#38ced6] transition">
                  <select 
                    className="bg-transparent border-none outline-none w-full text-[#374151] cursor-pointer"
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Selecciona una provincia</option>
                    {argentinaProvinces.map((prov) => (
                        <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-[#667387] text-sm mb-2 font-medium">Descripción</label>
                <div className="bg-[#f7f7f9] rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#38ced6] transition">
                  <textarea 
                    rows="4"
                    placeholder="Describe tu experiencia y lo que buscas..." 
                    className="bg-transparent border-none outline-none w-full text-[#374151] placeholder-[#9ca3af] resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Habilidades (Adaptado a nueva estructura .skills) */}
              <div>
                <label className="block text-[#667387] text-sm mb-2 font-medium">
                  Habilidades {selectedCategory ? `para ${selectedCategory}` : ''}
                </label>
                
                {selectedCategory ? (
                  <div className="space-y-2 pl-1 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                    {/* ACCEDEMOS A .skills */}
                    {categoriesData[selectedCategory].skills.map((skill) => (
                      <label key={skill.name} className="flex items-center space-x-3 cursor-pointer group hover:bg-gray-50 p-1.5 rounded-md transition">
                        <div className="relative flex items-center justify-center w-5 h-5">
                          <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-[#e5e7eb] rounded-md checked:bg-[#38ced6] checked:border-[#38ced6] transition cursor-pointer" />
                          <FaRegCheckCircle className="absolute text-white text-xs opacity-0 peer-checked:opacity-100 pointer-events-none transition scale-75" />
                        </div>
                        
                        <div className="flex items-center gap-2">
                           <span 
                             className="w-2.5 h-2.5 rounded-full shadow-sm" 
                             style={{ backgroundColor: skill.color }}
                           ></span>
                           <span className="text-[#374151] text-sm font-medium group-hover:text-[#000] transition">
                             {skill.name}
                           </span>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <p className="text-gray-400 text-sm italic">
                      Selecciona un "Título" arriba para cargar las habilidades disponibles.
                    </p>
                  </div>
                )}
              </div>

              {/* Botón Siguiente */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#38ced6] hover:bg-[#2aa8b0] text-[#ffffff] font-bold py-3 rounded-lg transition duration-300 shadow-lg shadow-[#cffafe]/50 active:scale-[0.98] cursor-pointer"
                >
                  Siguiente
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =======================================================
            PASO 2: PUBLICA TU SERVICIO
           ======================================================= */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-center mb-8 text-[#011314]">
              Publica tu Servicio
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Título del Servicio (Muestra Logo + Categoría en placeholder) */}
              <div>
                <label className="block text-[#667387] text-sm mb-2 font-medium">Nombre del Servicio</label>
                <div className="bg-[#f7f7f9] rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#38ced6] transition">
                  <input 
                    type="text" 
                    placeholder={`Ej: Servicio de ${selectedCategory ? categoriesData[selectedCategory].logo + ' ' + selectedCategory : 'Profesional'}`}
                    className="bg-transparent border-none outline-none w-full text-[#374151] placeholder-[#9ca3af]"
                  />
                </div>
              </div>

              {/* Descripción General */}
              <div>
                <label className="block text-[#667387] text-sm mb-2 font-medium">Descripción</label>
                <div className="bg-[#f7f7f9] rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#38ced6] transition">
                  <textarea 
                    rows="3"
                    placeholder="Describe tu servicio en detalle..." 
                    className="bg-transparent border-none outline-none w-full text-[#374151] placeholder-[#9ca3af] resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Características del Paquete */}
              <div>
                <div className="flex justify-between items-end mb-2">
                    <label className="block text-[#667387] text-sm font-medium">Características del Paquete</label>
                    <span className="text-xs text-[#9ca3af] italic">Una por línea</span>
                </div>
                <div className="bg-[#f7f7f9] rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#38ced6] transition">
                  <textarea 
                    rows="5"
                    placeholder={"Ej:\n3 conceptos\nRevisiones ilimitadas\nArchivos fuente\nGuía de uso"} 
                    className="bg-transparent border-none outline-none w-full text-[#374151] placeholder-[#9ca3af] resize-none leading-relaxed"
                  ></textarea>
                </div>
                <p className="mt-2 text-xs text-[#9ca3af]">
                   Estas opciones aparecerán con un tilde (✓) en la tarjeta de compra.
                </p>
              </div>

              {/* Tiempo de entrega */}
              <div>
                <label className="block text-[#667387] text-sm mb-2 font-medium">Tiempo de entrega</label>
                <div className="flex gap-4">
                  <div className="flex-1 bg-[#f7f7f9] rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#38ced6] transition">
                    <input 
                      type="number" 
                      placeholder="Ej: 5" 
                      className="bg-transparent border-none outline-none w-full text-[#374151] placeholder-[#9ca3af]"
                    />
                  </div>
                  <div className="w-1/3 bg-[#f7f7f9] rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#38ced6] transition">
                     <select className="bg-transparent border-none outline-none w-full text-[#374151] cursor-pointer">
                        <option value="dias">Días</option>
                        <option value="semanas">Semanas</option>
                     </select>
                  </div>
                </div>
              </div>

              {/* Precio */}
              <div>
                <label className="block text-[#667387] text-sm mb-2 font-medium">Precio (USD)</label>
                <div className="bg-[#f7f7f9] rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#38ced6] transition flex items-center">
                  <span className="text-[#9ca3af] mr-2 text-lg font-semibold">$</span>
                  <input 
                    type="number" 
                    placeholder="100" 
                    className="bg-transparent border-none outline-none w-full text-[#374151] placeholder-[#9ca3af] text-lg font-medium"
                  />
                </div>
              </div>

              {/* Categoría (Mostrar la seleccionada en el paso anterior) */}
              <div>
                <label className="block text-[#667387] text-sm mb-2 font-medium">Categoría Principal</label>
                <div className="bg-[#f7f7f9] rounded-lg px-4 py-3 opacity-70 cursor-not-allowed">
                  <input 
                      type="text" 
                      // Muestra el logo también aquí si hay categoría seleccionada
                      value={selectedCategory ? `${categoriesData[selectedCategory].logo} ${selectedCategory}` : "General"} 
                      disabled 
                      className="bg-transparent border-none outline-none w-full text-[#374151] font-medium"
                  />
                </div>
              </div>

              {/* Fotos */}
              <div>
                <label className="block text-[#667387] text-sm mb-2 font-medium">Fotos de portada</label>
                <div className="border-2 border-dashed border-[#d1d5db] rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition group">
                   <div className="bg-gray-100 p-3 rounded-full mb-2 group-hover:bg-[#e0fbfc] transition">
                      <FaBriefcase className="text-[#9ca3af] group-hover:text-[#38ced6]" />
                   </div>
                   <p className="text-[#6b7280] text-sm font-medium">Haz clic para subir imágenes</p>
                   <p className="text-[#9ca3af] text-xs mt-1">PNG, JPG hasta 5MB</p>
                </div>
              </div>

              {/* Botonera */}
              <div className="pt-4 flex flex-col gap-3">
                <button
                  type="submit"
                  className="w-full bg-[#38ced6] hover:bg-[#2aa8b0] text-[#ffffff] font-bold py-3 rounded-lg transition duration-300 shadow-lg shadow-[#cffafe]/50 active:scale-[0.98] cursor-pointer"
                >
                  Publicar Servicio
                </button>

                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full text-[#667387] hover:text-[#374151] font-medium text-sm py-2 cursor-pointer"
                >
                  Volver al paso anterior
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  )
}

export default FormServices;