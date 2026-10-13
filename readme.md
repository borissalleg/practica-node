# Manual: Backend con Node/Express/MySQL + Frontend con React

Este manual documenta paso a paso cómo se armó el proyecto hasta el momento: un backend en Node.js/Express con **Sequelize** conectado a MySQL (con **CRUD completo** de Usuarios y Productos), y un frontend en **React** con navegación (Navbar + rutas) que consume la API mediante **axios**.

---

## Estructura final del proyecto

```
practica-node/
├── backend/
│   ├── node_modules/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── producto.controller.js
│   │   │   └── usuario.controller.js
│   │   ├── models/
│   │   │   ├── Producto.js
│   │   │   ├── Usuario.js
│   │   │   └── index.js
│   │   ├── routes/
│   │   │   ├── producto.routes.js
│   │   │   └── usuario.routes.js
│   │   └── app.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
└── frontend/
    ├── node_modules/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   └── Navbar.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Usuarios.jsx
    │   │   └── Productos.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## Parte 1: Backend (Node + Express + MySQL)

### 1. Crear la carpeta del proyecto y del backend

```bash
mkdir practica-node
cd practica-node
mkdir backend
cd backend
npm init -y
```

### 2. Instalar dependencias

```bash
npm install express mysql2 dotenv cors
npm install --save-dev nodemon
```

| Paquete | Uso |
|---|---|
| `express` | Framework para el servidor HTTP |
| `mysql2` | Driver para conectar con MySQL (soporta promesas) |
| `dotenv` | Cargar variables de entorno desde `.env` |
| `cors` | Permitir peticiones desde el frontend (otro puerto) |
| `nodemon` | Reinicia el servidor automáticamente al guardar cambios |

### 3. Crear el archivo `.env`

```
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=tienda_db
PORT=3000
```

### 4. Crear la base de datos en MySQL y el usuario con privilegios a esa BD

```sql
CREATE DATABASE tiendanode
    DEFAULT CHARACTER SET = 'utf8mb4';



CREATE USER 'usertiendanode'@'localhost' IDENTIFIED BY '123456';


GRANT ALL PRIVILEGES ON tiendanode.* TO 'usertiendanode'@'localhost';


SELECT user, host FROM mysql.user;


SHOW GRANTS FOR 'usertiendanode'@'localhost';
```

### 5. Crear `src/app.js` — configuración de Express

```javascript
// src/app.js
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ mensaje: 'El servidor está funcionando 🚀' });
});

module.exports = app;
```

### 6. Crear `server.js` — punto de entrada, conecta a MySQL

```javascript
// server.js
require('dotenv').config();
const mysql = require('mysql2/promise');
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('✅ Conectado a MySQL');
    await connection.end(); // solo probamos la conexión

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar a MySQL:', error.message);
  }
}

iniciarServidor();
```

### 7. Agregar scripts en `package.json`

```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  }
}
```

### 8. Crear `.gitignore`

```
node_modules/
.env
```

### 9. Correr el servidor

```bash
npm run dev
```

Deberías ver en consola:
```
✅ Conectado a MySQL
🚀 Servidor corriendo en http://localhost:3000
```

### 10. Probar el endpoint

```bash
curl http://localhost:3000/api/health
```

Respuesta esperada:
```json
{ "mensaje": "El servidor está funcionando 🚀" }
```

**Nota importante:** todos los comandos del backend (`npm init`, `npm install`, `npm run dev`) deben ejecutarse **dentro de la carpeta `backend/`**. Si el `package.json` o `node_modules` terminan en la raíz del proyecto por error, hay que moverlos con `mv package.json backend/`, `mv node_modules backend/`, etc.

---

## Parte 2: Frontend (React con Vite)

### 1. Crear el proyecto con Vite

Desde la raíz del proyecto (`practica-node/`, **no** dentro de `backend/`):

```bash
cd practica-node
npm create vite@latest frontend -- --template react
```

Durante la instalación te preguntará:
- **Linter:** elegir `ESLint`
- **Lenguaje:** elegir `JavaScript`

### 2. Instalar dependencias

Este paso es indispensable: Vite genera el `package.json` del frontend, pero **no descarga las librerías** (React, ReactDOM, etc.) automáticamente.

```bash
cd frontend
npm install
```

### 3. Instalar React Router (para la navegación)

```bash
npm install react-router-dom
```

### 4. Crear el Navbar

```jsx
// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={estilos.nav}>
      <h2 style={estilos.logo}>Mi App</h2>
      <ul style={estilos.lista}>
        <li><Link to="/" style={estilos.link}>Inicio</Link></li>
        <li><Link to="/usuarios" style={estilos.link}>Usuarios</Link></li>
        <li><Link to="/productos" style={estilos.link}>Productos</Link></li>
      </ul>
    </nav>
  );
}

