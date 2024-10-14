import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CadastroCandidatoPage from './Pages/cadastroCandidato/CadastroCandidatoPage';
import VagasDisponiveisPage from './Pages/vagasDisponiveis/VagasDisponiveisPage';
import LoginPage from './Pages/Login/LoginPage';
import GerenciarCandidatosPage from './Pages/gerenciarCandidatos/GerenciarCandidatosPage';
import GerenciarVagasPage from './Pages/gerenciarVagas/GerenciarVagasPage';
import Navbar from './components/Navbar';
import AdminHomePage from './Pages/AdminHomePage/AdminHomePage';

function App() {
  return (
    <Router>
      <div>
        <Navbar /> {/* Menu de navegação superior */}
        <Routes>
          <Route path="/cadastroCandidato" element={<CadastroCandidatoPage />} />
          <Route path="/vagasDisponiveis" element={<VagasDisponiveisPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/home" element={<AdminHomePage />} />
          <Route path="/admin/gerenciar-candidatos" element={<GerenciarCandidatosPage />} />
          <Route path="/admin/gerenciar-vagas" element={<GerenciarVagasPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
