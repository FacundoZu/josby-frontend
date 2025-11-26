import { registerUser } from "../../API/userApi";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FaUser, FaLock, FaGoogle, FaEnvelope, FaCalendarAlt } from "react-icons/fa"; 
import logoJosby from "../../assets/imgs/josby-logo.png";

const Register = () => {
    const defaultValues = {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        birthdate: "",
    }

    const navigate = useNavigate()
    const { register, handleSubmit, watch, formState: { errors, isPending } } = useForm({ defaultValues })

    const { mutate } = useMutation({
        mutationFn: registerUser,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            navigate('/')
        }
    })

    const handleRegister = (formData) => mutate(formData)

    const birthdateValue = watch("birthdate");

    // Clases reutilizables (Idénticas al Login)
    const labelClasses = "block text-[#667387] text-sm mb-2";
    const inputContainerClasses = "flex items-center bg-[#f7f7f9] rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#38ced6] transition";
    
    // Base para inputs normales
    const inputClasses = "bg-transparent border-none outline-none w-full text-[#374151] placeholder-[#9ca3af]";
    
    // Clases específicas para el input date (Mantiene estilo visual del Login)
    const dateInputClasses = `
        bg-transparent border-none outline-none w-full 
        ${birthdateValue ? 'text-[#374151]' : 'text-[#9ca3af]'} 
        placeholder-[#9ca3af]
        [&::-webkit-calendar-picker-indicator]:opacity-40
        [&::-webkit-calendar-picker-indicator]:cursor-pointer
        [&::-webkit-calendar-picker-indicator]:hover:opacity-60
    `;

    const iconClasses = "text-[#9ca3af] mr-3 flex-shrink-0";
    const errorClasses = "text-[#f87171] text-xs mt-1 ml-1";

    return (
        <div className="min-h-[100dvh] bg-[#fefefe] flex flex-col items-center justify-center px-4 py-8 sm:p-6">
            
            {/* LOGO SUPERIOR */}
            <div className="mt-4 mb-12 flex justify-center w-full">
                <img 
                    src={logoJosby} 
                    alt="Logo Josby" 
                    className="w-auto h-16 sm:h-20 object-contain" 
                />
            </div>

            {/* TARJETA DEL FORMULARIO */}
            <div className="bg-[#ffffff] p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-xl w-full max-w-md mx-auto">
                
                {/* CORRECCIÓN: Cambiado de text-[#5a6678] a text-[#011314] para igualar la referencia del Login */}
                {/*<h2 className="text-xl font-bold text-left mb-6 text-[#011314]">Registrate</h2>*/}

                <form
                    onSubmit={handleSubmit(handleRegister)}
                    className="space-y-4"
                    noValidate
                >

                    {/* GRID NOMBRE Y APELLIDO */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Nombre */}
                        <div>
                            <label className={labelClasses}>Nombre</label>
                            <div className={inputContainerClasses}>
                                <FaUser className={iconClasses} />
                                <input
                                    type="text"
                                    placeholder="Nombre"
                                    autoComplete="given-name"
                                    {...register("firstname", { required: "Requerido" })}
                                    className={inputClasses}
                                />
                            </div>
                            {errors.firstname && <p className={errorClasses}>{errors.firstname.message}</p>}
                        </div>

                        {/* Apellido */}
                        <div>
                            <label className={labelClasses}>Apellido</label>
                            <div className={inputContainerClasses}>
                                <FaUser className={iconClasses} />
                                <input
                                    type="text"
                                    placeholder="Apellido"
                                    autoComplete="family-name"
                                    {...register("lastname", { required: "Requerido" })}
                                    className={inputClasses}
                                />
                            </div>
                            {errors.lastname && <p className={errorClasses}>{errors.lastname.message}</p>}
                        </div>
                    </div>

                    {/* EMAIL */}
                    <div>
                        <label className={labelClasses}>Correo electrónico</label>
                        <div className={inputContainerClasses}>
                            <FaEnvelope className={iconClasses} />
                            <input
                                type="email"
                                placeholder="ejemplo@correo.com"
                                autoComplete="email"
                                {...register("email", { 
                                    required: "El correo es obligatorio",
                                    pattern: { value: /\S+@\S+\.\S+/, message: "Correo inválido" }
                                })}
                                className={inputClasses}
                            />
                        </div>
                        {errors.email && <p className={errorClasses}>{errors.email.message}</p>}
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <label className={labelClasses}>Contraseña</label>
                        <div className={inputContainerClasses}>
                            <FaLock className={iconClasses} />
                            <input
                                type="password"
                                placeholder="******"
                                autoComplete="new-password"
                                {...register("password", { required: "La contraseña es obligatoria", minLength: { value: 6, message: "Mínimo 6 caracteres" } })}
                                className={inputClasses}
                            />
                        </div>
                        {errors.password && <p className={errorClasses}>{errors.password.message}</p>}
                    </div>

                    {/* FECHA DE NACIMIENTO */}
                    <div>
                        <label className={labelClasses}>Fecha de nacimiento</label>
                        <div className={inputContainerClasses}>
                            <FaCalendarAlt className={iconClasses} />
                            <input
                                type="date"
                                autoComplete="bday"
                                {...register("birthdate", { required: "Fecha requerida" })}
                                className={dateInputClasses} 
                            />
                        </div>
                        {errors.birthdate && <p className={errorClasses}>{errors.birthdate.message}</p>}
                    </div>

                    {/* BOTÓN REGISTRARSE */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full mt-2 bg-[#38ced6] hover:bg-[#2aa8b0] text-[#ffffff] font-bold py-3 rounded-lg transition duration-300 shadow-lg shadow-[#cffafe]/50 active:scale-[0.98]"
                    >
                        {isPending ? "Registrando..." : "Registrarse"}
                    </button>
                </form>

                {/* Separador Visual */}
                <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-[#e5e7eb]"></div>
                    <span className="flex-shrink-0 mx-4 text-[#9ca3af] text-sm">o</span>
                    <div className="flex-grow border-t border-[#e5e7eb]"></div>
                </div>

                {/* BOTÓN GOOGLE */}
                <Link
                    to={'http://localhost:5000/api/auth/google'}
                    className="flex items-center justify-center w-full bg-[#ffffff] border border-[#d1d5db] text-[#4b5563] font-medium py-3 rounded-lg hover:bg-[#f9fafb] transition duration-300 gap-3 active:scale-[0.98]"
                >
                    <FaGoogle className="text-[#ef4444] text-lg flex-shrink-0" />
                    <span>Continuar con Google</span>
                </Link>

                {/* FOOTER LINK */}
                <div className="mt-6 text-center text-sm text-[#6b7280]">
                    ¿Ya tienes una cuenta?{" "}
                    <Link to={'/login'} className="text-[#2aa8b0] font-bold hover:underline">
                        Inicia sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register;