const estilos = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#282c34',
    color: 'white'
  },
  logo: { margin: 0 },
  lista: {
    display: 'flex',
    listStyle: 'none',
    gap: '20px',
    margin: 0,
    padding: 0
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold'
  }
};

export default Navbar;
```

### 5. Crear las páginas

```jsx
// src/pages/Home.jsx
function Home() {
  return (
    <div style={{ padding: '30px' }}>
      <h1>Bienvenido</h1>
      <p>Esta es la página de inicio.</p>
    </div>
  );
}

export default Home;
```

```jsx
// src/pages/Usuarios.jsx
function Usuarios() {
  return (
    <div style={{ padding: '30px' }}>
      <h1>Usuarios</h1>
      <p>Aquí irá el CRUD de usuarios.</p>
    </div>
  );
}

export default Usuarios;
```

```jsx
// src/pages/Productos.jsx
function Productos() {
  return (
    <div style={{ padding: '30px' }}>
      <h1>Productos</h1>
      <p>Aquí irá el CRUD de productos.</p>
    </div>
  );
}

export default Productos;
```

### 6. Configurar las rutas en `App.jsx`

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Usuarios from './pages/Usuarios';
import Productos from './pages/Productos';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/productos" element={<Productos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### 7. `main.jsx` (queda como lo genera Vite por defecto)

```jsx
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 8. Correr el frontend

```bash
npm run dev
```

Por defecto corre en `http://localhost:5173`.

### 9. Probar la navegación

Abrir `http://localhost:5173` y verificar:
- El navbar se muestra arriba con los links **Inicio | Usuarios | Productos**
- Al hacer clic en cada link, el contenido cambia sin recargar la página (navegación tipo SPA gracias a React Router)

---

## Parte 3: CRUD con Sequelize (backend)

En esta parte convertimos el backend en una API REST completa para dos recursos: **Usuarios** y **Productos**, usando **Sequelize** (un ORM). Con un ORM trabajamos las tablas como objetos JavaScript y no escribimos SQL a mano: Sequelize genera las sentencias internamente.

**Resumen de lo que se agrega:**

| Archivo | Para qué sirve |
|---|---|
| `src/config/database.js` | Crea la conexión a MySQL con Sequelize |
| `src/models/Usuario.js` | Tabla `usuarios` |
| `src/models/Producto.js` | Tabla `productos` (con FK a usuario) |
| `src/models/index.js` | Importa modelos y define la relación 1—N |
| `src/controllers/*.controller.js` | Lógica de cada operación (listar, crear, etc.) |
| `src/routes/*.routes.js` | Define las URL del CRUD |

### 1. Instalar Sequelize

```bash
cd backend
npm install sequelize
```

**Nota:** Sequelize usa `mysql2` como driver interno, por eso no hace falta instalar nada más.

### 2. Crear la conexión a la base de datos

Un único archivo (`src/config/database.js`) encargado de conectarse a MySQL. Lee las variables de `.env` que ya definimos en la Parte 1 y exporta la instancia de `Sequelize`. `logging: false` evita que imprima cada consulta SQL en consola.

