import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth' //obtiene los datos del usuario logueado
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setAsFreelancer } from '../API/userApi';
import BecomeFreelancerModal from '../components/BecomeFreelancerModal';

export const Profile = () => {
    const navigate = useNavigate();
    const { data } = useAuth();
    const [isFreelancerModalOpen, setIsFreelancerModalOpen] = useState(false);
    const [isFreelancer, setIsFreelancer] = useState('user');

    React.useEffect(() => {
        if (data?.user?.role) {
            setIsFreelancer(data.user.role === 'freelancer');
        }
    }, [data]);

    console.log(data);
    const queryClient = useQueryClient();

    const setFreelancerMutation = useMutation({
        mutationFn: setAsFreelancer,
        onSuccess: () => {
            console.log("Usuario cambiado a freelancer exitosamente");
            setIsFreelancer(true);
            setIsFreelancerModalOpen(false);
            queryClient.invalidateQueries(['user']);
        },
        onError: (error) => {
            console.error("Error al cambiar a freelancer:", error);
        }
    });

    const handleConfirmFreelancer = () => {
        if (data?.user?.id) {
            setFreelancerMutation.mutate(data.user.id);
        } else {
            console.error("No user ID found to set as freelancer");
        }
    };
    return (
        <>
            <main className='py-8 bg-[#f6ffff]'>
                <section className='max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 '>
                    <article className='pb-7 flex'>
                        <div className='rounded-full mx-10 my-5 p-1 shadow-md w-40'>
                            <img className='rounded-full w-full h-full object-cover'
                                src={data?.user?.image || "../../public/user-image.webp"}
                                alt="Foto de perfil del usuario"
                            />
                        </div>
                        <div className='flex flex-col justify-around items-start'>
                            <div>
                                <h2 className='font-bold pb-2 text-3xl capitalize'>
                                    {data?.user?.firstname} {data?.user?.lastname}
                                </h2>
                                <p className='text-md text-gray-700'>Correo electrónico: {data?.user?.email}</p>
                                <p className='text-md text-gray-700'>
                                    Fecha de nacimiento: {data?.user?.birthdate ? new Date(data.user.birthdate).toLocaleDateString('es-ES', { timeZone: 'UTC' }) : 'No definida'}
                                </p>
                            </div>
                            <a onClick={() => navigate('/edit-profile')} className='flex text-white tracking-wide font-medium bg-[#38ced6] hover:bg-[#2aa8b0] rounded-xl px-3 py-2 transition duration-300 active:scale-[0.98] cursor-pointer' >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                                <p className='mx-1'>Editar perfil</p>
                            </a>
                        </div>
                    </article>
                    <hr className='border-[#ced2d7] mx-6' />

                    {!isFreelancer ? (
                        <article className='bg-white flex flex-col justify-between items-center text-center p-6'>
                            <h2 className='font-bold text-xl pb-2 text-gray-800'>¿Querés ofrecer tus servicios?</h2>
                            <p className='text-sm text-gray-500 pb-6'>Unite a nuestra comunidad de freelancer y empieza a trabajar en <br />proyectos increíbles.</p>
                            <a
                                onClick={() => setIsFreelancerModalOpen(true)}
                                className='flex text-white tracking-wide font-medium bg-[#38ced6] hover:bg-[#2aa8b0] rounded-xl px-4 py-2 transition duration-300 active:scale-[0.98] cursor-pointer shadow-sm'
                            >
                                <p className='mx-1'>Cambiarse a Freelancer</p>
                                <svg className='size-6 w-4' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </a>
                        </article>
                    ) : (
                        <>
                            {/* Sección de descripción */}
                            <article className='bg-white p-6 relative'>
                                <div className='flex justify-between items-center mb-4'>
                                    <h2 className='font-bold text-xl text-gray-900'>Descripción</h2>
                                    <button className='text-[#00d4ff] hover:text-[#00b0d4]'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                    </button>
                                </div>
                                <p className='text-gray-500 text-sm leading-relaxed'>
                                    {data?.user?.description || 'No se ha agregado una descripción'}
                                </p>
                            </article>
                            <hr className='border-[#ced2d7] mx-6' />



                            {/* Sección de ubicación */}
                            <article className='bg-white p-6 relative'>
                                <div className='flex justify-between items-center mb-4'>
                                    <h2 className='font-bold text-xl text-gray-900'>Ubicación</h2>
                                    <button className='text-[#00d4ff] hover:text-[#00b0d4]'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                    </button>
                                </div>
                                <div className='flex items-center text-gray-700 gap-2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                    </svg>
                                    <p className='text-gray-500 text-sm'>{data?.user?.location || 'No se ha agregado una ubicación'}</p>
                                </div>
                            </article>
                            <hr className='border-[#ced2d7] mx-6' />

                            {/* Sección de educación */}
                            <article className='bg-white p-6 relative'>
                                <div className='flex justify-between items-center mb-6'>
                                    <h2 className='font-bold text-xl text-gray-900'>Educación</h2>
                                    <button className='text-[#00d4ff] hover:text-[#00b0d4]'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </button>
                                </div>

                                <div className='space-y-6'>
                                    <div className='flex flex-col md:flex-row gap-4 justify-between items-start border-l-4 border-l-blue-100 pl-4 py-1'>
                                        <div>
                                            <h3 className='font-bold text-lg text-gray-800'>Ingeniería en Informática</h3>
                                            <p className='text-sm text-gray-500 mb-2'>Universidad Nacional de Jujuy | 2018 - 2024</p>
                                            <p className='text-gray-600 text-sm'>
                                                {data?.user?.education || 'No se ha agregado una educación'}
                                            </p>
                                        </div>
                                        <button className='flex items-center gap-2 text-sm font-medium text-[#38ced6] hover:text-[#2aa8b0] bg-cyan-50 hover:bg-cyan-100 px-3 py-1.5 rounded-lg transition-colors mt-2 md:mt-0'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                            </svg>
                                            Ver Título
                                        </button>
                                    </div>
                                </div>
                            </article>
                            <hr className='border-[#ced2d7] mx-6' />

                            {/* Sección de Mis Habilidades */}
                            <article className='bg-white p-6 relative'>
                                <div className='flex justify-between items-center mb-6'>
                                    <h2 className='font-bold text-xl text-gray-900'>Mis Habilidades</h2>
                                    <button className='text-[#00d4ff] hover:text-[#00b0d4]'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </button>
                                </div>
                                <div className='flex flex-wrap gap-3'>
                                    {(() => {
                                        // Array de colores para las habilidades
                                        const tagsColors = [
                                            "bg-blue-100 text-blue-800",
                                            "bg-green-100 text-green-800",
                                            "bg-yellow-100 text-yellow-800",
                                            "bg-purple-100 text-purple-800",
                                            "bg-red-100 text-red-800",
                                            "bg-indigo-100 text-indigo-800",
                                            "bg-pink-100 text-pink-800",
                                        ];

                                        const userSkills = data?.user?.skills || [];

                                        if (userSkills.length === 0) {
                                            return <p className='text-gray-500 text-sm'>No se han agregado habilidades</p>;
                                        }

                                        return userSkills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className={`px-4 py-1.5 rounded-full text-sm font-bold ${tagsColors[index % tagsColors.length]} transition-all cursor-default`}
                                            >
                                                {typeof skill === 'string' ? skill : skill.name}
                                            </span>
                                        ));
                                    })()}
                                </div>
                            </article>
                        </>
                    )}

                </section>
            </main >
            <BecomeFreelancerModal
                isOpen={isFreelancerModalOpen}
                onClose={() => setIsFreelancerModalOpen(false)}
                onConfirm={handleConfirmFreelancer}
            />
        </>
    )
}

export default Profile;