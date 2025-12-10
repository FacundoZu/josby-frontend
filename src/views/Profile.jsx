import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '../API/userApi'
import BecomeFreelancerModal from '../components/BecomeFreelancerModal';
import ServiceCard from '../components/home/ServiceCard';
import { FiEdit, FiPlus } from 'react-icons/fi';
import { IoIosArrowForward } from "react-icons/io";

export const Profile = () => {
    const navigate = useNavigate();
    const [isFreelancerModalOpen, setIsFreelancerModalOpen] = useState(false);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['profile'],
        queryFn: getProfile,
    });

    const user = data?.user;
    const services = data?.services || [];
    console.log(services)
    const isFreelancer = user?.role === 'freelancer';

    const handleConfirmFreelancer = () => {
        navigate("/service")
        setIsFreelancerModalOpen(false)
    };

    if (isLoading) {
        return (
            <main className='py-8'>
                <section className='max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6'>
                    <div className='animate-pulse'>
                        <div className='pb-7 flex'>
                            <div className='rounded-full mx-10 my-5 bg-gray-200 w-40 h-40'></div>
                            <div className='flex flex-col justify-around items-start flex-1'>
                                <div className='w-full'>
                                    <div className='h-8 bg-gray-200 rounded w-2/3 mb-2'></div>
                                    <div className='h-4 bg-gray-200 rounded w-1/2 mb-2'></div>
                                    <div className='h-4 bg-gray-200 rounded w-1/3'></div>
                                </div>
                                <div className='h-10 bg-gray-200 rounded w-32'></div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    if (isError) {
        return (
            <main className='py-8'>
                <section className='max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6'>
                    <div className='text-center py-12'>
                        <p className='text-red-500'>Error al cargar el perfil</p>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <>
            <main className='py-8'>
                <section className='max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 '>
                    <article className='pb-7 flex'>
                        <div className='rounded-full mx-10 my-5 p-1 shadow-md w-40'>
                            <img className='rounded-full w-full h-full object-cover'
                                src={user?.image || "/user-image.webp"}
                                alt="Foto de perfil del usuario"
                            />
                        </div>
                        <div className='flex flex-col justify-around items-start'>
                            <div>
                                <h2 className='font-bold pb-2 text-3xl capitalize'>
                                    {user?.firstname} {user?.lastname}
                                </h2>
                                <p className='text-md text-gray-700'>Correo electrónico: {user?.email}</p>
                                <p className='text-md text-gray-700'>
                                    Fecha de nacimiento: {user?.birthdate ? new Date(user.birthdate).toLocaleDateString('es-ES', { timeZone: 'UTC' }) : 'No definida'}
                                </p>
                                {user?.location && (
                                    <p className='text-md text-gray-700'>Ubicación: {user.location}</p>
                                )}
                            </div>
                            <a onClick={() => navigate('/edit-profile')} className='flex text-white tracking-wide font-medium bg-primary hover:bg-primary-dark rounded-xl px-3 py-2 transition duration-300 active:scale-[0.98] cursor-pointer' >
                                <FiEdit className='w-5 h-5 text-white' />
                                <p className='mx-1'>Editar perfil</p>
                            </a>
                        </div>
                    </article>
                    <hr className='border-[#ced2d7] mx-6' />

                    {!isFreelancer && (
                        <article className='bg-white flex flex-col justify-between items-center text-center p-6'>
                            <h2 className='font-bold text-xl pb-2 text-gray-800'>¿Querés ofrecer tus servicios?</h2>
                            <p className='text-sm text-gray-500 pb-6'>Unite a nuestra comunidad de freelancer y empieza a trabajar en <br />proyectos increíbles.</p>
                            <a
                                onClick={() => setIsFreelancerModalOpen(true)}
                                className='flex text-white tracking-wide items-center font-medium bg-primary hover:bg-primary-dark rounded-xl px-4 py-2 transition duration-300 active:scale-[0.98] cursor-pointer shadow-sm'
                            >
                                <p className='mx-1'>Cambiarse a Freelancer</p>
                                <IoIosArrowForward className='w-5 h-5 text-white' />
                            </a>
                        </article>
                    )}

                    {isFreelancer && services.length > 0 && (
                        <article className='bg-white p-6'>
                            <h2 className='font-bold text-xl pb-4 text-gray-800'>Mis Servicios</h2>
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6'>
                                {services.map((service) => (
                                    <ServiceCard key={service._id} service={service} />
                                ))}
                            </div>
                        </article>
                    )}

                    {isFreelancer && services.length === 0 && (
                        <article className='bg-white flex flex-col justify-between items-center text-center p-6'>
                            <h2 className='font-bold text-xl pb-2 text-gray-800'>Aún no tenés servicios publicados</h2>
                            <p className='text-sm text-gray-500 pb-6'>Creá tu primer servicio para empezar a recibir propuestas.</p>
                            <a
                                onClick={() => navigate('/service')}
                                className='flex text-white tracking-wide items-center font-medium bg-primary hover:bg-primary-dark rounded-xl px-4 py-2 transition duration-300 active:scale-[0.98] cursor-pointer shadow-sm'
                            >
                                <p className='mx-1'>Crear Servicio</p>
                                <FiPlus className='w-5 h-5 text-white' />
                            </a>
                        </article>
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