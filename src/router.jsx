import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./views/Home";
import Layout from "./layouts/Layout";
import Login from "./views/auth/Login";
import Register from "./views/auth/Register";
import { ToastContainer } from "react-toastify";
import Freelancers from "./views/freelancers/Freelancers";
import Service from "./views/service/Service";

export default function router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="/freelancers" element={<Freelancers />} />
                    <Route path="/service/:id" element={<Service />} />

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
