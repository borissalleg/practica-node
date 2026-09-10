# Manual: Backend con Node/Express/MySQL + Frontend con React

Este manual documenta paso a paso cómo se armó el proyecto hasta el momento: un backend en Node.js/Express conectado a MySQL, y un frontend en React con navegación (Navbar + rutas).

---

## Estructura final del proyecto

```
practica-node/
├── backend/
│   ├── node_modules/
│   ├── src/
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

### 4. Crear la base de datos en MySQL

```sql
CREATE DATABASE tienda_db;
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

## Cómo correr todo el proyecto (día a día)

Se necesitan **dos terminales abiertas al mismo tiempo**:

| Terminal | Carpeta | Comando | URL |
|---|---|---|---|
| 1 | `backend/` | `npm run dev` | http://localhost:3000 |
| 2 | `frontend/` | `npm run dev` | http://localhost:5173 |

El frontend consume al backend mediante peticiones HTTP (`fetch` o `axios`), y `cors` en el backend permite que ambos puertos se comuniquen sin bloqueos del navegador.

---

## Próximos pasos (pendientes)

1. Agregar **Sequelize** en el backend y crear los modelos `Usuario` y `Producto` con relación uno a muchos.
2. Crear las migraciones y generar las tablas reales en MySQL.
3. Construir los controllers y las rutas del CRUD (`GET`, `POST`, `PUT`, `DELETE`) para ambos modelos.
4. Conectar las páginas `Usuarios.jsx` y `Productos.jsx` del frontend con esos endpoints (formularios y tablas).