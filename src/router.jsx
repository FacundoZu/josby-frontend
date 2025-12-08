import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./views/Home";
import Layout from "./layouts/Layout";
import Login from "./views/auth/Login";
import Register from "./views/auth/Register";
import { ToastContainer } from "react-toastify";
import Freelancers from "./views/freelancers/Freelancers";
import Service from "./views/service/Service";
import ChatFreelancer from "./views/chat/ChatFreelancer";
import GlobalSocketListener from "./listeners/GlobalSocketListener";
import FormServices from "./views/formServices";
import { Profile } from "./views/Profile";
import { EditProfile } from "./views/EditProfile";
import MisPedidos from "./views/orders/MisPedidos";
import MisPedidosFreelancer from "./views/orders/MisPedidosFreelancer";

export default function router() {
    return (
        <BrowserRouter>
            <GlobalSocketListener />

            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="/freelancers" element={<Freelancers />} />
                    <Route path="/service/:id" element={<Service />} />
                    <Route path="/service" element={<FormServices />} />
                    <Route path="/chat" element={<ChatFreelancer />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/edit-profile" element={<EditProfile />} />
                    <Route path="mis-pedidos" element={<MisPedidos />} />
                    <Route path="/mis-pedidos-freelancer" element={<MisPedidosFreelancer />} />
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

            </Routes>
            <ToastContainer
                pauseOnHover={false}
                pauseOnFocusLoss={false}
            />
        </BrowserRouter>
    )
}