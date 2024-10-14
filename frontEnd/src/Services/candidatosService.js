const API_URL = 'http://localhost:3001';

export const cadastrarCandidato = async (candidato) => {
  try {
    const response = await fetch(`${API_URL}/candidatoCadastro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(candidato),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao cadastrar candidato:', error);
    throw error;
  }
};

export const obterCandidatos = async () => {
    try {
      const token = localStorage.getItem('token');
  
      const response = await fetch(`${API_URL}/candidatos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.status === 403) {
        throw new Error('Acesso negado. Você não tem permissão para acessar esta página.');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao obter candidatos:', error);
      throw error;
    }
  };

export const excluirCandidato = async (cpf) => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/candidatos/${cpf}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 403) {
      throw new Error('Acesso negado. Você não tem permissão para acessar esta página.');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao excluir candidato:', error);
    throw error;
  }
};

export const candidatarVaga = async (cpf, vagaCodigo) => {
    try {
      const response = await fetch(`${API_URL}/candidato/vaga`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cpf, vagaCodigo }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao candidatar-se à vaga:', error);
      throw error;
    }
  };
