const validationMiddleware = {
  validateNivel(req, res, next) {
    const { nivel } = req.body;

    if (!nivel || nivel.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'O campo nivel é obrigatório',
      });
    }

    req.body.nivel = nivel.trim();
    next();
  },

  validateId(req, res, next) {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido',
      });
    }

    next();
  },

  validateDesenvolvedor(req, res, next) {
    const { nivel_id, nome, sexo, data_nascimento } = req.body;
    const errors = [];

    if (!nivel_id || isNaN(parseInt(nivel_id))) {
      errors.push('nivel_id é obrigatório e deve ser um número');
    }

    if (!nome || nome.trim() === '') {
      errors.push('nome é obrigatório');
    }

    if (!sexo || !['M', 'F'].includes(sexo.toUpperCase())) {
      errors.push('sexo deve ser M ou F');
    }

    if (!data_nascimento || !isValidDate(data_nascimento)) {
      errors.push(
        'data_nascimento é obrigatória e deve estar no formato YYYY-MM-DD'
      );
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors,
      });
    }

    req.body.nome = nome.trim();
    req.body.sexo = sexo.toUpperCase();

    next();
  },
};

function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  const timestamp = date.getTime();

  if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) return false;

  return dateString === date.toISOString().split('T')[0];
}

module.exports = validationMiddleware;
