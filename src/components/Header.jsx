import { NavLink } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "../API/authApi";
import { toast } from "react-toastify";
import josbyLogo from "../assets/imgs/josby-logo.png";
import { FaUser, FaRegUser } from "react-icons/fa";
import { MdLogout, MdInbox } from "react-icons/md";
import { IoMenu } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { useConversations } from "../hooks/useConversations";
import UnreadBadge from "./chat/UnreadBadge";

const Header = () => {
  const { data } = useAuth();
  const { data: conversations } = useConversations()
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  const isFreelancer = data?.user?.role === "freelancer";

  const { mutate } = useMutation({
    mutationFn: logoutUser,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.removeQueries({ queryKey: ["user"] });
      navigate("/");
    },
  });

  const handleSession = () => {
    mutate();
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, menuRef]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const totalUnread = conversations?.reduce((acc, chat) => {
    return acc + (chat.unread || 0)
  }, 0)

  //Todo: Agregas las rutas correctas de los NavLinks
  return (
    <header className="p-4 bg-[#f6fdfe]">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div>
          <NavLink to="/">
            <img src={josbyLogo} alt="Logo de Josby" className="w-48" />
          </NavLink>
        </div>

        <div className="relative md:hidden">
          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <MdClose className="text-text-primary text-3xl" />
            ) : (
              <IoMenu className="text-text-primary text-3xl" />
            )}
          </button>

          <div
            ref={menuRef}
            className={`fixed inset-0 bg-[#f6fdfe] z-50 pt-16 overflow-auto ${
              isMenuOpen ? "block" : "hidden"
            }`}
          >
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Cerrar menú"
            >
              <MdClose className="text-text-primary text-3xl" />
            </button>
            <div className="px-4 py-4 border-b border-gray-200">
              <nav className="flex flex-col gap-3 text-text-primary">
                <NavLink
                  onClick={() => setIsMenuOpen(false)}
                  to="/"
                  className="hover:text-hover-cyan transition-colors"
                >
                  Servicios
                </NavLink>
                <NavLink
                  onClick={() => setIsMenuOpen(false)}
                  to="/freelancers"
                  className="hover:text-hover-cyan transition-colors"
                >
                  Freelancers
                </NavLink>

                {isFreelancer ? (
                  <NavLink
                    onClick={() => setIsMenuOpen(false)}
                    to="/" 
                    className="hover:text-hover-cyan transition-colors"
                  >
                    Mis pedidos
                  </NavLink>
                ) : (
                  <NavLink
                    onClick={() => setIsMenuOpen(false)}
                    to="/" 
                    className="hover:text-hover-cyan transition-colors"
                  >
                    Ofrecer servicio
                  </NavLink>
                )}
              </nav>
            </div>
            <div className="px-4 py-4">
              {data ? (
                <div className="flex flex-col gap-3">
                  {isFreelancer ? (
                    <NavLink
                      onClick={() => setIsMenuOpen(false)}
                      to="/chat" 
                      className="flex items-center gap-2 bg-white border border-gray-300 text-text-primary hover:bg-gray-100 px-4 py-2 rounded-md"
                    >
                      <MdInbox className="text-xl" /> Mensajes
                    </NavLink>
                  ) : (
                    <NavLink
                      onClick={() => setIsMenuOpen(false)}
                      to="/"
                      className="bg-primary hover:bg-hover-cyan text-white border border-gray-200 px-4 py-2 rounded-md"
                    >
                      Mis pedidos
                    </NavLink>
                  )}
                  <NavLink
                    onClick={() => setIsMenuOpen(false)}
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-gray-100 rounded-md"
                  >
                    <FaRegUser /> Perfil
                  </NavLink>
                  <button
                    onClick={() => {
                      handleSession();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-gray-100 rounded-md"
                  >
                    <MdLogout /> Cerrar sesión
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <NavLink
                    onClick={() => setIsMenuOpen(false)}
                    to="/login"
                    className="bg-primary hover:bg-hover-cyan text-white border border-gray-200 px-4 py-2 rounded-md"
                  >
                    Iniciar Sesión
                  </NavLink>
                  <NavLink
                    onClick={() => setIsMenuOpen(false)}
                    to="/register"
                    className="border border-primary px-4 py-2 rounded-md"
                  >
                    Registrarse
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>

        <nav className="hidden md:flex gap-8 text-sm font-medium text-text-primary items-center">
          <NavLink to="/" className="hover:text-hover-cyan transition-colors">
            Servicios
          </NavLink>
          <NavLink
            to="/freelancers"
            className="hover:text-hover-cyan transition-colors"
          >
            Freelancers
          </NavLink>

          {isFreelancer ? (
            <NavLink
              to="/"
              className="bg-primary hover:bg-hover-cyan text-white border border-gray-200 px-4 py-2 rounded-md"
            >
              Mis pedidos
            </NavLink>
          ) : (
            <NavLink to="/" className="hover:text-hover-cyan transition-colors">
              Ofrecer servicio
            </NavLink>
          )}
        </nav>

        {data ? (
          <nav className="hidden md:flex gap-4 items-center">
            {isFreelancer ? (
              <NavLink
                to="/chat" 
                className=" relative p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full transition-all"
              >
                <MdInbox className="text-3xl" />
                <div className="absolute top-0 right-0">
                    {totalUnread > 0 && (
                      <UnreadBadge count={totalUnread} />
                    )}
                </div>
              </NavLink>
            ) : (
              <NavLink
                to="/"
                className="bg-primary hover:bg-hover-cyan text-white border border-gray-200 px-4 py-2 rounded-md"
              >
                Mis pedidos
              </NavLink>
            )}

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center px-4 py-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <FaUser className="text-primary text-xl" />
                <p className="ms-2 rounded-md">
                  {data.user.firstname} {data.user.lastname}
                </p>
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute dropdown right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200"
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <ul className="py-1">
                    <li>
                      <NavLink
                        to="/"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FaRegUser className="text-text-primary" />
                        Perfil
                      </NavLink>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleSession();
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-gray-100 cursor-pointer"
                      >
                        <MdLogout className="text-text-primary" />
                        Cerrar sesión
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </nav>
        ) : (
          <nav className="hidden md:flex gap-4">
            <NavLink
              to="/login"
              className="bg-primary hover:bg-hover-cyan text-white border border-gray-200 px-4 py-2 rounded-md"
            >
              Iniciar Sesión
            </NavLink>
            <NavLink
              to="/register"
              className="border border-primary px-4 py-2 rounded-md"
            >
              Registrarse
            </NavLink>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
