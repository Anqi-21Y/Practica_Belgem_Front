import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, AlertCircle, Eye } from 'lucide-react';
import { ArticulosService, mapArticuloFromBackend } from '../services/ArticulosService';
import ProfileButton from '../components/ProfileButton';

const Articulos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formData, setFormData] = useState({
    id: '', nombre: '', cantidad: 0, dto: 0, precio: 0
  });

  useEffect(() => { cargarProductos(); }, []);

  const cargarProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ArticulosService.getAll();
      setProductos(data.map(mapArticuloFromBackend));
    } catch (err) {
      setError('Error al cargar los productos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setSelectedProduct(null);
    setFormData({ id: '', nombre: '', cantidad: 0, dto: 0, precio: 0 });
    setViewMode('create');
  };

  const handleEdit = (producto) => {
    setSelectedProduct(producto);
    setFormData(producto);
    setViewMode('edit');
  };

  const handleDelete = async (producto) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el producto "${producto.nombre}"?\n\nEsta acción no se puede deshacer.`)) return;
    setLoading(true);
    setError(null);
    try {
      await ArticulosService.delete(producto.id);
      alert(`Producto "${producto.nombre}" eliminado correctamente`);
      await cargarProductos();
    } catch (err) {
      setError('Error al eliminar el producto: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.nombre || !formData.precio || parseFloat(formData.precio) <= 0) {
      alert('Por favor completa los campos obligatorios (Nombre y Precio válido)');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (viewMode === 'edit') {
        await ArticulosService.update(selectedProduct.id, formData);
        alert('Producto actualizado correctamente');
      } else {
        await ArticulosService.create(formData);
        alert('Producto creado correctamente');
      }
      await cargarProductos();
      setViewMode('list');
      setSelectedProduct(null);
    } catch (err) {
      setError('Error al guardar el producto: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => { setViewMode('list'); setSelectedProduct(null); setError(null); };
  const handleInputChange = (field, value) => setFormData({ ...formData, [field]: value });

  const handleViewArticulo = async (producto) => {
    setLoading(true);
    setError(null);
    try {
      const data = await ArticulosService.getById(producto.id);
      setSelectedProduct(mapArticuloFromBackend(data));
      setViewMode('view');
    } catch (err) {
      setError('Error al obtener el artículo: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProductos = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toString().includes(searchTerm)
  );

  const getTitle = () => {
    switch (viewMode) {
      case 'view': return 'Detalles del Artículo';
      case 'edit': return 'Editar Artículo';
      case 'create': return 'Nuevo Artículo';
      default: return 'Artículos';
    }
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
        {viewMode === 'edit' && (
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '6px', letterSpacing: '0.1px' }}>ID Artículo</label>
            <input type="text" value={formData.id} disabled style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#f3f4f6', boxSizing: 'border-box', color: '#6b7280', outline: 'none' }} />
          </div>
        )}
        <div style={{ gridColumn: viewMode === 'edit' ? 'auto' : '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '6px', letterSpacing: '0.1px' }}>Nombre del Producto *</label>
          <input type="text" value={formData.nombre} onChange={(e) => handleInputChange('nombre', e.target.value)} disabled={loading} placeholder="Ej: Tornillo M6"
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none', boxSizing: 'border-box', backgroundColor: loading ? '#f3f4f6' : 'white', color: '#000000' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '6px', letterSpacing: '0.1px' }}>Cantidad</label>
          <input type="number" value={formData.cantidad} onChange={(e) => handleInputChange('cantidad', e.target.value)} disabled={loading} placeholder="0"
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none', boxSizing: 'border-box', backgroundColor: loading ? '#f3f4f6' : 'white', color: '#000000' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '6px', letterSpacing: '0.1px' }}>Descuento (%)</label>
          <input type="number" step="0.01" value={formData.dto} onChange={(e) => handleInputChange('dto', e.target.value)} disabled={loading} placeholder="0.00"
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none', boxSizing: 'border-box', backgroundColor: loading ? '#f3f4f6' : 'white', color: '#000000' }} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '6px', letterSpacing: '0.1px' }}>Precio (€) *</label>
          <input type="number" step="0.01" value={formData.precio} onChange={(e) => handleInputChange('precio', e.target.value)} disabled={loading} placeholder="0.00"
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none', boxSizing: 'border-box', backgroundColor: loading ? '#f3f4f6' : 'white', color: '#000000' }} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
        <button onClick={handleCancel} disabled={loading} style={{ padding: '8px 24px', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#374151', backgroundColor: 'white', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '500', opacity: loading ? 0.6 : 1 }}>Cancelar</button>
        <button onClick={handleSave} disabled={loading} style={{ padding: '8px 24px', backgroundColor: '#1d4ed8', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '500', opacity: loading ? 0.6 : 1 }}>
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
                <input type="text" placeholder="Buscar artículos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '40px', paddingTop: '8px', paddingBottom: '8px', paddingRight: '16px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
              </div>
              <button onClick={handleNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1d4ed8', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500', whiteSpace: 'nowrap' }}>
                <Plus size={20} />Nuevo Artículo
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <tr>
                    {['ID', 'Nombre', 'Cantidad', 'DTO (%)', 'Precio (€)', 'Acciones'].map(h => (
                      <th key={h} style={{ padding: '11px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredProductos.length === 0 ? (
                    <tr><td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>{searchTerm ? 'No se encontraron artículos' : 'No hay artículos'}</td></tr>
                  ) : (
                    filteredProductos.map((producto) => (
                      <tr key={producto.id} onClick={() => handleViewArticulo(producto)}
                        style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <td style={{ padding: '13px 20px', fontSize: '13.5px' }}>{producto.id}</td>
                        <td style={{ padding: '13px 20px', fontSize: '13.5px', fontWeight: '500' }}>{producto.nombre}</td>
                        <td style={{ padding: '13px 20px', fontSize: '13.5px' }}>{producto.cantidad}</td>
                        <td style={{ padding: '13px 20px', fontSize: '13.5px' }}>{producto.dto}%</td>
                        <td style={{ padding: '13px 20px', fontSize: '13.5px', fontWeight: '600' }}>{producto.precio.toFixed(2)}€</td>
                        <td style={{ padding: '13px 20px' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleViewArticulo(producto)} style={{ padding: '5px', color: '#16a34a', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '4px', display: 'inline-flex', alignItems: 'center' }} title="Ver"><Eye size={16} /></button>
                            <button onClick={() => handleEdit(producto)} style={{ padding: '5px', color: '#1d4ed8', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '4px', display: 'inline-flex', alignItems: 'center' }} title="Editar"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(producto)} style={{ padding: '5px', color: '#dc2626', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '4px', display: 'inline-flex', alignItems: 'center' }} title="Eliminar"><Trash2 size={16} /></button>
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
                  <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>{selectedProduct?.nombre}</h2>
                  <span style={{ padding: '6px 12px', fontSize: '14px', fontWeight: '600', borderRadius: '9999px', backgroundColor: '#dbeafe', color: '#2563eb' }}>Artículo</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                  {[
                    { label: 'ID Artículo', value: selectedProduct?.id },
                    { label: 'Nombre', value: selectedProduct?.nombre },
                    { label: 'Cantidad', value: selectedProduct?.cantidad },
                    { label: 'Descuento (%)', value: selectedProduct?.dto + '%' },
                    { label: 'Precio (€)', value: selectedProduct?.precio?.toFixed(2) + '€' }
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <h3 style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.6px' }}>{label}</h3>
                      <p style={{ fontSize: '15px', margin: 0, color: '#1e293b' }}>{value || '-'}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                  <button onClick={handleCancel} style={{ padding: '8px 24px', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#374151', backgroundColor: 'white', cursor: 'pointer', fontWeight: '500' }}>Volver</button>
                  <button onClick={() => handleEdit(selectedProduct)} style={{ padding: '7px 14px', backgroundColor: '#1d4ed8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }}>Editar Artículo</button>
                </div>
              </>
            )}
          </div>
        ) : renderForm()}
      </div>
    </div>
  );
};

export default Articulos;