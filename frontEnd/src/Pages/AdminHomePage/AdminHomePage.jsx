import React from 'react';
import { Link } from 'react-router-dom';
import './adminHomePage.css'; // CSS para a página

function AdminHomePage() {
  return (
    <div className="admin-home">
      <h1>Bem-vindo, Administrador!</h1>
      <div className="menu-options">
        <Link to="/admin/gerenciar-candidatos" className="menu-link">
          Gerenciar Candidatos
        </Link>
        <Link to="/admin/gerenciar-vagas" className="menu-link">
          Gerenciar Vagas
        </Link>
      </div>
    </div>
  );
}

export default AdminHomePage;
