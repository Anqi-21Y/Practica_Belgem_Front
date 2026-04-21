import React, { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, Plus, X, Eye, AlertCircle } from 'lucide-react';
import ProfileButton from '../components/ProfileButton';

const API_BASE_URL = '/api/v1/clientes';

const getHeaders = () => ({ 'Content-Type': 'application/json', 'Accept': 'application/json' });

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
  }
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

const ClienteService = {
  listarClientes: async () => handleResponse(await fetch(API_BASE_URL, { method: 'GET', headers: getHeaders() })),
  obtenerClientePorId: async (id) => handleResponse(await fetch(`${API_BASE_URL}/${id}`, { method: 'GET', headers: getHeaders() })),
  crearCliente: async (d) => handleResponse(await fetch(API_BASE_URL, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ nombre: d.nombre, nif: d.nif, direccion: d.direccion || '', ciudad: d.ciudad || '', codigoPostal: d.codigo_postal || '', telefono: d.telefono || '', email: d.email || '', tipoCliente: d.tipo_cliente || '', zona: d.zona || '', representante: d.representante || '', observaciones: d.observaciones || '' }) })),
  actualizarCliente: async (id, d) => handleResponse(await fetch(`${API_BASE_URL}/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ nombre: d.nombre, direccion: d.direccion || '', ciudad: d.ciudad || '', codigoPostal: d.codigo_postal || '', telefono: d.telefono || '', email: d.email || '', tipoCliente: d.tipo_cliente || '', zona: d.zona || '', representante: d.representante || '', observaciones: d.observaciones || '' }) })),
  eliminarCliente: async (id) => handleResponse(await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE', headers: getHeaders() }))
};

const mapClienteFromBackend = (c) => !c ? null : ({
  id: c.idCliente, nombre: c.nombre, nif: c.nif, direccion: c.direccion,
  ciudad: c.ciudad, codigo_postal: c.codigoPostal, telefono: c.telefono,
  email: c.email, tipo_cliente: c.tipoCliente, zona: c.zona,
  representante: c.representante, observaciones: c.observaciones
});

const ClientesPage = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    id: '', ciudad: '', codigo_postal: '', direccion: '', email: '',
    nif: '', nombre: '', observaciones: '', representante: '', telefono: '', tipo_cliente: '', zona: ''
  });

  useEffect(() => { cargarClientes(); }, []);

  const cargarClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ClienteService.listarClientes();
      setClientes(data.map(mapClienteFromBackend));
    } catch (err) {
      setError('Error al cargar los clientes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewClient = async (cliente) => {
    setLoading(true);
    setError(null);
    try {
      const data = await ClienteService.obtenerClientePorId(cliente.id);
      setSelectedClient(mapClienteFromBackend(data));
      setViewMode('view');
    } catch (err) {
      setError('Error al obtener el cliente: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cliente) => { setSelectedClient(cliente); setFormData(cliente); setViewMode('edit'); };

  const handleDelete = async (cliente) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el cliente "${cliente.nombre}"?\n\nEsta acción no se puede deshacer.`)) return;
    setLoading(true);
    setError(null);
    try {
      await ClienteService.eliminarCliente(cliente.id);
      alert(`Cliente "${cliente.nombre}" eliminado correctamente`);
      await cargarClientes();
    } catch (err) {
      setError('Error al eliminar el cliente: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setSelectedClient(null);
    setFormData({ id: '', ciudad: '', codigo_postal: '', direccion: '', email: '', nif: '', nombre: '', observaciones: '', representante: '', telefono: '', tipo_cliente: '', zona: '' });
    setViewMode('create');
  };

  const handleSave = async () => {
    if (!formData.nombre || !formData.nif) { alert('Por favor completa los campos obligatorios (Nombre y NIF)'); return; }
    setLoading(true);
    setError(null);
    try {
      if (viewMode === 'edit') {
        await ClienteService.actualizarCliente(selectedClient.id, formData);
        alert('Cliente actualizado correctamente');
      } else {
        await ClienteService.crearCliente(formData);
        alert('Cliente creado correctamente');
      }
      await cargarClientes();
      setViewMode('list');
      setSelectedClient(null);
    } catch (err) {
      setError('Error al guardar el cliente: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => { setViewMode('list'); setSelectedClient(null); setError(null); };
  const handleInputChange = (field, value) => setFormData({ ...formData, [field]: value });

  const filteredClientes = clientes.filter(c =>
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.nif.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTitle = () => {
    switch (viewMode) {
      case 'view': return 'Detalles del Cliente';
      case 'edit': return 'Editar Cliente';
      case 'create': return 'Nuevo Cliente';
      default: return 'Clientes';
    }
  };

  const getTipoBadgeStyle = (tipo) => ({
    padding: '4px 8px', fontSize: '12px', fontWeight: '600', borderRadius: '9999px',
    backgroundColor: tipo === 'Premium' ? '#f3e8ff' : tipo === 'Corporativo' ? '#dbeafe' : '#f3f4f6',
    color: tipo === 'Premium' ? '#7c3aed' : tipo === 'Corporativo' ? '#2563eb' : '#4b5563'
  });

  const ErrorAlert = ({ message }) => (
    <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderLeft: '4px solid #dc2626', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: '#dc2626', fontSize: '13.5px' }}>
      <AlertCircle size={20} /><span>{message}</span>
    </div>
  );

  const LoadingSpinner = () => (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTop: '3px solid #1d4ed8', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      <p style={{ marginTop: '16px', color: '#6b7280' }}>Cargando...</p>
    </div>
  );

  const renderForm = () => (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '28px', maxWidth: '896px' }}>
      {error && <ErrorAlert message={error} />}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {[
          { label: 'Nombre *', field: 'nombre', placeholder: 'Juan Pérez' },
          { label: 'NIF *', field: 'nif', placeholder: '12345678A', disabled: viewMode === 'edit' },
          { label: 'Teléfono', field: 'telefono', type: 'tel', placeholder: '+34 600 123 456' },
          { label: 'Email', field: 'email', type: 'email', placeholder: 'cliente@example.com' },
          { label: 'Dirección', field: 'direccion', placeholder: 'Calle Mayor 5' },
          { label: 'Ciudad', field: 'ciudad', placeholder: 'Barcelona' },
          { label: 'Código Postal', field: 'codigo_postal', placeholder: '08001' },
          { label: 'Zona', field: 'zona', placeholder: 'Cataluña' },
          { label: 'Representante', field: 'representante', placeholder: 'Ana Gómez' }
        ].map(({ label, field, disabled, type = 'text', placeholder }) => (
          <div key={field}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '6px', letterSpacing: '0.1px' }}>{label}</label>
            <input type={type} value={formData[field]} onChange={(e) => handleInputChange(field, e.target.value)} disabled={disabled || loading} placeholder={placeholder}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none', boxSizing: 'border-box', backgroundColor: (disabled || loading) ? '#f3f4f6' : 'white', color: '#000000' }} />
          </div>
        ))}
        <div>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '6px', letterSpacing: '0.1px' }}>Tipo Cliente</label>
          <select value={formData.tipo_cliente} onChange={(e) => handleInputChange('tipo_cliente', e.target.value)} disabled={loading}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none', boxSizing: 'border-box', backgroundColor: loading ? '#f3f4f6' : 'white', color: '#000000' }}>
            <option value="">Seleccionar...</option>
            <option value="Estándar">Estándar</option>
            <option value="Premium">Premium</option>
            <option value="Corporativo">Corporativo</option>
          </select>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '6px', letterSpacing: '0.1px' }}>Observaciones</label>
          <textarea value={formData.observaciones} onChange={(e) => handleInputChange('observaciones', e.target.value)} disabled={loading} rows="3" placeholder="Notas adicionales sobre el cliente..."
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical', backgroundColor: loading ? '#f3f4f6' : 'white', color: '#000000' }} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
        <button onClick={handleCancel} disabled={loading} style={{ padding: '8px 24px', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#374151', backgroundColor: 'white', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '500', opacity: loading ? 0.6 : 1 }}>Cancelar</button>
        <button onClick={handleSave} disabled={loading} style={{ padding: '8px 24px', backgroundColor: '#1d4ed8', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '500', opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* HEADER */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, height: '60px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {viewMode !== 'list' && (
            <button onClick={handleCancel} style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', borderRadius: '4px', display: 'inline-flex', alignItems: 'center' }}>
              <X size={20} />
            </button>
          )}
          <h1 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', margin: 0 }}>{getTitle()}</h1>
        </div>
        <ProfileButton />
      </header>

      {/* CONTENT */}
      <div style={{ flex: 1, overflow: 'auto', padding: '24px', backgroundColor: '#f8fafc' }}>
        {error && viewMode === 'list' && <ErrorAlert message={error} />}

        {loading && viewMode === 'list' ? (
          <LoadingSpinner />
        ) : viewMode === 'list' ? (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <div style={{ position: 'relative', flexGrow: 1, minWidth: '250px' }}>
                <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input type="text" placeholder="Buscar clientes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '40px', paddingTop: '8px', paddingBottom: '8px', paddingRight: '16px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
              </div>
              <button onClick={handleNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1d4ed8', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500', whiteSpace: 'nowrap' }}>
                <Plus size={20} />Nuevo Cliente
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <tr>
                    {['ID', 'Nombre', 'NIF', 'Email', 'Teléfono', 'Ciudad', 'Tipo', 'Acciones'].map(h => (
                      <th key={h} style={{ padding: '11px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredClientes.length === 0 ? (
                    <tr><td colSpan="8" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No se encontraron clientes</td></tr>
                  ) : (
                    filteredClientes.map((cliente) => (
                      <tr key={cliente.id} onClick={() => handleViewClient(cliente)}
                        style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <td style={{ padding: '13px 20px', fontSize: '13.5px' }}>{cliente.id}</td>
                        <td style={{ padding: '13px 20px', fontSize: '13.5px', fontWeight: '500' }}>{cliente.nombre}</td>
                        <td style={{ padding: '13px 20px', fontSize: '13.5px' }}>{cliente.nif}</td>
                        <td style={{ padding: '13px 20px', fontSize: '13.5px' }}>{cliente.email}</td>
                        <td style={{ padding: '13px 20px', fontSize: '13.5px' }}>{cliente.telefono}</td>
                        <td style={{ padding: '13px 20px', fontSize: '13.5px' }}>{cliente.ciudad}</td>
                        <td style={{ padding: '13px 20px' }}><span style={getTipoBadgeStyle(cliente.tipo_cliente)}>{cliente.tipo_cliente}</span></td>
                        <td style={{ padding: '13px 20px' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleViewClient(cliente)} style={{ padding: '5px', color: '#16a34a', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '4px', display: 'inline-flex', alignItems: 'center' }} title="Ver"><Eye size={16} /></button>
                            <button onClick={() => handleEdit(cliente)} style={{ padding: '5px', color: '#1d4ed8', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '4px', display: 'inline-flex', alignItems: 'center' }} title="Editar"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(cliente)} style={{ padding: '5px', color: '#dc2626', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '4px', display: 'inline-flex', alignItems: 'center' }} title="Eliminar"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : viewMode === 'view' ? (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '32px', maxWidth: '896px' }}>
            {loading ? <LoadingSpinner /> : (
              <>
                <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '2px solid #e5e7eb' }}>
                  <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>{selectedClient?.nombre}</h2>
                  <span style={getTipoBadgeStyle(selectedClient?.tipo_cliente)}>{selectedClient?.tipo_cliente}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                  {[
                    { label: 'ID Cliente', value: selectedClient?.id },
                    { label: 'NIF', value: selectedClient?.nif },
                    { label: 'Email', value: selectedClient?.email },
                    { label: 'Teléfono', value: selectedClient?.telefono },
                    { label: 'Dirección', value: selectedClient?.direccion },
                    { label: 'Ciudad', value: selectedClient?.ciudad },
                    { label: 'Código Postal', value: selectedClient?.codigo_postal },
                    { label: 'Zona', value: selectedClient?.zona },
                    { label: 'Representante', value: selectedClient?.representante }
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <h3 style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.6px' }}>{label}</h3>
                      <p style={{ fontSize: '15px', margin: 0, color: '#1e293b' }}>{value || '-'}</p>
                    </div>
                  ))}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <h3 style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.6px' }}>Observaciones</h3>
                    <p style={{ fontSize: '15px', margin: 0, color: '#1e293b', lineHeight: '1.6' }}>{selectedClient?.observaciones || 'Sin observaciones'}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                  <button onClick={handleCancel} style={{ padding: '8px 24px', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#374151', backgroundColor: 'white', cursor: 'pointer', fontWeight: '500' }}>Volver</button>
                  <button onClick={() => handleEdit(selectedClient)} style={{ padding: '7px 14px', backgroundColor: '#1d4ed8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }}>Editar Cliente</button>
                </div>
              </>
            )}
          </div>
        ) : renderForm()}
      </div>
    </div>
  );
};

export default ClientesPage;