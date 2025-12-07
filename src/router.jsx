import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import Layout from "./layouts/Layout";
import Login from "./views/auth/Login";
import Register from "./views/auth/Register";
import MisPedidos from "./views/orders/MisPedidos";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas que usan el Layout con Header */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {/* nueva ruta: /mis-pedidos */}
          <Route path="mis-pedidos" element={<MisPedidos />} />
        </Route>

        {/* Rutas fuera del Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
