const { sequelize } = require('../../models');

const niveisController = {
    async index(req, res) {
        try {
            const [results] = await sequelize.query('SELECT * from niveis ORDER by id');

            res.json({
                success: true,
                data: results
            });
        } catch (error) {
            console.error('Erro ao buscar níveis:',  error),
            res.status(500).json({
                success: false,
                message: 'Erro Interno do servidor.'
            });
        }
    }
};

module.exports = niveisController;
