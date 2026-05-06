/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminGaleria from "./pages/AdminGaleria";
import AdminDepoimentos from "./pages/AdminDepoimentos";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import RotaProtegida from "./components/auth/RotaProtegida";

/**
 * Componente principal com roteamento.
 * / -> Landing Page pública
 * /login -> Tela de Login
 * /admin -> Dashboard (Protegido)
 * /admin/galeria -> Módulo Galeria (Protegido)
 * /admin/depoimentos -> Módulo Depoimentos (Protegido)
 */
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Rotas Administrativas Protegidas */}
        <Route path="/admin" element={<RotaProtegida><AdminDashboard /></RotaProtegida>} />
        <Route path="/admin/galeria" element={<RotaProtegida><AdminGaleria /></RotaProtegida>} />
        <Route path="/admin/depoimentos" element={<RotaProtegida><AdminDepoimentos /></RotaProtegida>} />
        
        {/* Fallback para Home caso a rota não exista */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}
