import { NavLink } from "react-router"

const Header = () => {
    return (
        <header className="flex justify-between items-center p-4">
            <h1 className="text-4xl font-bold text-blue-600">
                Josby
            </h1>
            <nav className="flex gap-4">
                <NavLink to="/login" className="border border-gray-200 px-4 py-2">Login</NavLink>
                <NavLink to="/register" className="border border-gray-200 px-4 py-2">Register</NavLink>
            </nav>
        </header>
    )
}

export default Header