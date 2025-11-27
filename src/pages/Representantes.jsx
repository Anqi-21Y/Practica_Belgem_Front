import React, { useState, useEffect } from "react";
import { Eye, Edit2, Trash2, Search, Home, Package, Users, DollarSign, Menu, Bell, User, Plus, X, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Configuración de la API
const API_BASE_URL = 'http://localhost:8080/representantes';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json'
});

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
};

// Servicio de Representantes integrado
const RepresentantesService = {
  listarRepresentantes: async () => {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: getHeaders()
    });
    return await handleResponse(response);
  },

  obtenerRepresentantePorId: async (id) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return await handleResponse(response);
  },

  crearRepresentante: async (representanteData) => {
    const requestBody = {
      internalCode: representanteData.codigo_interno,
      name: representanteData.nombre,
      phone: representanteData.telefono || '',
      email: representanteData.email || '',
      zone: representanteData.zona || '',
      commission: Number(representanteData.comision) || 0
    };


    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(requestBody)
    });
    
    return await handleResponse(response);
  },

  actualizarRepresentante: async (id, representanteData) => {
    const requestBody = {
      name: representanteData.nombre,
      phone: representanteData.telefono || '',
      email: representanteData.email || '',
      zone: representanteData.zona || '',
      commission: Number(representanteData.comision) || 0
    };


    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(requestBody)
    });
    
    return await handleResponse(response);
  },

  eliminarRepresentante: async (id) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    return await handleResponse(response);
  }
};

// Mapeo de respuesta del backend a formato frontend
const mapRepresentanteFromBackend = (representante) => {
  if (!representante) return null;
  
  return {
    id: representante.idRepresentante,
    codigo_interno: representante.codigoInterno,
    nombre: representante.nombre,
    telefono: representante.telefono,
    email: representante.email,
    zona: representante.zona,
    comision: representante.comision
  };
};

