const express = require('express');
const { Nivel, Desenvolvedor } = require('../../models');

const router = express.Router();

router.get('/models', async (req, res) => {
    try {
        // Testar associações
        const associationsInfo = {
            nivel: Nivel.associations ? Object.keys(Nivel.associations) : [],
            desenvolvedor: Desenvolvedor.associations ? Object.keys(Desenvolvedor.associations) : []
        };

        // Contar registros
        const totalNiveis = await Nivel.count();
        const totalDevs = await Desenvolvedor.count();

        // Testar consulta com include (se houver desenvolvedores)
        let testQuery = null;
        if (totalDevs > 0) {
            testQuery = await Desenvolvedor.findOne({
                include: ['nivel']
            });
        }

        res.json({
            success: true,
            data: {
                models: ['Nivel', 'Desenvolvedor'],
                associations: associationsInfo,
                counts: {
                    niveis: totalNiveis,
                    desenvolvedores: totalDevs
                },
                testQuery: testQuery
            }
        });

    } catch (error) {
        console.error('Erro no debug:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;