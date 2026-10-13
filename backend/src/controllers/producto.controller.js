// src/controllers/producto.controller.js
const { Producto, Usuario } = require('../models');

// GET /api/productos
async function listar(req, res) {
  try {
    const productos = await Producto.findAll({
      include: {
        model: Usuario,
        attributes: ['id', 'nombre', 'email']
      }
    });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// GET /api/productos/:id
async function obtener(req, res) {
  try {
    const producto = await Producto.findByPk(req.params.id, {
      include: {
        model: Usuario,
        attributes: ['id', 'nombre', 'email']
      }
    });
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// POST /api/productos
async function crear(req, res) {
  try {
    const { nombre, precio, descripcion, usuarioId } = req.body;
    if (!nombre || !usuarioId) {
      return res.status(400).json({ error: 'nombre y usuarioId son obligatorios' });
    }
    const producto = await Producto.create({
      nombre,
      precio,
      descripcion,
      usuarioId
    });
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// PUT /api/productos/:id
async function actualizar(req, res) {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    const { nombre, precio, descripcion, usuarioId } = req.body;
    await producto.update({ nombre, precio, descripcion, usuarioId });
    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// DELETE /api/productos/:id
async function eliminar(req, res) {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    await producto.destroy();
    res.json({ mensaje: 'Producto eliminado' });
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
