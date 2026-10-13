// src/controllers/usuario.controller.js
const { Usuario } = require('../models');

// GET /api/usuarios
async function listar(req, res) {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// GET /api/usuarios/:id
async function obtener(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// POST /api/usuarios
async function crear(req, res) {
  try {
    const { nombre, email } = req.body;
    if (!nombre || !email) {
      return res.status(400).json({ error: 'nombre y email son obligatorios' });
    }
    const usuario = await Usuario.create({ nombre, email });
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// PUT /api/usuarios/:id
async function actualizar(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const { nombre, email } = req.body;
    await usuario.update({ nombre, email });
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// DELETE /api/usuarios/:id
async function eliminar(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    await usuario.destroy();
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar
};
