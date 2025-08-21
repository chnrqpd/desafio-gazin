import React, { useState, useEffect } from 'react';
import { niveisService } from '../../services/api';
import Modal from '../../components/Modal/Modal';
import NivelForm from '../../components/NivelForm/NivelForm';
import SearchBar from '../../components/SearchBar/SearchBar';
import './Niveis.scss';

const Niveis = () => {
  const [niveis, setNiveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNivel, setEditingNivel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNiveis();
  }, []);

  const fetchNiveis = async (term = '') => {
    try {
      setLoading(true);

      const params = {};
      if (term) {
        params.search = term;
      }
      
      const response = await niveisService.getAll(params);
      setNiveis(response.data.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar níveis');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchNiveis(term); 
  };

  const handleAddNivel = () => {
    setEditingNivel(null);
    setModalOpen(true);
  };

  const handleEditNivel = (nivel) => {
    setEditingNivel(nivel);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingNivel(null);
  };

  const handleSubmitNivel = async (formData) => {
    try {
      if (editingNivel) {
        await niveisService.update(editingNivel.id, formData);
      } else {
        await niveisService.create(formData);
      }
      
      await fetchNiveis(searchTerm);
      handleCloseModal();
    } catch (err) {
      console.error('Erro ao salvar nível:', err);
      throw err;
    }
  };

  const handleDeleteNivel = async (nivel) => {
    if (nivel.total_desenvolvedores > 0) {
      alert('Não é possível excluir um nível que possui desenvolvedores associados.');
      return;
    }

    if (window.confirm(`Tem certeza que deseja excluir o nível "${nivel.nivel}"?`)) {
      try {
        await niveisService.delete(nivel.id);
        await fetchNiveis(searchTerm); 
      } catch (err) {
        console.error('Erro ao excluir nível:', err);
        alert('Erro ao excluir nível. Tente novamente.');
      }
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="niveis">
      <div className="header">
        <h1>Gerenciamento de Níveis</h1>
        <button className="btn btn-add" onClick={handleAddNivel}>
          Adicionar Nível
        </button>
      </div>

      <SearchBar
        onSearch={handleSearch}
        placeholder="Buscar níveis..."
        disabled={loading}
      />

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nível</th>
              <th>Desenvolvedores</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {niveis.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                  {searchTerm ? 'Nenhum nível encontrado para sua busca' : 'Nenhum nível cadastrado'}
                </td>
              </tr>
            ) : (
              niveis.map(nivel => (
                <tr key={nivel.id}>
                  <td>{nivel.id}</td>
                  <td>{nivel.nivel}</td>
                  <td>{nivel.total_desenvolvedores || 0}</td>
                  <td>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleEditNivel(nivel)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteNivel(nivel)}
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
        title={editingNivel ? 'Editar Nível' : 'Adicionar Nível'}
      >
        <NivelForm
          nivel={editingNivel}
          onSubmit={handleSubmitNivel}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default Niveis;