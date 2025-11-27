import React, { useState } from "react";
import { Eye, Edit2, Trash2, Search } from 'lucide-react';
import {  Menu, Bell, User } from 'lucide-react';
import './representantes.css';


export default function ListaRepresentantes() {

  //Inicializar el estado del cuadro de búsqueda a una cadena vacía
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  //datos de la lista(iniciar la lista y guardar todos los datos de repres)
  const[representantes , setRepresentantes ] = useState([
    {
      id : '1',
      nombre : 'Carlos Mendoza',
      email :'carlos@belgem.com',
      zona : 'Barcelona',
      comision : '12.50'
    },

    {
      id : '2',
      nombre: 'Juan Pérez García',
      email: 'juan.perez@empresa.com',
      zona: 'Madrid',
      comision: '5.50'
    },

    {
      id : '3',
      nombre: 'María López Martínez',
      email: 'maria.lopez@empresa.com',
      zona: 'Tarragona',
      comision: '6.00'
    },

    {
      id : '4',
      nombre: 'Ana Fernández Torres',
      email: 'ana.fernandez@empresa.com',
      zona: 'Valencia',
      comision: '5.25'
    },

    {
      id : '5',
      nombre: 'María López Martínez',
      email: 'maria.lopez@empresa.com',
      zona: 'Aragón',
      comision: '5.25'
    },

  ]);

  //Activa de la lista
  const [formData ,  setFormData] = useState({
    id : '',
    nombre : '',
    email : '',
    zona : '',
    comision : ''
  });

  //Control form 
  //Esto indica que el formulario está inicialmente oculto
  // y solo aparece cuando el usuario hace clic en "+ Nuevo Representante" o en el botón de edición.
  const[showForm , setShowForm ] = useState(false);

  const filteredRepresentantes = representantes.filter(rep =>
    rep.nombre.toLowerCase().includes(search.toLowerCase()) ||
    rep.email.toLowerCase().includes(search.toLowerCase())
  );

  // Ver la lógica del botón representativo
  const handleView = (id) => {
    const rep = representantes.find(r => r.id === id);
    alert(`Ver representante : \nID : ${rep.id}\nNombre : ${rep.nombre}`);
  };

  // Edita la lógica del botón
  // Al hacer clic en el botón "Editar", los datos representativos seleccionados se introducen en el formulario y 
  // este se muestra para su modificación.
  const handleEdit = (id) =>{
    const rep = representantes.find(r => r.id ===id);
    setFormData(rep);
    setShowForm(true);
  };


  const handleDelete = (id) => {
    if(window.confirm('¿ Estás seguro de eliminar este representante ?')){
      setRepresentantes(representantes.filter(rep => rep.id !== id));
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const handleFormSubmit = (e) =>{
    e.preventDefault();
    const exists = representantes.find(r =>r.id === formData.id);

    if(exists){
      setRepresentantes(representantes.map(r => r.id === formData.id ? formData : r));
    }else{
      setRepresentantes([
        ...representantes,
        formData
      ]);
    }
    setFormData({ id: '', nombre: '', email: '', zona: '', comision: '' });
    setShowForm(false);
  };

  const handleNew = () => {
    setFormData({
    id : '',
    nombre : '',
    email : '',
    zona : '',
    comision : ''
    });
    setShowForm(true);
  };

    // estilos locales para que la lupa sea igual que Articulos
     const styles = `
    /* Contenedor central (igual que la tarjeta de Artículos) */
    .page-card {
      max-width: 980px; /* CAMBIO: ancho de la 'card' principal; ajústalo si quieres */
      margin: 0 auto;   /* CAMBIO: centra todo */
      padding: 24px;    /* espacio interior similar a Artículos */
    }

    /* Toolbar: buscador + botón (responsive) */
    .toolbar {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
      margin-bottom: 1rem;
    }
    @media (min-width: 640px) {
      .toolbar {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }

    /* Search: reproduce exactamente la lupa de Artículos */
    .search-container {
      position: relative;
      width: 100%;
      max-width: 600px; /* CAMBIO: controla ancho del input, ajústalo */
    }
    @media (min-width: 640px) {
      .search-container { width: 60%; } /* en pantallas >=640px ocupa 60% del page-card */
    }

    .search-icon {
      position: absolute;
      left: 0.75rem; /* same as left-3 */
      top: 50%;
      transform: translateY(-50%);
      color: #9ca3af; /* gray-400 */
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: 0.6rem 1rem 0.6rem 2.5rem; /* pl-10 pr-4 py-2 -> control de altura */
      border: 1px solid #e6e6e6; /* ligero */
      border-radius: 10px; /* rounded-lg más suave */
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
      transition: border-color 0.15s, box-shadow 0.15s;
      font-size: 14px;
      background-color: #fff;
      outline: none;
    }
    .search-input:focus {
      border-color: #4f46e5; /* morado */
      box-shadow: 0 8px 20px rgba(79,70,229,0.06);
    }

    /* Botón nuevo: igual color y tamaño que Artículos */
    .btn-new {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 8px 16px;
      border-radius: 10px;
      background-color: #4f46e5; /* morado igual que Artículos */
      color: white;
      border: none;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(79,70,229,0.12);
      white-space: nowrap;
    }

    /* Card para la tabla: sombra/rounded igual que Artículos */
    .table-card {
      background-color: #fff;
      border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.08);
      overflow: hidden;
      margin-top: 8px;
    }

    .table-card table {
      width: 100%;
      border-collapse: collapse;
    }

    .table-card thead {
      background-color: #f9fafb;
      border-bottom: 1px solid #eaeaea;
    }

    .table-card th, .table-card td {
      padding: 14px 18px;
      text-align: left;
      font-size: 14px;
    }

    .table-card tbody tr:nth-child(odd) td {
      background: transparent;
    }

    .action-buttons { display:flex; gap:8px; justify-content:flex-end; }
    .btn-action { border-radius:6px; padding:8px; border:none; background:#f3f4f6; cursor:pointer; }
  `;

  return (
    

    <div className="layout_Repre">
      <style>{styles}</style>

      {/* MAIN */}
      <div className="main">
        <header className="header">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="icon-btn">
            <Menu size={24} />
          </button>

          <div className="header-right">
            <button className="icon-btn notification">
              <Bell size={20} />
              <span className="dot"></span>
            </button>
            <button className="icon-btn">
              <User size={20} />
            </button>
          </div>
        </header>

        <main className="content">
          <div className="content-header">

            <h1>Listado de Representantes</h1>
          </div>

          {/* Search */}
          {/* PAGE-CARD centra la zona (igual a Artículos) */}
          <div className="page-card"></div>

          {/* TOOLBAR contiene buscador y botón alineado como Artículos */}
          <div className="toolbar">
            <div className="search-container">
              {/* Icono lupa con posición absoluta */}
              <Search className="search-icon" />
              {/* Input con la clase .search-input (nuevo estilo) */}
              <input
                type="text"
                placeholder="Buscar por nombre o email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Boton nuevo a la derecha en desktop (queda debajo en mobile) */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn-new" onClick={handleNew}>+ Nuevo Representante</button>
              </div>
            </div>
          


          {/* Table */}
          <div className="table-container">
          <div className="table-card">

            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Zona</th>
                  <th>Comisión</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredRepresentantes.map(rep => (
                  <tr key={rep.id}>
                    <td>{rep.nombre}</td>
                    <td>{rep.email}</td>
                    <td>{rep.zona}</td>
                    <td>{rep.comision}</td>
                    <td>
                      <button className="btn-action blue" onClick={() => handleView(rep.id)}>
                        <Eye size={18} />
                      </button>
                      <button className="btn-action yellow" onClick={() => handleEdit(rep.id)}>
                        <Edit2 size={18} />
                      </button>
                      <button className="btn-action red" onClick={() => handleDelete(rep.id)}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            {filteredRepresentantes.length === 0 && (
              <div className="no-data">No se encontraron representantes</div>
            )}
          </div>

          {/* Modal */}
          {showForm && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>{formData.id ? "Editar Representante" : "Nuevo Representante"}</h2>

                <form onSubmit={handleFormSubmit} className="form-grid">
                  <label>ID Empleado</label>
                  <input name="id" value={formData.id} onChange={handleInputChange} required />

                  <label>Nombre Completo</label>
                  <input name="nombre" value={formData.nombre} onChange={handleInputChange} required />

                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />

                  <label>Zona</label>
                  <input name="zona" value={formData.zona} onChange={handleInputChange} required />

                  <label>Comisión</label>
                  <input name="comision" value={formData.comision} onChange={handleInputChange} required />

                  <div className="form-buttons">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => setShowForm(false)}
                    >
                      Cancelar
                    </button>

                    <button type="submit" className="btn-blue">
                      Guardar Representante
                    </button>
                  </div>
                </form>

              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}