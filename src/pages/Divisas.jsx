import React, { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, Plus, X, Eye, AlertCircle } from 'lucide-react';
import ProfileButton from '../components/ProfileButton';

const API_BASE_URL = 'http://localhost:8080/divisas';

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

const DivisasService = {
  listarDivisas: async () => handleResponse(await fetch(API_BASE_URL, { method: 'GET', headers: getHeaders() })),
  obtenerDivisaPorId: async (id) => handleResponse(await fetch(`${API_BASE_URL}/${id}`, { method: 'GET', headers: getHeaders() })),
  crearDivisa: async (d) => handleResponse(await fetch(API_BASE_URL, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ code: d.code, name: d.name }) })),
  actualizarDivisa: async (id, d) => handleResponse(await fetch(`${API_BASE_URL}/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ code: d.code, name: d.name }) })),
  eliminarDivisa: async (id) => handleResponse(await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE', headers: getHeaders() }))
};

const mapDivisaFromBackend = (d) => !d ? null : ({ id: d.id, code: d.code, name: d.name });

const DivisasPage = () => {
  const [selectedDivisa, setSelectedDivisa] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [divisas, setDivisas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ id: '', code: '', name: '' });

  useEffect(() => { cargarDivisas(); }, []);

  const cargarDivisas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await DivisasService.listarDivisas();
      setDivisas(data.map(mapDivisaFromBackend));
    } catch (err) {
      setError('Error al cargar las divisas: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDivisa = async (divisa) => {
    setLoading(true);
    setError(null);
    try {
      const data = await DivisasService.obtenerDivisaPorId(divisa.id);
      setSelectedDivisa(mapDivisaFromBackend(data));
      setViewMode('view');
    } catch (err) {
      setError('Error al obtener la divisa: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (divisa) => { setSelectedDivisa(divisa); setFormData(divisa); setViewMode('edit'); };

  const handleDelete = async (divisa) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la divisa "${divisa.name}"?\n\nEsta acción no se puede deshacer.`)) return;
    setLoading(true);
    setError(null);
    try {
      await DivisasService.eliminarDivisa(divisa.id);
      alert(`Divisa "${divisa.name}" eliminada correctamente`);
      await cargarDivisas();
    } catch (err) {
      setError('Error al eliminar la divisa: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => { setSelectedDivisa(null); setFormData({ id: '', code: '', name: '' }); setViewMode('create'); };

  const handleSave = async () => {
    if (!formData.code || !formData.name) { alert('Por favor completa todos los campos obligatorios (Código y Nombre)'); return; }
    setLoading(true);
    setError(null);
    try {
      if (viewMode === 'edit') {
        await DivisasService.actualizarDivisa(selectedDivisa.id, formData);
        alert('Divisa actualizada correctamente');
      } else {
        await DivisasService.crearDivisa(formData);
        alert('Divisa creada correctamente');
      }
      await cargarDivisas();
      setViewMode('list');
      setSelectedDivisa(null);
    } catch (err) {
      setError('Error al guardar la divisa: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => { setViewMode('list'); setSelectedDivisa(null); setError(null); };
  const handleInputChange = (field, value) => setFormData({ ...formData, [field]: value });

  const filteredDivisas = divisas.filter(d =>
    d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTitle = () => {
    switch (viewMode) {
      case 'view': return 'Detalles de la Divisa';
      case 'edit': return 'Editar Divisa';
      case 'create': return 'Nueva Divisa';
      default: return 'Divisas';
    }
  };

  const ErrorAlert = ({ message }) => (
    <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px', color: '#dc2626' }}>
      <AlertCircle size={20} /><span>{message}</span>
    </div>
  );

  const LoadingSpinner = () => (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <div style={{ width: '40px', height: '40px', border: '4px solid #e5e7eb', borderTop: '4px solid #4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      <p style={{ marginTop: '16px', color: '#6b7280' }}>Cargando...</p>
    </div>
  );

  const renderForm = () => (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px', maxWidth: '600px' }}>
      {error && <ErrorAlert message={error} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Código *</label>
          <input type="text" value={formData.code} onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())} disabled={loading} maxLength={10} placeholder="EUR"
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', backgroundColor: loading ? '#f3f4f6' : 'white', color: '#000000' }} />
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', marginBottom: 0 }}>Máximo 10 caracteres</p>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Nombre *</label>
          <input type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} disabled={loading} placeholder="EURO"
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', backgroundColor: loading ? '#f3f4f6' : 'white', color: '#000000' }} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
        <button onClick={handleCancel} disabled={loading} style={{ padding: '8px 24px', border: '1px solid #d1d5db', borderRadius: '8px', color: '#374151', backgroundColor: 'white', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '500', opacity: loading ? 0.6 : 1 }}>Cancelar</button>
        <button onClick={handleSave} disabled={loading} style={{ padding: '8px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '500', opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'system-ui' }}>

      {/* HEADER */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {viewMode !== 'list' && (
            <button onClick={handleCancel} style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          )}
          <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#1f2937', margin: 0 }}>{getTitle()}</h1>
        </div>
        <ProfileButton />
      </header>

      {/* CONTENT */}
      <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
        {error && viewMode === 'list' && <ErrorAlert message={error} />}

        {loading && viewMode === 'list' ? (
          <LoadingSpinner />
        ) : viewMode === 'list' ? (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ position: 'relative', flexGrow: 1, minWidth: '250px' }}>
                <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input type="text" placeholder="Buscar divisas..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '40px', paddingTop: '8px', paddingBottom: '8px', paddingRight: '16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
              </div>
              <button onClick={handleNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#4f46e5', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500', whiteSpace: 'nowrap' }}>
                <Plus size={20} />Nueva Divisa
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <tr>
                    {['ID', 'Código', 'Nombre', 'Acciones'].map(h => (
                      <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredDivisas.length === 0 ? (
                    <tr><td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No se encontraron divisas</td></tr>
                  ) : (
                    filteredDivisas.map((divisa) => (
                      <tr key={divisa.id} onClick={() => handleViewDivisa(divisa)}
                        style={{ borderBottom: '1px solid #e5e7eb', cursor: 'pointer' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <td style={{ padding: '16px 24px', fontSize: '14px' }}>{divisa.id}</td>
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{ padding: '4px 12px', backgroundColor: '#dbeafe', color: '#1e40af', borderRadius: '6px', fontSize: '13px', fontWeight: '600' }}>{divisa.code}</span>
                        </td>
                        <td style={{ padding: '16px 24px', fontSize: '14px' }}>{divisa.name}</td>
                        <td style={{ padding: '16px 24px' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleViewDivisa(divisa)} style={{ padding: '8px', color: '#059669', background: 'transparent', border: 'none', cursor: 'pointer' }} title="Ver"><Eye size={16} /></button>
                            <button onClick={() => handleEdit(divisa)} style={{ padding: '8px', color: '#4f46e5', background: 'transparent', border: 'none', cursor: 'pointer' }} title="Editar"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(divisa)} style={{ padding: '8px', color: '#dc2626', background: 'transparent', border: 'none', cursor: 'pointer' }} title="Eliminar"><Trash2 size={16} /></button>
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
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '32px', maxWidth: '600px' }}>
            {loading ? <LoadingSpinner /> : (
              <>
                <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '2px solid #e5e7eb' }}>
                  <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>{selectedDivisa?.name}</h2>
                  <span style={{ padding: '6px 16px', backgroundColor: '#dbeafe', color: '#1e40af', borderRadius: '8px', fontSize: '16px', fontWeight: '600' }}>{selectedDivisa?.code}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {[{ label: 'ID', value: selectedDivisa?.id }, { label: 'Código', value: selectedDivisa?.code }, { label: 'Nombre', value: selectedDivisa?.name }].map(({ label, value }) => (
                    <div key={label}>
                      <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</h3>
                      <p style={{ fontSize: '18px', margin: 0, color: '#1f2937' }}>{value}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                  <button onClick={handleCancel} style={{ padding: '8px 24px', border: '1px solid #d1d5db', borderRadius: '8px', color: '#374151', backgroundColor: 'white', cursor: 'pointer', fontWeight: '500' }}>Volver</button>
                  <button onClick={() => handleEdit(selectedDivisa)} style={{ padding: '8px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Editar Divisa</button>
                </div>
              </>
            )}
          </div>
        ) : renderForm()}
      </div>
    </div>
  );
};

export default DivisasPage;