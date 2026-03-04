import React, { useState, useEffect } from "react";
import { Eye, Edit2, Trash2, Search, Plus, X, AlertCircle } from 'lucide-react';
import ProfileButton from '../components/ProfileButton';
import AlmacenService from '../services/AlmacenService';

const AlmacenesPage = () => {
    const [selectedAlmacen, setSelectedAlmacen] = useState(null);
    const [viewMode, setViewMode] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [almacenes, setAlmacenes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        id: '', nombre: '', direccion: '', telefono: '', responsable: '', activo: true
    });

    useEffect(() => { cargarAlmacenes(); }, []);

    const cargarAlmacenes = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await AlmacenService.listarAlmacenes();
            setAlmacenes(data);
        } catch (err) {
            setError('Error al cargar los almacenes: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleViewAlmacen = async (almacen) => {
        setLoading(true);
        setError(null);
        try {
            const data = await AlmacenService.obtenerAlmacenPorId(almacen.id);
            setSelectedAlmacen(data);
            setViewMode('view');
        } catch (err) {
            setError('Error al obtener el almacén: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (almacen) => {
        setSelectedAlmacen(almacen);
        setFormData({
            id: almacen.id, nombre: almacen.nombre || '', direccion: almacen.direccion || '',
            telefono: almacen.telefono || '', responsable: almacen.responsable || '',
            activo: almacen.activo !== undefined ? almacen.activo : true
        });
        setViewMode('edit');
    };

    const handleDelete = async (almacen) => {
        if (!window.confirm(`¿Estás seguro de que deseas eliminar el almacén "${almacen.nombre}"?\n\nEsta acción no se puede deshacer.`)) return;
        setLoading(true);
        setError(null);
        try {
            await AlmacenService.eliminarAlmacen(almacen.id);
            alert(`Almacén "${almacen.nombre}" eliminado correctamente`);
            await cargarAlmacenes();
        } catch (err) {
            setError('Error al eliminar el almacén: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleNew = () => {
        setSelectedAlmacen(null);
        setFormData({ id: '', nombre: '', direccion: '', telefono: '', responsable: '', activo: true });
        setViewMode('create');
    };

    const handleSave = async () => {
        if (!formData.nombre) { alert('Por favor completa los campos obligatorios (Nombre)'); return; }
        setLoading(true);
        setError(null);
        try {
            if (viewMode === 'edit') {
                await AlmacenService.actualizarAlmacen(selectedAlmacen.id, formData);
                alert('Almacén actualizado correctamente');
            } else {
                await AlmacenService.crearAlmacen(formData);
                alert('Almacén creado correctamente');
            }
            await cargarAlmacenes();
            setViewMode('list');
            setSelectedAlmacen(null);
        } catch (err) {
            setError('Error al guardar el almacén: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => { setViewMode('list'); setSelectedAlmacen(null); setError(null); };
    const handleInputChange = (field, value) => setFormData({ ...formData, [field]: value });

    const filteredAlmacenes = almacenes.filter(alm =>
        alm.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alm.responsable?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alm.direccion?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTitle = () => {
        switch (viewMode) {
            case 'view': return 'Detalles del Almacén';
            case 'edit': return 'Editar Almacén';
            case 'create': return 'Nuevo Almacén';
            default: return 'Almacenes';
        }
    };

    const getActivoBadge = (activo) => {
        const style = activo
            ? { bg: '#d1fae5', color: '#065f46', label: 'ACTIVO' }
            : { bg: '#fee2e2', color: '#991b1b', label: 'INACTIVO' };
        return (
            <span style={{ padding: '4px 12px', fontSize: '12px', fontWeight: '600', borderRadius: '9999px', backgroundColor: style.bg, color: style.color }}>
                {style.label}
            </span>
        );
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
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px', maxWidth: '896px' }}>
            {error && <ErrorAlert message={error} />}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {[
                    { label: 'Nombre *', field: 'nombre', placeholder: 'Almacén Central' },
                    { label: 'Responsable', field: 'responsable', placeholder: 'Juan Pérez' },
                    { label: 'Teléfono', field: 'telefono', type: 'tel', placeholder: '+34 900 123 456' },
                    { label: 'Dirección', field: 'direccion', placeholder: 'Calle Principal 123' }
                ].map(({ label, field, type = 'text', placeholder }) => (
                    <div key={field}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>{label}</label>
                        <input type={type} value={formData[field]} onChange={(e) => handleInputChange(field, e.target.value)} disabled={loading} placeholder={placeholder}
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', backgroundColor: loading ? '#f3f4f6' : 'white', color: '#000000' }} />
                    </div>
                ))}
                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Estado *</label>
                    <select value={formData.activo ? 'true' : 'false'} onChange={(e) => handleInputChange('activo', e.target.value === 'true')} disabled={loading}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', backgroundColor: loading ? '#f3f4f6' : 'white', color: '#000000' }}>
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </select>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
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
                                <input type="text" placeholder="Buscar almacenes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ paddingLeft: '40px', paddingTop: '8px', paddingBottom: '8px', paddingRight: '16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                            </div>
                            <button onClick={handleNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#4f46e5', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500', whiteSpace: 'nowrap' }}>
                                <Plus size={20} />Nuevo Almacén
                            </button>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                                <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                    <tr>
                                        {['ID', 'Nombre', 'Dirección', 'Teléfono', 'Responsable', 'Estado', 'Acciones'].map(h => (
                                            <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAlmacenes.length === 0 ? (
                                        <tr><td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No se encontraron almacenes</td></tr>
                                    ) : (
                                        filteredAlmacenes.map((almacen) => (
                                            <tr key={almacen.id} onClick={() => handleViewAlmacen(almacen)}
                                                style={{ borderBottom: '1px solid #e5e7eb', cursor: 'pointer' }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                                <td style={{ padding: '16px 24px', fontSize: '14px' }}>{almacen.id}</td>
                                                <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500' }}>{almacen.nombre}</td>
                                                <td style={{ padding: '16px 24px', fontSize: '14px' }}>{almacen.direccion || '-'}</td>
                                                <td style={{ padding: '16px 24px', fontSize: '14px' }}>{almacen.telefono || '-'}</td>
                                                <td style={{ padding: '16px 24px', fontSize: '14px' }}>{almacen.responsable || '-'}</td>
                                                <td style={{ padding: '16px 24px' }}>{getActivoBadge(almacen.activo)}</td>
                                                <td style={{ padding: '16px 24px' }} onClick={(e) => e.stopPropagation()}>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button onClick={() => handleViewAlmacen(almacen)} style={{ padding: '8px', color: '#059669', background: 'transparent', border: 'none', cursor: 'pointer' }} title="Ver"><Eye size={16} /></button>
                                                        <button onClick={() => handleEdit(almacen)} style={{ padding: '8px', color: '#4f46e5', background: 'transparent', border: 'none', cursor: 'pointer' }} title="Editar"><Edit2 size={16} /></button>
                                                        <button onClick={() => handleDelete(almacen)} style={{ padding: '8px', color: '#dc2626', background: 'transparent', border: 'none', cursor: 'pointer' }} title="Eliminar"><Trash2 size={16} /></button>
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
                                    <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>{selectedAlmacen?.nombre}</h2>
                                    {getActivoBadge(selectedAlmacen?.activo)}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                    {[
                                        { label: 'ID Almacén', value: selectedAlmacen?.id },
                                        { label: 'Responsable', value: selectedAlmacen?.responsable },
                                        { label: 'Teléfono', value: selectedAlmacen?.telefono },
                                        { label: 'Dirección', value: selectedAlmacen?.direccion },
                                        { label: 'Estado', value: selectedAlmacen?.activo ? 'Activo' : 'Inactivo' }
                                    ].map(({ label, value }) => (
                                        <div key={label}>
                                            <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</h3>
                                            <p style={{ fontSize: '16px', margin: 0 }}>{value ?? '-'}</p>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                                    <button onClick={handleCancel} style={{ padding: '8px 24px', border: '1px solid #d1d5db', borderRadius: '8px', color: '#374151', backgroundColor: 'white', cursor: 'pointer', fontWeight: '500' }}>Volver</button>
                                    <button onClick={() => handleEdit(selectedAlmacen)} style={{ padding: '8px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Editar Almacén</button>
                                </div>
                            </>
                        )}
                    </div>
                ) : renderForm()}
            </div>
        </div>
    );
};

export default AlmacenesPage;