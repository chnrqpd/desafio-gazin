const niveisController = require('../../controllers/niveisController');
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

describe('niveisController', () => {
  describe('index', () => {
    it('deve retornar lista de níveis sem paginação', async () => {
      await Nivel.create({ nivel: 'Júnior' });
      await Nivel.create({ nivel: 'Sênior' });

      const req = mockReq();
      const res = mockRes();

      await niveisController.index(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.arrayContaining([
          expect.objectContaining({ nivel: 'Júnior' }),
          expect.objectContaining({ nivel: 'Sênior' }),
        ]),
      });
    });

    it('deve retornar lista com paginação quando pagination está definida', async () => {
      await Nivel.bulkCreate([
        { nivel: 'Júnior' },
        { nivel: 'Pleno' },
        { nivel: 'Sênior' },
      ]);

      const req = mockReq({}, {}, {}, { page: 1, limit: 2, offset: 0 });
      const res = mockRes();

      await niveisController.index(req, res);

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

    it('deve aplicar busca corretamente', async () => {
      await Nivel.bulkCreate([
        { nivel: 'Júnior Frontend' },
        { nivel: 'Sênior Backend' },
      ]);

      const req = mockReq({}, {}, {}, { search: 'Frontend' });
      const res = mockRes();

      await niveisController.index(req, res);

      const responseData = res.json.mock.calls[0][0];
      expect(responseData.data).toHaveLength(1);
      expect(responseData.data[0].nivel).toBe('Júnior Frontend');
    });

    it('deve ordenar por campo válido', async () => {
      await Nivel.bulkCreate([{ nivel: 'Sênior' }, { nivel: 'Júnior' }]);

      const req = mockReq({}, {}, { sort: 'nivel', order: 'ASC' });
      const res = mockRes();

      await niveisController.index(req, res);

      const responseData = res.json.mock.calls[0][0];
      expect(responseData.data[0].nivel).toBe('Júnior');
      expect(responseData.data[1].nivel).toBe('Sênior');
    });

    it('deve usar ordenação padrão para campo inválido', async () => {
      await Nivel.create({ nivel: 'Test' });

      const req = mockReq({}, {}, { sort: 'campo_invalido', order: 'ASC' });
      const res = mockRes();

      await niveisController.index(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.any(Array),
        })
      );
    });
  });

  describe('show', () => {
    it('deve retornar nível específico', async () => {
      const nivel = await Nivel.create({ nivel: 'Especialista' });

      const req = mockReq({}, { id: nivel.id });
      const res = mockRes();

      await niveisController.show(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          nivel: 'Especialista',
        }),
      });
    });

    it('deve retornar erro 404 para nível inexistente', async () => {
      const req = mockReq({}, { id: 999 });
      const res = mockRes();

      await niveisController.show(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Nível não encontrado',
      });
    });
  });

  describe('store', () => {
    it('deve criar um nível com sucesso', async () => {
      const req = mockReq({ nivel: 'Especialista' });
      const res = mockRes();

      await niveisController.store(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          nivel: 'Especialista',
          id: expect.any(Number),
        }),
      });
    });
  });

  describe('update', () => {
    it('deve atualizar nível existente', async () => {
      const nivel = await Nivel.create({ nivel: 'Júnior' });

      const req = mockReq({ nivel: 'Júnior Atualizado' }, { id: nivel.id });
      const res = mockRes();

      await niveisController.update(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          nivel: 'Júnior Atualizado',
        }),
      });
    });

    it('deve retornar erro 404 para nível inexistente', async () => {
      const req = mockReq({ nivel: 'Teste' }, { id: 999 });
      const res = mockRes();

      await niveisController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Nível não encontrado',
      });
    });
  });

  describe('destroy', () => {
    it('deve remover nível sem desenvolvedores', async () => {
      const nivel = await Nivel.create({ nivel: 'Teste' });

      const req = mockReq({}, { id: nivel.id });
      const res = mockRes();

      await niveisController.destroy(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();

      const nivelRemovido = await Nivel.findByPk(nivel.id);
      expect(nivelRemovido).toBeNull();
    });

    it('deve impedir remoção de nível com desenvolvedores', async () => {
      const nivel = await Nivel.create({ nivel: 'Júnior' });

      await Desenvolvedor.create({
        nome: 'Dev',
        sexo: 'M',
        data_nascimento: '1990-01-01',
        hobby: 'Test',
        nivel_id: nivel.id,
      });

      const req = mockReq({}, { id: nivel.id });
      const res = mockRes();

      await niveisController.destroy(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message:
          'Não é possível remover um nível que possui desenvolvedores associados',
      });
    });

    it('deve retornar erro 404 para nível inexistente', async () => {
      const req = mockReq({}, { id: 999 });
      const res = mockRes();

      await niveisController.destroy(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Nível não encontrado',
      });
    });
  });

  describe('Tratamento de erros', () => {
    it('deve tratar erros internos no index', async () => {
      const originalFindAndCountAll = Nivel.findAndCountAll;
      Nivel.findAndCountAll = jest
        .fn()
        .mockRejectedValue(new Error('DB Error'));

      const req = mockReq({}, {}, {}, { page: 1, limit: 10 });
      const res = mockRes();

      await niveisController.index(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Erro interno do servidor',
      });

      Nivel.findAndCountAll = originalFindAndCountAll;
    });

    it('deve tratar erros internos no store', async () => {
      const originalCreate = Nivel.create;
      Nivel.create = jest.fn().mockRejectedValue(new Error('DB Error'));

      const req = mockReq({ nivel: 'Test' });
      const res = mockRes();

      await niveisController.store(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Erro interno do servidor',
      });

      Nivel.create = originalCreate;
    });
  });
});
