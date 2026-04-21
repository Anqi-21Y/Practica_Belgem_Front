import React, { useState, useEffect } from 'react';
import { Eye, Edit2, Trash2, Search, Plus, X, AlertCircle, BarChart2 } from 'lucide-react';
import MovimientoStockService from '../services/MovimientoStockService';
import { ArticulosService } from '../services/ArticulosService';
import AlmacenService from '../services/AlmacenService';
import TipoMovimientoService from '../services/TipoMovimientoService';
import ProfileButton from '../components/ProfileButton';

const MovimientoStockPage = () => {
    const [selectedMovimiento, setSelectedMovimiento] = useState(null);
    const [viewMode, setViewMode] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [movimientos, setMovimientos] = useState([]);
    const [stockActual, setStockActual] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [articulos, setArticulos] = useState([]);
    const [almacenes, setAlmacenes] = useState([]);
    const [tiposMovimiento, setTiposMovimiento] = useState([]);
    const [formData, setFormData] = useState({ articuloId: '', almacenId: '', tipoMovimientoId: '', cantidad: '', fecha: new Date().toISOString().split('T')[0], motivo: '', observaciones: '' });

    useEffect(() => { cargarMovimientos(); cargarDatosFormulario(); }, []);

    const cargarDatosFormulario = async () => {
        try {
            const [arts, alms, tipos] = await Promise.all([
                ArticulosService.getAll(),
                AlmacenService.listarAlmacenes(),
                TipoMovimientoService.listarTipos()
            ]);
            setArticulos(arts || []);
            setAlmacenes(alms || []);
            setTiposMovimiento(tipos || []);
        } catch (err) { console.error('Error cargando datos del formulario:', err); }
    };

    const cargarMovimientos = async () => {
        setLoading(true); setError(null);
        try { const data = await MovimientoStockService.listarMovimientos(); setMovimientos(data || []); }
        catch (err) { setError('Error al cargar los movimientos: ' + err.message); }
        finally { setLoading(false); }
    };

    const cargarStockActual = async () => {
        setLoading(true); setError(null);
        try { const data = await MovimientoStockService.obtenerStockActual(); setStockActual(data || []); }
        catch (err) { setError('Error al cargar el stock actual: ' + err.message); }
        finally { setLoading(false); }
    };

    const getNombreArticulo = (id) => { const a = articulos.find(x => x.id === id || x.id === Number(id)); return a ? a.nombre : `Artículo #${id}`; };
    const getNombreAlmacen = (id) => { const a = almacenes.find(x => x.id === id || x.id === Number(id)); return a ? a.nombre : `Almacén #${id}`; };
    const getNombreTipo = (id) => { const t = tiposMovimiento.find(x => x.id === id || x.id === Number(id)); return t ? t.nombre : `Tipo #${id}`; };

    const handleViewMovimiento = async (movimiento) => {
        setLoading(true); setError(null);
        try { const data = await MovimientoStockService.obtenerMovimientoPorId(movimiento.id); setSelectedMovimiento(data); setViewMode('view'); }
        catch (err) { setError('Error al obtener el movimiento: ' + err.message); }
        finally { setLoading(false); }
    };

    const handleEdit = (movimiento) => {
        setSelectedMovimiento(movimiento);
        setFormData({ articuloId: movimiento.articuloId || '', almacenId: movimiento.almacenId || '', tipoMovimientoId: movimiento.tipoMovimientoId || '', cantidad: movimiento.cantidad || '', fecha: movimiento.fecha ? movimiento.fecha.split('T')[0] : new Date().toISOString().split('T')[0], motivo: movimiento.motivo || '', observaciones: movimiento.observaciones || '' });
        setViewMode('edit');
    };

    const handleDelete = async (movimiento) => {
        if (!window.confirm('¿Estás seguro de eliminar este movimiento?\n\nEsta acción no se puede deshacer.')) return;
        setLoading(true); setError(null);
        try { await MovimientoStockService.eliminarMovimiento(movimiento.id); alert('Movimiento eliminado correctamente'); await cargarMovimientos(); }
        catch (err) { setError('Error al eliminar: ' + err.message); }
        finally { setLoading(false); }
    };

    const handleNew = () => { setSelectedMovimiento(null); setFormData({ articuloId: '', almacenId: '', tipoMovimientoId: '', cantidad: '', fecha: new Date().toISOString().split('T')[0], motivo: '', observaciones: '' }); setViewMode('create'); };

    const handleSave = async () => {
        if (!formData.articuloId || !formData.almacenId || !formData.tipoMovimientoId || !formData.cantidad || !formData.fecha || !formData.motivo) { alert('Completa todos los campos obligatorios'); return; }
        setLoading(true); setError(null);
        try {
            if (viewMode === 'edit') { await MovimientoStockService.actualizarMovimiento(selectedMovimiento.id, formData); alert('Movimiento actualizado correctamente'); }
            else { await MovimientoStockService.crearMovimiento(formData); alert('Movimiento registrado correctamente'); }
            await cargarMovimientos(); setViewMode('list'); setSelectedMovimiento(null);
        } catch (err) { setError('Error al guardar: ' + err.message); }
        finally { setLoading(false); }
    };

    const handleCancel = () => { setViewMode('list'); setSelectedMovimiento(null); setError(null); };
    const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
    const handleVerStockActual = () => { cargarStockActual(); setViewMode('stock'); };

    const filteredMovimientos = movimientos.filter(m => {
        const term = searchTerm.toLowerCase();
        return getNombreArticulo(m.articuloId).toLowerCase().includes(term) || getNombreAlmacen(m.almacenId).toLowerCase().includes(term) || getNombreTipo(m.tipoMovimientoId).toLowerCase().includes(term) || (m.motivo || '').toLowerCase().includes(term);
    });

    const getTitle = () => ({ view: 'Detalle del Movimiento', edit: 'Editar Movimiento', create: 'Registrar Movimiento', stock: 'Stock Actual por Artículo' }[viewMode] || 'Movimientos de Stock');

    const TipoBadge = ({ nombre }) => {
        const n = (nombre || '').toLowerCase();
        const styles = n.includes('entrada') ? { backgroundColor: '#dcfce7', color: '#16a34a' } : n.includes('salida') ? { backgroundColor: '#fee2e2', color: '#dc2626' } : { backgroundColor: '#dbeafe', color: '#2563eb' };
        return <span style={{ padding: '4px 12px', borderRadius: '9999px', fontSize: '13px', fontWeight: '600', ...styles }}>{nombre || '-'}</span>;
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

    const sel = { width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', backgroundColor: 'white' };
    const inp = { width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' };
    const lbl = { display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' };

    const renderForm = () => (
        <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px', maxWidth: '800px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            {error && <ErrorAlert message={error} />}
            <div style={{ display: 'grid', gap: '24px' }}>
                <div>
                    <label style={lbl}>Artículo *</label>
                    <select value={formData.articuloId} onChange={(e) => handleInputChange('articuloId', e.target.value)} style={sel}>
                        <option value="">Seleccionar artículo</option>
                        {articulos.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                    </select>
                </div>
                <div>
                    <label style={lbl}>Almacén *</label>
                    <select value={formData.almacenId} onChange={(e) => handleInputChange('almacenId', e.target.value)} style={sel}>
                        <option value="">Seleccionar almacén</option>
                        {almacenes.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                    </select>
                </div>
                <div>
                    <label style={lbl}>Tipo de movimiento *</label>
                    <select value={formData.tipoMovimientoId} onChange={(e) => handleInputChange('tipoMovimientoId', e.target.value)} style={sel}>
                        <option value="">Seleccionar tipo</option>
                        {tiposMovimiento.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                    </select>
                </div>
                <div>
                    <label style={lbl}>Cantidad *</label>
                    <input type="number" min="1" value={formData.cantidad} onChange={(e) => handleInputChange('cantidad', e.target.value)} placeholder="Ingresa la cantidad" style={inp} />
                </div>
                <div>
                    <label style={lbl}>Fecha *</label>
                    <input type="date" value={formData.fecha} onChange={(e) => handleInputChange('fecha', e.target.value)} style={inp} />
                </div>
                <div>
                    <label style={lbl}>Motivo *</label>
                    <input type="text" value={formData.motivo} onChange={(e) => handleInputChange('motivo', e.target.value)} placeholder="Ej. Compra a proveedor" style={inp} />
                </div>
                <div>
                    <label style={lbl}>Observaciones</label>
                    <textarea value={formData.observaciones} onChange={(e) => handleInputChange('observaciones', e.target.value)} rows={3} placeholder="Agrega comentarios adicionales (opcional)" style={{ ...inp, resize: 'vertical' }} />
                </div>
            </div>
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button onClick={handleCancel} disabled={loading} style={{ padding: '8px 24px', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#374151', backgroundColor: 'white', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '500', opacity: loading ? 0.6 : 1 }}>Cancelar</button>
                <button onClick={handleSave} disabled={loading} style={{ padding: '8px 24px', backgroundColor: loading ? '#94a3b8' : '#1d4ed8', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '500' }}>{loading ? 'Guardando...' : 'Registrar'}</button>
            </div>
        </div>
    );

    const renderStockActual = () => (
        <div>
            {error && <ErrorAlert message={error} />}
            {loading ? <LoadingSpinner /> : stockActual.map((articulo) => (
                <div key={articulo.id} style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '20px 24px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div>
                            <p style={{ fontWeight: '700', fontSize: '15px', margin: 0, color: '#1e293b' }}>{articulo.nombre}</p>
                            <p style={{ color: '#6b7280', fontSize: '13px', margin: '4px 0 0' }}>Stock total: {articulo.stockTotal} unidades</p>
                        </div>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead><tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <th style={{ textAlign: 'left', padding: '8px 0', fontSize: '12px', color: '#6b7280', fontWeight: '500', textTransform: 'uppercase' }}>Almacén</th>
                            <th style={{ textAlign: 'right', padding: '8px 0', fontSize: '12px', color: '#6b7280', fontWeight: '500', textTransform: 'uppercase' }}>Unidades</th>
                        </tr></thead>
                        <tbody>{articulo.almacenes?.map((alm, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '8px 0', fontSize: '14px', color: '#374151' }}>{alm.nombre}</td>
                                <td style={{ padding: '8px 0', fontSize: '14px', color: '#374151', textAlign: 'right' }}>{alm.cantidad} unidades</td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
            ))}
        </div>
    );

    const renderView = () => (
        <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '32px', maxWidth: '896px' }}>
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '2px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>{getNombreArticulo(selectedMovimiento?.articuloId)}</h2>
                <TipoBadge nombre={getNombreTipo(selectedMovimiento?.tipoMovimientoId)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {[
                    { label: 'Artículo', value: getNombreArticulo(selectedMovimiento?.articuloId) },
                    { label: 'Almacén', value: getNombreAlmacen(selectedMovimiento?.almacenId) },
                    { label: 'Tipo de Movimiento', value: getNombreTipo(selectedMovimiento?.tipoMovimientoId) },
                    { label: 'Cantidad', value: selectedMovimiento?.cantidad },
                    { label: 'Fecha', value: selectedMovimiento?.fecha ? new Date(selectedMovimiento.fecha).toLocaleDateString('es-ES') : '-' },
                    { label: 'Motivo', value: selectedMovimiento?.motivo }
                ].map(({ label, value }) => (
                    <div key={label}>
                        <h3 style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.6px' }}>{label}</h3>
                        <p style={{ fontSize: '15px', margin: 0, color: '#1e293b' }}>{value || '-'}</p>
                    </div>
                ))}
                {selectedMovimiento?.observaciones && (
                    <div style={{ gridColumn: '1 / -1' }}>
                        <h3 style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.6px' }}>Observaciones</h3>
                        <p style={{ fontSize: '15px', margin: 0, color: '#1e293b', lineHeight: '1.6' }}>{selectedMovimiento.observaciones}</p>
                    </div>
                )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                <button onClick={handleCancel} style={{ padding: '8px 24px', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#374151', backgroundColor: 'white', cursor: 'pointer', fontWeight: '500' }}>Volver</button>
                <button onClick={() => handleEdit(selectedMovimiento)} style={{ padding: '7px 14px', backgroundColor: '#1d4ed8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }}>Editar</button>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: "'Inter', system-ui, sans-serif" }}>
            <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, height: '60px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {viewMode !== 'list' && <button onClick={handleCancel} style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', borderRadius: '4px', display: 'inline-flex', alignItems: 'center' }}><X size={20} /></button>}
                    <h1 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', margin: 0 }}>{getTitle()}</h1>
                </div>
                <ProfileButton />
            </header>
            <div style={{ flex: 1, overflow: 'auto', padding: '24px', backgroundColor: '#f8fafc' }}>
                {error && viewMode === 'list' && <ErrorAlert message={error} />}
                {loading && viewMode === 'list' ? <LoadingSpinner />
                : viewMode === 'list' ? (
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                            <div style={{ position: 'relative', flexGrow: 1, minWidth: '250px' }}>
                                <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                <input type="text" placeholder="Buscar movimientos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ paddingLeft: '40px', paddingTop: '8px', paddingBottom: '8px', paddingRight: '16px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button onClick={handleVerStockActual} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'transparent', color: '#1d4ed8', padding: '7px 14px', borderRadius: '4px', border: '1px solid #bfdbfe', cursor: 'pointer', fontWeight: '500', fontSize: '13px', whiteSpace: 'nowrap' }}><BarChart2 size={20} /> Stock Actual</button>
                                <button onClick={handleNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1d4ed8', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500', whiteSpace: 'nowrap' }}><Plus size={20} /> Nuevo Movimiento</button>
                            </div>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                                <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                    <tr>{['Artículo', 'Almacén', 'Cantidad', 'Tipo de movimiento', 'Fecha', 'Motivo', 'Acciones'].map(h => (
                                        <th key={h} style={{ padding: '11px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{h}</th>
                                    ))}</tr>
                                </thead>
                                <tbody>
                                    {filteredMovimientos.length === 0 ? (
                                        <tr><td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No se encontraron movimientos de stock</td></tr>
                                    ) : filteredMovimientos.map((mov) => (
                                        <tr key={mov.id} style={{ borderBottom: '1px solid #f1f5f9' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                            <td style={{ padding: '13px 20px', fontSize: '13.5px', fontWeight: '500' }}>{getNombreArticulo(mov.articuloId)}</td>
                                            <td style={{ padding: '13px 20px', fontSize: '13.5px' }}>{getNombreAlmacen(mov.almacenId)}</td>
                                            <td style={{ padding: '13px 20px', fontSize: '13.5px', fontWeight: '700' }}>{mov.cantidad}</td>
                                            <td style={{ padding: '13px 20px' }}><TipoBadge nombre={getNombreTipo(mov.tipoMovimientoId)} /></td>
                                            <td style={{ padding: '13px 20px', fontSize: '13.5px' }}>{mov.fecha ? new Date(mov.fecha).toLocaleDateString('es-ES') : '-'}</td>
                                            <td style={{ padding: '13px 20px', fontSize: '13.5px' }}>{mov.motivo}</td>
                                            <td style={{ padding: '13px 20px' }}>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button onClick={() => handleViewMovimiento(mov)} style={{ padding: '5px', color: '#16a34a', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '4px', display: 'inline-flex', alignItems: 'center' }}><Eye size={16} /></button>
                                                    <button onClick={() => handleEdit(mov)} style={{ padding: '5px', color: '#1d4ed8', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '4px', display: 'inline-flex', alignItems: 'center' }}><Edit2 size={16} /></button>
                                                    <button onClick={() => handleDelete(mov)} style={{ padding: '5px', color: '#dc2626', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '4px', display: 'inline-flex', alignItems: 'center' }}><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : viewMode === 'view' ? renderView() : viewMode === 'stock' ? renderStockActual() : renderForm()}
            </div>
        </div>
    );
};

export default MovimientoStockPage;
