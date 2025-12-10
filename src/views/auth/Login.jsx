import { login } from "../../API/authApi";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { FaUser, FaLock, FaGoogle } from "react-icons/fa";
import logoJosby from "../../assets/imgs/josby-logo.png";

const Login = () => {
    const defaultValues = {
        email: "",
        password: ""
    };

    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isPending } } = useForm({ defaultValues });

    const { mutate } = useMutation({
        mutationFn: login,
        onError: (error) => {
            toast.error("Error al iniciar sesión");
        },
        onSuccess: (data) => {
            toast.success("Inicio de sesión exitoso");
            navigate('/');
        }
    });

    const handleLogin = (formData) => mutate(formData);

    return (
        <div className="min-h-[100dvh] bg-[#fefefe] flex flex-col items-center justify-center px-4 py-8 sm:p-6">

            {/* LOGO SUPERIOR: Sincronizado con Register */}
            {/* mt-4 (aire arriba) | mb-12 (separación de la tarjeta) */}
            <div className="mt-4 mb-12 flex justify-center w-full">
                <img
                    src={logoJosby}
                    alt="Logo Josby"
                    className="w-auto h-16 sm:h-20 object-contain"
                />
            </div>

            {/* TARJETA DEL FORMULARIO */}
            <div className="bg-[#ffffff] p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-xl w-full max-w-md mx-auto">

                {/* Título opcional, descomentar si se desea: */}
                {/* <h2 className="text-xl font-bold text-left mb-6 text-[#011314]">Bienvenido</h2> */}

                <form
                    onSubmit={handleSubmit(handleLogin)}
                    className="space-y-4"
                    noValidate
                >
                    {/* 1. USUARIO */}
                    <div>
                        <label className="block text-[#667387] text-sm mb-2">Usuario</label>
                        <div className="flex items-center bg-[#f7f7f9] rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#38ced6] transition">
                            <FaUser className="text-[#9ca3af] mr-3 flex-shrink-0" />
                            <input
                                id="email"
                                type="email"
                                className="bg-transparent border-none outline-none w-full text-[#374151] placeholder-[#9ca3af]"
                                placeholder="Ingresa tu usuario"
                                autoComplete="email"
                                {...register("email", {
                                    required: "El correo es obligatorio",
                                    pattern: {
                                        value: /\S+@\S+\.\S+/,
                                        message: "Correo no válido",
                                    },
                                })}
                            />
                        </div>
                        {errors.email && <p className="text-[#f87171] text-xs mt-1 ml-1">{errors.email.message}</p>}
                    </div>

                    {/* 2. CONTRASEÑA */}
                    <div>
                        <label className="block text-[#667387] text-sm mb-2">Contraseña</label>
                        <div className="flex items-center bg-[#f7f7f9] rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#38ced6] transition">
                            <FaLock className="text-[#9ca3af] mr-3 flex-shrink-0" />
                            <input
                                type="password"
                                className="bg-transparent border-none outline-none w-full text-[#374151] placeholder-[#9ca3af]"
                                placeholder="Ingresa tu contraseña"
                                autoComplete="current-password"
                                {...register("password", {
                                    required: "La contraseña es obligatoria",
                                    minLength: {
                                        value: 6,
                                        message: "Mínimo 6 caracteres",
                                    },
                                })}
                            />
                        </div>
                        {errors.password && <p className="text-[#f87171] text-xs mt-1 ml-1">{errors.password.message}</p>}
                    </div>

                    <div className="pt-2"></div>

                    {/* 3. BOTÓN INICIAR SESIÓN */}
                    <button
                        type="submit"
                        className="w-full bg-[#38ced6] hover:bg-[#2aa8b0] text-[#ffffff] font-bold py-3 rounded-lg transition duration-300 shadow-lg shadow-[#cffafe]/50 active:scale-[0.98] cursor-pointer"
                        disabled={isPending}
                    >
                        {isPending ? "Iniciando..." : "Iniciar Sesión"}
                    </button>
                </form>

                {/* Separador Visual */}
                <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-[#e5e7eb]"></div>
                    <span className="flex-shrink-0 mx-4 text-[#9ca3af] text-sm">o</span>
                    <div className="flex-grow border-t border-[#e5e7eb]"></div>
                </div>

                {/* 4. CONTINUAR CON GOOGLE */}
                <Link
                    to={'http://localhost:5000/api/auth/google'}
                    className="flex items-center justify-center w-full bg-[#ffffff] border border-[#d1d5db] text-[#4b5563] font-medium py-3 rounded-lg hover:bg-[#f9fafb] transition duration-300 gap-3 active:scale-[0.98]"
                >
                    <FaGoogle className="text-[#ef4444] text-lg flex-shrink-0" />
                    <span>Continuar con Google</span>
                </Link>

                {/* 5. REGÍSTRATE */}
                <div className="mt-6 text-center text-sm text-[#6b7280]">
                    ¿No tienes cuenta?{" "}
                    <Link to={'/register'} className="text-[#2aa8b0] font-bold hover:underline">
                        Regístrate aquí
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;