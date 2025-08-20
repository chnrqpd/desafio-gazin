const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        message: 'API Funcionando!',
        timestamp: new Date().toISOString()   
    });
});

// Adicionar restante das rotas


module.exports = app;