import React, { useEffect, useState } from 'react';
import { obterVagas, excluirVaga, adicionarVaga, editarVaga } from '../../Services/vagasService';
import Modal from 'react-modal'; // Importação do React Modal
import './gerenciarVagas.css';

// Configuração do modal
Modal.setAppElement('#root');

function GerenciarVagasPage() {
  const [vagas, setVagas] = useState([]); // Garante que é um array
  const [novaVaga, setNovaVaga] = useState({ cargo: '', salario: '', cidade: '', quantidade: '' });
  const [editandoVaga, setEditandoVaga] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o modal
  const [error, setError] = useState('');
  const [formError, setFormError] = useState(''); // Estado para armazenar o erro de validação do formulário
  const [editFormError, setEditFormError] = useState(''); // Estado para armazenar o erro de validação do formulário de edição

  useEffect(() => {
    const fetchVagas = async () => {
      try {
        console.log('Buscando vagas...');
        const data = await obterVagas();
        console.log('Vagas carregadas:', data);
        if (Array.isArray(data)) {
          setVagas(data);
        } else {
          setError('Erro ao carregar vagas. Resposta inválida.');
        }
      } catch (error) {
        console.error('Erro ao obter vagas:', error);
        setError('Erro ao carregar vagas.');
      }
    };
    fetchVagas();
  }, []);

  const handleAddVaga = async () => {
    console.log('Tentando adicionar vaga...');
    if (!novaVaga.cargo || !novaVaga.salario || !novaVaga.cidade || !novaVaga.quantidade) {
      setFormError('Todos os campos são obrigatórios.');
      return;
    }

    try {
      const response = await adicionarVaga(novaVaga);
      console.log('Vaga adicionada:', response);
      setVagas([...vagas, response]);
      setNovaVaga({ cargo: '', salario: '', cidade: '', quantidade: '' });
      setFormError('');
    } catch (error) {
      console.error('Erro ao adicionar vaga', error);
      setError('Erro ao adicionar vaga.');
    }
  };

  const handleEditVaga = (vaga_codigo) => {
    console.log('Tentando editar vaga com código:', vaga_codigo);
    const vaga = vagas.find((vaga) => vaga.vaga_codigo === vaga_codigo);
    console.log('Vaga encontrada para edição:', vaga);
    if (vaga) {
      setEditandoVaga({ ...vaga }); // Garante que estamos criando uma cópia do objeto para editar
      setIsModalOpen(true);
    } else {
      console.error('Vaga não encontrada:', vaga_codigo);
    }
  };

  const handleUpdateVaga = async () => {
    console.log('Tentando atualizar vaga:', editandoVaga);
    if (!editandoVaga.vaga_cargo || !editandoVaga.vaga_salario || !editandoVaga.vaga_cidade || !editandoVaga.vaga_quantidade) {
      setEditFormError('Todos os campos são obrigatórios.');
      return;
    }

    try {
      await editarVaga(editandoVaga.vaga_codigo, editandoVaga);
      console.log('Vaga atualizada:', editandoVaga);
      setVagas(vagas.map(vaga => vaga.vaga_codigo === editandoVaga.vaga_codigo ? editandoVaga : vaga));
      setEditandoVaga(null);
      setIsModalOpen(false);
      setEditFormError('');
    } catch (error) {
      console.error('Erro ao editar vaga', error);
      setError('Erro ao editar vaga.');
    }
  };

  const handleDeleteVaga = async (vaga_codigo) => {
    const confirmed = window.confirm('Tem certeza que deseja excluir esta vaga?');
    if (confirmed) {
      try {
        console.log('Excluindo vaga com código:', vaga_codigo);
        await excluirVaga(vaga_codigo);
        setVagas(vagas.filter(vaga => vaga.vaga_codigo !== vaga_codigo));
      } catch (error) {
        console.error('Erro ao excluir vaga', error);
        setError('Erro ao excluir vaga.');
      }
    }
  };

  return (
    <div className="gerenciar-vagas">
      <h2>Gerenciar Vagas</h2>
      {error && <p className="error">{error}</p>}

      <div className="nova-vaga">
        <h3>Adicionar Nova Vaga</h3>
        <input
          type="text"
          placeholder="Cargo"
          value={novaVaga.cargo}
          onChange={(e) => setNovaVaga({ ...novaVaga, cargo: e.target.value })}
        />
        <input
          type="number"
          placeholder="Salário"
          value={novaVaga.salario}
          onChange={(e) => setNovaVaga({ ...novaVaga, salario: e.target.value })}
        />
        <input
          type="text"
          placeholder="Cidade"
          value={novaVaga.cidade}
          onChange={(e) => setNovaVaga({ ...novaVaga, cidade: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantidade"
          value={novaVaga.quantidade}
          onChange={(e) => setNovaVaga({ ...novaVaga, quantidade: e.target.value })}
        />
        <button onClick={handleAddVaga}>Adicionar Vaga</button>
        {formError && <p className="form-error">{formError}</p>}
      </div>

      <ul>
        {Array.isArray(vagas) && vagas.length > 0 ? (
          vagas.map((vaga) => (
            <li key={vaga.vaga_codigo}>
              <h3>{vaga.vaga_cargo}</h3>
              <p>Salário: {vaga.vaga_salario}</p>
              <p>Cidade: {vaga.vaga_cidade}</p>
              <p>Quantidade: {vaga.vaga_quantidade}</p>
              <button onClick={() => handleEditVaga(vaga.vaga_codigo)}>Editar</button>
              <button onClick={() => handleDeleteVaga(vaga.vaga_codigo)}>Excluir</button>
            </li>
          ))
        ) : (
          <p>Nenhuma vaga encontrada.</p>
        )}
      </ul>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Editar Vaga"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        {editandoVaga && (
          <div>
            <h3>Editando Vaga</h3>
            <input
              type="text"
              placeholder="Cargo"
              value={editandoVaga.vaga_cargo || ''} 
              onChange={(e) => setEditandoVaga({ ...editandoVaga, vaga_cargo: e.target.value })}
            />
            <input
              type="number"
              placeholder="Salário"
              value={editandoVaga.vaga_salario || ''} 
              onChange={(e) => setEditandoVaga({ ...editandoVaga, vaga_salario: e.target.value })}
            />
            <input
              type="text"
              placeholder="Cidade"
              value={editandoVaga.vaga_cidade || ''} 
              onChange={(e) => setEditandoVaga({ ...editandoVaga, vaga_cidade: e.target.value })}
            />
            <input
              type="number"
              placeholder="Quantidade"
              value={editandoVaga.vaga_quantidade || ''} 
              onChange={(e) => setEditandoVaga({ ...editandoVaga, vaga_quantidade: e.target.value })}
            />
            <button onClick={handleUpdateVaga}>Atualizar Vaga</button>
            <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
            {editFormError && <p className="form-error">{editFormError}</p>}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default GerenciarVagasPage;
