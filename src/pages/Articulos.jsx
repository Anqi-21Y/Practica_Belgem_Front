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

  //Corrección de datos BD
  const initialFormState = {
    id: '',
    nombre: '',
    situacion: 'ACTIVO',
    pvpMinimo: 0,
    pesoKg: 0,
    altoCm: 0,
    anchoCm: 0,
    largoCm: 0,
    vendible: true
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ArticulosService.getAll();
      // Mapeamos los datos para asegurar que el front entiende la estructura del back
      setProductos(data.map(mapArticuloFromBackend));
    } catch (err) {
      setError('Error al cargar los productos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setSelectedProduct(null);
    setFormData(initialFormState);
    setViewMode('create');
  };

  const handleEdit = (producto) => {
    setSelectedProduct(producto);
    setFormData(producto);
    setViewMode('edit');
  };

  const handleDelete = async (producto) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el producto "${producto.nombre}"?`)) return;
    setLoading(true);
    try {
      await ArticulosService.delete(producto.id);
      alert(`Producto eliminado correctamente`);
      await cargarProductos();
    } catch (err) {
      setError('Error al eliminar el producto: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validaciones basadas en la lógica de tu Articulo.java
    if (!formData.nombre || formData.pvpMinimo < 0) {
      alert('Por favor completa los campos obligatorios (Nombre y PVP no negativo)');
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

  const handleCancel = () => {
    setViewMode('list');
    setSelectedProduct(null);
    setError(null);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

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

  // Componentes Auxiliares de UI
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
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>ID Artículo</label>
            <input type="text" value={formData.id} disabled style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#f3f4f6', color: '#6b7280' }} />
          </div>
        )}
        <div style={{ gridColumn: viewMode === 'edit' ? 'auto' : '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Nombre del Producto *</label>
          <input type="text" value={formData.nombre} onChange={(e) => handleInputChange('nombre', e.target.value)} disabled={loading} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: loading ? '#f3f4f6' : 'white' }} />
        </div>
        
        <div>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Situación</label>
          <select value={formData.situacion} onChange={(e) => handleInputChange('situacion', e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
            <option value="ACTIVO">ACTIVO</option>
            <option value="INACTIVO">INACTIVO</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>PVP Mínimo (€) *</label>
          <input type="number" step="0.01" value={formData.pvpMinimo} onChange={(e) => handleInputChange('pvpMinimo', parseFloat(e.target.value))} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Peso (Kg)</label>
          <input type="number" step="0.01" value={formData.pesoKg} onChange={(e) => handleInputChange('pesoKg', parseFloat(e.target.value))} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input type="checkbox" checked={formData.vendible} onChange={(e) => handleInputChange('vendible', e.target.checked)} id="vendible" />
          <label htmlFor="vendible" style={{ fontSize: '12.5px', fontWeight: '600', color: '#475569' }}>¿Es vendible?</label>
        </div>

        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '16px' }}>
           <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>Alto (cm)</label>
              <input type="number" value={formData.altoCm} onChange={(e) => handleInputChange('altoCm', parseFloat(e.target.value))} style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
           </div>
           <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>Ancho (cm)</label>
              <input type="number" value={formData.anchoCm} onChange={(e) => handleInputChange('anchoCm', parseFloat(e.target.value))} style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
           </div>
           <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>Largo (cm)</label>
              <input type="number" value={formData.largoCm} onChange={(e) => handleInputChange('largoCm', parseFloat(e.target.value))} style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
           </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
        <button onClick={handleCancel} style={{ padding: '8px 24px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: 'white', cursor: 'pointer' }}>Cancelar</button>
        <button onClick={handleSave} style={{ padding: '8px 24px', backgroundColor: '#1d4ed8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: "'Inter', sans-serif" }}>
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {viewMode !== 'list' && (
            <button onClick={handleCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
          )}
          <h1 style={{ fontSize: '17px', fontWeight: '700', margin: 0 }}>{getTitle()}</h1>
        </div>
        <ProfileButton />
      </header>

      <div style={{ flex: 1, overflow: 'auto', padding: '24px', backgroundColor: '#f8fafc' }}>
        {error && viewMode === 'list' && <ErrorAlert message={error} />}

        {loading && viewMode === 'list' ? (
          <LoadingSpinner />
        ) : viewMode === 'list' ? (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ position: 'relative', flexGrow: 1 }}>
                <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input type="text" placeholder="Buscar artículos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ paddingLeft: '40px', paddingRight: '16px', height: '38px', border: '1px solid #e2e8f0', borderRadius: '6px', width: '100%' }} />
              </div>
              <button onClick={handleNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1d4ed8', color: 'white', padding: '0 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500' }}>
                <Plus size={20} />Nuevo Artículo
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <tr>
                    {['ID', 'Nombre', 'Situación', 'PVP Mínimo', 'Acciones'].map(h => (
                      <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredProductos.length === 0 ? (
                    <tr><td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No se encontraron artículos</td></tr>
                  ) : (
                    filteredProductos.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '13px 20px' }}>{p.id}</td>
                        <td style={{ padding: '13px 20px', fontWeight: '500' }}>{p.nombre}</td>
                        <td style={{ padding: '13px 20px' }}>
                          <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', backgroundColor: p.situacion === 'ACTIVO' ? '#dcfce7' : '#fee2e2', color: p.situacion === 'ACTIVO' ? '#166534' : '#991b1b' }}>
                            {p.situacion}
                          </span>
                        </td>
                        <td style={{ padding: '13px 20px' }}>{p.pvpMinimo?.toFixed(2)}€</td>
                        <td style={{ padding: '13px 20px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleViewArticulo(p)} style={{ color: '#16a34a', background: 'none', border: 'none', cursor: 'pointer' }}><Eye size={16} /></button>
                            <button onClick={() => handleEdit(p)} style={{ color: '#1d4ed8', background: 'none', border: 'none', cursor: 'pointer' }}><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(p)} style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
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
          <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '32px', maxWidth: '896px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>{selectedProduct?.nombre}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div><strong>ID:</strong> {selectedProduct?.id}</div>
              <div><strong>Situación:</strong> {selectedProduct?.situacion}</div>
              <div><strong>PVP Mínimo:</strong> {selectedProduct?.pvpMinimo?.toFixed(2)}€</div>
              <div><strong>Peso:</strong> {selectedProduct?.pesoKg} Kg</div>
              <div><strong>Dimensiones:</strong> {`${selectedProduct?.altoCm}x${selectedProduct?.anchoCm}x${selectedProduct?.largoCm} cm`}</div>
              <div><strong>Vendible:</strong> {selectedProduct?.vendible ? 'Sí' : 'No'}</div>
            </div>
            <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
               <button onClick={handleCancel} style={{ padding: '8px 24px', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer' }}>Volver</button>
               <button onClick={() => handleEdit(selectedProduct)} style={{ padding: '8px 24px', backgroundColor: '#1d4ed8', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Editar</button>
            </div>
          </div>
        ) : renderForm()}
      </div>
    </div>
  );
};

export default Articulos;