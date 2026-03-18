import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, AlertCircle, Calendar, Eye } from 'lucide-react';
import PedidosService, { mapPedidoFromBackend, mapDetalleFromBackend } from '../services/PedidosService';
import ProfileButton from '../components/ProfileButton';

const Pedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list');
    const [selectedPedido, setSelectedPedido] = useState(null);

    // Modal detalle
    const [modalDetalle, setModalDetalle] = useState(false);
    const [detalles, setDetalles] = useState([]);
    const [loadingDetalles, setLoadingDetalles] = useState(false);
    const [pedidoDetalle, setPedidoDetalle] = useState(null);

    const [formData, setFormData] = useState({ id: '', cliente_id: '', representante_id: '', fecha: new Date().toISOString().split('T')[0], estado: 'CREADO', total: 0, observaciones: '' });

    useEffect(() => { cargarPedidos(); }, []);

    const cargarPedidos = async () => {
        setLoading(true); setError(null);
        try { const data = await PedidosService.listarPedidos(); setPedidos(data.map(mapPedidoFromBackend)); }
        catch (err) { setError('Error al cargar los pedidos: ' + err.message); }
        finally { setLoading(false); }
    };

    const handleVerDetalles = async (pedido) => {
        setPedidoDetalle(pedido);
        setModalDetalle(true);
        setLoadingDetalles(true);
        try {
            const data = await PedidosService.obtenerDetalles(pedido.id);
            setDetalles((data || []).map(mapDetalleFromBackend));
        } catch (err) {
            setDetalles([]);
        } finally {
            setLoadingDetalles(false);
        }
    };

    const handleViewPedido = async (pedido) => {
        setLoading(true); setError(null);
        try { const data = await PedidosService.obtenerPedidoPorId(pedido.id); setSelectedPedido(mapPedidoFromBackend(data)); setViewMode('view'); }
        catch (err) { setError('Error al obtener el pedido: ' + err.message); }
        finally { setLoading(false); }
    };

    const handleNew = () => { setSelectedPedido(null); setFormData({ id: '', cliente_id: '', representante_id: '', fecha: new Date().toISOString().split('T')[0], estado: 'CREADO', total: 0, observaciones: '' }); setViewMode('create'); };
    const handleEdit = (pedido) => { setSelectedPedido(pedido); setFormData({ ...pedido, fecha: pedido.fecha ? new Date(pedido.fecha).toISOString().split('T')[0] : new Date().toISOString().split('T')[0], cliente_id: pedido.cliente_id || '', representante_id: pedido.representante_id || '' }); setViewMode('edit'); };

    const handleDelete = async (pedido) => {
        if (!window.confirm(`¿Estás seguro de que deseas eliminar el pedido #${pedido.id}?\n\nEsta acción no se puede deshacer.`)) return;
        setLoading(true); setError(null);
        try { await PedidosService.eliminarPedido(pedido.id); alert(`Pedido #${pedido.id} eliminado correctamente`); await cargarPedidos(); }
        catch (err) { setError('Error al eliminar el pedido: ' + err.message); }
        finally { setLoading(false); }
    };

    const handleSave = async () => {
        if (!formData.cliente_id || !formData.representante_id) { alert('Por favor completa los campos obligatorios (Cliente y Representante)'); return; }
        setLoading(true); setError(null);
        try {
            if (viewMode === 'edit') { await PedidosService.actualizarPedido(selectedPedido.id, formData); alert('Pedido actualizado correctamente'); }
            else { await PedidosService.crearPedido(formData); alert('Pedido creado correctamente'); }
            await cargarPedidos(); setViewMode('list'); setSelectedPedido(null);
        } catch (err) { setError('Error al guardar el pedido: ' + err.message); }
        finally { setLoading(false); }
    };

    const handleCancel = () => { setViewMode('list'); setSelectedPedido(null); setError(null); };
    const handleInputChange = (field, value) => setFormData({ ...formData, [field]: value });

    const filteredPedidos = pedidos.filter(p => p.id?.toString().includes(searchTerm) || p.cliente_id?.toString().includes(searchTerm) || p.estado?.toLowerCase().includes(searchTerm.toLowerCase()));

    const getTitle = () => ({ view: 'Detalles del Pedido', edit: 'Editar Pedido', create: 'Nuevo Pedido' }[viewMode] || 'Pedidos');
    const formatFecha = (fecha) => { if (!fecha) return '-'; return new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }); };
    const getEstadoBadgeStyle = (estado) => ({ 'CREADO': { bg: '#dbeafe', color: '#1e40af' }, 'CONFIRMADO': { bg: '#d1fae5', color: '#065f46' }, 'EN_PROCESO': { bg: '#fef3c7', color: '#92400e' }, 'ENVIADO': { bg: '#e0e7ff', color: '#3730a3' }, 'ENTREGADO': { bg: '#d1fae5', color: '#065f46' }, 'CANCELADO': { bg: '#fee2e2', color: '#991b1b' } }[estado] || { bg: '#f3f4f6', color: '#374151' });

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

    // ─── MODAL PEDIDO DETALLE ──────────────────────────────────────────────────
    const ModalDetalle = () => {
        if (!modalDetalle) return null;
        const estadoStyle = getEstadoBadgeStyle(pedidoDetalle?.estado);
        return (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', width: '100%', maxWidth: '780px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>

                    {/* Header modal */}
                    <div style={{ padding: '24px 28px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: '#1f2937' }}>Pedido #{pedidoDetalle?.id}</h2>
                            <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ padding: '3px 10px', fontSize: '12px', fontWeight: '600', borderRadius: '9999px', backgroundColor: estadoStyle.bg, color: estadoStyle.color }}>{pedidoDetalle?.estado}</span>
                                <span style={{ fontSize: '13px', color: '#6b7280' }}>{formatFecha(pedidoDetalle?.fecha)}</span>
                            </div>
                        </div>
                        <button onClick={() => setModalDetalle(false)} style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', color: '#6b7280', borderRadius: '6px' }}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Info cabecera pedido */}
                    <div style={{ padding: '20px 28px', borderBottom: '1px solid #f3f4f6', backgroundColor: '#f9fafb', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', flexShrink: 0 }}>
                        {[
                            { label: 'Cliente', value: `#${pedidoDetalle?.cliente_id}` },
                            { label: 'Representante', value: `#${pedidoDetalle?.representante_id}` },
                            { label: 'Total', value: `${parseFloat(pedidoDetalle?.total || 0).toFixed(2)}€` }
                        ].map(({ label, value }) => (
                            <div key={label}>
                                <p style={{ fontSize: '11px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', margin: '0 0 4px' }}>{label}</p>
                                <p style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937', margin: 0 }}>{value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Tabla de líneas */}
                    <div style={{ flex: 1, overflow: 'auto', padding: '0 28px 28px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: '20px 0 12px' }}>Líneas del pedido</h3>
                        {loadingDetalles ? (
                            <LoadingSpinner />
                        ) : detalles.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af', border: '2px dashed #e5e7eb', borderRadius: '8px' }}>
                                <p style={{ margin: 0 }}>Este pedido no tiene líneas de detalle.</p>
                            </div>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                <thead style={{ backgroundColor: '#f9fafb' }}>
                                    <tr>
                                        {['#', 'Artículo ID', 'Cantidad', 'Precio unitario', 'Subtotal'].map(h => (
                                            <th key={h} style={{ padding: '10px 16px', textAlign: h === 'Cantidad' || h === 'Precio unitario' || h === 'Subtotal' ? 'right' : 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {detalles.map((d, i) => (
                                        <tr key={d.id} style={{ borderBottom: '1px solid #f3f4f6' }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                            <td style={{ padding: '12px 16px', color: '#9ca3af' }}>{i + 1}</td>
                                            <td style={{ padding: '12px 16px', fontWeight: '500' }}>Artículo #{d.articulo_id}</td>
                                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>{d.cantidad}</td>
                                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>{parseFloat(d.precio_unitario).toFixed(2)}€</td>
                                            <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '700', color: '#1f2937' }}>{parseFloat(d.subtotal).toFixed(2)}€</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr style={{ borderTop: '2px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                                        <td colSpan="4" style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', color: '#374151', fontSize: '13px', textTransform: 'uppercase' }}>Total</td>
                                        <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '700', fontSize: '16px', color: '#4f46e5' }}>
                                            {detalles.reduce((sum, d) => sum + parseFloat(d.subtotal || 0), 0).toFixed(2)}€
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        )}
                    </div>

                    {/* Footer modal */}
                    <div style={{ padding: '16px 28px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: '12px', flexShrink: 0 }}>
                        <button onClick={() => setModalDetalle(false)} style={{ padding: '8px 20px', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#374151', backgroundColor: 'white', cursor: 'pointer', fontWeight: '500' }}>Cerrar</button>
                        <button onClick={() => { setModalDetalle(false); handleViewPedido(pedidoDetalle); }} style={{ padding: '8px 20px', backgroundColor: '#1d4ed8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Ver pedido completo</button>
                    </div>
                </div>
            </div>
        );
    };

    const renderForm = () => (
        <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '28px', maxWidth: '800px' }}>
            {error && <ErrorAlert message={error} />}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {selectedPedido && (
                    <div>
                        <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '6px', letterSpacing: '0.1px' }}>ID Pedido</label>
                        <input type="text" value={formData.id} disabled style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#f3f4f6', boxSizing: 'border-box' }} />
                    </div>
                )}
                <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '6px', letterSpacing: '0.1px' }}>ID Cliente *</label>
                    <input type="number" value={formData.cliente_id} onChange={(e) => handleInputChange('cliente_id', e.target.value)} disabled={loading} placeholder="ID del cliente" style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none', boxSizing: 'border-box', backgroundColor: loading ? '#f3f4f6' : 'white' }} />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '6px', letterSpacing: '0.1px' }}>ID Representante *</label>
                    <input type="number" value={formData.representante_id} onChange={(e) => handleInputChange('representante_id', e.target.value)} disabled={loading} placeholder="ID del representante" style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none', boxSizing: 'border-box', backgroundColor: loading ? '#f3f4f6' : 'white' }} />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '6px', letterSpacing: '0.1px' }}>Fecha</label>
                    <input type="date" value={formData.fecha} onChange={(e) => handleInputChange('fecha', e.target.value)} disabled={loading} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none', boxSizing: 'border-box', backgroundColor: loading ? '#f3f4f6' : 'white' }} />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '6px', letterSpacing: '0.1px' }}>Estado</label>
                    <select value={formData.estado} onChange={(e) => handleInputChange('estado', e.target.value)} disabled={loading} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none', boxSizing: 'border-box', backgroundColor: loading ? '#f3f4f6' : 'white' }}>
                        <option value="CREADO">CREADO</option>
                        <option value="CONFIRMADO">CONFIRMADO</option>
                        <option value="EN_PROCESO">EN PROCESO</option>
                        <option value="ENVIADO">ENVIADO</option>
                        <option value="ENTREGADO">ENTREGADO</option>
                        <option value="CANCELADO">CANCELADO</option>
                    </select>
                </div>
                {selectedPedido && (
                    <div>
                        <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '6px', letterSpacing: '0.1px' }}>Total (€)</label>
                        <input type="text" value={`${parseFloat(formData.total || 0).toFixed(2)}€`} disabled style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#f3f4f6', boxSizing: 'border-box', fontWeight: '700' }} />
                    </div>
                )}
                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '6px', letterSpacing: '0.1px' }}>Observaciones</label>
                    <textarea value={formData.observaciones} onChange={(e) => handleInputChange('observaciones', e.target.value)} disabled={loading} rows={4} placeholder="Notas adicionales sobre el pedido..." style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none', boxSizing: 'border-box', backgroundColor: loading ? '#f3f4f6' : 'white', resize: 'vertical' }} />
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                <button onClick={handleCancel} disabled={loading} style={{ padding: '8px 24px', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#374151', backgroundColor: 'white', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '500', opacity: loading ? 0.6 : 1 }}>Cancelar</button>
                <button onClick={handleSave} disabled={loading} style={{ padding: '8px 24px', backgroundColor: '#1d4ed8', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '500', opacity: loading ? 0.6 : 1 }}>{loading ? 'Guardando...' : 'Guardar Cambios'}</button>
            </div>
        </div>
    );

    const renderView = () => {
        const estadoStyle = getEstadoBadgeStyle(selectedPedido?.estado);
        return (
            <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '32px', maxWidth: '800px' }}>
                {loading ? <LoadingSpinner /> : (
                    <>
                        <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '2px solid #e5e7eb' }}>
                            <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Pedido #{selectedPedido?.id}</h2>
                            <span style={{ padding: '6px 12px', fontSize: '14px', fontWeight: '600', borderRadius: '9999px', backgroundColor: estadoStyle.bg, color: estadoStyle.color, display: 'inline-block' }}>{selectedPedido?.estado}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                            {[
                                { label: 'ID Pedido', value: `#${selectedPedido?.id}` },
                                { label: 'Fecha', value: formatFecha(selectedPedido?.fecha) },
                                { label: 'Cliente', value: `Cliente #${selectedPedido?.cliente_id}` },
                                { label: 'Representante', value: `Rep. #${selectedPedido?.representante_id}` }
                            ].map(({ label, value }) => (
                                <div key={label}>
                                    <h3 style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.6px' }}>{label}</h3>
                                    <p style={{ fontSize: '15px', margin: 0, color: '#1e293b' }}>{value}</p>
                                </div>
                            ))}
                            <div>
                                <h3 style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.6px' }}>Total</h3>
                                <p style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>{parseFloat(selectedPedido?.total || 0).toFixed(2)}€</p>
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <h3 style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.6px' }}>Observaciones</h3>
                                <p style={{ fontSize: '15px', margin: 0, color: '#1e293b', lineHeight: '1.6' }}>{selectedPedido?.observaciones || 'Sin observaciones'}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                            <button onClick={handleCancel} style={{ padding: '8px 24px', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#374151', backgroundColor: 'white', cursor: 'pointer', fontWeight: '500' }}>Volver</button>
                            <button onClick={() => handleEdit(selectedPedido)} style={{ padding: '7px 14px', backgroundColor: '#1d4ed8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }}>Editar Pedido</button>
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: "'Inter', system-ui, sans-serif" }}>
            <ModalDetalle />

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
                                <input type="text" placeholder="Buscar pedidos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ paddingLeft: '40px', paddingTop: '8px', paddingBottom: '8px', paddingRight: '16px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                            </div>
                            <button onClick={handleNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1d4ed8', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500', whiteSpace: 'nowrap' }}>
                                <Plus size={20} />Nuevo Pedido
                            </button>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                    <tr>{['ID', 'Cliente', 'Representante', 'Fecha', 'Estado', 'Total (€)', 'Acciones'].map(h => (
                                        <th key={h} style={{ padding: '11px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{h}</th>
                                    ))}</tr>
                                </thead>
                                <tbody>
                                    {filteredPedidos.length === 0 ? (
                                        <tr><td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>{searchTerm ? 'No se encontraron pedidos' : 'Aún no hay pedidos. ¡Crea uno nuevo!'}</td></tr>
                                    ) : filteredPedidos.map((pedido) => {
                                        const estadoStyle = getEstadoBadgeStyle(pedido.estado);
                                        return (
                                            <tr key={pedido.id} style={{ borderBottom: '1px solid #f1f5f9' }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                                <td style={{ padding: '13px 20px', fontSize: '13.5px', fontFamily: 'monospace', color: '#6b7280' }}>#{pedido.id}</td>
                                                <td style={{ padding: '13px 20px', fontSize: '13.5px' }}>Cliente #{pedido.cliente_id}</td>
                                                <td style={{ padding: '13px 20px', fontSize: '13.5px' }}>Rep. #{pedido.representante_id}</td>
                                                <td style={{ padding: '13px 20px', fontSize: '13.5px', color: '#4b5563' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} style={{ color: '#9ca3af' }} />{formatFecha(pedido.fecha)}</div>
                                                </td>
                                                <td style={{ padding: '13px 20px' }}>
                                                    <span style={{ padding: '4px 8px', fontSize: '12px', fontWeight: '600', borderRadius: '9999px', backgroundColor: estadoStyle.bg, color: estadoStyle.color, display: 'inline-block' }}>{pedido.estado}</span>
                                                </td>
                                                <td style={{ padding: '13px 20px', fontSize: '13.5px', fontWeight: '700' }}>{parseFloat(pedido.total || 0).toFixed(2)}€</td>
                                                <td style={{ padding: '13px 20px' }}>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button onClick={() => handleVerDetalles(pedido)} style={{ padding: '5px', color: '#16a34a', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '4px', display: 'inline-flex', alignItems: 'center' }} title="Ver detalles"><Eye size={16} /></button>
                                                        <button onClick={() => handleEdit(pedido)} style={{ padding: '5px', color: '#1d4ed8', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '4px', display: 'inline-flex', alignItems: 'center' }} title="Editar"><Edit2 size={16} /></button>
                                                        <button onClick={() => handleDelete(pedido)} style={{ padding: '5px', color: '#dc2626', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '4px', display: 'inline-flex', alignItems: 'center' }} title="Eliminar"><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : viewMode === 'view' ? renderView() : renderForm()}
            </div>
        </div>
    );
};

export default Pedidos;
