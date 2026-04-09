const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'gustavo1234567890',        // altere para sua senha do MySQL
  database: 'clinica_vet',
  charset: 'utf8mb4'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao MySQL:', err.message);
    process.exit(1);
  }
  console.log('✅ Conectado ao MySQL com sucesso!');
});

module.exports = connection;
