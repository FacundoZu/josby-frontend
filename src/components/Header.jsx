import { NavLink } from "react-router"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router"
import { useQueryClient } from "@tanstack/react-query"
import { useMutation } from "@tanstack/react-query"
import { logoutUser } from "../API/authApi"
import { toast } from "react-toastify"

const Header = () => {
    const { data } = useAuth()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: logoutUser,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.removeQueries({ queryKey: ['user'] })
            navigate('/')
        }
    })

    const handleSession = () => {
        mutate()
    }

    // if (isLoading) return null

    return (
        <header className="flex justify-between items-center p-4">
            <h1 className="text-4xl font-bold text-blue-600">
                Josby
            </h1>
            {data? (
                <nav className="flex gap-4">
                    <p className="border border-gray-200 px-4 py-2">{data.user.firstname} {data.user.lastname}</p>
                    <button className="border border-gray-200 px-4 py-2 cursor-pointer" onClick={handleSession}>Logout</button>
                </nav>
            ) : (
                <nav className="flex gap-4">
                    <NavLink to="/login" className="border border-gray-200 px-4 py-2">Login</NavLink>
                    <NavLink to="/register" className="border border-gray-200 px-4 py-2">Register</NavLink>
                </nav>
            )}
        </header>
    )
}

export default Header