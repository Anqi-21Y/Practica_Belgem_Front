import React, { useState, useEffect } from "react";
import { Eye, Edit2, Trash2, Search, Menu, Bell, User, X, AlertCircle, Plus } from 'lucide-react';
import './representantes.css';
import RepresentanteService, { mapRepresentanteFromBackend } from '../services/RepresentanteService';

export default function ListaRepresentantes() {
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [representantes, setRepresentantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    codigo_interno: '',
    nombre: '',
    telefono: '',
    email: '',
    zona: '',
    comision: ''
  });

  // Cargar representantes al inicio
  useEffect(() => {
    cargarRepresentantes();
  }, []);

  const cargarRepresentantes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await RepresentanteService.listarRepresentantes();
      const representantesMapeados = data.map(mapRepresentanteFromBackend);
      setRepresentantes(representantesMapeados);
    } catch (err) {
      setError('Error al cargar representantes: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRepresentantes = representantes.filter(rep =>
    rep.nombre.toLowerCase().includes(search.toLowerCase()) ||
    rep.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleView = async (id) => {
    try {
      const data = await RepresentanteService.obtenerRepresentantePorId(id);
      const rep = mapRepresentanteFromBackend(data);
      alert(`Ver representante:\n\nID: ${rep.id}\nCódigo Interno: ${rep.codigo_interno}\nNombre: ${rep.nombre}\nEmail: ${rep.email}\nZona: ${rep.zona}\nTeléfono: ${rep.telefono}\nComisión: ${rep.comision}`);
    } catch (err) {
      alert('Error al obtener representante: ' + err.message);
    }
  };

  const handleEdit = (id) => {
    const rep = representantes.find(r => r.id === id);
    setFormData({
      codigo_interno: rep.codigo_interno,
      nombre: rep.nombre,
      telefono: rep.telefono || '',
      email: rep.email,
      zona: rep.zona,
      comision: rep.comision
    });
    setEditingId(rep.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este representante?')) {
      try {
        await RepresentanteService.eliminarRepresentante(id);
        alert('Representante eliminado correctamente');
        await cargarRepresentantes();
      } catch (err) {
        alert('Error al eliminar: ' + err.message);
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.codigo_interno) {
      alert('Por favor completa los campos obligatorios (Nombre y Código Interno)');
      return;
    }
    
    try {
      if (editingId) {
        await RepresentanteService.actualizarRepresentante(editingId, formData);
        alert('Representante actualizado correctamente');
      } else {
        await RepresentanteService.crearRepresentante(formData);
        alert('Representante creado correctamente');
      }
      
      await cargarRepresentantes();
      setFormData({ codigo_interno: '', nombre: '', telefono: '', email: '', zona: '', comision: '' });
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      alert('Error al guardar: ' + err.message);
    }
  };

  const handleNew = () => {
    setFormData({
      codigo_interno: '',
      nombre: '',
      telefono: '',
      email: '',
      zona: '',
      comision: ''
    });
    setEditingId(null);
    setShowForm(true);
  };

  const ErrorAlert = ({ message }) => (
    <div style={{
      backgroundColor: '#fee2e2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      padding: '12px 16px',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      color: '#dc2626'
    }}>
      <AlertCircle size={20} />
      <span>{message}</span>
    </div>
  );

  const LoadingSpinner = () => (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #e5e7eb',
        borderTop: '4px solid #4f46e5',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto'
      }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      <p style={{ marginTop: '16px', color: '#6b7280' }}>Cargando...</p>
    </div>
  );

  if (loading && representantes.length === 0) {
    return (
      <div className="layout_Repre">
        <div className="main">
          <div className="content">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout_Repre">
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
            <button className="btn-green" onClick={handleNew}>
              <Plus size={20} style={{ marginRight: '8px' }} />
              Nuevo Representante
            </button>
          </div>

          {error && <ErrorAlert message={error} />}

          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por nombre o email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Código Interno</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Zona</th>
                  <th>Comisión</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredRepresentantes.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
                      No se encontraron representantes
                    </td>
                  </tr>
                ) : (
                  filteredRepresentantes.map(rep => (
                    <tr key={rep.id}>
                      <td>{rep.codigo_interno}</td>
                      <td>{rep.nombre}</td>
                      <td>{rep.email}</td>
                      <td>{rep.telefono}</td>
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
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Modal */}
          {showForm && (
            <div className="modal-overlay">
              <div className="modal">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2>{editingId ? "Editar Representante" : "Nuevo Representante"}</h2>
                  <button 
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                    }} 
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleFormSubmit} className="form-grid">
                  <label>Código Interno *</label>
                  <input 
                    name="codigo_interno" 
                    value={formData.codigo_interno} 
                    onChange={handleInputChange} 
                    required 
                    disabled={!!editingId}
                    placeholder="Ej: REP001"
                  />

                  <label>Nombre Completo *</label>
                  <input 
                    name="nombre" 
                    value={formData.nombre} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Ej: Carlos Mendoza"
                  />

                  <label>Teléfono *</label>
                  <input 
                    name="telefono" 
                    value={formData.telefono} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Ej: +34 600 123 456"
                  />

                  <label>Email *</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Ej: carlos@belgem.com"
                  />

                  <label>Zona *</label>
                  <input 
                    name="zona" 
                    value={formData.zona} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Ej: Barcelona"
                  />

                  <label>Comisión</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    name="comision" 
                    value={formData.comision} 
                    onChange={handleInputChange}
                    placeholder="Ej: 12.50"
                  />

                  <div className="form-buttons">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => {
                        setShowForm(false);
                        setEditingId(null);
                      }}
                    >
                      Cancelar
                    </button>

                    <button type="submit" className="btn-blue">
                      {editingId ? 'Actualizar' : 'Guardar'} Representante
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