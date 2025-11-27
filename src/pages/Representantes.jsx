import React, { useState, useEffect } from "react";
import RepresentanteService from '../services/RepresentanteService';

import { Eye, Edit2, Trash2, Search, Home, Package, Users, DollarSign, Menu, Bell, User, Plus, X, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// ConfiguraciÃ³n de la API
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
  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // search
  const [search, setSearch] = useState("");

  // datos de la lista
  const [representantes, setRepresentantes] = useState([]);

  // loading y error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // list | view | form
  const [viewMode, setViewMode] = useState("list");
  const [selectedRep, setSelectedRep] = useState(null);

  // form data
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    zone: "",
    internalCode: "",
    commission: ""
  });

  // Cargar representantes al montar el componente
  useEffect(() => {
    cargarRepresentantes();
  }, []);

  // FunciÃ³n para cargar todos los representantes
  const cargarRepresentantes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await RepresentanteService.listarRepresentantes();
      setRepresentantes(data);
    } catch (err) {
      console.error('Error al cargar representantes:', err);
      setError('No se pudieron cargar los representantes');
    } finally {
      setLoading(false);
    }
  };

  // search
  const filteredRepresentantes = representantes.filter(
    (rep) =>
      rep.name.toLowerCase().includes(search.toLowerCase()) ||
      rep.email.toLowerCase().includes(search.toLowerCase()) ||
      rep.internalCode.toLowerCase().includes(search.toLowerCase())
  );

  // view
  const handleView = (rep) => {
    setSelectedRep(rep);
    setViewMode("view");
  };

  // editar
  const handleEdit = (rep) => {
    setFormData({
      name: rep.name || "",
      phone: rep.phone || "",
      email: rep.email || "",
      zone: rep.zone || "",
      internalCode: rep.internalCode || "",
      commission: rep.commission || ""
    });
    setSelectedRep(rep);
    setViewMode("form");
  };

  // eliminar
  const handleDelete = async (id) => {
    if (window.confirm("Â¿EstÃ¡s seguro de eliminar este representante?")) {
      try {
        setLoading(true);
        await RepresentanteService.eliminarRepresentante(id);
        await cargarRepresentantes();

        // Si estÃ¡bamos viendo ese representante, volver a la lista
        if (selectedRep?.id === id) {
          handleCancel();
        }
      } catch (err) {
        console.error('Error al eliminar representante:', err);
        alert('Error al eliminar el representante: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    }
  };

  // input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // crear nuevo
  const handleNew = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      zone: "",
      internalCode: "",
      commission: ""
    });
    setSelectedRep(null);
    setViewMode("form");
  };

  // guardar (crear o actualizar)
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validaciones bÃ¡sicas
    if (!formData.name || !formData.phone || !formData.zone || !formData.internalCode) {
      alert("Por favor complete todos los campos obligatorios (nombre, telÃ©fono, zona, cÃ³digo interno)");
      return;
    }

    try {
      setLoading(true);

      // Preparar datos para enviar al backend
      const dataToSend = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        zone: formData.zone,
        internalCode: formData.internalCode,
        commission: formData.commission ? Number(formData.commission) : null
      };

      if (selectedRep) {
        // Actualizar representante existente
        await RepresentanteService.actualizarRepresentante(selectedRep.id, dataToSend);
      } else {
        // Crear nuevo representante
        await RepresentanteService.crearRepresentante(dataToSend);
      }

      // Recargar lista y volver a la vista de lista
      await cargarRepresentantes();
      setFormData({
        name: "",
        phone: "",
        email: "",
        zone: "",
        internalCode: "",
        commission: ""
      });
      setViewMode("list");
      setSelectedRep(null);
    } catch (err) {
      console.error('Error al guardar representante:', err);
      alert('Error al guardar el representante: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // cancel
  const handleCancel = () => {
    setViewMode("list");
    setSelectedRep(null);
    setFormData({
      name: "",
      phone: "",
      email: "",
      zone: "",
      internalCode: "",
      commission: ""
    });
  };

  const viewFields = [
    { label: "ID", key: "id" },
    { label: "Código Interno", key: "internalCode" },
    { label: "Teléfono", key: "phone" },
    { label: "Email", key: "email" },
    { label: "Zona", key: "zone" },
    { label: "Comisión", key: "commission" }
  ];

  const placeholders = {
    name: "Carlos Mendoza",
    phone: "+34 600 123 456",
    email: "carlos@belgem.com",
    zone: "Barcelona",
    internalCode: "REP001",
    commission: "12.50"
  };

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f9fafb", fontFamily: "system-ui" }}>
      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? "256px" : "80px",
          backgroundColor: "#312e81",
          color: "white",
          transition: "width 0.3s",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div
          style={{
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #4338ca"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                backgroundColor: "white",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <span style={{ color: "#312e81", fontWeight: "bold", fontSize: "14px" }}>A</span>
            </div>
            {sidebarOpen && <span style={{ fontWeight: "600" }}>Admin Portal</span>}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ padding: "4px", background: "transparent", border: "none", color: "white", cursor: "pointer", borderRadius: "4px" }}
          >
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
        {/* Header */}
        <header
          style={{
            backgroundColor: "white",
            borderBottom: "1px solid #e5e7eb",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {viewMode !== "list" && (
              <button
                onClick={handleCancel}
                style={{ padding: "8px", background: "transparent", border: "none", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            )}
            <h1 style={{ fontSize: "24px", fontWeight: "600", color: "#1f2937", margin: 0 }}>
              {viewMode === "list"
                ? "Representantes"
                : viewMode === "view"
                  ? selectedRep?.name
                  : selectedRep ? "Editar Representante" : "Nuevo Representante"}
            </h1>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: "24px" }}>
          {/* Mostrar error si existe */}
          {error && (
            <div style={{ backgroundColor: "#fee2e2", border: "1px solid #ef4444", color: "#991b1b", padding: "16px", borderRadius: "8px", marginBottom: "16px" }}>
              {error}
            </div>
          )}

          {/* Lista */}
          {viewMode === "list" && (
            <div style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <div style={{ padding: "24px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between" }}>
                <div style={{ position: "relative" }}>
                  <Search size={20} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                  <input
                    type="text"
                    placeholder="Buscar representantes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ paddingLeft: "40px", paddingTop: "8px", paddingBottom: "8px", paddingRight: "16px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", width: "300px", color: "#000000" }}
                  />
                </div>

                <button
                  onClick={handleNew}
                  disabled={loading}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: loading ? "#9ca3af" : "#4f46e5",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontWeight: "500"
                  }}
                >
                  <Plus size={20} />
                  Nuevo Representante
                </button>
              </div>

              {loading ? (
                <div style={{ padding: "48px", textAlign: "center", color: "#6b7280" }}>
                  Cargando representantes...
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                    <tr>
                      {["ID", "Código Interno", "Nombre", "Email", "Zona", "Comisión", "Acciones"].map((h) => (
                        <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: "#6b7280", textTransform: "uppercase" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRepresentantes.length > 0 ? (
                      filteredRepresentantes.map((rep) => (
                        <tr key={rep.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                          <td style={{ padding: "16px 24px" }}>{rep.id}</td>
                          <td style={{ padding: "16px 24px", fontWeight: "500" }}>{rep.internalCode}</td>
                          <td style={{ padding: "16px 24px" }}>{rep.name}</td>
                          <td style={{ padding: "16px 24px" }}>{rep.email || '-'}</td>
                          <td style={{ padding: "16px 24px" }}>{rep.zone}</td>
                          <td style={{ padding: "16px 24px" }}>{rep.commission !== null ? rep.commission : '-'}</td>
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
                        <td colSpan={7} style={{ padding: "16px 24px", textAlign: "center", color: "#6b7280" }}>
                          No hay representantes
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Vista detalle */}
          {viewMode === "view" && selectedRep && (
            <div style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", padding: "32px", maxWidth: "896px" }}>
              <div style={{ marginBottom: "24px", paddingBottom: "24px", borderBottom: "2px solid #e5e7eb" }}>
                <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>{selectedRep.name}</h2>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                {viewFields.map(({ label, key }) => (
                  <div key={key}>
                    <h3 style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", marginBottom: "8px" }}>
                      {label}
                    </h3>
                    <p style={{ fontSize: "16px", margin: 0 }}>
                      {selectedRep[key] !== null && selectedRep[key] !== undefined ? selectedRep[key] : '-'}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "32px", paddingTop: "24px", borderTop: "1px solid #e5e7eb" }}>
                <button onClick={handleCancel} style={{ padding: "8px 24px", border: "1px solid #d1d5db", borderRadius: "8px", backgroundColor: "white", cursor: "pointer", fontWeight: "500" }}>
                  Volver
                </button>
                <button onClick={() => handleEdit(selectedRep)} style={{ padding: "8px 24px", backgroundColor: "#4f46e5", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "500" }}>
                  Editar
                </button>
              </div>
            </div>
          )}

          {/* Formulario */}
          {viewMode === "form" && (
            <div style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", padding: "32px", maxWidth: "800px" }}>
              <form onSubmit={handleFormSubmit} style={{ display: "grid", gap: "16px" }}>
                <div>
                  <label style={{ fontWeight: "700", fontSize: "14px", marginBottom: "4px", display: "block" }}>
                    Nombre *
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={placeholders.name}
                    required
                    style={{ width: "80%", maxWidth: "600px", padding: "8px 16px", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", color: "#000000" }}
                  />
                </div>

                <div>
                  <label style={{ fontWeight: "700", fontSize: "14px", marginBottom: "4px", display: "block" }}>
                    Teléfono *
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={placeholders.phone}
                    required
                    style={{ width: "80%", maxWidth: "600px", padding: "8px 16px", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", color: "#000000" }}
                  />
                </div>

                <div>
                  <label style={{ fontWeight: "700", fontSize: "14px", marginBottom: "4px", display: "block" }}>
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={placeholders.email}
                    style={{ width: "80%", maxWidth: "600px", padding: "8px 16px", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", color: "#000000" }}
                  />
                </div>

                <div>
                  <label style={{ fontWeight: "700", fontSize: "14px", marginBottom: "4px", display: "block" }}>
                    Zona *
                  </label>
                  <input
                    name="zone"
                    value={formData.zone}
                    onChange={handleInputChange}
                    placeholder={placeholders.zone}
                    required
                    style={{ width: "80%", maxWidth: "600px", padding: "8px 16px", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", color: "#000000" }}
                  />
                </div>

                <div>
                  <label style={{ fontWeight: "700", fontSize: "14px", marginBottom: "4px", display: "block" }}>
                    Código Interno *
                  </label>
                  <input
                    name="internalCode"
                    value={formData.internalCode}
                    onChange={handleInputChange}
                    placeholder={placeholders.internalCode}
                    required
                    style={{ width: "80%", maxWidth: "600px", padding: "8px 16px", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", color: "#000000" }}
                  />
                </div>

                <div>
                  <label style={{ fontWeight: "700", fontSize: "14px", marginBottom: "4px", display: "block" }}>
                    Comisión
                  </label>
                  <input
                    name="commission"
                    type="number"
                    step="0.01"
                    value={formData.commission}
                    onChange={handleInputChange}
                    placeholder={placeholders.commission}
                    style={{ width: "80%", maxWidth: "600px", padding: "8px 16px", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", color: "#000000" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    style={{
                      padding: "8px 24px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      backgroundColor: "white",
                      cursor: loading ? "not-allowed" : "pointer",
                      fontWeight: "500"
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: "8px 24px",
                      backgroundColor: loading ? "#9ca3af" : "#4f46e5",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: loading ? "not-allowed" : "pointer",
                      fontWeight: "500"
                    }}
                  >
                    {loading ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
