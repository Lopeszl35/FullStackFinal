import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cadastrarCandidato } from '../../Services/candidatosService'; 
import './cadastroCandidato.css';


function CadastroCandidatoPage() {
  const [formData, setFormData] = useState({
    cpf: '',
    nome: '',
    endereco: '',
    telefone: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.cpf) newErrors.cpf = 'CPF é obrigatório';
    if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
    if (!formData.endereco) newErrors.endereco = 'Endereço é obrigatório';
    if (!formData.telefone) newErrors.telefone = 'Telefone é obrigatório';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await cadastrarCandidato(formData);
        if (response.success) {
          navigate('/vagasDisponiveis');
        }
      } catch (error) {
        console.error('Erro ao cadastrar candidato', error);
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="cadastro-candidato">
      <h2>Cadastro de Candidato</h2>
      <form onSubmit={handleSubmit}>
        <label>CPF:</label>
        <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} />
        {errors.cpf && <p className="error">{errors.cpf}</p>}

        <label>Nome:</label>
        <input type="text" name="nome" value={formData.nome} onChange={handleChange} />
        {errors.nome && <p className="error">{errors.nome}</p>}

        <label>Endereço:</label>
        <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} />
        {errors.endereco && <p className="error">{errors.endereco}</p>}

        <label>Telefone:</label>
        <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} />
        {errors.telefone && <p className="error">{errors.telefone}</p>}

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default CadastroCandidatoPage;
