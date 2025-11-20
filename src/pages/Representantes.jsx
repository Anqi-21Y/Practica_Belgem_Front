import React, { useState } from "react";
import { Eye, Edit2, Trash2, Search } from 'lucide-react';


export default function ListaRepresentantes() {

  //Inicializar el estado del cuadro de búsqueda a una cadena vacía
  const [search, setSearch] = useState('');

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
      comision: '5.25%'
    },

    {
      id : '5',
      nombre: 'María López Martínez',
      email: 'maria.lopez@empresa.com',
      zona: 'Aragón',
      comision: '5.25%'
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

  const fielteredRepresentantes = setRepresentantes.filter(rep => 
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
      setRepresentantes(representantes.filter(rep => rep.id !=id));
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



  return (
    <div className="container">

      // parte de search
      <div className="header">
        <h1>Listado de Representantes</h1>
        <button className="btn_nuevo" onClick={handleNew}> + Nuevo Representante</button>
      </div>


      <div className="search">
        <search className="icon_search" />
        <input type="text" placeholder="Buscar por nombre o email" value={search} onChange={(e) => setSearch(e.target.value)} className="search_input"/>
      </div>

      <table className="tabla_representantes">
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
          {fielteredRepresentantes.map(rep => (
            <tr key={rep.id}>
              <td>{rep.nombre}</td>
              <td>{rep.email}</td>
              <td>{rep.zona}</td>
              <td>{rep.comision}</td>
              <td>
                <button onClick={() => handleView(rep.id)} title="Ver"><Eye size={18} /></button>
                <button onClick={() => handleEdit(rep.id)} title="Editar"><Edit2 size={18} /></button>
                <button onClick={() => handleDelete(rep.id)} title="Eliminar"><Trash2 size={18} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredRepresentantes.length === 0 && <div className="no-results">No se encontraron representantes</div>}


      {showForm && (
        <div className="form-container">
          <h2>{formData.id ? 'Editar Representante' : 'Nuevo Representante'}</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label>ID Empleado:</label>
              <input type="text" name="id" value={formData.id} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Nombre Completo:</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Zona:</label>
              <input type="text" name="zona" value={formData.zona} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Comisión:</label>
              <input type="text" name="comision" value={formData.comision} onChange={handleInputChange} required />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-guardar">Guardar</button>
              <button type="button" className="btn-cancelar" onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
      
    </div>
  );
}
