const desenvolvedoresController = require('../../controllers/desenvolvedoresController');
const { Nivel, Desenvolvedor } = require('../../../models');

const mockReq = (body = {}, params = {}, query = {}, pagination = null) => ({
  body,
  params,
  query,
  pagination,
});

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('desenvolvedoresController', () => {
  let nivelJunior, nivelSenior;

  beforeEach(async () => {
    nivelJunior = await Nivel.create({ nivel: 'Júnior' });
    nivelSenior = await Nivel.create({ nivel: 'Sênior' });
  });

  describe('index', () => {
    it('deve retornar lista vazia quando não há desenvolvedores', async () => {
      const req = mockReq();
      const res = mockRes();

      await desenvolvedoresController.index(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: [],
      });
    });

    it('deve retornar lista de desenvolvedores sem paginação', async () => {
      await Desenvolvedor.create({
        nome: 'João Silva',
        sexo: 'M',
        data_nascimento: '1995-03-15',
        hobby: 'Futebol',
        nivel_id: nivelJunior.id,
      });

      const req = mockReq();
      const res = mockRes();

      await desenvolvedoresController.index(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.arrayContaining([
          expect.objectContaining({
            nome: 'João Silva',
            sexo: 'M',
            hobby: 'Futebol',
            nivel: expect.objectContaining({
              id: nivelJunior.id,
              nivel: 'Júnior',
            }),
          }),
        ]),
      });
    });

    it('deve retornar lista com paginação quando pagination está definida', async () => {
      await Desenvolvedor.bulkCreate([
        {
          nome: 'Dev 1',
          sexo: 'M',
          data_nascimento: '1990-01-01',
          hobby: 'Test',
          nivel_id: nivelJunior.id,
        },
        {
          nome: 'Dev 2',
          sexo: 'F',
          data_nascimento: '1991-01-01',
          hobby: 'Test',
          nivel_id: nivelJunior.id,
        },
        {
          nome: 'Dev 3',
          sexo: 'M',
          data_nascimento: '1992-01-01',
          hobby: 'Test',
          nivel_id: nivelSenior.id,
        },
      ]);

      const req = mockReq({}, {}, {}, { page: 1, limit: 2, offset: 0 });
      const res = mockRes();

      await desenvolvedoresController.index(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.any(Array),
        meta: {
          total: 3,
          per_page: 2,
          current_page: 1,
          last_page: 2,
        },
      });
    });

    it('deve filtrar por nome quando search está definido', async () => {
      await Desenvolvedor.bulkCreate([
        {
          nome: 'João Silva',
          sexo: 'M',
          data_nascimento: '1990-01-01',
          hobby: 'Test',
          nivel_id: nivelJunior.id,
        },
        {
          nome: 'Maria Santos',
          sexo: 'F',
          data_nascimento: '1991-01-01',
          hobby: 'Test',
          nivel_id: nivelSenior.id,
        },
      ]);

      const req = mockReq({}, {}, {}, { search: 'Maria' });
      const res = mockRes();

      await desenvolvedoresController.index(req, res);

      const responseData = res.json.mock.calls[0][0];
      expect(responseData.data).toHaveLength(1);
      expect(responseData.data[0].nome).toBe('Maria Santos');
    });

    it('deve ordenar por campo válido', async () => {
      await Desenvolvedor.bulkCreate([
        {
          nome: 'B Dev',
          sexo: 'M',
          data_nascimento: '1990-01-01',
          hobby: 'Test',
          nivel_id: nivelJunior.id,
        },
        {
          nome: 'A Dev',
          sexo: 'F',
          data_nascimento: '1991-01-01',
          hobby: 'Test',
          nivel_id: nivelSenior.id,
        },
      ]);

      const req = mockReq({}, {}, { sort: 'nome', order: 'ASC' });
      const res = mockRes();

      await desenvolvedoresController.index(req, res);

      const responseData = res.json.mock.calls[0][0];
      expect(responseData.data[0].nome).toBe('A Dev');
      expect(responseData.data[1].nome).toBe('B Dev');
    });

    it('deve usar ordenação padrão para campo inválido', async () => {
      await Desenvolvedor.create({
        nome: 'Test Dev',
        sexo: 'M',
        data_nascimento: '1990-01-01',
        hobby: 'Test',
        nivel_id: nivelJunior.id,
      });

      const req = mockReq({}, {}, { sort: 'campo_invalido', order: 'ASC' });
      const res = mockRes();

      await desenvolvedoresController.index(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.any(Array),
        })
      );
    });

    it('deve ordenar por nível quando sort=nivel', async () => {
      await Desenvolvedor.bulkCreate([
        {
          nome: 'Dev Senior',
          sexo: 'M',
          data_nascimento: '1990-01-01',
          hobby: 'Test',
          nivel_id: nivelSenior.id,
        },
        {
          nome: 'Dev Junior',
          sexo: 'F',
          data_nascimento: '1991-01-01',
          hobby: 'Test',
          nivel_id: nivelJunior.id,
        },
      ]);

      const req = mockReq({}, {}, { sort: 'nivel', order: 'ASC' });
      const res = mockRes();

      await desenvolvedoresController.index(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.any(Array),
        })
      );
    });
  });

  describe('show', () => {
    it('deve retornar desenvolvedor específico', async () => {
      const desenvolvedor = await Desenvolvedor.create({
        nome: 'Pedro Costa',
        sexo: 'M',
        data_nascimento: '1988-12-10',
        hobby: 'Yoga',
        nivel_id: nivelJunior.id,
      });

      const req = mockReq({}, { id: desenvolvedor.id });
      const res = mockRes();

      await desenvolvedoresController.show(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          nome: 'Pedro Costa',
          sexo: 'M',
          hobby: 'Yoga',
          nivel: expect.objectContaining({
            nivel: 'Júnior',
          }),
        }),
      });
    });

    it('deve retornar 404 para desenvolvedor inexistente', async () => {
      const req = mockReq({}, { id: 999 });
      const res = mockRes();

      await desenvolvedoresController.show(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Desenvolvedor não encontrado',
      });
    });
  });

  describe('store', () => {
    it('deve criar um novo desenvolvedor', async () => {
      const novoDesenvolvedor = {
        nome: 'Ana Costa',
        sexo: 'F',
        data_nascimento: '1988-12-10',
        hobby: 'Yoga',
        nivel_id: nivelJunior.id,
      };

      const req = mockReq(novoDesenvolvedor);
      const res = mockRes();

      await desenvolvedoresController.store(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          nome: 'Ana Costa',
          sexo: 'F',
          hobby: 'Yoga',
        }),
      });
    });

    it('deve retornar erro 400 para nível inexistente', async () => {
      const req = mockReq({
        nome: 'Teste',
        sexo: 'M',
        data_nascimento: '1990-01-01',
        hobby: 'Teste',
        nivel_id: 999,
      });
      const res = mockRes();

      await desenvolvedoresController.store(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Nível informado não existe',
      });
    });
  });

  describe('update', () => {
    it('deve atualizar desenvolvedor existente', async () => {
      const desenvolvedor = await Desenvolvedor.create({
        nome: 'Carlos',
        sexo: 'M',
        data_nascimento: '1985-05-20',
        hobby: 'Games',
        nivel_id: nivelJunior.id,
      });

      const req = mockReq(
        {
          nome: 'Carlos Atualizado',
          sexo: 'M',
          data_nascimento: '1985-05-20',
          hobby: 'Cinema',
          nivel_id: nivelSenior.id,
        },
        { id: desenvolvedor.id }
      );
      const res = mockRes();

      await desenvolvedoresController.update(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          nome: 'Carlos Atualizado',
          hobby: 'Cinema',
        }),
      });
    });

    it('deve retornar erro 404 para desenvolvedor inexistente', async () => {
      const req = mockReq(
        {
          nome: 'Teste',
          nivel_id: nivelJunior.id,
        },
        { id: 999 }
      );
      const res = mockRes();

      await desenvolvedoresController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Desenvolvedor não encontrado',
      });
    });

    it('deve retornar erro 400 para nível inexistente na atualização', async () => {
      const desenvolvedor = await Desenvolvedor.create({
        nome: 'Test',
        sexo: 'M',
        data_nascimento: '1990-01-01',
        hobby: 'Test',
        nivel_id: nivelJunior.id,
      });

      const req = mockReq(
        {
          nome: 'Test Updated',
          nivel_id: 999,
        },
        { id: desenvolvedor.id }
      );
      const res = mockRes();

      await desenvolvedoresController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Nível informado não existe',
      });
    });
  });

  describe('destroy', () => {
    it('deve remover desenvolvedor existente', async () => {
      const desenvolvedor = await Desenvolvedor.create({
        nome: 'To Delete',
        sexo: 'M',
        data_nascimento: '1990-01-01',
        hobby: 'Test',
        nivel_id: nivelJunior.id,
      });

      const req = mockReq({}, { id: desenvolvedor.id });
      const res = mockRes();

      await desenvolvedoresController.destroy(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();

      const desenvolvedorRemovido = await Desenvolvedor.findByPk(
        desenvolvedor.id
      );
      expect(desenvolvedorRemovido).toBeNull();
    });

    it('deve retornar erro 404 para desenvolvedor inexistente', async () => {
      const req = mockReq({}, { id: 999 });
      const res = mockRes();

      await desenvolvedoresController.destroy(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Desenvolvedor não encontrado',
      });
    });
  });

  describe('Tratamento de erros', () => {
    it('deve tratar erros internos no index', async () => {
      const originalFindAndCountAll = Desenvolvedor.findAndCountAll;
      Desenvolvedor.findAndCountAll = jest
        .fn()
        .mockRejectedValue(new Error('DB Error'));

      const req = mockReq({}, {}, {}, { page: 1, limit: 10 });
      const res = mockRes();

      await desenvolvedoresController.index(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Erro interno do servidor',
      });

      Desenvolvedor.findAndCountAll = originalFindAndCountAll;
    });

    it('deve tratar erros internos no store', async () => {
      const originalCreate = Desenvolvedor.create;
      Desenvolvedor.create = jest.fn().mockRejectedValue(new Error('DB Error'));

      const req = mockReq({
        nome: 'Test',
        sexo: 'M',
        data_nascimento: '1990-01-01',
        hobby: 'Test',
        nivel_id: nivelJunior.id,
      });
      const res = mockRes();

      await desenvolvedoresController.store(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Erro interno do servidor',
      });

      Desenvolvedor.create = originalCreate;
    });
  });
});