```javascript
// src/config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  }
);

module.exports = sequelize;
```

### 3. Definir el modelo Usuario

Un **modelo** representa una tabla. `sequelize.define('Usuario', {...})` describe sus columnas y sus reglas:

- `primaryKey: true` → columna `id` es la llave primaria.
- `autoIncrement: true` → MySQL la numera sola (1, 2, 3…).
- `allowNull: false` → el campo es obligatorio.
- `unique: true` → no puede repetirse (email por usuario).
- `timestamps: true` → Sequelize agrega `createdAt` y `updatedAt` automáticamente.

```javascript
// src/models/Usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  }
}, {
  tableName: 'usuarios',
  timestamps: true
});

module.exports = Usuario;
```

### 4. Definir el modelo Producto

Además de sus propios campos, guarda `usuarioId`: la **llave foránea** que conecta cada producto con el usuario que lo registró.

- `DECIMAL(10, 2)` → número con 2 decimales (para precios).
- `defaultValue: 0` → si no se manda precio, usa 0.
- `descripcion` permite `null` (es opcional).

```javascript
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
```

### 5. Asociar los modelos (relación 1 — N)

El archivo `src/models/index.js` importa todo y declara la relación:

- `Usuario.hasMany(Producto)` → un Usuario **tiene muchos** Productos.
- `Producto.belongsTo(Usuario)` → un Producto **pertenece a** un Usuario.

Con `onDelete: 'CASCADE'` indicamos que al borrar un usuario, MySQL borra **también sus productos** (esta regla queda aplicada en la propia tabla).

```javascript
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
```

### 6. Actualizar `server.js` para usar Sequelize

Antes probábamos la conexión con `mysql2` directamente. Ahora:

- `sequelize.authenticate()` → valida que las credenciales funcionen.
- `sequelize.sync()` → **crea las tablas** a partir de los modelos solos (en vez de escribir `CREATE TABLE` a mano). Si la tabla ya existe, la deja tal cual.

```javascript
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
    console.error('❌ Error al conectarse a MySQL:', error.message);
  }
}

iniciarServidor();
```

### 7. Crear el controller de Usuarios

Un **controller** agrupa la lógica de cada operación. Cada función recibe `req` (lo que llega al servidor) y `res` (la respuesta que devolvemos):

- `listar` → `Usuario.findAll()` devuelve todos.
- `obtener` → `findByPk()` busca por llave primaria (`id`).
- `crear` → `Usuario.create()` inserta un registro; responde `201`.
- `actualizar` → `findByPk` + `update()`.
- `eliminar` → `destroy()`.

Códigos de estado: `400` (petición inválida), `404` (no existe), `500` (error interno).

```javascript
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
```

### 8. Crear el controller de Productos

Es igual al de Usuarios, con dos diferencias:

- Al **listar** y **obtener** usamos `include: { model: Usuario, ... }` para que cada producto venga acompañado de los datos de su usuario (`Producto.Usuario`).
- Recibe un campo extra `usuarioId` (la llave foránea) al crear y actualizar.

```javascript
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
```

### 9. Crear las rutas del CRUD

Un **router** de Express asocia cada URL y verbo HTTP con la función del controller correspondiente. El `:id` es un parámetro variable que podemos leer con `req.params.id`.

```javascript
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
```

```javascript
// src/routes/producto.routes.js
const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');

router.get('/', productoController.listar);
router.get('/:id', productoController.obtener);
router.post('/', productoController.crear);
router.put('/:id', productoController.actualizar);
router.delete('/:id', productoController.eliminar);

module.exports = router;
```

### 10. Montar las rutas en la app

En `src/app.js` registramos ambos routers. Desde este momento, todo lo que entre por `/api/usuarios` y `/api/productos` se reparte según el verbo y el path:

```javascript
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
```

### 11. Resumen de los endpoints

