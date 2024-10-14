const API_URL = 'http://localhost:3001'; 

export const obterVagas = async () => {
  try {
    const response = await fetch(`${API_URL}/vagas`, {
      method: 'GET',
    });
    console.log(response);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao obter vagas:', error);
    throw error;
  }
};

export const adicionarVaga = async (vaga) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/vagas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(vaga),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao adicionar vaga:', error);
    throw error;
  }
};


export const editarVaga = async (vaga_codigo, vaga) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/vagas/${vaga_codigo}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(vaga),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao editar vaga:', error);
    throw error;
  }
};


export const excluirVaga = async (vaga_codigo) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/vagas/${vaga_codigo}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao excluir vaga:', error);
    throw error;
  }
};
