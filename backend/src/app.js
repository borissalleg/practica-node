// src/app.js
const express = require('express');
const cors = require('cors');

const usuarioRoutes = require('./routes/usuario.routes');
const productoRoutes = require('./routes/producto.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ mensaje: 'El servidor está funcionando 🚀' });
});

// Rutas del CRUD
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productoRoutes);

module.exports = app;