| Método | URL | Acción |
|---|---|---|
| `GET` | `/api/usuarios` | Listar usuarios |
| `GET` | `/api/usuarios/:id` | Ver un usuario |
| `POST` | `/api/usuarios` | Crear usuario |
| `PUT` | `/api/usuarios/:id` | Actualizar usuario |
| `DELETE` | `/api/usuarios/:id` | Eliminar usuario |
| `GET` | `/api/productos` | Listar productos (con su usuario) |
| `GET` | `/api/productos/:id` | Ver un producto |
| `POST` | `/api/productos` | Crear producto |
| `PUT` | `/api/productos/:id` | Actualizar producto |
| `DELETE` | `/api/productos/:id` | Eliminar producto |

### 12. Levantar el servidor y probar con curl

```bash
npm run dev
```

Salida esperada:

```
✅ Conectado a MySQL
✅ Tablas sincronizadas
🚀 Servidor corriendo en http://localhost:3000
```

Pruebas de ejemplo:

```bash
# Crear un usuario
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana","email":"ana@test.com"}'

# Crear un producto asignado al usuario 1
curl -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Laptop","precio":1200.50,"descripcion":"Portátil","usuarioId":1}'

# Listar productos (vienen con los datos del usuario)
curl http://localhost:3000/api/productos

# Actualizar
curl -X PUT http://localhost:3000/api/productos/1 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Laptop Pro","precio":1500,"usuarioId":1}'

# Eliminar (borra en cascada los productos del usuario)
curl -X DELETE http://localhost:3000/api/usuarios/1
```

---

## Parte 4: Frontend conectado (axios)

En esta parte conectamos las páginas del frontend con la API del backend. Cuando creamos/editamos/eliminamos desde React, el frontend hace una petición HTTP a Express, y Express interactúa con la base de datos a través de Sequelize.

### 1. Instalar axios

axios es un cliente HTTP para JavaScript. Tiene una sintaxis más breve que el `fetch` nativo: `api.get()`, `api.post()`, etc.

```bash
cd frontend
npm install axios
```

### 2. Crear un servicio de API

Creamos `src/services/api.js` con una instancia de axios que ya trae la URL base del backend. Así, en los componentes basta con hacer `api.get('/usuarios')` sin repetir `http://localhost:3000/api`.

```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

export default api;
```

### 3. Crear la página `Usuarios.jsx`

Esta página hace el **CRUD completo de usuarios** desde el navegador:

- `useState` guarda el estado del formulario, la lista y el id en edición.
- `useEffect` carga la lista al montar el componente (la promesa de axios resuelve con `data`).
- `guardar` decide entre `POST` (crear) o `PUT` (editar) según `editandoId`.
- `editar` rellena el formulario con los datos del registro seleccionado.
- `eliminar` borra vía `DELETE` y recarga la lista.
- El botón **Cancelar** limpia el formulario y vuelve al modo "crear".

