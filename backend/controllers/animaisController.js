const db = require('../config/db');

// GET /animais
exports.listar = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search ? `%${req.query.search}%` : '%';

  const countSql = `
    SELECT COUNT(*) as total FROM animais a
    JOIN tutores t ON a.tutor_id = t.id
    WHERE a.nome LIKE ? OR a.especie LIKE ? OR t.nome LIKE ?`;
  db.query(countSql, [search, search, search], (err, countResult) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar animais', details: err.message });
    const total = countResult[0].total;

    const sql = `
      SELECT a.*, t.nome as tutor_nome, t.telefone as tutor_telefone
      FROM animais a
      JOIN tutores t ON a.tutor_id = t.id
      WHERE a.nome LIKE ? OR a.especie LIKE ? OR t.nome LIKE ?
      ORDER BY a.nome LIMIT ? OFFSET ?`;
    db.query(sql, [search, search, search, limit, offset], (err2, rows) => {
      if (err2) return res.status(500).json({ error: 'Erro ao buscar animais', details: err2.message });
      res.json({ data: rows, total, page, limit, totalPages: Math.ceil(total / limit) });
    });
  });
};

// GET /animais/:id
exports.buscarPorId = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT a.*, t.nome as tutor_nome, t.telefone as tutor_telefone, t.email as tutor_email
    FROM animais a
    JOIN tutores t ON a.tutor_id = t.id
    WHERE a.id = ?`;
  db.query(sql, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar animal', details: err.message });
    if (rows.length === 0) return res.status(404).json({ error: 'Animal não encontrado' });
    res.json(rows[0]);
  });
};

// POST /animais
exports.criar = (req, res) => {
  const { nome, especie, raca, data_nascimento, peso, tutor_id, observacoes } = req.body;

  if (!nome || !especie || !raca || !data_nascimento || !peso || !tutor_id)
    return res.status(400).json({ error: 'Campos obrigatórios: nome, espécie, raça, data de nascimento, peso e tutor' });

  if (parseFloat(peso) <= 0)
    return res.status(400).json({ error: 'Peso deve ser maior que zero' });

  const nascimento = new Date(data_nascimento);
  if (isNaN(nascimento.getTime()) || nascimento > new Date())
    return res.status(400).json({ error: 'Data de nascimento inválida' });

  db.query('SELECT id FROM tutores WHERE id = ?', [tutor_id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro interno', details: err.message });
    if (rows.length === 0) return res.status(400).json({ error: 'Tutor não encontrado' });

    const sql = 'INSERT INTO animais (nome, especie, raca, data_nascimento, peso, tutor_id, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [nome.trim(), especie.trim(), raca.trim(), data_nascimento, peso, tutor_id, observacoes || null], (err2, result) => {
      if (err2) return res.status(500).json({ error: 'Erro ao cadastrar animal', details: err2.message });
      res.status(201).json({ id: result.insertId, message: 'Animal cadastrado com sucesso!' });
    });
  });
};

// PUT /animais/:id
exports.atualizar = (req, res) => {
  const { id } = req.params;
  const { nome, especie, raca, data_nascimento, peso, tutor_id, observacoes } = req.body;

  if (!nome || !especie || !raca || !data_nascimento || !peso || !tutor_id)
    return res.status(400).json({ error: 'Campos obrigatórios: nome, espécie, raça, data de nascimento, peso e tutor' });

  if (parseFloat(peso) <= 0)
    return res.status(400).json({ error: 'Peso deve ser maior que zero' });

  const sql = 'UPDATE animais SET nome=?, especie=?, raca=?, data_nascimento=?, peso=?, tutor_id=?, observacoes=? WHERE id=?';
  db.query(sql, [nome.trim(), especie.trim(), raca.trim(), data_nascimento, peso, tutor_id, observacoes || null, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao atualizar animal', details: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Animal não encontrado' });
    res.json({ message: 'Animal atualizado com sucesso!' });
  });
};

// DELETE /animais/:id
exports.deletar = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM animais WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao deletar animal', details: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Animal não encontrado' });
    res.json({ message: 'Animal removido com sucesso!' });
  });
};
