const API_URL = 'http://localhost:3001'; // URL base do backend

export const login = async (email, senha) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token); // Armazena o token JWT no localStorage
      return data;
    } else {
      throw new Error(data.message || 'Erro ao fazer login');
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token'); // Remove o token JWT do localStorage
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token'); // Verifica se o token está presente
};
