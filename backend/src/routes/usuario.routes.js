// src/routes/usuario.routes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');

router.get('/', usuarioController.listar);
router.get('/:id', usuarioController.obtener);
router.post('/', usuarioController.crear);
router.put('/:id', usuarioController.actualizar);
router.delete('/:id', usuarioController.eliminar);

module.exports = router;
