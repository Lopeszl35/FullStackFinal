import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../Services/authService';
import './login.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook para navegação

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const data = await login(email, password);
      console.log("Login bem-sucedido: ", data);
      localStorage.setItem('token', data.token);
      navigate('/admin/home'); 
    } catch (error) {
      setError(error.message || 'Falha ao logar');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Senha:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default LoginPage;
