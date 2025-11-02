import { login } from "../../API/authApi";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const Login = () => {
    const defaultValues = {
        email: "",
        password: ""
    }
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors, isPending } } = useForm({ defaultValues })

    const { mutate } = useMutation({
        mutationFn: login,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            navigate('/')
        }
    })

    const handleLogin = (formData) => mutate(formData)

    return (
        <section className="bg-white p-10 min-w-md min-h-screen flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold text-center mb-4">Iniciar Sesión</h2>
            <form
                onSubmit={handleSubmit(handleLogin)}
                className="p-10 mt-2"
                noValidate
            >
                <input
                    id="email"
                    type="email"
                    className="w-full border p-2 mb-3 rounded"
                    autoComplete="email"
                    placeholder="correo@gmail.com"
                    {...register("email", {
                        required: "El correo es obligatorio",
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: "Correo no válido",
                        },
                    })}
                />

                {errors.email && <p className="text-red-400">{errors.email.message}</p>}

                <input
                    type="password"
                    className="w-full border p-2 mb-3 rounded"
                    autoComplete="current-password"
                    placeholder="********"
                    {...register("password", {
                        required: "La contraseña es obligatoria",
                        minLength: {
                            value: 6,
                            message: "La contraseña debe tener al menos 6 caracteres",
                        },
                    })}
                />


                {errors.password && <p className="text-red-400">{errors.password.message}</p>}

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                    disabled={isPending}
                >
                    {isPending ? "Iniciando Sesión..." : "Iniciar Sesión"}
                </button>
            </form>
            <div className="px-10 space-y-2">
                <Link
                    to={'http://localhost:5000/api/auth/google'}
                    className="flex items-center justify-center w-full space-x-2 bg-gray-100 border border-gray-200 hover:bg-gray-200 px-4 py-2 rounded-md transition-colors duration-pro"
                >
                    <p className="font-bold text-sm text-gray-500">Continuar con Google</p>
                </Link>
                <Link to={'/register'} className="text-center block text-sm text-gray-500">Registrarse</Link>
            </div>
        </section>
    );
};

export default Login;
