const db = require('../config/db');

// GET /tutores - listar todos
exports.listar = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search ? `%${req.query.search}%` : '%';

  const countSql = `SELECT COUNT(*) as total FROM tutores WHERE nome LIKE ? OR cpf LIKE ?`;
  db.query(countSql, [search, search], (err, countResult) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar tutores', details: err.message });

    const total = countResult[0].total;
    const sql = `SELECT * FROM tutores WHERE nome LIKE ? OR cpf LIKE ? ORDER BY nome LIMIT ? OFFSET ?`;
    db.query(sql, [search, search, limit, offset], (err2, rows) => {
      if (err2) return res.status(500).json({ error: 'Erro ao buscar tutores', details: err2.message });
      res.json({ data: rows, total, page, limit, totalPages: Math.ceil(total / limit) });
    });
  });
};

// GET /tutores/:id - buscar por id
exports.buscarPorId = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM tutores WHERE id = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar tutor', details: err.message });
    if (rows.length === 0) return res.status(404).json({ error: 'Tutor não encontrado' });
    res.json(rows[0]);
  });
};

// GET /tutores/:id/animais - animais do tutor
exports.animaisDoTutor = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM animais WHERE tutor_id = ? ORDER BY nome', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar animais', details: err.message });
    res.json(rows);
  });
};

// POST /tutores - criar
exports.criar = (req, res) => {
  const { nome, cpf, telefone, email, endereco } = req.body;

  if (!nome || !cpf || !telefone || !email || !endereco)
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });

  if (nome.trim().length < 3)
    return res.status(400).json({ error: 'Nome deve ter pelo menos 3 caracteres' });

  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  if (!cpfRegex.test(cpf))
    return res.status(400).json({ error: 'CPF inválido. Formato esperado: 000.000.000-00' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ error: 'E-mail inválido' });

  db.query('SELECT id FROM tutores WHERE cpf = ?', [cpf], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro interno', details: err.message });
    if (rows.length > 0) return res.status(409).json({ error: 'CPF já cadastrado' });

    const sql = 'INSERT INTO tutores (nome, cpf, telefone, email, endereco) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nome.trim(), cpf, telefone, email.toLowerCase(), endereco.trim()], (err2, result) => {
      if (err2) return res.status(500).json({ error: 'Erro ao criar tutor', details: err2.message });
      res.status(201).json({ id: result.insertId, message: 'Tutor cadastrado com sucesso!' });
    });
  });
};

// PUT /tutores/:id - atualizar
exports.atualizar = (req, res) => {
  const { id } = req.params;
  const { nome, cpf, telefone, email, endereco } = req.body;

  if (!nome || !cpf || !telefone || !email || !endereco)
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });

  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  if (!cpfRegex.test(cpf))
    return res.status(400).json({ error: 'CPF inválido. Formato esperado: 000.000.000-00' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ error: 'E-mail inválido' });

  db.query('SELECT id FROM tutores WHERE cpf = ? AND id != ?', [cpf, id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro interno', details: err.message });
    if (rows.length > 0) return res.status(409).json({ error: 'CPF já pertence a outro tutor' });

    const sql = 'UPDATE tutores SET nome=?, cpf=?, telefone=?, email=?, endereco=? WHERE id=?';
    db.query(sql, [nome.trim(), cpf, telefone, email.toLowerCase(), endereco.trim(), id], (err2, result) => {
      if (err2) return res.status(500).json({ error: 'Erro ao atualizar tutor', details: err2.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Tutor não encontrado' });
      res.json({ message: 'Tutor atualizado com sucesso!' });
    });
  });
};

// DELETE /tutores/:id - deletar
exports.deletar = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tutores WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao deletar tutor', details: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Tutor não encontrado' });
    res.json({ message: 'Tutor removido com sucesso!' });
  });
};
