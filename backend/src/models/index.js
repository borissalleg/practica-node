// src/models/index.js
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Producto = require('./Producto');

// Relación uno a muchos: un Usuario tiene muchos Productos
Usuario.hasMany(Producto, {
  foreignKey: 'usuarioId',
  onDelete: 'CASCADE'
});

// Un Producto pertenece a un Usuario
Producto.belongsTo(Usuario, {
  foreignKey: 'usuarioId'
});

module.exports = {
  sequelize,
  Usuario,
  Producto
};
