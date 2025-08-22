const request = require('supertest');
const app = require('../../app');
const { Nivel, Desenvolvedor } = require('../../../models');

describe('Rotas /api/niveis', () => {
  describe('GET /api/niveis', () => {
    it('deve retornar lista vazia quando não há níveis', async () => {
      const response = await request(app).get('/api/niveis').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('deve retornar lista de níveis', async () => {
      await Nivel.create({ nivel: 'Júnior' });
      await Nivel.create({ nivel: 'Sênior' });

      const response = await request(app).get('/api/niveis').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].nivel).toBe('Júnior');
    });

    it('deve retornar níveis com paginação', async () => {
      await Nivel.bulkCreate([
        { nivel: 'Júnior' },
        { nivel: 'Pleno' },
        { nivel: 'Sênior' },
      ]);

      const response = await request(app)
        .get('/api/niveis?page=1&limit=2')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.meta.total).toBe(3);
      expect(response.body.meta.current_page).toBe(1);
      expect(response.body.meta.last_page).toBe(2);
    });

    it('deve filtrar níveis por busca', async () => {
      await Nivel.bulkCreate([
        { nivel: 'Júnior Frontend' },
        { nivel: 'Sênior Backend' },
        { nivel: 'Pleno Fullstack' },
      ]);

      const response = await request(app)
        .get('/api/niveis?search=Sênior')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].nivel).toBe('Sênior Backend');
    });

    it('deve ordenar níveis por campo especificado', async () => {
      await Nivel.bulkCreate([
        { nivel: 'Sênior' },
        { nivel: 'Júnior' },
        { nivel: 'Pleno' },
      ]);

      const response = await request(app)
        .get('/api/niveis?sort=nivel&order=ASC')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data[0].nivel).toBe('Júnior');
      expect(response.body.data[1].nivel).toBe('Pleno');
      expect(response.body.data[2].nivel).toBe('Sênior');
    });
  });

  describe('GET /api/niveis/:id', () => {
    it('deve retornar nível específico', async () => {
      const nivel = await Nivel.create({ nivel: 'Especialista' });

      const response = await request(app)
        .get(`/api/niveis/${nivel.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.nivel).toBe('Especialista');
    });

    it('deve retornar 404 para nível inexistente', async () => {
      const response = await request(app).get('/api/niveis/999').expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('encontrado');
    });

    it('deve retornar erro 400 para ID inválido', async () => {
      const response = await request(app).get('/api/niveis/abc').expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('inválido');
    });
  });

  describe('POST /api/niveis', () => {
    it('deve criar um novo nível', async () => {
      const response = await request(app)
        .post('/api/niveis')
        .send({ nivel: 'Pleno' })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.nivel).toBe('Pleno');
      expect(response.body.data.id).toBeDefined();
    });

    it('deve retornar erro 400 para dados inválidos', async () => {
      const response = await request(app)
        .post('/api/niveis')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('obrigatório');
    });

    it('deve retornar erro para nível vazio', async () => {
      const response = await request(app)
        .post('/api/niveis')
        .send({ nivel: '' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('deve trimmar espaços do nível', async () => {
      const response = await request(app)
        .post('/api/niveis')
        .send({ nivel: '  Trainee  ' })
        .expect(201);

      expect(response.body.data.nivel).toBe('Trainee');
    });
  });

  describe('PUT /api/niveis/:id', () => {
    it('deve atualizar nível existente', async () => {
      const nivel = await Nivel.create({ nivel: 'Júnior' });

      const response = await request(app)
        .put(`/api/niveis/${nivel.id}`)
        .send({ nivel: 'Júnior Atualizado' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.nivel).toBe('Júnior Atualizado');
    });

    it('deve retornar erro 404 para nível inexistente', async () => {
      const response = await request(app)
        .put('/api/niveis/999')
        .send({ nivel: 'Teste' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('encontrado');
    });

    it('deve retornar erro 400 para dados inválidos', async () => {
      const nivel = await Nivel.create({ nivel: 'Teste' });

      const response = await request(app)
        .put(`/api/niveis/${nivel.id}`)
        .send({ nivel: '' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('deve retornar erro 400 para ID inválido', async () => {
      const response = await request(app)
        .put('/api/niveis/abc')
        .send({ nivel: 'Teste' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/niveis/:id', () => {
    it('deve remover nível sem desenvolvedores', async () => {
      const nivel = await Nivel.create({ nivel: 'Teste' });

      await request(app).delete(`/api/niveis/${nivel.id}`).expect(204);

      const nivelRemovido = await Nivel.findByPk(nivel.id);
      expect(nivelRemovido).toBeNull();
    });

    it('deve impedir remoção de nível com desenvolvedores associados', async () => {
      const nivel = await Nivel.create({ nivel: 'Júnior' });

      await Desenvolvedor.create({
        nome: 'João',
        sexo: 'M',
        data_nascimento: '1990-01-01',
        hobby: 'Programar',
        nivel_id: nivel.id,
      });

      const response = await request(app)
        .delete(`/api/niveis/${nivel.id}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('desenvolvedores associados');
    });

    it('deve retornar erro 404 para nível inexistente', async () => {
      const response = await request(app).delete('/api/niveis/999').expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('encontrado');
    });

    it('deve retornar erro 400 para ID inválido', async () => {
      const response = await request(app).delete('/api/niveis/abc').expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Validações de paginação', () => {
    it('deve retornar erro para página inválida', async () => {
      const response = await request(app).get('/api/niveis?page=0').expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('maior que 0');
    });

    it('deve retornar erro para limite inválido', async () => {
      const response = await request(app)
        .get('/api/niveis?limit=101')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('entre 1 e 100');
    });

    it('deve retornar erro para página não numérica', async () => {
      const response = await request(app)
        .get('/api/niveis?page=abc')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
