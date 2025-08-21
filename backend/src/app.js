const express = require('express');
const cors = require('cors');
const { specs, swaggerUi } = require('../config/swagger');

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Gazin API Documentation',
  })
);

app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

app.get('/health', (req, res) => {
  res.json({
    message: 'API Funcionando!',
    timestamp: new Date().toISOString(),
  });
});
app.use('/api/niveis', require('./routes/niveis'));
app.use('/api/desenvolvedores', require('./routes/desenvolvedores'));
app.use('/api/debug', require('./routes/debug'));

module.exports = app;
