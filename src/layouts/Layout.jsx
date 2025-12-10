import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { socket } from "../libs/socket.js"; 
import { useAuth } from "../hooks/useAuth.js";
import { useEffect } from "react";

export default function Layout() {
  const { data: user, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return

    if (user) {
      if (!socket.connected) {
        socket.connect()
        const userId = user.user.id || user.user._id;
      
        socket.emit("join_chat", userId)

        socket.emit("setup", user.user.id)
      }
    } else {
      if (socket.connected) {
        socket.disconnect()
      }
    }
    
  }, [user, isLoading])
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}