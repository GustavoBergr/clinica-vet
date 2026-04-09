const db = require('../config/db');

// GET /consultas
exports.listar = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search ? `%${req.query.search}%` : '%';

  const countSql = `
    SELECT COUNT(*) as total FROM consultas c
    JOIN animais a ON c.animal_id = a.id
    JOIN tutores t ON a.tutor_id = t.id
    WHERE a.nome LIKE ? OR c.motivo LIKE ? OR c.status LIKE ?`;
  db.query(countSql, [search, search, search], (err, countResult) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar consultas', details: err.message });
    const total = countResult[0].total;

    const sql = `
      SELECT c.*, a.nome as animal_nome, a.especie, t.nome as tutor_nome
      FROM consultas c
      JOIN animais a ON c.animal_id = a.id
      JOIN tutores t ON a.tutor_id = t.id
      WHERE a.nome LIKE ? OR c.motivo LIKE ? OR c.status LIKE ?
      ORDER BY c.data_consulta DESC, c.hora_consulta DESC
      LIMIT ? OFFSET ?`;
    db.query(sql, [search, search, search, limit, offset], (err2, rows) => {
      if (err2) return res.status(500).json({ error: 'Erro ao buscar consultas', details: err2.message });
      res.json({ data: rows, total, page, limit, totalPages: Math.ceil(total / limit) });
    });
  });
};

// GET /consultas/:id
exports.buscarPorId = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT c.*, a.nome as animal_nome, a.especie, a.raca, t.nome as tutor_nome, t.telefone as tutor_telefone
    FROM consultas c
    JOIN animais a ON c.animal_id = a.id
    JOIN tutores t ON a.tutor_id = t.id
    WHERE c.id = ?`;
  db.query(sql, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar consulta', details: err.message });
    if (rows.length === 0) return res.status(404).json({ error: 'Consulta não encontrada' });
    res.json(rows[0]);
  });
};

// POST /consultas
exports.criar = (req, res) => {
  const { animal_id, data_consulta, hora_consulta, motivo, diagnostico, tratamento, valor, status } = req.body;

  if (!animal_id || !data_consulta || !hora_consulta || !motivo || !valor)
    return res.status(400).json({ error: 'Campos obrigatórios: animal, data, hora, motivo e valor' });

  if (parseFloat(valor) < 0)
    return res.status(400).json({ error: 'Valor não pode ser negativo' });

  const statusValidos = ['agendada', 'realizada', 'cancelada'];
  const statusFinal = status || 'agendada';
  if (!statusValidos.includes(statusFinal))
    return res.status(400).json({ error: 'Status inválido. Use: agendada, realizada ou cancelada' });

  if (motivo.trim().length < 3)
    return res.status(400).json({ error: 'Motivo deve ter pelo menos 3 caracteres' });

  db.query('SELECT id FROM animais WHERE id = ?', [animal_id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro interno', details: err.message });
    if (rows.length === 0) return res.status(400).json({ error: 'Animal não encontrado' });

    const sql = 'INSERT INTO consultas (animal_id, data_consulta, hora_consulta, motivo, diagnostico, tratamento, valor, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [animal_id, data_consulta, hora_consulta, motivo.trim(), diagnostico || null, tratamento || null, valor, statusFinal], (err2, result) => {
      if (err2) return res.status(500).json({ error: 'Erro ao criar consulta', details: err2.message });
      res.status(201).json({ id: result.insertId, message: 'Consulta cadastrada com sucesso!' });
    });
  });
};

// PUT /consultas/:id
exports.atualizar = (req, res) => {
  const { id } = req.params;
  const { animal_id, data_consulta, hora_consulta, motivo, diagnostico, tratamento, valor, status } = req.body;

  if (!animal_id || !data_consulta || !hora_consulta || !motivo || !valor)
    return res.status(400).json({ error: 'Campos obrigatórios: animal, data, hora, motivo e valor' });

  const statusValidos = ['agendada', 'realizada', 'cancelada'];
  if (status && !statusValidos.includes(status))
    return res.status(400).json({ error: 'Status inválido' });

  const sql = 'UPDATE consultas SET animal_id=?, data_consulta=?, hora_consulta=?, motivo=?, diagnostico=?, tratamento=?, valor=?, status=? WHERE id=?';
  db.query(sql, [animal_id, data_consulta, hora_consulta, motivo.trim(), diagnostico || null, tratamento || null, valor, status || 'agendada', id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao atualizar consulta', details: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Consulta não encontrada' });
    res.json({ message: 'Consulta atualizada com sucesso!' });
  });
};

// DELETE /consultas/:id
exports.deletar = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM consultas WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao deletar consulta', details: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Consulta não encontrada' });
    res.json({ message: 'Consulta removida com sucesso!' });
  });
};
