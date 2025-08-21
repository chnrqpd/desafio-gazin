import { useState, useEffect } from 'react';
import { desenvolvedoresService } from '../../services/api';
import DesenvolvedorForm from '../../components/DesenvolvedorForm/DesenvolvedorForm';
import Modal from '../../components/Modal/Modal';
import SearchBar from '../../components/SearchBar/SearchBar';
import Toast from '../../components/Toast/Toast';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import Pagination from '../../components/Pagination/Pagination';
import usePagination from '../../hooks/usePagination';
import useToast from '../../hooks/useToast';
import './Desenvolvedores.scss';

const Desenvolvedores = () => {
  const [desenvolvedores, setDesenvolvedores] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDesenvolvedor, setEditingDesenvolvedor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
  });
  const { toast, showSuccess, showError, hideToast } = useToast();

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
    onDataFetch: desenvolvedoresService.getAll,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchData({
          sort: sortField,
          order: sortOrder,
        });
        setDesenvolvedores(response.data.data);
      } catch (err) {
        console.error('Erro ao carregar desenvolvedores:', err);
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
      setDesenvolvedores(response.data.data);
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
      setDesenvolvedores(response.data.data);
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
      setDesenvolvedores(response.data.data);
    } catch (err) {
      console.error('Erro ao mudar página:', err);
    }
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
        showSuccess('Desenvolvedor atualizado com sucesso!');
      } else {
        await desenvolvedoresService.create(formData);
        showSuccess('Desenvolvedor criado com sucesso!');
      }

      const response = await fetchData({
        search: searchTerm,
        sort: sortField,
        order: sortOrder,
      });
      setDesenvolvedores(response.data.data);
      handleCloseModal();
    } catch (err) {
      console.error('Erro ao salvar desenvolvedor:', err);
      showError('Erro ao salvar desenvolvedor. Tente novamente.');
      throw err;
    }
  };

  const handleDeleteDesenvolvedor = (desenvolvedor) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir o desenvolvedor "${desenvolvedor.nome}"? Esta ação não pode ser desfeita.`,
      onConfirm: () => confirmDeleteDesenvolvedor(desenvolvedor),
    });
  };

  const confirmDeleteDesenvolvedor = async (desenvolvedor) => {
    try {
      await desenvolvedoresService.delete(desenvolvedor.id);
      showSuccess('Desenvolvedor excluído com sucesso!');

      const remainingItems = desenvolvedores.length - 1;
      const correctedPage = checkAndFixEmptyPage(remainingItems);

      if (correctedPage !== currentPage) {
        handlePageChange(correctedPage);
      }

      const response = await fetchData({
        search: searchTerm,
        sort: sortField,
        order: sortOrder,
      });
      setDesenvolvedores(response.data.data);
    } catch (err) {
      console.error('Erro ao excluir desenvolvedor:', err);
      showError('Erro ao excluir desenvolvedor. Tente novamente.');
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
    });
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

      {totalItems > 0 && (
        <div className="results-info">
          Mostrando {desenvolvedores.length} de {totalItems} desenvolvedores
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
                onClick={() => handleSort('nome')}
                style={{ cursor: 'pointer' }}
              >
                Nome {sortField === 'nome' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('sexo')}
                style={{ cursor: 'pointer' }}
              >
                Sexo {sortField === 'sexo' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('data_nascimento')}
                style={{ cursor: 'pointer' }}
              >
                Data Nascimento{' '}
                {sortField === 'data_nascimento' &&
                  (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>Idade</th>
              <th
                onClick={() => handleSort('hobby')}
                style={{ cursor: 'pointer' }}
              >
                Hobby{' '}
                {sortField === 'hobby' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('nivel')}
                style={{ cursor: 'pointer' }}
              >
                Nível{' '}
                {sortField === 'nivel' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {desenvolvedores.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  style={{ textAlign: 'center', padding: '2rem' }}
                >
                  {searchTerm
                    ? 'Nenhum desenvolvedor encontrado para sua busca'
                    : 'Nenhum desenvolvedor cadastrado'}
                </td>
              </tr>
            ) : (
              desenvolvedores.map((desenvolvedor) => (
                <tr key={desenvolvedor.id}>
                  <td>{desenvolvedor.id}</td>
                  <td>{desenvolvedor.nome}</td>
                  <td>
                    {desenvolvedor.sexo === 'M' ? 'Masculino' : 'Feminino'}
                  </td>
                  <td>
                    {new Date(desenvolvedor.data_nascimento).toLocaleDateString(
                      'pt-BR'
                    )}
                  </td>
                  <td>{calcularIdade(desenvolvedor.data_nascimento)} anos</td>
                  <td>{desenvolvedor.hobby}</td>
                  <td>
                    {desenvolvedor.nivel ? desenvolvedor.nivel.nivel : 'N/A'}
                  </td>
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        disabled={loading}
      />

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={
          editingDesenvolvedor
            ? 'Editar Desenvolvedor'
            : 'Adicionar Desenvolvedor'
        }
      >
        <DesenvolvedorForm
          desenvolvedor={editingDesenvolvedor}
          onSubmit={handleSubmitDesenvolvedor}
          onCancel={handleCloseModal}
        />
      </Modal>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={handleCloseConfirmDialog}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

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
