import React, { useState, useEffect } from 'react';
import { Eye, Edit2, Trash2, Search, Plus, X, AlertCircle } from 'lucide-react';
import ProfileButton from '../components/ProfileButton';

const API_BASE_URL = 'http://localhost:8080/api/v1/tipos-movimiento';

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

const TipoMovimientoService = {
    listarTipos: async () => handleResponse(await fetch(API_BASE_URL, { method: 'GET', headers: getHeaders() })),
    obtenerTipoPorId: async (id) => handleResponse(await fetch(`${API_BASE_URL}/${id}`, { method: 'GET', headers: getHeaders() })),
    crearTipo: async (d) => handleResponse(await fetch(API_BASE_URL, { method: 'POST', headers: getHeaders(), body: JSON.stringify(d) })),
    actualizarTipo: async (id, d) => handleResponse(await fetch(`${API_BASE_URL}/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(d) })),
    eliminarTipo: async (id) => handleResponse(await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE', headers: getHeaders() }))
};

const TiposMovimientoPage = () => {
    const [selectedTipo, setSelectedTipo] = useState(null);
    const [viewMode, setViewMode] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [tipos, setTipos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({ id: '', nombre: '', descripcion: '' });

    useEffect(() => { cargarTipos(); }, []);

    const cargarTipos = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await TipoMovimientoService.listarTipos();
            setTipos(data || []);
        } catch (err) {
            setError('Error al cargar los tipos: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleViewTipo = async (tipo) => {
        setLoading(true);
        setError(null);
        try {
            const data = await TipoMovimientoService.obtenerTipoPorId(tipo.id);
            setSelectedTipo(data);
            setViewMode('view');
        } catch (err) {
            setError('Error al obtener el tipo: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (tipo) => {
        setSelectedTipo(tipo);
        setFormData({ id: tipo.id, nombre: tipo.nombre || '', descripcion: tipo.descripcion || '' });
        setViewMode('edit');
    };

    const handleDelete = async (tipo) => {
        if (!window.confirm(`¿Estás seguro de eliminar "${tipo.nombre}"?\n\nEsta acción no se puede deshacer.`)) return;
        setLoading(true);
        setError(null);
        try {
            await TipoMovimientoService.eliminarTipo(tipo.id);
            alert('Tipo eliminado correctamente');
            await cargarTipos();
        } catch (err) {
            setError('Error al eliminar: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleNew = () => {
        setSelectedTipo(null);
        setFormData({ id: '', nombre: '', descripcion: '' });
        setViewMode('create');
    };

    const handleSave = async () => {
        if (!formData.nombre || !formData.descripcion) { alert('Completa todos los campos obligatorios'); return; }
        setLoading(true);
        setError(null);
        try {
            const dataToSend = { nombre: formData.nombre, descripcion: formData.descripcion };
            if (viewMode === 'edit') {
                await TipoMovimientoService.actualizarTipo(selectedTipo.id, dataToSend);
                alert('Tipo actualizado correctamente');
            } else {
                await TipoMovimientoService.crearTipo(dataToSend);
                alert('Tipo creado correctamente');
            }
            await cargarTipos();
            setViewMode('list');
            setSelectedTipo(null);
        } catch (err) {
            setError('Error al guardar: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => { setViewMode('list'); setSelectedTipo(null); setError(null); };
    const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const filteredTipos = tipos.filter(t =>
        t.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTitle = () => {
        switch (viewMode) {
            case 'view': return 'Detalles del Tipo de Movimiento';
            case 'edit': return 'Editar Tipo de Movimiento';
            case 'create': return 'Nuevo Tipo de Movimiento';
            default: return 'Tipos de Movimiento';
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
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '32px', maxWidth: '800px' }}>
            {error && <ErrorAlert message={error} />}
            <div style={{ display: 'grid', gap: '24px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Nombre *</label>
                    <input value={formData.nombre} onChange={(e) => handleInputChange('nombre', e.target.value)} disabled={loading} placeholder="Ej: Entrada, Salida, Transferencia"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box', backgroundColor: loading ? '#f3f4f6' : 'white', color: '#000000' }} />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Descripción *</label>
                    <textarea value={formData.descripcion} onChange={(e) => handleInputChange('descripcion', e.target.value)} disabled={loading} rows={4} placeholder="Describe el tipo de movimiento..."
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit', backgroundColor: loading ? '#f3f4f6' : 'white', color: '#000000' }} />
                </div>
            </div>
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                <button onClick={handleCancel} disabled={loading} style={{ padding: '8px 24px', border: '1px solid #d1d5db', borderRadius: '8px', color: '#374151', backgroundColor: 'white', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '500', opacity: loading ? 0.6 : 1 }}>Cancelar</button>
                <button onClick={handleSave} disabled={loading} style={{ padding: '8px 24px', backgroundColor: loading ? '#9ca3af' : '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '500', opacity: loading ? 0.6 : 1 }}>
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
                                <input type="text" placeholder="Buscar tipos de movimiento..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ paddingLeft: '40px', paddingTop: '8px', paddingBottom: '8px', paddingRight: '16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                            </div>
                            <button onClick={handleNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#4f46e5', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500', whiteSpace: 'nowrap' }}>
                                <Plus size={20} />Nuevo Tipo
                            </button>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                                <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                    <tr>
                                        {['Nombre', 'Descripción', 'Acciones'].map(h => (
                                            <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTipos.length === 0 ? (
                                        <tr><td colSpan="3" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No se encontraron tipos de movimiento</td></tr>
                                    ) : (
                                        filteredTipos.map((tipo) => (
                                            <tr key={tipo.id} style={{ borderBottom: '1px solid #e5e7eb', cursor: 'pointer' }}
                                                onClick={() => handleViewTipo(tipo)}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                                <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500' }}>{tipo.nombre}</td>
                                                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>{tipo.descripcion}</td>
                                                <td style={{ padding: '16px 24px' }} onClick={(e) => e.stopPropagation()}>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button onClick={() => handleViewTipo(tipo)} style={{ padding: '8px', color: '#059669', background: 'transparent', border: 'none', cursor: 'pointer' }} title="Ver"><Eye size={16} /></button>
                                                        <button onClick={() => handleEdit(tipo)} style={{ padding: '8px', color: '#4f46e5', background: 'transparent', border: 'none', cursor: 'pointer' }} title="Editar"><Edit2 size={16} /></button>
                                                        <button onClick={() => handleDelete(tipo)} style={{ padding: '8px', color: '#dc2626', background: 'transparent', border: 'none', cursor: 'pointer' }} title="Eliminar"><Trash2 size={16} /></button>
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
                        <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '2px solid #e5e7eb' }}>
                            <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>{selectedTipo?.nombre}</h2>
                            <span style={{ padding: '6px 12px', fontSize: '14px', fontWeight: '600', borderRadius: '9999px', backgroundColor: '#dbeafe', color: '#2563eb' }}>
                                Tipo de Movimiento
                            </span>
                        </div>
                        <div style={{ display: 'grid', gap: '24px' }}>
                            <div>
                                <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>Nombre</h3>
                                <p style={{ fontSize: '16px', margin: 0 }}>{selectedTipo?.nombre}</p>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>Descripción</h3>
                                <p style={{ fontSize: '16px', margin: 0, lineHeight: '1.6' }}>{selectedTipo?.descripcion}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                            <button onClick={handleCancel} style={{ padding: '8px 24px', border: '1px solid #d1d5db', borderRadius: '8px', color: '#374151', backgroundColor: 'white', cursor: 'pointer', fontWeight: '500' }}>Volver</button>
                            <button onClick={() => handleEdit(selectedTipo)} style={{ padding: '8px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Editar Tipo</button>
                        </div>
                    </div>
                ) : renderForm()}
            </div>
        </div>
    );
};

export default TiposMovimientoPage;