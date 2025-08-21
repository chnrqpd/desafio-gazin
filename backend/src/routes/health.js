const express = require('express');
const router = express.Router();
const { sequelize } = require('../../models');

router.get('/', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'Conectado ao Banco de Dados',
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      database: 'Desconectado do banco de Dados',
      error: error.message,
    });
  }
});

module.exports = router;
