import React, { useEffect, useState } from 'react';
import { obterCandidatos, excluirCandidato } from '../../Services/candidatosService';
import './gerenciarCandidatos.css';

function GerenciarCandidatosPage() {
  const [candidatos, setCandidatos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCandidatos = async () => {
      try {
        const data = await obterCandidatos();
        if (Array.isArray(data)) {
          setCandidatos(data); // Certifica-se de que é um array
        } else {
          setError('Erro ao carregar candidatos.');
        }
      } catch (error) {
        setError('Erro ao carregar candidatos.');
        console.error(error);
      }
    };

    fetchCandidatos();
  }, []);

  const handleDelete = async (cpf) => {
    const confirmed = window.confirm('Tem certeza que deseja excluir este candidato?');
    if (confirmed) {
      try {
        await excluirCandidato(cpf);
        setCandidatos(candidatos.filter(candidato => candidato.cpf !== cpf));
      } catch (error) {
        console.error('Erro ao excluir candidato', error);
      }
    }
  };

  return (
    <div className="gerenciar-candidatos">
      <h2>Gerenciar Candidatos</h2>
      {error && <p className="error">{error}</p>}
      <ul>
        {candidatos.length > 0 ? (
          candidatos.map((candidato, index) => (
            <li key={candidato.cand_cpf || index}> {/* Usar `index` como fallback se o CPF não estiver disponível */}
              <h3>{candidato.cand_nome}</h3>
              <p>CPF: {candidato.cand_cpf}</p>
              <p>Endereço: {candidato.cand_endereco}</p>
              <p>Telefone: {candidato.cand_telefone}</p>
              <button onClick={() => handleDelete(candidato.cand_cpf)}>Excluir</button>
            </li>
          ))
        ) : (
          <p>Nenhum candidato encontrado.</p>
        )}
      </ul>
    </div>
  );
}

export default GerenciarCandidatosPage;
