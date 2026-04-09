const express = require('express');
const router = express.Router();
const tutores = require('../controllers/tutoresController');
const animais = require('../controllers/animaisController');
const consultas = require('../controllers/consultasController');

// Tutores
router.get('/tutores', tutores.listar);
router.get('/tutores/:id', tutores.buscarPorId);
router.get('/tutores/:id/animais', tutores.animaisDoTutor);
router.post('/tutores', tutores.criar);
router.put('/tutores/:id', tutores.atualizar);
router.delete('/tutores/:id', tutores.deletar);

// Animais
router.get('/animais', animais.listar);
router.get('/animais/:id', animais.buscarPorId);
router.post('/animais', animais.criar);
router.put('/animais/:id', animais.atualizar);
router.delete('/animais/:id', animais.deletar);

// Consultas
router.get('/consultas', consultas.listar);
router.get('/consultas/:id', consultas.buscarPorId);
router.post('/consultas', consultas.criar);
router.put('/consultas/:id', consultas.atualizar);
router.delete('/consultas/:id', consultas.deletar);

module.exports = router;
