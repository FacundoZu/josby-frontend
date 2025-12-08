import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import Layout from "./layouts/Layout";
import Login from "./views/auth/Login";
import Register from "./views/auth/Register";
import MisPedidos from "./views/orders/MisPedidos";
import MisPedidosFreelancer from "./views/orders/MisPedidosFreelancer";


export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas que usan el Layout con Header */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {/* nueva ruta: /mis-pedidos */}
          <Route path="mis-pedidos" element={<MisPedidos />} />
          <Route path="/mis-pedidos-freelancer" element={<MisPedidosFreelancer />} />
        </Route>

        {/* Rutas fuera del Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
