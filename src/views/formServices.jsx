import { useState } from 'react';
import { FaBriefcase, FaRegCheckCircle } from 'react-icons/fa';
import { argentinaProvinces } from '../constants/argentineProvinces';
import { getCategories, getSkills, sendServiceForm } from '../API/service/serviceApi';
import { useEffect } from 'react';
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'

const FormServices = () => {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const [title, setTitle] = useState("")
  const [userDescription, setUserDescription] = useState("")
  const [skills, setSkills] = useState([])
  const [serviceName, setServiceName] = useState("")
  const [description, setDescription] = useState("")
  const [packageFeatures, setPackageFeatures] = useState("")
  const [deliveryTime, setDeliveryTime] = useState("")
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState([])
  const [selectedSkills, setSelectedSkills] = useState([])
  const [images, setImages] = useState([])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = (e) => {
    e.preventDefault();
    // if (!selectedCategory) {
    //   alert("Por favor selecciona un título/categoría para continuar.");
    //   return;
    // }
    setStep(2);
    scrollToTop();
  };

  const handleBack = () => {
    setStep(1);
    scrollToTop();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, skillsRes] = await Promise.all([
          getCategories(),
          getSkills()
        ])

        setCategories(catRes)
        setSkills(skillsRes)
      } catch (error) {
        console.error("Error cargando datos:", error.message)
      }
    }

    fetchData()
  }, [])

  const toggleSkill = (id) => {
    setSelectedSkills((prev) =>
      prev.includes(id)
        ? prev.filter((skillId) => skillId !== id)
        : [...prev, id]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData()

    formData.append("title", title)
    formData.append("categories", selectedCategory)
    formData.append("location", selectedLocation)
    formData.append("userDescription", userDescription)
    formData.append("serviceName", serviceName)
    formData.append("description", description)
    formData.append("deliveryTime", deliveryTime)
    formData.append("price", price)
    formData.append("features", packageFeatures)

    selectedSkills.forEach((id, i) => {
      formData.append(`skills[${i}]`, id)
    })

    // packageFeatures.split("\n").forEach((f, i) => {
    //   formData.append(`features[${i}]`, f);
    // })

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i])
    }

    try {
      await sendServiceForm(formData)

      window.location.href = "/"

    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.error || "Error al subir el servicio")

    }
  }

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
              <label className="block text-[#667387] text-sm mb-2 font-medium" htmlFor="title">Título</label>
              <div className="bg-[#f7f7f9] rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#38ced6] transition">
                <input 
                  type="text" 
                  id='title' 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='Ej: Desarrollador Web FullStack' 
                  className="bg-transparent border-none outline-none w-full text-[#374151] placeholder-[#9ca3af]" />
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
                    value={userDescription}
                    onChange={(e) => setUserDescription(e.target.value)}
                    placeholder="Describe tu experiencia y lo que buscas..."
                    className="bg-transparent border-none outline-none w-full text-[#374151] placeholder-[#9ca3af] resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Habilidades (Adaptado a nueva estructura .skills) */}
              <div>
                <label className="block text-[#667387] text-sm mb-2 font-medium">
                  Habilidades
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {skills.map((skill) => (
                    <label key={skill._id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(skill._id)}
                        onChange={() => toggleSkill(skill._id)}
                        className="peer appearance-none w-5 h-5 border-2 border-[#e5e7eb] rounded-md checked:bg-[#38ced6] checked:border-[#38ced6] transition cursor-pointer" />
                        <FaRegCheckCircle className="absolute text-white text-md text-center opacity-0 peer-checked:opacity-100 pointer-events-none transition scale-75" />
                      {skill.name}
                    </label>
                  ))}
                </div>

                {/* {skills.map((skill) => (
                  <label key={skill._id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={skill._id}
                      checked={selectedSkills.includes(skill._id)}
                      onChange={() => toggleSkill(skill._id)}
                    />
                    <span>{skill.name}</span>
                  </label>
                ))} */}

                {/* {selectedCategory ? (
                  <div className="space-y-2 pl-1 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                    {/* ACCEDEMOS A .skills *
                    {categoriesData[selectedCategory].skills.map((skill) => (
                      <label key={skill.name} className="flex items-center space-x-3 cursor-pointer group hover:bg-gray-50 p-1.5 rounded-md transition">
                        <div className="relative flex items-center justify-center w-5 h-5">
                          <input 
                            type="checkbox"
                            onChange={() => toggleSkill(skill.name)} 
                            checked={skills.includes(skill.name)}
                            className="peer appearance-none w-5 h-5 border-2 border-[#e5e7eb] rounded-md checked:bg-[#38ced6] checked:border-[#38ced6] transition cursor-pointer" />
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
                      Selecciona una "Categoría" arriba para cargar las habilidades disponibles.
                    </p>
                  </div>
                )} */}
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
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder={`Ej: Servicio de ${categories ? categories[0].logo + ' ' + categories[0].name : 'profesional'}`}
                    className="bg-transparent border-none outline-none w-full text-[#374151] placeholder-[#9ca3af]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#667387] text-sm mb-2 font-medium">Categoría</label>
                <div className="bg-[#f7f7f9] rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#38ced6] transition">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-transparent border-none outline-none w-full text-[#374151] cursor-pointer placeholder-[#9ca3af]"
                    required
                  >
                    <option value="" disabled>Selecciona tu especialidad</option>
                    {/* Iteramos sobre las llaves y mostramos el logo + nombre */}
                    {categories && categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.logo} {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Descripción General */}
              <div>
                <label className="block text-[#667387] text-sm mb-2 font-medium">Descripción</label>
                <div className="bg-[#f7f7f9] rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#38ced6] transition">
                  <textarea
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                    value={packageFeatures}
                    onChange={(e) => setPackageFeatures(e.target.value)}
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
                <label className="block text-[#667387] text-sm mb-2 font-medium">Tiempo de entrega (Días)</label>
                <div className="flex gap-4">
                  <div className="flex-1 bg-[#f7f7f9] rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#38ced6] transition">
                    <input
                      type="number"
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      placeholder="Ej: 5"
                      className="bg-transparent border-none outline-none w-full text-[#374151] placeholder-[#9ca3af]"
                    />
                  </div>
                </div>
              </div>

              {/* Precio */}
              <div>
                <label className="block text-[#667387] text-sm mb-2 font-medium">Precio (ARS)</label>
                <div className="bg-[#f7f7f9] rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#38ced6] transition flex items-center">
                  <span className="text-[#9ca3af] mr-2 text-lg font-semibold">$</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="100"
                    className="bg-transparent border-none outline-none w-full text-[#374151] placeholder-[#9ca3af] text-lg font-medium"
                  />
                </div>
              </div>

              {/* Categoría (Mostrar la seleccionada en el paso anterior) */}
              {/* <div>
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
              </div> */}

              {/* Fotos */}
              <div>
                <label className="block text-[#667387] text-sm mb-2 font-medium">
                  Fotos de portada
                </label>

                {/* Zona clickeable para subir imágenes */}
                <label
                  htmlFor="images"
                  className="border-2 border-dashed border-[#d1d5db] rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition group"
                >
                  <div className="bg-gray-100 p-3 rounded-full mb-2 group-hover:bg-[#e0fbfc] transition">
                    <FaBriefcase className="text-[#9ca3af] group-hover:text-[#38ced6]" />
                  </div>
                  <p className="text-[#6b7280] text-sm font-medium">
                    Haz clic para subir imágenes
                  </p>
                  <p className="text-[#9ca3af] text-xs mt-1">PNG, JPG hasta 5MB</p>
                </label>

                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setImages((prev) => [...prev, ...files]);
                  }}
                />

                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(img)}
                          alt="preview"
                          className="w-full h-32 object-cover rounded-lg shadow"
                        />

                        {/* Botón eliminar */}
                        <button
                          onClick={() =>
                            setImages((prev) => prev.filter((_, i) => i !== index))
                          }
                          className="cursor-pointer absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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