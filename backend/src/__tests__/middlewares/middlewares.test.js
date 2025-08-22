const paginationMiddleware = require('../../middlewares/paginationMiddleware');
const validationMiddleware = require('../../middlewares/validationMiddleware');

const mockReq = (query = {}, body = {}, params = {}) => ({
  query,
  body,
  params,
});
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
const mockNext = jest.fn();

describe('Middlewares', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('paginationMiddleware', () => {
    it('deve pular middleware quando não há parâmetros de paginação', () => {
      const req = mockReq();
      const res = mockRes();

      paginationMiddleware(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(req.pagination).toBeUndefined();
    });

    it('deve configurar paginação com parâmetros válidos', () => {
      const req = mockReq({ page: '2', limit: '5' });
      const res = mockRes();

      paginationMiddleware(req, res, mockNext);

      expect(req.pagination).toEqual({
        page: 2,
        limit: 5,
        offset: 5,
        search: null,
      });
      expect(mockNext).toHaveBeenCalled();
    });

    it('deve usar valores padrão quando page/limit não fornecidos', () => {
      const req = mockReq({ search: 'test' });
      const res = mockRes();

      paginationMiddleware(req, res, mockNext);

      expect(req.pagination).toEqual({
        page: 1,
        limit: 10,
        offset: 0,
        search: 'test',
      });
      expect(mockNext).toHaveBeenCalled();
    });

    it('deve processar search removendo espaços', () => {
      const req = mockReq({ search: '  João Silva  ' });
      const res = mockRes();

      paginationMiddleware(req, res, mockNext);

      expect(req.pagination.search).toBe('João Silva');
      expect(mockNext).toHaveBeenCalled();
    });

    it('deve retornar erro 400 para página inválida', () => {
      const req = mockReq({ page: '0' });
      const res = mockRes();

      paginationMiddleware(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Página deve ser um número maior que 0',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('deve retornar erro 400 para página não numérica', () => {
      const req = mockReq({ page: 'abc' });
      const res = mockRes();

      paginationMiddleware(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Página deve ser um número maior que 0',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('deve retornar erro 400 para limit inválido (menor que 1)', () => {
      const req = mockReq({ limit: '0' });
      const res = mockRes();

      paginationMiddleware(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Limite deve ser um número entre 1 e 100',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('deve retornar erro 400 para limit maior que 100', () => {
      const req = mockReq({ limit: '101' });
      const res = mockRes();

      paginationMiddleware(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Limite deve ser um número entre 1 e 100',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('deve calcular offset corretamente', () => {
      const req = mockReq({ page: '3', limit: '15' });
      const res = mockRes();

      paginationMiddleware(req, res, mockNext);

      expect(req.pagination.offset).toBe(30);
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('validationMiddleware', () => {
    describe('validateNivel', () => {
      it('deve validar nível válido', () => {
        const req = mockReq({}, { nivel: 'Júnior' });
        const res = mockRes();

        validationMiddleware.validateNivel(req, res, mockNext);

        expect(req.body.nivel).toBe('Júnior');
        expect(mockNext).toHaveBeenCalled();
      });

      it('deve trimmar espaços do nível', () => {
        const req = mockReq({}, { nivel: '  Sênior  ' });
        const res = mockRes();

        validationMiddleware.validateNivel(req, res, mockNext);

        expect(req.body.nivel).toBe('Sênior');
        expect(mockNext).toHaveBeenCalled();
      });

      it('deve retornar erro para nível vazio', () => {
        const req = mockReq({}, { nivel: '' });
        const res = mockRes();

        validationMiddleware.validateNivel(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'O campo nivel é obrigatório',
        });
        expect(mockNext).not.toHaveBeenCalled();
      });

      it('deve retornar erro para nível não fornecido', () => {
        const req = mockReq({}, {});
        const res = mockRes();

        validationMiddleware.validateNivel(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(mockNext).not.toHaveBeenCalled();
      });

      it('deve retornar erro para nível apenas com espaços', () => {
        const req = mockReq({}, { nivel: '   ' });
        const res = mockRes();

        validationMiddleware.validateNivel(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(mockNext).not.toHaveBeenCalled();
      });
    });

    describe('validateId', () => {
      it('deve validar ID válido', () => {
        const req = mockReq({}, {}, { id: '123' });
        const res = mockRes();

        validationMiddleware.validateId(req, res, mockNext);

        expect(mockNext).toHaveBeenCalled();
      });

      it('deve retornar erro para ID não numérico', () => {
        const req = mockReq({}, {}, { id: 'abc' });
        const res = mockRes();

        validationMiddleware.validateId(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'ID inválido',
        });
        expect(mockNext).not.toHaveBeenCalled();
      });

      it('deve retornar erro para ID não fornecido', () => {
        const req = mockReq({}, {}, {});
        const res = mockRes();

        validationMiddleware.validateId(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(mockNext).not.toHaveBeenCalled();
      });
    });

    describe('validateDesenvolvedor', () => {
      it('deve validar desenvolvedor com dados válidos', () => {
        const req = mockReq(
          {},
          {
            nivel_id: '1',
            nome: 'João Silva',
            sexo: 'm',
            data_nascimento: '1990-01-01',
            hobby: 'Programar',
          }
        );
        const res = mockRes();

        validationMiddleware.validateDesenvolvedor(req, res, mockNext);

        expect(req.body.nome).toBe('João Silva');
        expect(req.body.sexo).toBe('M');
        expect(mockNext).toHaveBeenCalled();
      });

      it('deve trimmar nome e converter sexo para maiúsculo', () => {
        const req = mockReq(
          {},
          {
            nivel_id: '1',
            nome: '  Maria Santos  ',
            sexo: 'f',
            data_nascimento: '1995-12-25',
            hobby: 'Leitura',
          }
        );
        const res = mockRes();

        validationMiddleware.validateDesenvolvedor(req, res, mockNext);

        expect(req.body.nome).toBe('Maria Santos');
        expect(req.body.sexo).toBe('F');
        expect(mockNext).toHaveBeenCalled();
      });

      it('deve retornar erro para nivel_id inválido', () => {
        const req = mockReq(
          {},
          {
            nivel_id: 'abc',
            nome: 'João',
            sexo: 'M',
            data_nascimento: '1990-01-01',
          }
        );
        const res = mockRes();

        validationMiddleware.validateDesenvolvedor(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'Dados inválidos',
          errors: expect.arrayContaining([
            'nivel_id é obrigatório e deve ser um número',
          ]),
        });
        expect(mockNext).not.toHaveBeenCalled();
      });

      it('deve retornar erro para nome vazio', () => {
        const req = mockReq(
          {},
          {
            nivel_id: '1',
            nome: '',
            sexo: 'M',
            data_nascimento: '1990-01-01',
          }
        );
        const res = mockRes();

        validationMiddleware.validateDesenvolvedor(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'Dados inválidos',
          errors: expect.arrayContaining(['nome é obrigatório']),
        });
        expect(mockNext).not.toHaveBeenCalled();
      });

      it('deve retornar erro para sexo inválido', () => {
        const req = mockReq(
          {},
          {
            nivel_id: '1',
            nome: 'João',
            sexo: 'X',
            data_nascimento: '1990-01-01',
          }
        );
        const res = mockRes();

        validationMiddleware.validateDesenvolvedor(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'Dados inválidos',
          errors: expect.arrayContaining(['sexo deve ser M ou F']),
        });
        expect(mockNext).not.toHaveBeenCalled();
      });

      it('deve retornar erro para data de nascimento inválida', () => {
        const req = mockReq(
          {},
          {
            nivel_id: '1',
            nome: 'João',
            sexo: 'M',
            data_nascimento: '1990-13-40',
          }
        );
        const res = mockRes();

        validationMiddleware.validateDesenvolvedor(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'Dados inválidos',
          errors: expect.arrayContaining([
            'data_nascimento é obrigatória e deve estar no formato YYYY-MM-DD',
          ]),
        });
        expect(mockNext).not.toHaveBeenCalled();
      });

      it('deve retornar erro para formato de data incorreto', () => {
        const req = mockReq(
          {},
          {
            nivel_id: '1',
            nome: 'João',
            sexo: 'M',
            data_nascimento: '01/01/1990',
          }
        );
        const res = mockRes();

        validationMiddleware.validateDesenvolvedor(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(mockNext).not.toHaveBeenCalled();
      });

      it('deve retornar múltiplos erros quando vários campos são inválidos', () => {
        const req = mockReq(
          {},
          {
            nivel_id: 'abc',
            nome: '',
            sexo: 'X',
            data_nascimento: 'invalid-date',
          }
        );
        const res = mockRes();

        validationMiddleware.validateDesenvolvedor(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.errors).toHaveLength(4);
        expect(response.errors).toEqual(
          expect.arrayContaining([
            'nivel_id é obrigatório e deve ser um número',
            'nome é obrigatório',
            'sexo deve ser M ou F',
            'data_nascimento é obrigatória e deve estar no formato YYYY-MM-DD',
          ])
        );
        expect(mockNext).not.toHaveBeenCalled();
      });
    });

    describe('Função auxiliar isValidDate (testada indiretamente)', () => {
      it('deve aceitar datas válidas', () => {
        const validDates = ['1990-01-01', '2000-12-31', '1985-06-15'];

        validDates.forEach((date) => {
          const req = mockReq(
            {},
            {
              nivel_id: '1',
              nome: 'Test',
              sexo: 'M',
              data_nascimento: date,
            }
          );
          const res = mockRes();

          validationMiddleware.validateDesenvolvedor(req, res, mockNext);
          expect(mockNext).toHaveBeenCalled();

          mockNext.mockClear();
        });
      });

      it('deve rejeitar datas inválidas', () => {
        const invalidDates = [
          '1990-13-01',
          '1990-02-30',
          '1990/01/01',
          'abc',
          '90-01-01',
        ];

        invalidDates.forEach((date) => {
          const req = mockReq(
            {},
            {
              nivel_id: '1',
              nome: 'Test',
              sexo: 'M',
              data_nascimento: date,
            }
          );
          const res = mockRes();

          validationMiddleware.validateDesenvolvedor(req, res, mockNext);
          expect(res.status).toHaveBeenCalledWith(400);

          res.status.mockClear();
          res.json.mockClear();
        });
      });
    });
  });
});
