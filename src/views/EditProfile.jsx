import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router';
import { useAuth } from "../hooks/useAuth";
import ImageUploadModal from '../components/ImageUploadModal';

export const EditProfile = () => {
    const navigate = useNavigate();
    const { data } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profileImage, setProfileImage] = useState("../../public/user-image.webp");

    console.log(data);

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        birthdate: '',
        image: '',
        password: '',
        confirmPassword: ''
    });

    React.useEffect(() => {
        if (data?.user) {
            setFormData(prev => ({
                ...prev,
                nombre: data.user.firstname || '',
                apellido: data.user.lastname || '',
                email: data.user.email || '',
                birthdate: data.user.birthdate ? data.user.birthdate.split('T')[0] : '',
                image: data.user.image || ''
            }));
        }
    }, [data]);
    const [errors, setErrors] = useState({});

    const handleSaveImage = (newImage) => {
        setProfileImage(newImage);
    };

    const handleChange = (e) => {
        const { id, value } = e.target;

        if ((id === 'nombre' || id === 'apellido') && !/^[a-zA-Z\s]*$/.test(value)) {
            return;
        }

        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        // Clear error when user types
        if (errors[id]) {
            setErrors(prev => ({
                ...prev,
                [id]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const { email, password, confirmPassword } = formData;

        // Validar Email
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Ingrese un correo electrónico válido';
        }

        // Validar Contraseña (Min 8 chars, 1 mayúscula)
        if (password) {
            if (password.length < 8) {
                newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
            } else if (!/[A-Z]/.test(password)) {
                newErrors.password = 'La contraseña debe contener al menos una letra mayúscula';
            }
            if (confirmPassword.length == 0 || password !== confirmPassword) {
                newErrors.confirmPassword = 'Las contraseñas no coinciden';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            //TODO: guardar cambios en el backend.
            navigate('/profile');
        }
    };

    return (
        <main className='py-8 bg-[#f6ffff] min-h-screen'>
            <ImageUploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveImage}
                currentImage={profileImage}
            />

            <section className='max-w-3xl mx-auto'>
                <h1 className='text-3xl font-black text-[#0f172a] mb-8 text-center md:text-left'>Editar Mi Perfil</h1>

                <div className='bg-white rounded-xl shadow-sm p-8'>
                    {/* Avatar Section */}
                    <div className='flex justify-center mb-8'>
                        <div className='relative'>
                            <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg'>
                                <img
                                    className='w-full h-full object-cover'
                                    src={profileImage}
                                    alt="Foto de perfil"
                                />
                            </div>
                            {/* Botón para subir imagen */}
                            <button
                                type="button"
                                className='absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors  border border-gray-100 cursor-pointer'
                                onClick={() => setIsModalOpen(true)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Form Section */}
                    <form className='space-y-6' onSubmit={handleSubmit}>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            {/* Nombre */}
                            <div className='space-y-2'>
                                <label htmlFor="nombre" className='block text-sm font-semibold text-gray-600'>
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    id="nombre"
                                    placeholder="Arturo"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-blue-100 text-gray-800 focus:outline-none focus:ring-2 focus:border-blue-500 transition-all`}
                                />
                            </div>

                            {/* Apellido */}
                            <div className='space-y-2'>
                                <label htmlFor="apellido" className='block text-sm font-semibold text-gray-600'>
                                    Apellido
                                </label>
                                <input
                                    type="text"
                                    id="apellido"
                                    placeholder="Vidal"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-blue-100 text-gray-800 focus:outline-none focus:ring-2 focus:border-blue-500 transition-all`}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className='space-y-2'>
                            <label htmlFor="email" className='block text-sm font-semibold text-gray-600'>
                                Correo electrónico
                            </label>
                            <input
                                type="text"
                                id="email"
                                placeholder="arturo.vidal@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-lg bg-gray-50 border ${errors.email ? 'border-red-500 focus:ring-red-100' : 'border-gray-200 focus:ring-blue-100'} text-gray-800 focus:outline-none focus:ring-2 focus:border-blue-500 transition-all`}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        {/* Fecha de Nacimiento */}
                        <div className='space-y-2'>
                            <label htmlFor="birthdate" className='block text-sm font-semibold text-gray-600'>
                                Fecha de nacimiento
                            </label>
                            <input
                                type="date"
                                id="birthdate"
                                value={formData.birthdate}
                                onChange={handleChange}
                                className='w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all'
                            />
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            {/* Contraseña */}
                            <div className='space-y-2'>
                                <label htmlFor="password" className='block text-sm font-semibold text-gray-600'>
                                    Nueva contraseña
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg bg-gray-50 border ${errors.password ? 'border-red-500 focus:ring-red-100' : 'border-gray-200 focus:ring-blue-100'} text-gray-800 focus:outline-none focus:ring-2 focus:border-blue-500 transition-all`}
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>

                            {/* Confirmar Contraseña */}
                            <div className='space-y-2'>
                                <label htmlFor="confirmPassword" className='block text-sm font-semibold text-gray-600'>
                                    Confirmar contraseña
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg bg-gray-50 border ${errors.confirmPassword ? 'border-red-500 focus:ring-red-100' : 'border-gray-200 focus:ring-blue-100'} text-gray-800 focus:outline-none focus:ring-2 focus:border-blue-500 transition-all`}
                                />
                                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                            </div>
                        </div>

                        <div className='pt-6 border-t border-gray-100 flex justify-between'>
                            <Link
                                to="/profile"
                                className='flex text-gray-600 tracking-wide font-medium bg-gray-100 rounded-xl px-3 py-2 cursor-pointer hover:bg-gray-200 transition-colors transition duration-300 active:scale-[0.98]'
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                className='flex text-white tracking-wide font-medium bg-[#38ced6] hover:bg-[#2aa8b0] rounded-xl px-3 py-2 cursor-pointer hover:bg-opacity-90 transition duration-300 active:scale-[0.98]'
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    )
}

export default EditProfile
