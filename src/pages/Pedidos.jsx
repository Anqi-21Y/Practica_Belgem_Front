import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, AlertCircle, Calendar, Eye } from 'lucide-react';
import PedidosService, { mapPedidoFromBackend } from '../services/PedidosService';
import ProfileButton from '../components/ProfileButton';

const Pedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list');
    const [selectedPedido, setSelectedPedido] = useState(null);

    const [formData, setFormData] = useState({
        id: '', cliente_id: '', representante_id: '',
        fecha: new Date().toISOString().split('T')[0],
        estado: 'CREADO', total: 0, observaciones: ''
    });

    useEffect(() => { cargarPedidos(); }, []);

    const cargarPedidos = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await PedidosService.listarPedidos();
            setPedidos(data.map(mapPedidoFromBackend));
        } catch (err) {
            setError('Error al cargar los pedidos: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleViewPedido = async (pedido) => {
        setLoading(true);
        setError(null);
        try {
            const data = await PedidosService.obtenerPedidoPorId(pedido.id);
            setSelectedPedido(mapPedidoFromBackend(data));
            setViewMode('view');
        } catch (err) {
            setError('Error al obtener el pedido: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleNew = () => {
        setSelectedPedido(null);
        setFormData({ id: '', cliente_id: '', representante_id: '', fecha: new Date().toISOString().split('T')[0], estado: 'CREADO', total: 0, observaciones: '' });
        setViewMode('create');
    };

    const handleEdit = (pedido) => {
        setSelectedPedido(pedido);
        setFormData({ ...pedido, fecha: pedido.fecha ? new Date(pedido.fecha).toISOString().split('T')[0] : new Date().toISOString().split('T')[0], cliente_id: pedido.cliente_id || '', representante_id: pedido.representante_id || '' });
        setViewMode('edit');
    };

    const handleDelete = async (pedido) => {
        if (!window.confirm(`¿Estás seguro de que deseas eliminar el pedido #${pedido.id}?\n\nEsta acción no se puede deshacer.`)) return;
        setLoading(true);
        setError(null);
        try {
            await PedidosService.eliminarPedido(pedido.id);
            alert(`Pedido #${pedido.id} eliminado correctamente`);
            await cargarPedidos();
        } catch (err) {
            setError('Error al eliminar el pedido: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.cliente_id || !formData.representante_id) { alert('Por favor completa los campos obligatorios (Cliente y Representante)'); return; }
        setLoading(true);
        setError(null);
        try {
            if (viewMode === 'edit') {
                await PedidosService.actualizarPedido(selectedPedido.id, formData);
                alert('Pedido actualizado correctamente');
            } else {
                await PedidosService.crearPedido(formData);
                alert('Pedido creado correctamente');
            }
            await cargarPedidos();
            setViewMode('list');
            setSelectedPedido(null);
        } catch (err) {
            setError('Error al guardar el pedido: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => { setViewMode('list'); setSelectedPedido(null); setError(null); };
    const handleInputChange = (field, value) => setFormData({ ...formData, [field]: value });

    const filteredPedidos = pedidos.filter(p =>
        p.id?.toString().includes(searchTerm) ||
        p.cliente_id?.toString().includes(searchTerm) ||
        p.estado?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTitle = () => {
        switch (viewMode) {
            case 'view': return 'Detalles del Pedido';
            case 'edit': return 'Editar Pedido';
            case 'create': return 'Nuevo Pedido';
            default: return 'Pedidos';
        }
    };

    const formatFecha = (fecha) => {
        if (!fecha) return '-';
        return new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const getEstadoBadgeStyle = (estado) => {
        const styles = {
            'CREADO': { bg: '#dbeafe', color: '#1e40af' },
            'CONFIRMADO': { bg: '#d1fae5', color: '#065f46' },
            'EN_PROCESO': { bg: '#fef3c7', color: '#92400e' },
            'ENVIADO': { bg: '#e0e7ff', color: '#3730a3' },
            'ENTREGADO': { bg: '#d1fae5', color: '#065f46' },
            'CANCELADO': { bg: '#fee2e2', color: '#991b1b' }
        };
        return styles[estado] || { bg: '#f3f4f6', color: '#374151' };
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
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px', maxWidth: '800px' }}>
            {error && <ErrorAlert message={error} />}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {selectedPedido && (
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>ID Pedido</label>
                        <input type="text" value={formData.id} disabled style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#f3f4f6', boxSizing: 'border-box' }} />
                    </div>
                )}
                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>ID Cliente *</label>
                    <input type="number" value={formData.cliente_id} onChange={(e) => handleInputChange('cliente_id', e.target.value)} disabled={loading} placeholder="ID del cliente"
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', backgroundColor: loading ? '#f3f4f6' : 'white' }} />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>ID Representante *</label>
                    <input type="number" value={formData.representante_id} onChange={(e) => handleInputChange('representante_id', e.target.value)} disabled={loading} placeholder="ID del representante"
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', backgroundColor: loading ? '#f3f4f6' : 'white' }} />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Fecha</label>
                    <input type="date" value={formData.fecha} onChange={(e) => handleInputChange('fecha', e.target.value)} disabled={loading}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', backgroundColor: loading ? '#f3f4f6' : 'white' }} />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Estado</label>
                    <select value={formData.estado} onChange={(e) => handleInputChange('estado', e.target.value)} disabled={loading}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', backgroundColor: loading ? '#f3f4f6' : 'white' }}>
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
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Total (€)</label>
                        <input type="text" value={`${parseFloat(formData.total || 0).toFixed(2)}€`} disabled style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#f3f4f6', boxSizing: 'border-box', fontWeight: '700' }} />
                    </div>
                )}
                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Observaciones</label>
                    <textarea value={formData.observaciones} onChange={(e) => handleInputChange('observaciones', e.target.value)} disabled={loading} rows={4} placeholder="Notas adicionales sobre el pedido..."
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', backgroundColor: loading ? '#f3f4f6' : 'white', resize: 'vertical' }} />
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                <button onClick={handleCancel} disabled={loading} style={{ padding: '8px 24px', border: '1px solid #d1d5db', borderRadius: '8px', color: '#374151', backgroundColor: 'white', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '500', opacity: loading ? 0.6 : 1 }}>Cancelar</button>
                <button onClick={handleSave} disabled={loading} style={{ padding: '8px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '500', opacity: loading ? 0.6 : 1 }}>
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </div>
    );

    const renderView = () => {
        const estadoStyle = getEstadoBadgeStyle(selectedPedido?.estado);
        return (
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '32px', maxWidth: '800px' }}>
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
                                    <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</h3>
                                    <p style={{ fontSize: '16px', margin: 0 }}>{value}</p>
                                </div>
                            ))}
                            <div>
                                <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>Total</h3>
                                <p style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>{parseFloat(selectedPedido?.total || 0).toFixed(2)}€</p>
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>Observaciones</h3>
                                <p style={{ fontSize: '16px', margin: 0, lineHeight: '1.6' }}>{selectedPedido?.observaciones || 'Sin observaciones'}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                            <button onClick={handleCancel} style={{ padding: '8px 24px', border: '1px solid #d1d5db', borderRadius: '8px', color: '#374151', backgroundColor: 'white', cursor: 'pointer', fontWeight: '500' }}>Volver</button>
                            <button onClick={() => handleEdit(selectedPedido)} style={{ padding: '8px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Editar Pedido</button>
                        </div>
                    </>
                )}
            </div>
        );
    };

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
                                <input type="text" placeholder="Buscar pedidos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ paddingLeft: '40px', paddingTop: '8px', paddingBottom: '8px', paddingRight: '16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                            </div>
                            <button onClick={handleNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#4f46e5', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500', whiteSpace: 'nowrap' }}>
                                <Plus size={20} />Nuevo Pedido
                            </button>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                    <tr>
                                        {['ID', 'Cliente', 'Representante', 'Fecha', 'Estado', 'Total (€)', 'Acciones'].map(h => (
                                            <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPedidos.length === 0 ? (
                                        <tr><td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>{searchTerm ? 'No se encontraron pedidos' : 'Aún no hay pedidos. ¡Crea uno nuevo!'}</td></tr>
                                    ) : (
                                        filteredPedidos.map((pedido) => {
                                            const estadoStyle = getEstadoBadgeStyle(pedido.estado);
                                            return (
                                                <tr key={pedido.id}
                                                    style={{ borderBottom: '1px solid #e5e7eb' }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                                    <td style={{ padding: '16px 24px', fontSize: '14px', fontFamily: 'monospace', color: '#6b7280' }}>#{pedido.id}</td>
                                                    <td style={{ padding: '16px 24px', fontSize: '14px' }}>Cliente #{pedido.cliente_id}</td>
                                                    <td style={{ padding: '16px 24px', fontSize: '14px' }}>Rep. #{pedido.representante_id}</td>
                                                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#4b5563' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <Calendar size={14} style={{ color: '#9ca3af' }} />
                                                            {formatFecha(pedido.fecha)}
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '16px 24px' }}>
                                                        <span style={{ padding: '4px 8px', fontSize: '12px', fontWeight: '600', borderRadius: '9999px', backgroundColor: estadoStyle.bg, color: estadoStyle.color, display: 'inline-block' }}>{pedido.estado}</span>
                                                    </td>
                                                    <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '700' }}>{parseFloat(pedido.total || 0).toFixed(2)}€</td>
                                                    <td style={{ padding: '16px 24px' }}>
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <button onClick={() => handleViewPedido(pedido)} style={{ padding: '8px', color: '#059669', background: 'transparent', border: 'none', cursor: 'pointer' }} title="Ver"><Eye size={16} /></button>
                                                            <button onClick={() => handleEdit(pedido)} style={{ padding: '8px', color: '#4f46e5', background: 'transparent', border: 'none', cursor: 'pointer' }} title="Editar"><Edit2 size={16} /></button>
                                                            <button onClick={() => handleDelete(pedido)} style={{ padding: '8px', color: '#dc2626', background: 'transparent', border: 'none', cursor: 'pointer' }} title="Eliminar"><Trash2 size={16} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
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