export default function ListaRepresentantes() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [representantes, setRepresentantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [selectedRep, setSelectedRep] = useState(null);

  const [formData, setFormData] = useState({
    id: '',
    codigo_interno: '',
    nombre: '',
    telefono: '',
    email: '',
    zona: '',
    comision: ''
  });

  useEffect(() => {
    cargarRepresentantes();
  }, []);

  const cargarRepresentantes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await RepresentantesService.listarRepresentantes();
      const representantesMapeados = data.map(mapRepresentanteFromBackend);
      setRepresentantes(representantesMapeados);
    } catch (err) {
      setError('Error al cargar representantes: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (rep) => {
    setLoading(true);
    setError(null);
    try {
      const data = await RepresentantesService.obtenerRepresentantePorId(rep.id);
      const repMapeado = mapRepresentanteFromBackend(data);
      setSelectedRep(repMapeado);
      setViewMode('view');
    } catch (err) {
      setError('Error al obtener representante: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rep) => {
    setFormData(rep);
    setSelectedRep(rep);
    setViewMode('form');
  };

  const handleDelete = async (id) => {
    const rep = representantes.find(r => r.id === id);
    if (window.confirm(`¿Estás seguro de eliminar el representante "${rep.nombre}"?`)) {
      setLoading(true);
      setError(null);
      try {
        await RepresentantesService.eliminarRepresentante(id);
        alert(`Representante "${rep.nombre}" eliminado correctamente`);
        await cargarRepresentantes();
        if (selectedRep?.id === id) {
          handleCancel();
        }
      } catch (err) {
        setError('Error al eliminar: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNew = () => {
    setFormData({
      id: '',
      codigo_interno: '',
      nombre: '',
      telefono: '',
      email: '',
      zona: '',
      comision: ''
    });
    setSelectedRep(null);
    setViewMode('form');
  };

  const handleFormSubmit = async () => {
    if (!formData.nombre || !formData.codigo_interno) {
      alert('Por favor completa los campos obligatorios (Nombre y Código Interno)');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      if (selectedRep) {
        await RepresentantesService.actualizarRepresentante(selectedRep.id, formData);
        alert('Representante actualizado correctamente');
      } else {
        await RepresentantesService.crearRepresentante(formData);
        alert('Representante creado correctamente');
      }
      
      await cargarRepresentantes();
      setViewMode('list');
      setSelectedRep(null);
    } catch (err) {
      setError('Error al guardar: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedRep(null);
    setError(null);
  };

  const filteredRepresentantes = representantes.filter(
    (rep) =>
      rep.nombre.toLowerCase().includes(search.toLowerCase()) ||
      rep.email.toLowerCase().includes(search.toLowerCase())
  );

  const viewFields = [
    { label: "ID", key: "id" },
    { label: "Código Interno", key: "codigo_interno" },
    { label: "Email", key: "email" },
    { label: "Teléfono", key: "telefono" },
    { label: "Zona", key: "zona" },
    { label: "Comisión", key: "comision" }
  ];

  const placeholders = {
    codigo_interno: "REP001",
    nombre: "Carlos Mendoza",
    email: "carlos@belgem.com",
    telefono: "+34 600 123 456",
    zona: "Barcelona",
    comision: "12.50"
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

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f9fafb", fontFamily: "system-ui" }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? "256px" : "80px",
        backgroundColor: "#312e81",
        color: "white",
        transition: "width 0.3s",
        display: "flex",
        flexDirection: "column"
      }}>
        <div style={{
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #4338ca"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "32px",
              height: "32px",
              backgroundColor: "white",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <span style={{ color: "#312e81", fontWeight: "bold", fontSize: "14px" }}>A</span>
            </div>
            {sidebarOpen && <span style={{ fontWeight: "600" }}>Admin Portal</span>}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ padding: "4px", background: "transparent", border: "none", color: "white", cursor: "pointer", borderRadius: "4px" }}>
            <Menu size={20} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '16px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none', color: 'white' }}>
            <Home size={20} />
            {sidebarOpen && <span>Home</span>}
          </Link>

          <Link to="/clientes" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "8px", textDecoration: "none", color: "white", marginBottom: "8px" }}>
            <Users size={20} /> {sidebarOpen && <span>Clientes</span>}
          </Link>

          <Link to="/articulos" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "8px", textDecoration: "none", color: "white", marginBottom: "8px" }}>
            <Package size={20} /> {sidebarOpen && <span>Artículos</span>}
          </Link>

          <Link to="/representantes" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', backgroundColor: '#4338ca', textDecoration: 'none', color: 'white' }}>
            <Users size={20} /> {sidebarOpen && <span>Representantes</span>}
          </Link>

          <Link to="/divisas" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "8px", textDecoration: "none", color: "white", marginBottom: "8px" }}>
            <DollarSign size={20} />
            {sidebarOpen && <span>Divisas</span>}
          </Link>
        </nav>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{
          backgroundColor: "white",
          borderBottom: "1px solid #e5e7eb",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {viewMode !== "list" && (
              <button onClick={handleCancel} style={{ padding: "8px", background: "transparent", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            )}
            <h1 style={{ fontSize: "24px", fontWeight: "600", color: "#1f2937", margin: 0 }}>
              {viewMode === "list"
                ? "Representantes"
                : viewMode === "view"
                  ? selectedRep?.nombre
                  : "Formulario de Representante"}
            </h1>
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <button style={{ padding: "8px", background: "transparent", border: "none", cursor: "pointer", position: "relative" }}>
              <Bell size={20} />
              <span style={{ position: "absolute", top: "4px", right: "4px", width: "8px", height: "8px", backgroundColor: "#ef4444", borderRadius: "50%" }} />
            </button>
            <button style={{ padding: "8px", background: "transparent", border: "none", cursor: "pointer" }}>
              <User size={20} />
            </button>
          </div>
        </header>

        <div style={{ flex: 1, overflow: "auto", padding: "24px"}}>
          {error && viewMode === 'list' && <ErrorAlert message={error} />}
          
          {loading && viewMode === 'list' ? (
            <LoadingSpinner />
          ) : viewMode === "list" ? (
            <div style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <div style={{ padding: "24px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ position: "relative", flexGrow: 1, minWidth: '250px' }}>
                  <Search size={20} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                  <input
                    type="text"
                    placeholder="Buscar representantes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ paddingLeft: "40px", padding: "8px 16px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", width: "100%", boxSizing: 'border-box' }}
                  />
                </div>

                <button
                  onClick={handleNew}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "#4f46e5",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "500",
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Plus size={20} />
                  Nuevo Representante
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: '900px' }}>
                  <thead style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                    <tr>
                      {["Código Interno", "Nombre", "Email", "Teléfono", "Zona", "Comisión", "Acciones"].map((h) => (
                        <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: "#6b7280", textTransform: "uppercase" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRepresentantes.length > 0 ? (
                      filteredRepresentantes.map((rep) => (
                        <tr key={rep.id} onClick={() => handleView(rep)}
                          style={{ borderBottom: "1px solid #e5e7eb", cursor: 'pointer', transition: 'background-color 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <td style={{ padding: "16px 24px", fontWeight: '500' }}>{rep.codigo_interno}</td>
                          <td style={{ padding: "16px 24px", fontWeight: "500" }}>{rep.nombre}</td>
                          <td style={{ padding: "16px 24px" }}>{rep.email}</td>
                          <td style={{ padding: "16px 24px" }}>{rep.telefono}</td>
                          <td style={{ padding: "16px 24px" }}>{rep.zona}</td>
                          <td style={{ padding: "16px 24px" }}>{rep.comision}</td>
                          <td style={{ padding: "16px 24px" }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button onClick={() => handleView(rep)} style={{ padding: "8px", color: "#059669", background: "transparent", border: "none", cursor: "pointer" }} title="Ver">
                                <Eye size={16} />
                              </button>
                              <button onClick={() => handleEdit(rep)} style={{ padding: "8px", color: "#4f46e5", background: "transparent", border: "none", cursor: "pointer" }} title="Editar">
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => handleDelete(rep.id)} style={{ padding: "8px", color: "#dc2626", background: "transparent", border: "none", cursor: "pointer" }} title="Eliminar">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} style={{ padding: "32px", textAlign: "center", color: "#6b7280" }}>
                          No se encontraron representantes
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : viewMode === "view" && selectedRep ? (
            <div style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", padding: "32px", maxWidth: "896px" }}>
              {loading ? <LoadingSpinner /> : (
                <>
                  <div style={{ marginBottom: "24px", paddingBottom: "24px", borderBottom: "2px solid #e5e7eb" }}>
                    <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>{selectedRep.nombre}</h2>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                    {viewFields.map(({ label, key }) => (
                      <div key={key}>
                        <h3 style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", marginBottom: "8px" }}>
                          {label}
                        </h3>
                        <p style={{ fontSize: "16px", margin: 0 }}>{selectedRep[key] || '-'}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "32px", paddingTop: "24px", borderTop: "1px solid #e5e7eb" }}>
                    <button onClick={handleCancel} style={{ padding: "8px 24px", border: "1px solid #d1d5db", borderRadius: "8px", color: '#374151', backgroundColor: "white", cursor: "pointer", fontWeight: "500" }}>
                      Volver
                    </button>
                    <button onClick={() => handleEdit(selectedRep)} style={{ padding: "8px 24px", backgroundColor: "#4f46e5", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "500" }}>
                      Editar
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", padding: "32px", maxWidth: "800px"}}>
              {error && <ErrorAlert message={error} />}
              
              <div style={{ display: "grid", gap: "16px" }}>
                {["codigo_interno", "nombre", "email", "telefono", "zona", "comision"].map((field) => (
                  <div key={field}>
                    <label style={{ fontWeight: "700", fontSize: "14px", marginBottom: "4px", display: "block" }}>
                      {field === 'codigo_interno' ? 'Código Interno' : field.charAt(0).toUpperCase() + field.slice(1)}
                      {(field === 'codigo_interno' || field === 'nombre') && ' *'}
                    </label>
                    <input
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      disabled={loading || (field === 'codigo_interno' && selectedRep)}
                      placeholder={placeholders[field]}
                      style={{ 
                        width: "80%",
                        maxWidth:"600px", 
                        padding: "8px 16px", 
                        borderRadius: "8px", 
                        border: "1px solid #d1d5db", 
                        outline: "none",
                        backgroundColor: (loading || (field === 'codigo_interno' && selectedRep)) ? '#f3f4f6' : 'white'
                      }}
                    />
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
                  <button 
                    onClick={handleCancel}
                    disabled={loading}
                    style={{ 
                      padding: "8px 24px", 
                      border: "1px solid #d1d5db", 
                      borderRadius: "8px", 
                      backgroundColor: "transparent", 
                      cursor: loading ? 'not-allowed' : "pointer", 
                      fontWeight: "500",
                      opacity: loading ? 0.6 : 1
                    }}
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleFormSubmit}
                    disabled={loading}
                    style={{ 
                      padding: "8px 24px", 
                      backgroundColor: "#4f46e5", 
                      color: "white", 
                      border: "none", 
                      borderRadius: "8px", 
                      cursor: loading ? 'not-allowed' : "pointer", 
                      fontWeight: "500",
                      opacity: loading ? 0.6 : 1
                    }}
                  >
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}