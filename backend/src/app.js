const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    message: 'API Funcionando!',
    timestamp: new Date().toISOString(),
  });
});

// Rotas da API
app.use('/api/niveis', require('./routes/niveis'));
app.use('/api/desenvolvedores', require('./routes/desenvolvedores'));
app.use('/api/debug', require('./routes/debug'));

module.exports = app;
