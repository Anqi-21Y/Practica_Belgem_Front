import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Search, X, Eye, ShoppingCart, Trash } from 'lucide-react';
import PedidosService, { mapPedidoFromBackend, mapDetalleFromBackend } from '../services/PedidosService';

const Pedidos = () => {
    // --- ESTADOS PRINCIPALES ---
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list', 'create', 'edit'
    
    // --- ESTADOS PARA MODAL DE DETALLES ---
    const [modalDetalle, setModalDetalle] = useState(false);
    const [detalles, setDetalles] = useState([]);
    const [loadingDetalles, setLoadingDetalles] = useState(false);
    const [pedidoSeleccionadoParaVer, setPedidoSeleccionadoParaVer] = useState(null);

    // --- ESTADO DEL FORMULARIO ---
    const initialForm = { 
        id: '', 
        cliente_id: '', 
        representante_id: '', 
        fecha: new Date().toISOString().split('T')[0], 
        estado: 'CREADO', 
        total: 0, 
        observaciones: '',
        lineas: [] // Líneas de detalle temporales antes de guardar
    };
    const [formData, setFormData] = useState(initialForm);

    // Estado para la nueva línea que se está escribiendo en el form
    const [nuevaLinea, setNuevaLinea] = useState({ articulo_id: '', cantidad: 1, precio_unitario: '' });

    // --- CARGA DE DATOS ---
    useEffect(() => { cargarPedidos(); }, []);

    const cargarPedidos = async () => {
        setLoading(true);
        try { 
            const data = await PedidosService.listarPedidos(); 
            setPedidos(data.map(mapPedidoFromBackend)); 
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    // --- ACCIONES DE VISTA ---
    const handleVerDetalles = async (pedido) => {
        setPedidoSeleccionadoParaVer(pedido);
        setModalDetalle(true);
        setLoadingDetalles(true);
        try {
            const data = await PedidosService.obtenerDetalles(pedido.id);
            setDetalles((data || []).map(mapDetalleFromBackend));
        } catch (err) { setDetalles([]); }
        finally { setLoadingDetalles(false); }
    };

    const handleNew = () => { 
        setFormData(initialForm); 
        setViewMode('create'); 
    };

    // --- LÓGICA DE LÍNEAS (FRONTEND) ---
    const agregarLineaLocal = () => {
        if (!nuevaLinea.articulo_id || !nuevaLinea.precio_unitario) return;
        
        const subtotal = nuevaLinea.cantidad * nuevaLinea.precio_unitario;
        setFormData({
            ...formData,
            lineas: [...formData.lineas, { ...nuevaLinea }],
            total: formData.total + subtotal
        });
        setNuevaLinea({ articulo_id: '', cantidad: 1, precio_unitario: '' });
    };

    const eliminarLineaLocal = (index) => {
        const linea = formData.lineas[index];
        const nuevasLineas = formData.lineas.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            lineas: nuevasLineas,
            total: formData.total - (linea.cantidad * linea.precio_unitario)
        });
    };

    // --- PERSISTENCIA (GUARDAR EN BACKEND) ---
    const handleSave = async () => {
        if (!formData.cliente_id || !formData.representante_id) {
            alert('Campos obligatorios faltantes');
            return;
        }

        setLoading(true);
        try {
            if (viewMode === 'create') {
                // 1. Primero creamos la cabecera del pedido
                const pedidoCreado = await PedidosService.crearPedido(formData);
                
                // 2. Luego enviamos cada línea usando el ID que nos devolvió el Back
                if (formData.lineas.length > 0) {
                    const promesas = formData.lineas.map(linea => 
                        PedidosService.crearDetalle(pedidoCreado.id, linea)
                    );
                    await Promise.all(promesas);
                }
                alert('Pedido creado exitosamente');
            } else {
                await PedidosService.actualizarPedido(formData.id, formData);
                alert('Pedido actualizado');
            }
            await cargarPedidos();
            setViewMode('list');
        } catch (err) { alert('Error: ' + err.message); }
        finally { setLoading(false); }
    };

    // --- RENDERIZADO DE FORMULARIO ---
    const renderForm = () => (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ marginBottom: '20px', fontWeight: 'bold' }}>Datos del Pedido</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <input placeholder="ID Cliente" type="number" value={formData.cliente_id} onChange={e => setFormData({...formData, cliente_id: e.target.value})} style={{ padding: '8px', border: '1px solid #ddd' }} />
                    <input placeholder="ID Representante" type="number" value={formData.representante_id} onChange={e => setFormData({...formData, representante_id: e.target.value})} style={{ padding: '8px', border: '1px solid #ddd' }} />
                    <textarea placeholder="Observaciones" style={{ gridColumn: '1 / -1', padding: '8px', border: '1px solid #ddd' }} value={formData.observaciones} onChange={e => setFormData({...formData, observaciones: e.target.value})} />
                </div>

                {/* Sección de artículos (solo en creación) */}
                {viewMode === 'create' && (
                    <div style={{ marginTop: '30px' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}><ShoppingCart size={18}/> Artículos</h4>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                            <input placeholder="ID Art." value={nuevaLinea.articulo_id} onChange={e => setNuevaLinea({...nuevaLinea, articulo_id: e.target.value})} style={{ flex: 1, padding: '5px' }} />
                            <input placeholder="Cant." type="number" value={nuevaLinea.cantidad} onChange={e => setNuevaLinea({...nuevaLinea, cantidad: e.target.value})} style={{ width: '60px' }} />
                            <input placeholder="Precio" value={nuevaLinea.precio_unitario} onChange={e => setNuevaLinea({...nuevaLinea, precio_unitario: e.target.value})} style={{ width: '80px' }} />
                            <button onClick={agregarLineaLocal} style={{ backgroundColor: '#000', color: '#fff', padding: '5px 10px', borderRadius: '4px' }}>+</button>
                        </div>
                        <table style={{ width: '100%', fontSize: '14px' }}>
                            <thead><tr style={{ textAlign: 'left' }}><th>Art</th><th>Cant</th><th>Subtotal</th><th></th></tr></thead>
                            <tbody>
                                {formData.lineas.map((l, i) => (
                                    <tr key={i}>
                                        <td>#{l.articulo_id}</td>
                                        <td>{l.cantidad}</td>
                                        <td>{(l.cantidad * l.precio_unitario).toFixed(2)}€</td>
                                        <td><button onClick={() => eliminarLineaLocal(i)} style={{ color: 'red', border: 'none', background: 'none' }}><Trash size={14}/></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div style={{ backgroundColor: '#1e293b', color: 'white', padding: '24px', borderRadius: '8px', alignSelf: 'start' }}>
                <p>TOTAL ESTIMADO</p>
                <h2 style={{ fontSize: '32px' }}>{formData.total.toFixed(2)}€</h2>
                <button onClick={handleSave} style={{ width: '100%', marginTop: '20px', padding: '10px', backgroundColor: '#3b82f6', border: 'none', color: 'white', borderRadius: '5px', fontWeight: 'bold' }}>
                    {loading ? 'Procesando...' : 'Guardar Pedido'}
                </button>
                <button onClick={() => setViewMode('list')} style={{ width: '100%', marginTop: '10px', background: 'none', color: '#94a3b8', border: 'none' }}>Cancelar</button>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h1>Pedidos</h1>
                {viewMode === 'list' && <button onClick={handleNew} style={{ backgroundColor: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>Nuevo Pedido</button>}
            </div>

            {viewMode === 'list' ? (
                <table style={{ width: '100%', backgroundColor: 'white', borderRadius: '8px' }}>
                    <thead><tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}><th style={{ padding: '12px' }}>ID</th><th>Cliente</th><th>Total</th><th>Acciones</th></tr></thead>
                    <tbody>
                        {pedidos.map(p => (
                            <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px' }}>#{p.id}</td>
                                <td>{p.cliente_id}</td>
                                <td>{p.total}€</td>
                                <td>
                                    <button onClick={() => handleVerDetalles(p)} style={{ marginRight: '10px', border: 'none', background: 'none' }}><Eye size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : renderForm()}

            {/* Modal simple de visualización */}
            {modalDetalle && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', minWidth: '400px' }}>
                        <h3>Detalles Pedido #{pedidoSeleccionadoParaVer?.id}</h3>
                        {loadingDetalles ? <p>Cargando...</p> : (
                            <ul>
                                {detalles.map(d => <li key={d.id}>Art #{d.articulo_id}: {d.cantidad} x {d.precio_unitario}€ = {d.subtotal}€</li>)}
                            </ul>
                        )}
                        <button onClick={() => setModalDetalle(false)} style={{ marginTop: '20px' }}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pedidos;