```jsx
// src/pages/Usuarios.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  async function cargarUsuarios() {
    const { data } = await api.get('/usuarios');
    setUsuarios(data);
  }

  useEffect(() => {
    api.get('/usuarios').then(({ data }) => setUsuarios(data));
  }, []);

  async function guardar(e) {
    e.preventDefault();
    if (editandoId) {
      await api.put(`/usuarios/${editandoId}`, { nombre, email });
    } else {
      await api.post('/usuarios', { nombre, email });
    }
    limpiarFormulario();
    cargarUsuarios();
  }

  function editar(usuario) {
    setEditandoId(usuario.id);
    setNombre(usuario.nombre);
    setEmail(usuario.email);
  }

  async function eliminar(id) {
    await api.delete(`/usuarios/${id}`);
    cargarUsuarios();
  }

  function limpiarFormulario() {
    setEditandoId(null);
    setNombre('');
    setEmail('');
  }

  return (
    <div style={{ padding: '30px' }}>
      <h1>Usuarios</h1>

      <form onSubmit={guardar} style={estilos.form}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={estilos.input}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={estilos.input}
        />
        <button type="submit" style={estilos.boton}>
          {editandoId ? 'Actualizar' : 'Crear'}
        </button>
        {editandoId && (
          <button type="button" onClick={limpiarFormulario} style={estilos.botonCancelar}>
            Cancelar
          </button>
        )}
      </form>

      <table style={estilos.tabla}>
        <thead>
          <tr>
            <th style={estilos.celda}>ID</th>
            <th style={estilos.celda}>Nombre</th>
            <th style={estilos.celda}>Email</th>
            <th style={estilos.celda}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td style={estilos.celda}>{usuario.id}</td>
              <td style={estilos.celda}>{usuario.nombre}</td>
              <td style={estilos.celda}>{usuario.email}</td>
              <td style={estilos.celda}>
                <button onClick={() => editar(usuario)} style={estilos.boton}>
                  Editar
                </button>
                <button onClick={() => eliminar(usuario.id)} style={estilos.botonEliminar}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const estilos = {
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  input: {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  boton: {
    padding: '8px 12px',
    backgroundColor: '#2d6cdf',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  botonCancelar: {
    padding: '8px 12px',
    backgroundColor: '#888',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  botonEliminar: {
    padding: '8px 12px',
    marginLeft: '5px',
    backgroundColor: '#d9534f',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  tabla: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  celda: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
    textAlign: 'left'
  }
};

export default Usuarios;
```

### 4. Crear la página `Productos.jsx`

Es similar a la de Usuarios, con dos diferencias clave:

- Tiene un `<select>` para elegir el **usuario dueño** del producto (el `usuarioId`).
- La tabla muestra el nombre del usuario gracias al `include` que hicimos en el controller (`producto.Usuario?.nombre`).

```jsx
// src/pages/Productos.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  async function cargarProductos() {
    const { data } = await api.get('/productos');
    setProductos(data);
  }

  useEffect(() => {
    api.get('/productos').then(({ data }) => setProductos(data));
    api.get('/usuarios').then(({ data }) => setUsuarios(data));
  }, []);

  async function guardar(e) {
    e.preventDefault();
    const datos = { nombre, precio, descripcion, usuarioId };
    if (editandoId) {
      await api.put(`/productos/${editandoId}`, datos);
    } else {
      await api.post('/productos', datos);
    }
    limpiarFormulario();
    cargarProductos();
  }

  function editar(producto) {
    setEditandoId(producto.id);
    setNombre(producto.nombre);
    setPrecio(producto.precio);
    setDescripcion(producto.descripcion || '');
    setUsuarioId(producto.usuarioId);
  }

  async function eliminar(id) {
    await api.delete(`/productos/${id}`);
    cargarProductos();
  }

  function limpiarFormulario() {
    setEditandoId(null);
    setNombre('');
    setPrecio('');
    setDescripcion('');
    setUsuarioId('');
  }

  return (
    <div style={{ padding: '30px' }}>
      <h1>Productos</h1>

      <form onSubmit={guardar} style={estilos.form}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={estilos.input}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          style={estilos.input}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          style={estilos.input}
        />
        <select
          value={usuarioId}
          onChange={(e) => setUsuarioId(e.target.value)}
          style={estilos.input}
        >
          <option value="">Selecciona un usuario</option>
          {usuarios.map((usuario) => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.nombre}
            </option>
          ))}
        </select>
        <button type="submit" style={estilos.boton}>
          {editandoId ? 'Actualizar' : 'Crear'}
        </button>
        {editandoId && (
          <button type="button" onClick={limpiarFormulario} style={estilos.botonCancelar}>
            Cancelar
          </button>
        )}
      </form>

      <table style={estilos.tabla}>
        <thead>
          <tr>
            <th style={estilos.celda}>ID</th>
            <th style={estilos.celda}>Nombre</th>
            <th style={estilos.celda}>Precio</th>
            <th style={estilos.celda}>Descripción</th>
            <th style={estilos.celda}>Usuario</th>
            <th style={estilos.celda}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td style={estilos.celda}>{producto.id}</td>
              <td style={estilos.celda}>{producto.nombre}</td>
              <td style={estilos.celda}>{producto.precio}</td>
              <td style={estilos.celda}>{producto.descripcion}</td>
              <td style={estilos.celda}>{producto.Usuario?.nombre || '-'}</td>
              <td style={estilos.celda}>
                <button onClick={() => editar(producto)} style={estilos.boton}>
                  Editar
                </button>
                <button onClick={() => eliminar(producto.id)} style={estilos.botonEliminar}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const estilos = {
  form: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '20px'
  },
  input: {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  boton: {
    padding: '8px 12px',
    backgroundColor: '#2d6cdf',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  botonCancelar: {
    padding: '8px 12px',
    backgroundColor: '#888',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  botonEliminar: {
    padding: '8px 12px',
    marginLeft: '5px',
    backgroundColor: '#d9534f',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  tabla: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  celda: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
    textAlign: 'left'
  }
};

export default Productos;
```

