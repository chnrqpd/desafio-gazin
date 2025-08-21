import { useState, useEffect } from 'react';
import { niveisService } from '../../services/api';
import Modal from '../../components/Modal/Modal';
import NivelForm from '../../components/NivelForm/NivelForm';
import SearchBar from '../../components/SearchBar/SearchBar';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import './Niveis.scss';

const Niveis = () => {
  const [niveis, setNiveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNivel, setEditingNivel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'confirm'
  });
  const itemsPerPage = 10;

  useEffect(() => {
    fetchNiveis();
  }, [currentPage, sortField, sortOrder]);

  const fetchNiveis = async (term = '') => {
    try {
      setLoading(true);

      const params = {
        page: currentPage,
        limit: itemsPerPage,
        sort: sortField,
        order: sortOrder
      };
      if (term) {
        params.search = term;
      }
      
      const response = await niveisService.getAll(params);
      setNiveis(response.data.data);
      setTotalPages(response.data.meta.last_page);
      setTotalItems(response.data.meta.total);
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
    setCurrentPage(1);
    fetchNiveis(term); 
  };

  const handleSort = (field) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
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

  const handleDeleteNivel = (nivel) => {
    if (nivel.total_desenvolvedores > 0) {
      setConfirmDialog({
        isOpen: true,
        title: 'Não é possível excluir',
        message: `Não é possível excluir um nível que possui desenvolvedores associados. O nível "${nivel.nivel}" possui ${nivel.total_desenvolvedores} desenvolvedor(es) associado(s).`,
        onConfirm: () => handleCloseConfirmDialog(),
        type: 'info'
      });
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir o nível "${nivel.nivel}"? Esta ação não pode ser desfeita.`,
      onConfirm: () => confirmDeleteNivel(nivel)
    });
  };
  const confirmDeleteNivel = async (nivel) => {
    try {
      await niveisService.delete(nivel.id);
      await fetchNiveis(searchTerm);
    } catch (err) {
      console.error('Erro ao excluir nível:', err);
      alert('Erro ao excluir nível. Tente novamente.');
    } finally {
      setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
    }
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null, type: 'confirm' });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn btn-sm btn-secondary"
        >
          Anterior
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="btn btn-sm btn-secondary"
            >
              1
            </button>
            {startPage > 2 && <span className="pagination-ellipsis">...</span>}
          </>
        )}

        {pages.map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-secondary'}`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="btn btn-sm btn-secondary"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn btn-sm btn-secondary"
        >
          Próxima
        </button>
      </div>
    );
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

      {totalItems > 0 && (
        <div className="results-info">
          Mostrando {niveis.length} de {totalItems} níveis
          {searchTerm && ` para "${searchTerm}"`}
        </div>
      )}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} style={{cursor: 'pointer'}}>
                ID {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('nivel')} style={{cursor: 'pointer'}}>
                Nível {sortField === 'nivel' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
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

      {renderPagination()}

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

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={handleCloseConfirmDialog}
        type={confirmDialog.type}
      />
    </div>
  );
};

export default Niveis;