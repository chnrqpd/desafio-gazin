import { useState, useEffect } from 'react';
import './NivelForm.scss';

const NivelForm = ({ nivel, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nivel: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (nivel) {
      setFormData({ nivel: nivel.nivel });
    }
  }, [nivel]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nivel.trim()) return;

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
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="nivel-form">
      <div className="form-group">
        <label htmlFor="nivel">Nome do Nível:</label>
        <input
          type="text"
          id="nivel"
          name="nivel"
          value={formData.nivel}
          onChange={handleChange}
          placeholder="Ex: Junior, Pleno, Senior..."
          required
          disabled={loading}
        />
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
          disabled={loading || !formData.nivel.trim()}
        >
          {loading ? 'Salvando...' : nivel ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
};

export default NivelForm;
