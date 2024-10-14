import React, { useEffect, useState } from 'react';
import { obterVagas } from '../../Services/vagasService'; 
import { candidatarVaga } from '../../Services/candidatosService'; 
import './vagasDisponiveis.css';

function VagasDisponiveisPage() {
  const [vagas, setVagas] = useState([]);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    // Função para buscar todas as vagas disponíveis
    const fetchVagas = async () => {
      try {
        const vagasData = await obterVagas();
        setVagas(vagasData);
      } catch (error) {
        console.error('Erro ao obter vagas:', error);
      }
    };

    fetchVagas();
  }, []);

  const handleCandidatar = async (vagaCodigo) => {
    const cpf = localStorage.getItem('cpf'); // CPF do candidato deve estar armazenado no localStorage após cadastro/login
    if (!cpf) {
      setMensagem('Você precisa estar logado para se candidatar.');
      return;
    }

    try {
      const response = await candidatarVaga(cpf, vagaCodigo);
      if (response.success) {
        setMensagem('Candidatura realizada com sucesso!');
      } else {
        setMensagem('Erro ao se candidatar. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao se candidatar:', error);
      setMensagem('Erro ao se candidatar. Tente novamente.');
    }
  };

  return (
    <div className="vagas-disponiveis">
      <h2>Vagas Disponíveis</h2>
      {mensagem && <p className="mensagem">{mensagem}</p>}

      <ul>
        {vagas.length > 0 ? (
          vagas.map((vaga) => (
            <li key={vaga.vaga_codigo}>
              <h3>{vaga.vaga_cargo}</h3>
              <p><strong>Salário:</strong> {vaga.vaga_salario}</p>
              <p><strong>Cidade:</strong> {vaga.vaga_cidade}</p>
              <p><strong>Quantidade de Vagas:</strong> {vaga.vaga_quantidade}</p>
              <button onClick={() => handleCandidatar(vaga.vaga_codigo)}>
                Candidatar-se
              </button>
            </li>
          ))
        ) : (
          <p>Nenhuma vaga disponível no momento.</p>
        )}
      </ul>
    </div>
  );
}

export default VagasDisponiveisPage;
