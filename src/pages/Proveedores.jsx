import React, { useState, useEffect } from "react";
import { Eye, Edit2, Trash2, Search, Plus, X, AlertCircle } from 'lucide-react';
import ProfileButton from '../components/ProfileButton';

const API_BASE_URL = '/api/v1/proveedores';

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

const ProveedorService = {
    listarProveedores: async () => handleResponse(await fetch(API_BASE_URL, { method: 'GET', headers: getHeaders() })),
    obtenerProveedorPorId: async (id) => handleResponse(await fetch(`${API_BASE_URL}/${id}`, { method: 'GET', headers: getHeaders() })),
    crearProveedor: async (d) => handleResponse(await fetch(API_BASE_URL, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ nombre: d.nombre, cif: d.cif, email: d.email || null, telefono: d.telefono || null, direccion: d.direccion || null, ciudad: d.ciudad || null, pais: d.pais || null, estado: d.estado || 'ACTIVO' }) })),
    actualizarProveedor: async (id, d) => handleResponse(await fetch(`${API_BASE_URL}/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ nombre: d.nombre, email: d.email || null, telefono: d.telefono || null, direccion: d.direccion || null, ciudad: d.ciudad || null, pais: d.pais || null, estado: d.estado || 'ACTIVO' }) })),
    eliminarProveedor: async (id) => handleResponse(await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE', headers: getHeaders() }))
};

const ProveedoresPage = () => {
    const [selectedProveedor, setSelectedProveedor] = useState(null);
    const [viewMode, setViewMode] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        id: '', nombre: '', cif: '', email: '', telefono: '',
        direccion: '', ciudad: '', pais: '', estado: 'ACTIVO'
    });

    useEffect(() => { cargarProveedores(); }, []);

    const cargarProveedores = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await ProveedorService.listarProveedores();
            setProveedores(data);
        } catch (err) {
            setError('Error al cargar los proveedores: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleViewProveedor = async (proveedor) => {
        setLoading(true);
        setError(null);
        try {
            const data = await ProveedorService.obtenerProveedorPorId(proveedor.id);
            setSelectedProveedor(data);
            setViewMode('view');
        } catch (err) {
            setError('Error al obtener el proveedor: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (proveedor) => {
        setSelectedProveedor(proveedor);
        setFormData({
            id: proveedor.id, nombre: proveedor.nombre || '', cif: proveedor.cif || '',
            email: proveedor.email || '', telefono: proveedor.telefono || '',
            direccion: proveedor.direccion || '', ciudad: proveedor.ciudad || '',
            pais: proveedor.pais || '', estado: proveedor.estado || 'ACTIVO'
        });
        setViewMode('edit');
    };

    const handleDelete = async (proveedor) => {
        if (!window.confirm(`¿Estás seguro de que deseas eliminar el proveedor "${proveedor.nombre}"?\n\nEsta acción no se puede deshacer.`)) return;
        setLoading(true);
        setError(null);
        try {
            await ProveedorService.eliminarProveedor(proveedor.id);
            alert(`Proveedor "${proveedor.nombre}" eliminado correctamente`);
            await cargarProveedores();
        } catch (err) {
            setError('Error al eliminar el proveedor: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleNew = () => {
        setSelectedProveedor(null);
        setFormData({ id: '', nombre: '', cif: '', email: '', telefono: '', direccion: '', ciudad: '', pais: '', estado: 'ACTIVO' });
        setViewMode('create');
    };

    const handleSave = async () => {
        if (!formData.nombre || !formData.cif) { alert('Por favor completa los campos obligatorios (Nombre y CIF)'); return; }
        setLoading(true);
        setError(null);
        try {
            if (viewMode === 'edit') {
                await ProveedorService.actualizarProveedor(selectedProveedor.id, formData);
                alert('Proveedor actualizado correctamente');
            } else {
                await ProveedorService.crearProveedor(formData);
                alert('Proveedor creado correctamente');
            }
            await cargarProveedores();
            setViewMode('list');
            setSelectedProveedor(null);
        } catch (err) {
            setError('Error al guardar el proveedor: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => { setViewMode('list'); setSelectedProveedor(null); setError(null); };
    const handleInputChange = (field, value) => setFormData({ ...formData, [field]: value });

    const filteredProveedores = proveedores.filter(p =>
        p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.cif?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTitle = () => {
        switch (viewMode) {
            case 'view': return 'Detalles del Proveedor';
            case 'edit': return 'Editar Proveedor';
            case 'create': return 'Nuevo Proveedor';
            default: return 'Proveedores';
        }
    };

    const getEstadoBadge = (estado) => {
        const styles = {
            'ACTIVO': { bg: '#d1fae5', color: '#065f46' },
            'INACTIVO': { bg: '#fee2e2', color: '#991b1b' },
            'SUSPENDIDO': { bg: '#fef3c7', color: '#92400e' }
        };
        const s = styles[estado] || styles['ACTIVO'];
        return <span style={{ padding: '4px 12px', fontSize: '12px', fontWeight: '600', borderRadius: '9999px', backgroundColor: s.bg, color: s.color }}>{estado}</span>;
    };

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
                    { label: 'Nombre *', field: 'nombre', placeholder: 'Suministros López S.L.' },
                    { label: 'CIF *', field: 'cif', placeholder: 'B12345678', disabled: viewMode === 'edit' },
                    { label: 'Email', field: 'email', type: 'email', placeholder: 'contacto@proveedor.com' },
                    { label: 'Teléfono', field: 'telefono', type: 'tel', placeholder: '+34 900 123 456' },
                    { label: 'Dirección', field: 'direccion', placeholder: 'Polígono Industrial 5, Nave 12' },
                    { label: 'Ciudad', field: 'ciudad', placeholder: 'Valencia' },
                    { label: 'País', field: 'pais', placeholder: 'España' }
                ].map(({ label, field, disabled, type = 'text', placeholder }) => (
                    <div key={field}>
                        <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '6px', letterSpacing: '0.1px' }}>{label}</label>
                        <input type={type} value={formData[field]} onChange={(e) => handleInputChange(field, e.target.value)} disabled={disabled || loading} placeholder={placeholder}
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none', boxSizing: 'border-box', backgroundColor: (disabled || loading) ? '#f3f4f6' : 'white', color: '#000000' }} />
                    </div>
                ))}
                <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '6px', letterSpacing: '0.1px' }}>Estado *</label>
                    <select value={formData.estado} onChange={(e) => handleInputChange('estado', e.target.value)} disabled={loading}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none', boxSizing: 'border-box', backgroundColor: loading ? '#f3f4f6' : 'white', color: '#000000' }}>
                        <option value="ACTIVO">Activo</option>
                        <option value="INACTIVO">Inactivo</option>
                        <option value="SUSPENDIDO">Suspendido</option>
                    </select>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                <button onClick={handleCancel} disabled={loading} style={{ padding: '8px 24px', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#374151', backgroundColor: 'white', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '500', opacity: loading ? 0.6 : 1 }}>Cancelar</button>
                <button onClick={handleSave} disabled={loading} style={{ padding: '8px 24px', backgroundColor: loading ? '#94a3b8' : '#1d4ed8', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '500', opacity: loading ? 0.6 : 1 }}>
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
                                <input type="text" placeholder="Buscar proveedores..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ paddingLeft: '40px', paddingTop: '8px', paddingBottom: '8px', paddingRight: '16px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                            </div>
                            <button onClick={handleNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1d4ed8', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500', whiteSpace: 'nowrap' }}>
                                <Plus size={20} />Nuevo Proveedor
                            </button>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                                <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                    <tr>
                                        {['ID', 'Nombre', 'CIF', 'Email', 'Teléfono', 'Estado', 'Acciones'].map(h => (
                                            <th key={h} style={{ padding: '11px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProveedores.length === 0 ? (
                                        <tr><td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No se encontraron proveedores</td></tr>
                                    ) : (
                                        filteredProveedores.map((proveedor) => (
                                            <tr key={proveedor.id} onClick={() => handleViewProveedor(proveedor)}
                                                style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                                <td style={{ padding: '13px 20px', fontSize: '13.5px' }}>{proveedor.id}</td>
                                                <td style={{ padding: '13px 20px', fontSize: '13.5px', fontWeight: '500' }}>{proveedor.nombre}</td>
                                                <td style={{ padding: '13px 20px', fontSize: '13.5px' }}>{proveedor.cif}</td>
                                                <td style={{ padding: '13px 20px', fontSize: '13.5px' }}>{proveedor.email || '-'}</td>
                                                <td style={{ padding: '13px 20px', fontSize: '13.5px' }}>{proveedor.telefono || '-'}</td>
                                                <td style={{ padding: '13px 20px' }}>{getEstadoBadge(proveedor.estado)}</td>
                                                <td style={{ padding: '13px 20px' }} onClick={(e) => e.stopPropagation()}>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button onClick={() => handleViewProveedor(proveedor)} style={{ padding: '5px', color: '#16a34a', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '4px', display: 'inline-flex', alignItems: 'center' }} title="Ver"><Eye size={16} /></button>
                                                        <button onClick={() => handleEdit(proveedor)} style={{ padding: '5px', color: '#1d4ed8', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '4px', display: 'inline-flex', alignItems: 'center' }} title="Editar"><Edit2 size={16} /></button>
                                                        <button onClick={() => handleDelete(proveedor)} style={{ padding: '5px', color: '#dc2626', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '4px', display: 'inline-flex', alignItems: 'center' }} title="Eliminar"><Trash2 size={16} /></button>
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
                                    <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>{selectedProveedor?.nombre}</h2>
                                    {getEstadoBadge(selectedProveedor?.estado)}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                    {[
                                        { label: 'ID Proveedor', value: selectedProveedor?.id },
                                        { label: 'CIF', value: selectedProveedor?.cif },
                                        { label: 'Email', value: selectedProveedor?.email },
                                        { label: 'Teléfono', value: selectedProveedor?.telefono },
                                        { label: 'Dirección', value: selectedProveedor?.direccion },
                                        { label: 'Ciudad', value: selectedProveedor?.ciudad },
                                        { label: 'País', value: selectedProveedor?.pais },
                                        { label: 'Estado', value: selectedProveedor?.estado }
                                    ].map(({ label, value }) => (
                                        <div key={label}>
                                            <h3 style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.6px' }}>{label}</h3>
                                            <p style={{ fontSize: '15px', margin: 0, color: '#1e293b' }}>{value || '-'}</p>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                                    <button onClick={handleCancel} style={{ padding: '8px 24px', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#374151', backgroundColor: 'white', cursor: 'pointer', fontWeight: '500' }}>Volver</button>
                                    <button onClick={() => handleEdit(selectedProveedor)} style={{ padding: '7px 14px', backgroundColor: '#1d4ed8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }}>Editar Proveedor</button>
                                </div>
                            </>
                        )}
                    </div>
                ) : renderForm()}
            </div>
        </div>
    );
};

export default ProveedoresPage;