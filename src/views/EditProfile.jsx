import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateProfile } from '../API/userApi';
import ImageUploadModal from '../components/ImageUploadModal';
import { FiEdit } from "react-icons/fi";

export const EditProfile = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profileImage, setProfileImage] = useState("/user-image.webp");

    const { data } = useQuery({
        queryKey: ['profile'],
        queryFn: getProfile,
    });

    const mutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            navigate('/profile');
        },
        onError: (error) => {
            setErrors({ submit: error.message || 'Error al actualizar el perfil' });
        }
    });

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        birthdate: '',
        image: '',
        password: '',
        currentPassword: '',
        confirmPassword: ''
    });

    React.useEffect(() => {
        if (data?.user) {
            setFormData(prev => ({
                ...prev,
                firstname: data.user.firstname || '',
                lastname: data.user.lastname || '',
                email: data.user.email || '',
                birthdate: data.user.birthdate ? data.user.birthdate.split('T')[0] : '',
                image: data.user.image || ''
            }));
            if (data.user.image) {
                setProfileImage(data.user.image);
            }
        }
    }, [data]);

    const isGoogleUser = data?.user?.providerId ? true : false;

    const [errors, setErrors] = useState({});

    const handleSaveImage = (newImage) => {
        setProfileImage(newImage);
        setFormData(prev => ({
            ...prev,
            image: newImage
        }));
    };

    const handleChange = (e) => {
        const { id, value } = e.target;

        if ((id === 'firstname' || id === 'lastname') && !/^[a-zA-Z\s]*$/.test(value)) {
            return;
        }

        setFormData(prev => ({
            ...prev,
            [id]: value
        }));

        if (errors[id]) {
            setErrors(prev => ({
                ...prev,
                [id]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const { password, currentPassword, confirmPassword } = formData;

        if (password) {
            if (!currentPassword) {
                newErrors.currentPassword = 'Debe ingresar su contraseña actual';
            }

            if (password.length < 6) {
                newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
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
            const updateData = {
                firstname: formData.firstname,
                lastname: formData.lastname,
                birthdate: formData.birthdate,
                image: formData.image,
            };

            if (formData.password) {
                updateData.password = formData.password;
                updateData.currentPassword = formData.currentPassword;
            }

            mutation.mutate(updateData);
        }
    };

    return (
        <main className='py-8 min-h-screen'>
            <ImageUploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveImage}
                currentImage={profileImage}
            />

            <section className='max-w-3xl mx-auto'>
                <h1 className='text-3xl font-black text-[#0f172a] mb-8 text-center md:text-left'>Editar Mi Perfil</h1>

                <div className='bg-white rounded-xl shadow-sm p-8'>
                    <div className='flex justify-center mb-8'>
                        <div className='relative'>
                            <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg'>
                                <img
                                    className='w-full h-full object-cover'
                                    src={profileImage}
                                    alt="Foto de perfil"
                                />
                            </div>
                            <button
                                type="button"
                                className='absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors  border border-gray-100 cursor-pointer'
                                onClick={() => setIsModalOpen(true)}
                            >
                                <FiEdit className='w-5 h-5 text-gray-600' />
                            </button>
                        </div>
                    </div>

                    <form className='space-y-6' onSubmit={handleSubmit}>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className='space-y-2'>
                                <label htmlFor="firstname" className='block text-sm font-semibold text-gray-600'>
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    id="firstname"
                                    placeholder="Arturo"
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-blue-100 text-gray-800 focus:outline-none focus:ring-2 focus:border-blue-500 transition-all`}
                                />
                            </div>

                            <div className='space-y-2'>
                                <label htmlFor="lastname" className='block text-sm font-semibold text-gray-600'>
                                    Apellido
                                </label>
                                <input
                                    type="text"
                                    id="lastname"
                                    placeholder="Vidal"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-blue-100 text-gray-800 focus:outline-none focus:ring-2 focus:border-blue-500 transition-all`}
                                />
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <label htmlFor="email" className='block text-sm font-semibold text-gray-600'>
                                Correo electrónico
                            </label>
                            <input
                                type="text"
                                id="email"
                                value={formData.email}
                                disabled
                                className={`w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed`}
                            />
                        </div>

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

                        {!isGoogleUser && (
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div className='space-y-2 md:col-span-2'>
                                    <label htmlFor="currentPassword" className='block text-sm font-semibold text-gray-600'>
                                        Contraseña actual
                                    </label>
                                    <input
                                        type="password"
                                        id="currentPassword"
                                        placeholder="••••••••"
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-lg bg-gray-50 border ${errors.currentPassword ? 'border-red-500 focus:ring-red-100' : 'border-gray-200 focus:ring-blue-100'} text-gray-800 focus:outline-none focus:ring-2 focus:border-blue-500 transition-all`}
                                    />
                                    {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>}
                                    <p className="text-xs text-gray-500">Solo requerida si deseas cambiar tu contraseña</p>
                                </div>

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
                        )}

                        {errors.submit && (
                            <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
                                {errors.submit}
                            </div>
                        )}

                        <div className='pt-6 border-t border-gray-100 flex justify-between'>
                            <Link
                                to="/profile"
                                className='flex text-gray-600 tracking-wide font-medium bg-gray-100 rounded-xl px-3 py-2 cursor-pointer hover:bg-gray-200 transition-colors duration-300 active:scale-[0.98]'
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={mutation.isPending}
                                className='flex text-white tracking-wide font-medium bg-primary hover:bg-primary-dark rounded-xl px-3 py-2 cursor-pointer hover:bg-opacity-90 transition duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {mutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    )
}

export default EditProfile
