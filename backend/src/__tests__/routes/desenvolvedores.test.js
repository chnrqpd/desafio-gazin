const request = require('supertest');
const app = require('../../app');
const { Nivel, Desenvolvedor } = require('../../../models');

describe('Rotas /api/desenvolvedores', () => {
  let nivelJunior, nivelSenior;

  beforeEach(async () => {
    nivelJunior = await Nivel.create({ nivel: 'Júnior' });
    nivelSenior = await Nivel.create({ nivel: 'Sênior' });
  });

  describe('GET /api/desenvolvedores', () => {
    it('deve retornar lista vazia quando não há desenvolvedores', async () => {
      const response = await request(app)
        .get('/api/desenvolvedores')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('deve retornar lista de desenvolvedores com nível', async () => {
      await Desenvolvedor.create({
        nome: 'João Silva',
        sexo: 'M',
        data_nascimento: '1995-03-15',
        hobby: 'Futebol',
        nivel_id: nivelJunior.id,
      });

      const response = await request(app)
        .get('/api/desenvolvedores')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toMatchObject({
        nome: 'João Silva',
        sexo: 'M',
        hobby: 'Futebol',
      });
      expect(response.body.data[0].nivel).toMatchObject({
        id: nivelJunior.id,
        nivel: 'Júnior',
      });
    });

    it('deve retornar desenvolvedores com paginação', async () => {
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

      const response = await request(app)
        .get('/api/desenvolvedores?page=1&limit=2')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.meta.total).toBe(3);
      expect(response.body.meta.current_page).toBe(1);
      expect(response.body.meta.last_page).toBe(2);
    });

    it('deve filtrar desenvolvedores por nome', async () => {
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

      const response = await request(app)
        .get('/api/desenvolvedores?search=Maria')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].nome).toBe('Maria Santos');
    });

    it('deve ordenar desenvolvedores por nome', async () => {
      await Desenvolvedor.bulkCreate([
        {
          nome: 'Carlos',
          sexo: 'M',
          data_nascimento: '1990-01-01',
          hobby: 'Test',
          nivel_id: nivelJunior.id,
        },
        {
          nome: 'Ana',
          sexo: 'F',
          data_nascimento: '1991-01-01',
          hobby: 'Test',
          nivel_id: nivelSenior.id,
        },
      ]);

      const response = await request(app)
        .get('/api/desenvolvedores?sort=nome&order=ASC')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data[0].nome).toBe('Ana');
      expect(response.body.data[1].nome).toBe('Carlos');
    });
  });

  describe('GET /api/desenvolvedores/:id', () => {
    it('deve retornar desenvolvedor específico', async () => {
      const desenvolvedor = await Desenvolvedor.create({
        nome: 'Pedro Costa',
        sexo: 'M',
        data_nascimento: '1988-12-10',
        hobby: 'Yoga',
        nivel_id: nivelJunior.id,
      });

      const response = await request(app)
        .get(`/api/desenvolvedores/${desenvolvedor.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        nome: 'Pedro Costa',
        sexo: 'M',
        hobby: 'Yoga',
      });
      expect(response.body.data.nivel.nivel).toBe('Júnior');
    });

    it('deve retornar 404 para desenvolvedor inexistente', async () => {
      const response = await request(app)
        .get('/api/desenvolvedores/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('encontrado');
    });
  });

  describe('POST /api/desenvolvedores', () => {
    it('deve criar um novo desenvolvedor', async () => {
      const novoDesenvolvedor = {
        nome: 'Ana Costa',
        sexo: 'F',
        data_nascimento: '1988-12-10',
        hobby: 'Yoga',
        nivel_id: nivelJunior.id,
      };

      const response = await request(app)
        .post('/api/desenvolvedores')
        .send(novoDesenvolvedor)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        nome: 'Ana Costa',
        sexo: 'F',
        hobby: 'Yoga',
      });
      expect(response.body.data.id).toBeDefined();
    });

    it('deve retornar erro 400 para nível inexistente', async () => {
      const response = await request(app)
        .post('/api/desenvolvedores')
        .send({
          nome: 'Teste',
          sexo: 'M',
          data_nascimento: '1990-01-01',
          hobby: 'Teste',
          nivel_id: 999,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('não existe');
    });

    it('deve retornar erro 400 para dados inválidos', async () => {
      const response = await request(app)
        .post('/api/desenvolvedores')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('deve normalizar sexo para maiúsculo', async () => {
      const response = await request(app)
        .post('/api/desenvolvedores')
        .send({
          nome: 'Test',
          sexo: 'f',
          data_nascimento: '1990-01-01',
          hobby: 'Test',
          nivel_id: nivelJunior.id,
        })
        .expect(201);

      expect(response.body.data.sexo).toBe('F');
    });

    it('deve trimmar nome', async () => {
      const response = await request(app)
        .post('/api/desenvolvedores')
        .send({
          nome: '  João Silva  ',
          sexo: 'M',
          data_nascimento: '1990-01-01',
          hobby: 'Test',
          nivel_id: nivelJunior.id,
        })
        .expect(201);

      expect(response.body.data.nome).toBe('João Silva');
    });
  });

  describe('PUT /api/desenvolvedores/:id', () => {
    it('deve atualizar desenvolvedor existente', async () => {
      const desenvolvedor = await Desenvolvedor.create({
        nome: 'Carlos',
        sexo: 'M',
        data_nascimento: '1985-05-20',
        hobby: 'Games',
        nivel_id: nivelJunior.id,
      });

      const response = await request(app)
        .put(`/api/desenvolvedores/${desenvolvedor.id}`)
        .send({
          nome: 'Carlos Atualizado',
          sexo: 'M',
          data_nascimento: '1985-05-20',
          hobby: 'Cinema',
          nivel_id: nivelSenior.id,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.nome).toBe('Carlos Atualizado');
      expect(response.body.data.hobby).toBe('Cinema');
      expect(response.body.data.nivel.nivel).toBe('Sênior');
    });

    it('deve retornar erro 404 para desenvolvedor inexistente', async () => {
      const response = await request(app)
        .put('/api/desenvolvedores/999')
        .send({
          nome: 'Teste',
          sexo: 'M',
          data_nascimento: '1990-01-01',
          nivel_id: nivelJunior.id,
        })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('encontrado');
    });

    it('deve retornar erro 400 para nível inexistente na atualização', async () => {
      const desenvolvedor = await Desenvolvedor.create({
        nome: 'Test',
        sexo: 'M',
        data_nascimento: '1990-01-01',
        hobby: 'Test',
        nivel_id: nivelJunior.id,
      });

      const response = await request(app)
        .put(`/api/desenvolvedores/${desenvolvedor.id}`)
        .send({
          nome: 'Test Updated',
          sexo: 'M',
          data_nascimento: '1990-01-01',
          nivel_id: 999,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('não existe');
    });
  });

  describe('DELETE /api/desenvolvedores/:id', () => {
    it('deve remover desenvolvedor existente', async () => {
      const desenvolvedor = await Desenvolvedor.create({
        nome: 'To Delete',
        sexo: 'M',
        data_nascimento: '1990-01-01',
        hobby: 'Test',
        nivel_id: nivelJunior.id,
      });

      await request(app)
        .delete(`/api/desenvolvedores/${desenvolvedor.id}`)
        .expect(204);

      const desenvolvedorRemovido = await Desenvolvedor.findByPk(
        desenvolvedor.id
      );
      expect(desenvolvedorRemovido).toBeNull();
    });

    it('deve retornar erro 404 para desenvolvedor inexistente', async () => {
      const response = await request(app)
        .delete('/api/desenvolvedores/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('encontrado');
    });
  });
});
