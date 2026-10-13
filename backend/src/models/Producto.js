// src/models/Producto.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Producto = sequelize.define('Producto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'productos',
  timestamps: true
});

module.exports = Producto;
