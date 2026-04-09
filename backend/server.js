const express = require('express');
const cors = require('cors');
const routes = require('./routes/index');

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api', routes);

// Rota de saúde
app.get('/', (req, res) => {
  res.json({
    message: '🐾 API Clínica Veterinária - Online',
    aluno: 'Gustavo Berg Ribeiro',
    versao: '1.0.0'
  });
});

// Middleware de erro 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Middleware de erro geral
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📋 Aluno: Gustavo Berg Ribeiro`);
});
