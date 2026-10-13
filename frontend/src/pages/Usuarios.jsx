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
