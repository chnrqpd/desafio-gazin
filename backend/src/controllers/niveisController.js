const { Nivel, Desenvolvedor } = require('../../models');

const niveisController = {
    async index(req, res) {
        try {
            const { page, limit, offset } = req.pagination || {};
            
            let result;

            if (page && limit) {
                result = await Nivel.findAndCountAll({
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
                const niveis = await Nivel.findAll({
                    order: [['id', 'ASC']]
                });

                res.json({
                    success: true,
                    data: niveis
                });
            }
        } catch (error) {
            console.error('Erro ao buscar níveis:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    async store(req, res) {
        try {
            const { nivel } = req.body; // Já validado pelo middleware

            const novoNivel = await Nivel.create({ nivel });

            res.status(201).json({
                success: true,
                data: novoNivel
            });
        } catch (error) {
            console.error('Erro ao criar nível:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    async show(req, res) {
        try {
            const { id } = req.params;
            
            const nivel = await Nivel.findByPk(id);

            if (!nivel) {
                return res.status(404).json({
                    success: false,
                    message: 'Nível não encontrado'
                });
            }

            res.json({
                success: true,
                data: nivel
            });
        } catch (error) {
            console.error('Erro ao buscar nível:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { nivel } = req.body; // Já validado pelo middleware
            
            const nivelExistente = await Nivel.findByPk(id);

            if (!nivelExistente) {
                return res.status(404).json({
                    success: false,
                    message: 'Nível não encontrado'
                });
            }

            await nivelExistente.update({ nivel });

            res.json({
                success: true,
                data: nivelExistente
            });
        } catch (error) {
            console.error('Erro ao atualizar nível:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    async destroy(req, res) {
        try {
            const { id } = req.params;

            const nivel = await Nivel.findByPk(id);

            if (!nivel) {
                return res.status(404).json({
                    success: false,
                    message: 'Nível não encontrado'
                });
            }

            const desenvolvedoresAssociados = await Desenvolvedor.count({
                where: { nivel_id: id }
            });

            if (desenvolvedoresAssociados > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Não é possível remover um nível que possui desenvolvedores associados'
                });
            }

            await nivel.destroy();
            res.status(204).send();

        } catch (error) {
            console.error('Erro ao remover nível:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
};

module.exports = niveisController;