### 5. Activar las rutas en `App.jsx`

Ahora descomentamos las rutas de `Usuarios` y `Productos`. El `BrowserRouter` + `Routes` del navegador se encarga de mostrar la página correcta según la URL, y el `Navbar` ya tenía los enlaces `/usuarios` y `/productos` desde la Parte 2.

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Usuarios from './pages/Usuarios';
import Productos from './pages/Productos';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/productos" element={<Productos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### 6. Prueba final en el navegador

Con el backend y el frontend corriendo (ver "Cómo correr todo el proyecto" más abajo):

1. Ve a `http://localhost:5173/usuarios` y crea un usuario (por ejemplo, **Ana**).
2. Ve a `http://localhost:5173/productos` y crea un producto asignándoselo a **Ana**.
3. Verás que en la columna **Usuario** aparece el nombre de Ana.
4. Prueba **Editar** (el formulario se rellena y el botón cambia a "Actualizar") y **Eliminar**.
5. Si eliminas a Ana en `/usuarios`, sus productos se borran automáticamente gracias al `CASCADE` que definimos en la asociación.

---

## Cómo correr todo el proyecto (día a día)

Se necesitan **dos terminales abiertas al mismo tiempo**:

| Terminal | Carpeta | Comando | URL |
|---|---|---|---|
| 1 | `backend/` | `npm run dev` | http://localhost:3000 |
| 2 | `frontend/` | `npm run dev` | http://localhost:5173 |

El frontend consume al backend mediante peticiones HTTP (`fetch` o `axios`), y `cors` en el backend permite que ambos puertos se comuniquen sin bloqueos del navegador.

---

## Próximos pasos (sugerencias de mejora)

El CRUD básico ya está funcionando. Algunas mejoras sugeridas para continuar aprendiendo:

1. **Migraciones con `sequelize-cli`**: reemplazar `sequelize.sync()` por migraciones versionadas, como se haría en un proyecto real de equipo.
2. **Validaciones y manejo de errores**: crear un middleware de Express que detecte errores y devuelva respuestas uniformes (evitar que se filtre `error.message` de la base de datos).
3. **Autenticación**: agregar registro y login con contraseñas hasheadas (`bcrypt`) y tokens `JWT`, protegiendo las rutas del CRUD.
4. **Estilos**: darle una capa visual con un framework de CSS (Bootstrap, Tailwind, etc.) o un CSS Modules por página.
5. **URL base configurable del frontend**: usar una variable de entorno (Vite `VITE_API_URL`) y el proxy de Vite para no apuntar siempre a `http://localhost:3000`.
6. **Paginación**: limitar el número de registros devueltos por `findAll()` con `limit` y `offset`.
7. **Filtros y búsqueda**: por ejemplo, obtener los productos de un solo usuario con `GET /api/usuarios/:id/productos`.