import React, { useState, useEffect } from 'react';
import { desenvolvedoresService } from '../../services/api';
import DesenvolvedorForm from '../../components/DesenvolvedorForm/DesenvolvedorForm';
import Modal from '../../components/Modal/Modal';
import SearchBar from '../../components/SearchBar/SearchBar';
import './Desenvolvedores.scss';

const Desenvolvedores = () => {
  const [desenvolvedores, setDesenvolvedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDesenvolvedor, setEditingDesenvolvedor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDesenvolvedores();
  }, []);

  const fetchDesenvolvedores = async (term = '') => {
    try {
      setLoading(true);

      const params = {};
      if (term) {
        params.search = term;
      }
      
      const response = await desenvolvedoresService.getAll(params);
      setDesenvolvedores(response.data.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar desenvolvedores');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchDesenvolvedores(term); 
  };

  const handleAddDesenvolvedor = () => {
    setEditingDesenvolvedor(null);
    setModalOpen(true);
  };

  const handleEditDesenvolvedor = (desenvolvedor) => {
    setEditingDesenvolvedor(desenvolvedor);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingDesenvolvedor(null);
  };

  const handleSubmitDesenvolvedor = async (formData) => {
    try {
      if (editingDesenvolvedor) {
        await desenvolvedoresService.update(editingDesenvolvedor.id, formData);
      } else {
        await desenvolvedoresService.create(formData);
      }
      
      await fetchDesenvolvedores(searchTerm);
      handleCloseModal();
    } catch (err) {
      console.error('Erro ao salvar desenvolvedor:', err);
      throw err;
    }
  };

  const handleDeleteDesenvolvedor = async (desenvolvedor) => {
    if (window.confirm(`Tem certeza que deseja excluir o desenvolvedor "${desenvolvedor.nome}"?`)) {
      try {
        await desenvolvedoresService.delete(desenvolvedor.id);
        await fetchDesenvolvedores(searchTerm); 
      } catch (err) {
        console.error('Erro ao excluir desenvolvedor:', err);
        alert('Erro ao excluir desenvolvedor. Tente novamente.');
      }
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="desenvolvedores">
      <div className="header">
        <h1>Gerenciamento de Desenvolvedores</h1>
        <button className="btn btn-add" onClick={handleAddDesenvolvedor}>
          Adicionar Desenvolvedor
        </button>
      </div>

      <SearchBar
        onSearch={handleSearch}
        placeholder="Buscar desenvolvedores..."
        disabled={loading}
      />

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Sexo</th>
              <th>Data Nascimento</th>
              <th>Idade</th>
              <th>Hobby</th>
              <th>Nível</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {desenvolvedores.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                  {searchTerm ? 'Nenhum desenvolvedor encontrado para sua busca' : 'Nenhum desenvolvedor cadastrado'}
                </td>
              </tr>
            ) : (
              desenvolvedores.map(desenvolvedor => (
                <tr key={desenvolvedor.id}>
                  <td>{desenvolvedor.id}</td>
                  <td>{desenvolvedor.nome}</td>
                  <td>{desenvolvedor.sexo === 'M' ? 'Masculino' : 'Feminino'}</td>
                  <td>{new Date(desenvolvedor.data_nascimento).toLocaleDateString('pt-BR')}</td>
                  <td>{calcularIdade(desenvolvedor.data_nascimento)} anos</td>
                  <td>{desenvolvedor.hobby}</td>
                  <td>{desenvolvedor.nivel ? desenvolvedor.nivel.nivel : 'N/A'}</td>
                  <td>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleEditDesenvolvedor(desenvolvedor)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteDesenvolvedor(desenvolvedor)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editingDesenvolvedor ? 'Editar Desenvolvedor' : 'Adicionar Desenvolvedor'}
      >
        <DesenvolvedorForm
          desenvolvedor={editingDesenvolvedor}
          onSubmit={handleSubmitDesenvolvedor}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

// Função auxiliar para calcular idade
const calcularIdade = (dataNascimento) => {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  
  return idade;
};

export default Desenvolvedores;