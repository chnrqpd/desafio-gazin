const { Desenvolvedor, Nivel } = require('../../models');

const desenvolvedoresController = {

  async index(req, res) {
    try {
        const { page, limit, offset } = req.pagination || {};
        
        let result;

        if (page && limit) {
            result = await Desenvolvedor.findAndCountAll({
                include: [{
                    model: Nivel,
                    as: 'nivel',
                    attributes: ['id', 'nivel']
                }],
                order: [['id', 'ASC']],
                limit,
                offset
            });

            const totalPages = Math.ceil(result.count / limit);

            res.json({
                success: true,
                data: result.rows,
                meta: {
                    total: result.count,
                    per_page: limit,
                    current_page: page,
                    last_page: totalPages
                }
            });
        } else {
            const desenvolvedores = await Desenvolvedor.findAll({
                include: [{
                    model: Nivel,
                    ass: 'nivel',
                    attributes: ['id', 'nivel']
                }],
                order: [['id', 'ASC']]
            });

            res.json({
                success: true,
                data: desenvolvedores
            });
        }
    } catch (error) {
      console.error('Erro ao buscar desenvolvedores:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;
      
      const desenvolvedor = await Desenvolvedor.findByPk(id, {
        include: [{
          model: Nivel,
          as: 'nivel',
          attributes: ['id', 'nivel']
        }]
      });
      
      if (!desenvolvedor) {
        return res.status(404).json({
          success: false,
          message: 'Desenvolvedor não encontrado'
        });
      }
      
      res.json({
        success: true,
        data: desenvolvedor
      });
    } catch (error) {
      console.error('Erro ao buscar desenvolvedor:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },


  async store(req, res) {
    try {
      const { nivel_id, nome, sexo, data_nascimento, hobby } = req.body;
      
      const nivel = await Nivel.findByPk(nivel_id);
      if (!nivel) {
        return res.status(400).json({
          success: false,
          message: 'Nível informado não existe'
        });
      }
      
      const desenvolvedor = await Desenvolvedor.create({
        nivel_id,
        nome,
        sexo,
        data_nascimento,
        hobby
      });
      
      const desenvolvedorCompleto = await Desenvolvedor.findByPk(desenvolvedor.id, {
        include: ['nivel']
      });
      
      res.status(201).json({
        success: true,
        data: desenvolvedorCompleto
      });
    } catch (error) {
      console.error('Erro ao criar desenvolvedor:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { nivel_id, nome, sexo, data_nascimento, hobby } = req.body;
      
      const desenvolvedor = await Desenvolvedor.findByPk(id);
      
      if (!desenvolvedor) {
        return res.status(404).json({
          success: false,
          message: 'Desenvolvedor não encontrado'
        });
      }

      const nivel = await Nivel.findByPk(nivel_id);
      if (!nivel) {
        return res.status(400).json({
          success: false,
          message: 'Nível informado não existe'
        });
      }

      await desenvolvedor.update({
        nivel_id,
        nome,
        sexo,
        data_nascimento,
        hobby
      });
      
      const desenvolvedorAtualizado = await Desenvolvedor.findByPk(id, {
        include: ['nivel']
      });
      
      res.json({
        success: true,
        data: desenvolvedorAtualizado
      });
    } catch (error) {
      console.error('Erro ao atualizar desenvolvedor:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  async destroy(req, res) {
    try {
      const { id } = req.params;
      
      const desenvolvedor = await Desenvolvedor.findByPk(id);
      
      if (!desenvolvedor) {
        return res.status(404).json({
          success: false,
          message: 'Desenvolvedor não encontrado'
        });
      }

      await desenvolvedor.destroy();
      res.status(204).send();

    } catch (error) {
      console.error('Erro ao remover desenvolvedor:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
};

module.exports = desenvolvedoresController;