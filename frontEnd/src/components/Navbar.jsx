import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../Services/authService';
import './navBar.css'

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <ul>
        {/* Estado antes de logar */}
        {!isAuthenticated() ? (
          <li>
            <Link to="/login">Login</Link>
          </li>
        ) : (
          <>
            {/* Estado após logar */}
            <li>
              <Link to="/admin/home">Home</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
