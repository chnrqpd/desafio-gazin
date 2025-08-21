import { useState, useEffect } from 'react';
import { niveisService } from '../../services/api';
import './DesenvolvedorForm.scss';

const DesenvolvedorForm = ({ desenvolvedor, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nome: '',
    sexo: '',
    data_nascimento: '',
    hobby: '',
    nivel_id: ''
  });
  const [niveis, setNiveis] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNiveis();
    if (desenvolvedor) {
      setFormData({
        nome: desenvolvedor.nome || '',
        sexo: desenvolvedor.sexo || '',
        data_nascimento: desenvolvedor.data_nascimento || '',
        hobby: desenvolvedor.hobby || '',
        nivel_id: desenvolvedor.nivel_id || ''
      });
    }
  }, [desenvolvedor]);

  const fetchNiveis = async () => {
    try {
      const response = await niveisService.getAll();
      setNiveis(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar níveis:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nome.trim() || !formData.sexo || !formData.data_nascimento || 
        !formData.hobby.trim() || !formData.nivel_id) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const isFormValid = formData.nome.trim() && formData.sexo && 
                     formData.data_nascimento && formData.hobby.trim() && 
                     formData.nivel_id;

  return (
    <form onSubmit={handleSubmit} className="desenvolvedor-form">
      <div className="form-group">
        <label htmlFor="nome">Nome:</label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Nome completo do desenvolvedor"
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="sexo">Sexo:</label>
        <select
          id="sexo"
          name="sexo"
          value={formData.sexo}
          onChange={handleChange}
          required
          disabled={loading}
        >
          <option value="">Selecione o sexo</option>
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="data_nascimento">Data de Nascimento:</label>
        <input
          type="date"
          id="data_nascimento"
          name="data_nascimento"
          value={formData.data_nascimento}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="hobby">Hobby:</label>
        <input
          type="text"
          id="hobby"
          name="hobby"
          value={formData.hobby}
          onChange={handleChange}
          placeholder="Ex: Programação, Leitura, Esportes..."
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="nivel_id">Nível:</label>
        <select
          id="nivel_id"
          name="nivel_id"
          value={formData.nivel_id}
          onChange={handleChange}
          required
          disabled={loading}
        >
          <option value="">Selecione o nível</option>
          {niveis.map(nivel => (
            <option key={nivel.id} value={nivel.id}>
              {nivel.nivel}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading || !isFormValid}
        >
          {loading ? 'Salvando...' : (desenvolvedor ? 'Atualizar' : 'Criar')}
        </button>
      </div>
    </form>
  );
};

export default DesenvolvedorForm;