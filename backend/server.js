// server.js
require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a MySQL');

    // Crea/actualiza las tablas según los modelos
    await sequelize.sync();
    console.log('✅ Tablas sincronizadas');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar a MySQL:', error.message);
  }
}

iniciarServidor();
