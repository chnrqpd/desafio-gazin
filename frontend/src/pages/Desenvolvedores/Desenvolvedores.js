import { useState, useEffect } from 'react';
import { desenvolvedoresService } from '../../services/api';
import DesenvolvedorForm from '../../components/DesenvolvedorForm/DesenvolvedorForm';
import Modal from '../../components/Modal/Modal';
import SearchBar from '../../components/SearchBar/SearchBar';
import Toast from '../../components/Toast/Toast';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import useToast from '../../hooks/useToast';
import './Desenvolvedores.scss';

const Desenvolvedores = () => {
  const [desenvolvedores, setDesenvolvedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDesenvolvedor, setEditingDesenvolvedor] = useState(null);
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
    onConfirm: null
  });
  const itemsPerPage = 10;
  const { toast, showSuccess, showError, hideToast } = useToast();

  useEffect(() => {
    fetchDesenvolvedores();
  }, [currentPage, searchTerm, sortField, sortOrder]);

  const fetchDesenvolvedores = async (term = '') => {
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
      
      const response = await desenvolvedoresService.getAll(params);
      setDesenvolvedores(response.data.data);
      setTotalPages(response.data.meta.last_page);
      setTotalItems(response.data.meta.total);
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
    setCurrentPage(1);
    fetchDesenvolvedores(term); 
  };

  const handleSort = (field) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
    setCurrentPage(1);
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
      
      await fetchDesenvolvedores(searchTerm);
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
      onConfirm: () => confirmDeleteDesenvolvedor(desenvolvedor)
    });
  };

  const confirmDeleteDesenvolvedor = async (desenvolvedor) => {
    try {
      await desenvolvedoresService.delete(desenvolvedor.id);
      showSuccess('Desenvolvedor excluído com sucesso!');
      
      if (desenvolvedores.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        await fetchDesenvolvedores(searchTerm);
      }
    } catch (err) {
      console.error('Erro ao excluir desenvolvedor:', err);
      showError('Erro ao excluir desenvolvedor. Tente novamente.');
    } finally {
      setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
    }
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: null });
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
              <th onClick={() => handleSort('id')} style={{cursor: 'pointer'}}>
                ID {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('nome')} style={{cursor: 'pointer'}}>
                Nome {sortField === 'nome' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('sexo')} style={{cursor: 'pointer'}}>
                Sexo {sortField === 'sexo' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('data_nascimento')} style={{cursor: 'pointer'}}>
                Data Nascimento {sortField === 'data_nascimento' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>Idade</th>
              <th onClick={() => handleSort('hobby')} style={{cursor: 'pointer'}}>
                Hobby {sortField === 'hobby' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('nivel')} style={{cursor: 'pointer'}}>
                Nível {sortField === 'nivel' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
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

      {renderPagination()}

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