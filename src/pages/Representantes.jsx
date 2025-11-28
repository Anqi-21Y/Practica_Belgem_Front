import React, { useState, useEffect } from "react";
import { Eye, Edit2, Trash2, Search, Home, Package, Users, DollarSign, Menu, Plus, X, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import RepresentanteService from '../services/RepresentanteService';

const RepresentantesPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedRep, setSelectedRep] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [representantes, setRepresentantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    phone: '',
    email: '',
    zone: '',
    internalCode: '',
    commission: ''
  });

  useEffect(() => {
    cargarRepresentantes();
  }, []);

  const cargarRepresentantes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await RepresentanteService.listarRepresentantes();
      setRepresentantes(data);
    } catch (err) {
      setError('Error al cargar los representantes: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRep = async (rep) => {
    setLoading(true);
    setError(null);
    try {
      const data = await RepresentanteService.obtenerRepresentantePorId(rep.id);
      setSelectedRep(data);
      setViewMode('view');
    } catch (err) {
      setError('Error al obtener el representante: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rep) => {
    setSelectedRep(rep);
    setFormData({
      id: rep.id,
      name: rep.name || '',
      phone: rep.phone || '',
      email: rep.email || '',
      zone: rep.zone || '',
      internalCode: rep.internalCode || '',
      commission: rep.commission || ''
    });
    setViewMode('edit');
  };

  const handleDelete = async (rep) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar el representante "${rep.name}"?\n\nEsta acción no se puede deshacer.`
    );

    if (confirmDelete) {
      setLoading(true);
      setError(null);
      try {
        await RepresentanteService.eliminarRepresentante(rep.id);
        alert(`Representante "${rep.name}" eliminado correctamente`);
        await cargarRepresentantes();
      } catch (err) {
        setError('Error al eliminar el representante: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleNew = () => {
    setSelectedRep(null);
    setFormData({
      id: '',
      name: '',
      phone: '',
      email: '',
      zone: '',
      internalCode: '',
      commission: ''
    });
    setViewMode('create');
  };

  const handleSave = async () => {
    if (!formData.name || !formData.phone || !formData.zone || !formData.internalCode) {
      alert('Por favor completa los campos obligatorios (Nombre, Teléfono, Zona y Código Interno)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dataToSend = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        zone: formData.zone,
        internalCode: formData.internalCode,
        commission: formData.commission ? Number(formData.commission) : null
      };

      if (viewMode === 'edit') {
        await RepresentanteService.actualizarRepresentante(selectedRep.id, dataToSend);
        alert('Representante actualizado correctamente');
      } else {
        await RepresentanteService.crearRepresentante(dataToSend);
        alert('Representante creado correctamente');
      }

      await cargarRepresentantes();
      setViewMode('list');
      setSelectedRep(null);
    } catch (err) {
      setError('Error al guardar el representante: ' + err.message);
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

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const filteredRepresentantes = representantes.filter(rep =>
    rep.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rep.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rep.internalCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTitle = () => {
    switch (viewMode) {
      case 'view': return 'Detalles del Representante';
      case 'edit': return 'Editar Representante';
      case 'create': return 'Nuevo Representante';
      default: return 'Representantes';
    }
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

  const renderForm = () => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '24px',
      maxWidth: '896px'
    }}>
      {error && <ErrorAlert message={error} />}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {[
          { label: 'Nombre *', field: 'name', placeholder: 'Carlos Mendoza' },
          { label: 'Código Interno *', field: 'internalCode', placeholder: 'REP001', disabled: viewMode === 'edit' },
          { label: 'Teléfono *', field: 'phone', type: 'tel', placeholder: '+34 600 123 456' },
          { label: 'Email', field: 'email', type: 'email', placeholder: 'carlos@belgem.com' },
          { label: 'Zona *', field: 'zone', placeholder: 'Barcelona' },
          { label: 'Comisión', field: 'commission', type: 'number', placeholder: '12.50', step: '0.01' }
        ].map(({ label, field, disabled, type = 'text', placeholder, step }) => (
          <div key={field}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              {label}
            </label>
            <input
              type={type}
              step={step}
              value={formData[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
              disabled={disabled || loading}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: (disabled || loading) ? '#f3f4f6' : 'white',
                color: '#000000'
              }}
              placeholder={placeholder}
            />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
        <button
          onClick={handleCancel}
          disabled={loading}
          style={{
            padding: '8px 24px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            color: '#374151',
            backgroundColor: 'white',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '500',
            opacity: loading ? 0.6 : 1
          }}
          onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#f9fafb')}
          onMouseOut={(e) => !loading && (e.target.style.backgroundColor = 'white')}
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            padding: '8px 24px',
            backgroundColor: loading ? '#9ca3af' : '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '500',
            opacity: loading ? 0.6 : 1
          }}
          onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#4338ca')}
          onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#4f46e5')}
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f9fafb', fontFamily: 'system-ui' }}>
      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? '256px' : '80px', backgroundColor: '#312e81', color: 'white', transition: 'width 0.3s', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #4338ca' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#312e81', fontWeight: 'bold', fontSize: '14px' }}>A</span>
            </div>
            {sidebarOpen && <span style={{ fontWeight: '600' }}>Admin Portal</span>}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ padding: '4px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '4px' }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#4338ca'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>
            <Menu size={20} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '16px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none', color: 'white' }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#4338ca'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>
            <Home size={20} />
            {sidebarOpen && <span>Home</span>}
          </Link>

          <Link to="/clientes" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none', color: 'white' }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#4338ca'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>
            <Users size={20} />
            {sidebarOpen && <span>Clientes</span>}
          </Link>

          <Link to="/articulos" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none', color: 'white' }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#4338ca'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>
            <Package size={20} />
            {sidebarOpen && <span>Artículos</span>}
          </Link>

          <Link to="/representantes" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', backgroundColor: '#4338ca', textDecoration: 'none', color: 'white' }}>
            <Users size={20} />
            {sidebarOpen && <span>Representantes</span>}
          </Link>

          <Link to="/divisas" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none', color: 'white' }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#4338ca'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>
            <DollarSign size={20} />
            {sidebarOpen && <span>Divisas</span>}
          </Link>
        </nav>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {viewMode !== 'list' && (
              <button onClick={handleCancel} style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            )}
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', margin: 0 }}>{getTitle()}</h1>
          </div>
        </header>

        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {error && viewMode === 'list' && <ErrorAlert message={error} />}

          {loading && viewMode === 'list' ? (
            <LoadingSpinner />
          ) : viewMode === 'list' ? (
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ position: 'relative', flexGrow: 1, minWidth: '250px' }}>
                  <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input type="text" placeholder="Buscar representantes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: '40px', paddingTop: '8px', paddingBottom: '8px', paddingRight: '16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', width: '100%', boxSizing: 'border-box', backgroundColor: '#374151', color: 'white' }} />
                </div>
                <button onClick={handleNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#4f46e5', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500', whiteSpace: 'nowrap' }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#4338ca'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#4f46e5'}>
                  <Plus size={20} />Nuevo Representante
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                  <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <tr>
                      {['ID', 'Código Interno', 'Nombre', 'Email', 'Teléfono', 'Zona', 'Comisión', 'Acciones'].map(h => (
                        <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRepresentantes.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                          No se encontraron representantes
                        </td>
                      </tr>
                    ) : (
                      filteredRepresentantes.map((rep) => (
                        <tr key={rep.id} onClick={() => handleViewRep(rep)}
                          style={{ borderBottom: '1px solid #e5e7eb', cursor: 'pointer', transition: 'background-color 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <td style={{ padding: '16px 24px', fontSize: '14px' }}>{rep.id}</td>
                          <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500' }}>{rep.internalCode}</td>
                          <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500' }}>{rep.name}</td>
                          <td style={{ padding: '16px 24px', fontSize: '14px' }}>{rep.email || '-'}</td>
                          <td style={{ padding: '16px 24px', fontSize: '14px' }}>{rep.phone}</td>
                          <td style={{ padding: '16px 24px', fontSize: '14px' }}>{rep.zone}</td>
                          <td style={{ padding: '16px 24px', fontSize: '14px' }}>{rep.commission !== null && rep.commission !== undefined ? rep.commission : '-'}</td>
                          <td style={{ padding: '16px 24px' }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => handleViewRep(rep)} style={{ padding: '8px', color: '#059669', background: 'transparent', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.2s' }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#d1fae5'}
                                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                                title="Ver"><Eye size={16} /></button>
                              <button onClick={() => handleEdit(rep)} style={{ padding: '8px', color: '#4f46e5', background: 'transparent', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.2s' }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#eef2ff'}
                                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                                title="Editar"><Edit2 size={16} /></button>
                              <button onClick={() => handleDelete(rep)} style={{ padding: '8px', color: '#dc2626', background: 'transparent', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.2s' }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#fee2e2'}
                                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                                title="Eliminar"><Trash2 size={16} /></button>
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
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '32px', maxWidth: '896px' }}>
              {loading ? <LoadingSpinner /> : (
                <>
                  <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '2px solid #e5e7eb' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>{selectedRep?.name}</h2>
                    <span style={{
                      padding: '6px 12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      borderRadius: '9999px',
                      backgroundColor: '#dbeafe',
                      color: '#2563eb'
                    }}>
                      Representante
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    {[
                      { label: 'ID Representante', value: selectedRep?.id },
                      { label: 'Código Interno', value: selectedRep?.internalCode },
                      { label: 'Email', value: selectedRep?.email },
                      { label: 'Teléfono', value: selectedRep?.phone },
                      { label: 'Zona', value: selectedRep?.zone },
                      { label: 'Comisión', value: selectedRep?.commission }
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</h3>
                        <p style={{ fontSize: '16px', margin: 0 }}>{value !== null && value !== undefined ? value : '-'}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                    <button onClick={handleCancel} style={{ padding: '8px 24px', border: '1px solid #d1d5db', borderRadius: '8px', color: '#374151', backgroundColor: 'white', cursor: 'pointer', fontWeight: '500' }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#f9fafb'}
                      onMouseOut={(e) => e.target.style.backgroundColor = 'white'}>Volver</button>
                    <button onClick={() => handleEdit(selectedRep)} style={{ padding: '8px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#4338ca'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#4f46e5'}>Editar Representante</button>
                  </div>
                </>
              )}
            </div>
          ) : renderForm()}
        </div>
      </div>
    </div>
  );
};

export default RepresentantesPage;