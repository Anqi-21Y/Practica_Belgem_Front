import React, { useState, useEffect } from 'react';
import {
    Eye, Edit2, Trash2, Search, Plus, X,
    AlertCircle, BarChart2, Bell, User
} from 'lucide-react';
import MovimientoStockService from '../services/MovimientoStockService';

const MovimientoStockPage = () => {

    const [selectedMovimiento, setSelectedMovimiento] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'create' | 'edit' | 'view' | 'stock'
    const [searchTerm, setSearchTerm] = useState('');
    const [movimientos, setMovimientos] = useState([]);
    const [stockActual, setStockActual] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        articuloId: '',
        almacenId: '',
        tipoMovimientoId: '',
        cantidad: '',
        fecha: new Date().toISOString().split('T')[0],
        motivo: '',
        observaciones: ''
    });

    useEffect(() => {
        cargarMovimientos();
    }, []);

    const cargarMovimientos = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await MovimientoStockService.listarMovimientos();
            setMovimientos(data || []);
        } catch (err) {
            setError('Error al cargar los movimientos: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const cargarStockActual = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await MovimientoStockService.obtenerStockActual();
            setStockActual(data || []);
        } catch (err) {
            setError('Error al cargar el stock actual: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleViewMovimiento = async (movimiento) => {
        setLoading(true);
        setError(null);
        try {
            const data = await MovimientoStockService.obtenerMovimientoPorId(movimiento.id);
            setSelectedMovimiento(data);
            setViewMode('view');
        } catch (err) {
            setError('Error al obtener el movimiento: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (movimiento) => {
        setSelectedMovimiento(movimiento);
        setFormData({
            articuloId: movimiento.articuloId || '',
            almacenId: movimiento.almacenId || '',
            tipoMovimientoId: movimiento.tipoMovimientoId || '',
            cantidad: movimiento.cantidad || '',
            fecha: movimiento.fecha || new Date().toISOString().split('T')[0],
            motivo: movimiento.motivo || '',
            observaciones: movimiento.observaciones || ''
        });
        setViewMode('edit');
    };

    const handleDelete = async (movimiento) => {
        if (!window.confirm('¿Estás seguro de eliminar este movimiento?\n\nEsta acción no se puede deshacer.')) return;

        setLoading(true);
        setError(null);
        try {
            await MovimientoStockService.eliminarMovimiento(movimiento.id);
            alert('Movimiento eliminado correctamente');
            await cargarMovimientos();
        } catch (err) {
            setError('Error al eliminar: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleNew = () => {
        setSelectedMovimiento(null);
        setFormData({
            articuloId: '',
            almacenId: '',
            tipoMovimientoId: '',
            cantidad: '',
            fecha: new Date().toISOString().split('T')[0],
            motivo: '',
            observaciones: ''
        });
        setViewMode('create');
    };

    const handleSave = async () => {
        if (!formData.articuloId || !formData.almacenId || !formData.tipoMovimientoId || !formData.cantidad || !formData.fecha || !formData.motivo) {
            alert('Completa todos los campos obligatorios');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            if (viewMode === 'edit') {
                await MovimientoStockService.actualizarMovimiento(selectedMovimiento.id, formData);
                alert('Movimiento actualizado correctamente');
            } else {
                await MovimientoStockService.crearMovimiento(formData);
                alert('Movimiento registrado correctamente');
            }
            await cargarMovimientos();
            setViewMode('list');
            setSelectedMovimiento(null);
        } catch (err) {
            setError('Error al guardar: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setViewMode('list');
        setSelectedMovimiento(null);
        setError(null);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleVerStockActual = () => {
        cargarStockActual();
        setViewMode('stock');
    };

    const filteredMovimientos = movimientos.filter(m =>
        m.articulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.almacen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.tipoMovimiento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.motivo?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTitle = () => {
        switch (viewMode) {
            case 'view': return 'Detalle del Movimiento';
            case 'edit': return 'Editar Movimiento';
            case 'create': return 'Registrar Movimiento';
            case 'stock': return 'Stock Actual por Artículo';
            default: return 'Movimientos de Stock';
        }
    };

    const TipoBadge = ({ tipo }) => {
        const styles = {
            Entrada: { backgroundColor: '#dcfce7', color: '#16a34a' },
            Salida: { backgroundColor: '#fee2e2', color: '#dc2626' },
            Transferencia: { backgroundColor: '#dbeafe', color: '#2563eb' }
        };
        return (
            <span style={{
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: '600',
                ...(styles[tipo] || { backgroundColor: '#f3f4f6', color: '#374151' })
            }}>
                {tipo}
            </span>
        );
    };

    const ErrorAlert = ({ message }) => (
        <div style={{
            backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px',
            padding: '12px 16px', marginBottom: '16px', display: 'flex',
            alignItems: 'center', gap: '12px', color: '#dc2626'
        }}>
            <AlertCircle size={20} />
            <span>{message}</span>
        </div>
    );

    const LoadingSpinner = () => (
        <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{
                width: '40px', height: '40px', border: '4px solid #e5e7eb',
                borderTop: '4px solid #4f46e5', borderRadius: '50%',
                animation: 'spin 1s linear infinite', margin: '0 auto'
            }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <p style={{ marginTop: '16px', color: '#6b7280' }}>Cargando...</p>
        </div>
    );

    const renderForm = () => (
        <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px', maxWidth: '800px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            {error && <ErrorAlert message={error} />}
            <div style={{ display: 'grid', gap: '24px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Artículo *</label>
                    <select value={formData.articuloId} onChange={(e) => handleInputChange('articuloId', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}>
                        <option value="">Seleccionar artículo</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Almacén *</label>
                    <select value={formData.almacenId} onChange={(e) => handleInputChange('almacenId', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}>
                        <option value="">Seleccionar almacén</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Tipo de movimiento *</label>
                    <select value={formData.tipoMovimientoId} onChange={(e) => handleInputChange('tipoMovimientoId', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}>
                        <option value="">Seleccionar tipo</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Cantidad *</label>
                    <input type="number" min="1" value={formData.cantidad} onChange={(e) => handleInputChange('cantidad', e.target.value)}
                        placeholder="Ingresa la cantidad"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Fecha *</label>
                    <input type="date" value={formData.fecha} onChange={(e) => handleInputChange('fecha', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Motivo *</label>
                    <input type="text" value={formData.motivo} onChange={(e) => handleInputChange('motivo', e.target.value)}
                        placeholder="Ej. Compra a proveedor"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>Observaciones</label>
                    <textarea value={formData.observaciones} onChange={(e) => handleInputChange('observaciones', e.target.value)}
                        rows={3} placeholder="Agrega comentarios adicionales (opcional)"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }} />
                </div>
            </div>
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button onClick={handleCancel} disabled={loading}
                    style={{ padding: '8px 24px', border: '1px solid #d1d5db', borderRadius: '8px', color: '#374151', backgroundColor: 'white', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '500', opacity: loading ? 0.6 : 1 }}>
                    Cancelar
                </button>
                <button onClick={handleSave} disabled={loading}
                    style={{ padding: '8px 24px', backgroundColor: loading ? '#9ca3af' : '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '500' }}>
                    {loading ? 'Guardando...' : 'Registrar'}
                </button>
            </div>
        </div>
    );

    const renderStockActual = () => (
        <div>
            {error && <ErrorAlert message={error} />}
            {loading ? <LoadingSpinner /> : (
                stockActual.map((articulo) => (
                    <div key={articulo.id} style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '20px 24px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div>
                                <p style={{ fontWeight: '700', fontSize: '16px', margin: 0 }}>{articulo.nombre}</p>
                                <p style={{ color: '#6b7280', fontSize: '13px', margin: '4px 0 0' }}>Stock total: {articulo.stockTotal} unidades</p>
                            </div>
                            <TipoBadge tipo={articulo.stockTotal > 0 ? 'Alta' : 'Baja'} />
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <th style={{ textAlign: 'left', padding: '8px 0', fontSize: '12px', color: '#6b7280', fontWeight: '500', textTransform: 'uppercase' }}>Almacén</th>
                                    <th style={{ textAlign: 'right', padding: '8px 0', fontSize: '12px', color: '#6b7280', fontWeight: '500', textTransform: 'uppercase' }}>Unidades</th>
                                </tr>
                            </thead>
                            <tbody>
                                {articulo.almacenes?.map((alm, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        <td style={{ padding: '8px 0', fontSize: '14px', color: '#374151' }}>{alm.nombre}</td>
                                        <td style={{ padding: '8px 0', fontSize: '14px', color: '#374151', textAlign: 'right' }}>{alm.cantidad} unidades</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))
            )}
        </div>
    );

    const renderView = () => (
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '32px', maxWidth: '896px' }}>
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '2px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>{selectedMovimiento?.articulo}</h2>
                <TipoBadge tipo={selectedMovimiento?.tipoMovimiento} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {[
                    { label: 'Artículo', value: selectedMovimiento?.articulo },
                    { label: 'Almacén', value: selectedMovimiento?.almacen },
                    { label: 'Tipo de Movimiento', value: selectedMovimiento?.tipoMovimiento },
                    { label: 'Cantidad', value: selectedMovimiento?.cantidad },
                    { label: 'Fecha', value: selectedMovimiento?.fecha },
                    { label: 'Motivo', value: selectedMovimiento?.motivo }
                ].map(({ label, value }) => (
                    <div key={label}>
                        <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</h3>
                        <p style={{ fontSize: '16px', margin: 0 }}>{value || '-'}</p>
                    </div>
                ))}
                {selectedMovimiento?.observaciones && (
                    <div style={{ gridColumn: '1 / -1' }}>
                        <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>Observaciones</h3>
                        <p style={{ fontSize: '16px', margin: 0, lineHeight: '1.6' }}>{selectedMovimiento.observaciones}</p>
                    </div>
                )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                <button onClick={handleCancel} style={{ padding: '8px 24px', border: '1px solid #d1d5db', borderRadius: '8px', color: '#374151', backgroundColor: 'white', cursor: 'pointer', fontWeight: '500' }}>Volver</button>
                <button onClick={() => handleEdit(selectedMovimiento)} style={{ padding: '8px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Editar</button>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'system-ui' }}>

            {/* HEADER */}
            <header style={{
                backgroundColor: 'white',
                borderBottom: '1px solid #e5e7eb',
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {viewMode !== 'list' && (
                        <button onClick={handleCancel} style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                            <X size={20} />
                        </button>
                    )}
                    <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#1f2937', margin: 0 }}>{getTitle()}</h1>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative' }}>
                        <Bell size={20} />
                        <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' }} />
                    </button>
                    <button style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                        <User size={20} />
                    </button>
                </div>
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
                                <input type="text" placeholder="Buscar movimientos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ paddingLeft: '40px', paddingTop: '8px', paddingBottom: '8px', paddingRight: '16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button onClick={handleVerStockActual}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'white', color: '#4f46e5', padding: '8px 16px', borderRadius: '8px', border: '1px solid #4f46e5', cursor: 'pointer', fontWeight: '500', whiteSpace: 'nowrap' }}>
                                    <BarChart2 size={20} /> Stock Actual
                                </button>
                                <button onClick={handleNew}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#4f46e5', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500', whiteSpace: 'nowrap' }}>
                                    <Plus size={20} /> Nuevo Movimiento
                                </button>
                            </div>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                                <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                    <tr>
                                        {['Artículo', 'Almacén', 'Cantidad', 'Tipo de movimiento', 'Fecha', 'Motivo', 'Acciones'].map(h => (
                                            <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMovimientos.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No se encontraron movimientos de stock</td>
                                        </tr>
                                    ) : (
                                        filteredMovimientos.map((mov) => (
                                            <tr key={mov.id} style={{ borderBottom: '1px solid #e5e7eb', cursor: 'pointer' }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                                <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500' }}>{mov.articulo}</td>
                                                <td style={{ padding: '16px 24px', fontSize: '14px' }}>{mov.almacen}</td>
                                                <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '700' }}>{mov.cantidad}</td>
                                                <td style={{ padding: '16px 24px' }}><TipoBadge tipo={mov.tipoMovimiento} /></td>
                                                <td style={{ padding: '16px 24px', fontSize: '14px' }}>{mov.fecha}</td>
                                                <td style={{ padding: '16px 24px', fontSize: '14px' }}>{mov.motivo}</td>
                                                <td style={{ padding: '16px 24px' }}>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button onClick={() => handleViewMovimiento(mov)} style={{ padding: '8px', color: '#059669', background: 'transparent', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Eye size={16} /></button>
                                                        <button onClick={() => handleEdit(mov)} style={{ padding: '8px', color: '#4f46e5', background: 'transparent', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Edit2 size={16} /></button>
                                                        <button onClick={() => handleDelete(mov)} style={{ padding: '8px', color: '#dc2626', background: 'transparent', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : viewMode === 'view' ? renderView()
                    : viewMode === 'stock' ? renderStockActual()
                        : renderForm()}
            </div>
        </div>
    );
};

export default MovimientoStockPage;