import { registerUser } from "../../API/userApi";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

const Register = () => {
    const defaultValues = {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        birthdate: "",
    }

    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors, isPending } } = useForm({ defaultValues })

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

    return (
        <section className="bg-white p-10 min-w-md min-h-screen flex flex-col items-center justify-center">
            <h2 className="text-2xl font-semibold mb-6 text-center">Registro</h2>
            <form
                onSubmit={handleSubmit(handleRegister)}
                className="p-10 mt-2"
            >

                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="firstname"
                        placeholder="Nombre"
                        autoComplete="given-name"
                        {...register("firstname")}
                        className="border p-2 rounded-md"
                        required
                    />
                    {errors.firstname && <p className="text-red-400">{errors.firstname.message}</p>}
                    <input
                        type="text"
                        name="lastname"
                        placeholder="Apellido"
                        autoComplete="family-name"
                        {...register("lastname")}
                        className="border p-2 rounded-md"
                        required
                    />
                    {errors.lastname && <p className="text-red-400">{errors.lastname.message}</p>}
                </div>

                <input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    autoComplete="email"
                    {...register("email")}
                    className="border p-2 rounded-md w-full mt-4"
                    required
                />
                {errors.email && <p className="text-red-400">{errors.email.message}</p>}

                <input
                    type="password"
                    name="password"
                    placeholder="******"
                    autoComplete="new-password"
                    {...register("password")}
                    className="border p-2 rounded-md w-full mt-4"
                    required
                />
                {errors.password && <p className="text-red-400">{errors.password.message}</p>}

                <input
                    type="date"
                    name="birthdate"
                    autoComplete="bday"
                    {...register("birthdate")}
                    className="border p-2 rounded-md w-full mt-4"
                    required
                />
                {errors.birthdate && <p className="text-red-400">{errors.birthdate.message}</p>}

                <button
                    type="submit"
                    disabled={isPending}
                    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md transition"
                >
                    {isPending ? "Registrando..." : "Registrarse"}
                </button>
            </form>

            <div className="px-10 space-y-2">
                <Link
                    to={'http://localhost:5000/api/auth/google'}
                    className="flex items-center justify-center w-full space-x-2 bg-gray-100 border border-gray-200 hover:bg-gray-200 px-4 py-2 rounded-md transition-colors duration-pro"
                >
                    <p className="font-bold text-sm text-gray-500">Continuar con Google</p>
                </Link>
                <Link to={'/login'} className="text-center block text-sm text-gray-500">Ya tengo una cuenta</Link>
            </div>
        </section>
    );
}

export default Register