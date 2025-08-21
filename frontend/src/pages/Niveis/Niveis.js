import { useState, useEffect } from 'react';
import { niveisService } from '../../services/api';
import Modal from '../../components/Modal/Modal';
import NivelForm from '../../components/NivelForm/NivelForm';
import SearchBar from '../../components/SearchBar/SearchBar';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import Pagination from '../../components/Pagination/Pagination';
import usePagination from '../../hooks/usePagination';
import './Niveis.scss';

const Niveis = () => {
  const [niveis, setNiveis] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNivel, setEditingNivel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'confirm',
  });

  const {
    currentPage,
    totalPages,
    totalItems,
    loading,
    error,
    fetchData,
    handlePageChange,
    handleSearch: paginationHandleSearch,
    handleSort: paginationHandleSort,
    checkAndFixEmptyPage,
  } = usePagination({
    initialPage: 1,
    itemsPerPage: 10,
    onDataFetch: niveisService.getAll,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchData({
          sort: sortField,
          order: sortOrder,
        });
        setNiveis(response.data.data);
      } catch (err) {
        console.error('Erro ao carregar níveis:', err);
      }
    };

    loadData();
  }, [fetchData, sortField, sortOrder]);

  const handleSearch = async (term) => {
    setSearchTerm(term);
    try {
      const response = await paginationHandleSearch({
        search: term,
        sort: sortField,
        order: sortOrder,
      });
      setNiveis(response.data.data);
    } catch (err) {
      console.error('Erro na busca:', err);
    }
  };

  const handleSort = async (field) => {
    const newOrder =
      sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);

    try {
      const response = await paginationHandleSort({
        search: searchTerm,
        sort: field,
        order: newOrder,
      });
      setNiveis(response.data.data);
    } catch (err) {
      console.error('Erro na ordenação:', err);
    }
  };

  const onPageChange = async (page) => {
    handlePageChange(page);
    try {
      const response = await fetchData({
        search: searchTerm,
        sort: sortField,
        order: sortOrder,
      });
      setNiveis(response.data.data);
    } catch (err) {
      console.error('Erro ao mudar página:', err);
    }
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

      const response = await fetchData({
        search: searchTerm,
        sort: sortField,
        order: sortOrder,
      });
      setNiveis(response.data.data);
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
        type: 'info',
      });
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir o nível "${nivel.nivel}"? Esta ação não pode ser desfeita.`,
      onConfirm: () => confirmDeleteNivel(nivel),
    });
  };

  const confirmDeleteNivel = async (nivel) => {
    try {
      await niveisService.delete(nivel.id);

      const remainingItems = niveis.length - 1;
      const correctedPage = checkAndFixEmptyPage(remainingItems);

      if (correctedPage !== currentPage) {
        handlePageChange(correctedPage);
      }

      const response = await fetchData({
        search: searchTerm,
        sort: sortField,
        order: sortOrder,
      });
      setNiveis(response.data.data);
    } catch (err) {
      console.error('Erro ao excluir nível:', err);
      alert('Erro ao excluir nível. Tente novamente.');
    } finally {
      setConfirmDialog({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
      });
    }
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: null,
      type: 'confirm',
    });
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
              <th
                onClick={() => handleSort('id')}
                style={{ cursor: 'pointer' }}
              >
                ID {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('nivel')}
                style={{ cursor: 'pointer' }}
              >
                Nível{' '}
                {sortField === 'nivel' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>Desenvolvedores</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {niveis.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  style={{ textAlign: 'center', padding: '2rem' }}
                >
                  {searchTerm
                    ? 'Nenhum nível encontrado para sua busca'
                    : 'Nenhum nível cadastrado'}
                </td>
              </tr>
            ) : (
              niveis.map((nivel) => (
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        disabled={loading}
      />

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
