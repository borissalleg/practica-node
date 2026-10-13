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