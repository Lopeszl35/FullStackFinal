import React, { useEffect, useState } from 'react';
import { candidatarVaga } from '../../Services/candidatosService';
import { obterVagas } from '../../Services/vagasService';
import './cadastroCandidato.css';

function CadastroCandidatoPage() {
  const [candidato, setCandidato] = useState({
    nome: '',
    cpf: '',
    endereco: '',
    telefone: ''
  });
  const [vagas, setVagas] = useState([]);
  const [vagaSelecionada, setVagaSelecionada] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [formError, setFormError] = useState(''); 

  useEffect(() => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificação de campos vazios
    if (!candidato.nome || !candidato.cpf || !candidato.endereco || !candidato.telefone || !vagaSelecionada) {
      setFormError('Todos os campos e a seleção da vaga são obrigatórios.');
      return;
    }

    try {
        // Não precisa recriar o objeto candidato, pois ele já está definido no estado
        const candidatura = await candidatarVaga(candidato, vagaSelecionada);
        
        if (candidatura.success) {
          setMensagem('Candidato cadastrado e candidatura realizada com sucesso!');
        } else {
          setMensagem('Erro ao candidatar-se à vaga.');
        }
    } catch (error) {
      console.error('Erro ao cadastrar candidato e candidatar-se à vaga:', error);
      setMensagem('Ocorreu um erro ao processar sua solicitação.');
    }
};

  const handleChange = (e) => {
    setCandidato({
      ...candidato,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="cadastro-candidato-vagas">
      <h2>Cadastro de Candidato e Candidatura</h2>
      {mensagem && <p className="mensagem">{mensagem}</p>}
      <form onSubmit={handleSubmit}>
        <label>Nome:</label>
        <input type="text" name="nome" value={candidato.nome} onChange={handleChange} />

        <label>CPF:</label>
        <input type="text" name="cpf" value={candidato.cpf} onChange={handleChange} />

        <label>Endereço:</label>
        <input type="text" name="endereco" value={candidato.endereco} onChange={handleChange} />

        <label>Telefone:</label>
        <input type="text" name="telefone" value={candidato.telefone} onChange={handleChange} />

        <label>Selecione uma vaga:</label>
        <select value={vagaSelecionada} onChange={(e) => setVagaSelecionada(e.target.value)}>
          <option value="">Selecione uma vaga</option>
          {vagas.map((vaga) => (
            <option key={vaga.vaga_codigo} value={vaga.vaga_codigo}>
              {vaga.vaga_cargo} - {vaga.vaga_cidade} (R$ {vaga.vaga_salario})
            </option>
          ))}
        </select>

        <button type="submit">Cadastrar e Candidatar-se</button>

        {formError && <p className="form-error">{formError}</p>}
      </form>
    </div>
  );
}

export default CadastroCandidatoPage;
