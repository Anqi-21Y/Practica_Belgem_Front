import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Home, Bell, User, Menu, Package, DollarSign, Users, AlertCircle, Eye } from 'lucide-react';
import { ArticulosService, mapArticuloFromBackend } from '../services/ArticulosService';
import { Link } from 'react-router-dom';

const Articulos = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list', 'view', 'create', 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    cantidad: 0,
    dto: 0,
    precio: 0
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ArticulosService.getAll();
      const productosMapeados = data.map(mapArticuloFromBackend);
      setProductos(productosMapeados);
    } catch (err) {
      setError('Error al cargar los productos: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setSelectedProduct(null);
    setFormData({
      id: '',
      nombre: '',
      cantidad: 0,
      dto: 0,
      precio: 0
    });
    setViewMode('create');
  };

  const handleEdit = (producto) => {
    setSelectedProduct(producto);
    setFormData(producto);
    setViewMode('edit');
  };

  const handleDelete = async (producto) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar el producto "${producto.nombre}"?\n\nEsta acción no se puede deshacer.`
    );

    if (confirmDelete) {
      setLoading(true);
      setError(null);
      try {
        await ArticulosService.delete(producto.id);
        alert(`Producto "${producto.nombre}" eliminado correctamente`);
        await cargarProductos();
      } catch (err) {
        setError('Error al eliminar el producto: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
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
      console.error(err);
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
      const articuloMapeado = mapArticuloFromBackend(data);
      setSelectedProduct(articuloMapeado);
      setViewMode('view');
    } catch (err) {
      setError('Error al obtener el artículo: ' + err.message);
      console.error(err);
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
    <div style={{
      backgroundColor: '#fee2e2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      padding: '12px 16px',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      color: '#dc2626'
    }}>
      <AlertCircle size={20} />
      <span>{message}</span>
    </div>
  );

  const LoadingSpinner = () => (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #e5e7eb',
        borderTop: '4px solid #4f46e5',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto'
      }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      <p style={{ marginTop: '16px', color: '#6b7280' }}>Cargando...</p>
    </div>
  );

  const renderForm = () => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '24px',
      maxWidth: '896px'
    }}>
      {error && <ErrorAlert message={error} />}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {viewMode === 'edit' && (
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              ID Artículo
            </label>
            <input
              type="text"
              value={formData.id}
              disabled
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: '#f3f4f6',
                boxSizing: 'border-box',
                color: '#6b7280',
                outline: 'none'
              }}
            />
          </div>
        )}

        <div style={{ gridColumn: viewMode === 'edit' ? 'auto' : '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Nombre del Producto *
          </label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => handleInputChange('nombre', e.target.value)}
            disabled={loading}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              outline: 'none',
              boxSizing: 'border-box',
              backgroundColor: loading ? '#f3f4f6' : 'white',
              color: '#000000'
            }}
            placeholder="Ej: Tornillo M6"
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Cantidad
          </label>
          <input
            type="number"
            value={formData.cantidad}
            onChange={(e) => handleInputChange('cantidad', e.target.value)}
            disabled={loading}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              outline: 'none',
              boxSizing: 'border-box',
              backgroundColor: loading ? '#f3f4f6' : 'white',
              color: '#000000'
            }}
            placeholder="0"
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Descuento (%)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.dto}
            onChange={(e) => handleInputChange('dto', e.target.value)}
            disabled={loading}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              outline: 'none',
              boxSizing: 'border-box',
              backgroundColor: loading ? '#f3f4f6' : 'white',
              color: '#000000'
            }}
            placeholder="0.00"
          />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Precio (€) *
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.precio}
            onChange={(e) => handleInputChange('precio', e.target.value)}
            disabled={loading}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              outline: 'none',
              boxSizing: 'border-box',
              backgroundColor: loading ? '#f3f4f6' : 'white',
              color: '#000000'
            }}
            placeholder="0.00"
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
        <button
          onClick={handleCancel}
          disabled={loading}
          style={{
            padding: '8px 24px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            color: '#374151',
            backgroundColor: 'white',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '500',
            opacity: loading ? 0.6 : 1
          }}
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            padding: '8px 24px',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '500',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f9fafb', fontFamily: 'system-ui' }}>
      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? '256px' : '80px', backgroundColor: '#312e81', color: 'white', transition: 'width 0.3s', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #4338ca' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#312e81', fontWeight: 'bold', fontSize: '14px' }}>A</span>
            </div>
            {sidebarOpen && <span style={{ fontWeight: '600' }}>Admin Portal</span>}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ padding: '4px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '4px' }}>
            <Menu size={20} />
          </button>
        </div>
        <nav style={{ flex: 1, padding: '16px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none', color: 'white' }}>
            <Home size={20} />
            {sidebarOpen && <span>Home</span>}
          </Link>

          <Link to="/clientes" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "8px", textDecoration: "none", color: "white", marginBottom: "8px" }}>
            <Users size={20} /> {sidebarOpen && <span>Clientes</span>}
          </Link>

          <Link to="/articulos" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', backgroundColor: '#4338ca', textDecoration: 'none', color: 'white', marginBottom: '8px' }}>
            <Package size={20} /> {sidebarOpen && <span>Artículos</span>}
          </Link>

          <Link to="/representantes" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "8px", textDecoration: "none", color: "white", marginBottom: "8px" }}>
            <Users size={20} /> {sidebarOpen && <span>Representantes</span>}
          </Link>

          <Link to="/divisas" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "8px", textDecoration: "none", color: "white", marginBottom: "8px" }}>
            <DollarSign size={20} />
            {sidebarOpen && <span>Divisas</span>}
          </Link>
        </nav>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {viewMode !== 'list' && (
              <button onClick={handleCancel} style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            )}
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', margin: 0 }}>{getTitle()}</h1>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative' }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' }}></span>
            </button>
            <button style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
              <User size={20} />
            </button>
          </div>
        </header>

        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {error && viewMode === 'list' && <ErrorAlert message={error} />}

          {loading && viewMode === 'list' ? (
            <LoadingSpinner />
          ) : viewMode === 'list' ? (
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ position: 'relative', flexGrow: 1, minWidth: '250px' }}>
                  <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input type="text" placeholder="Buscar artículos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: '40px', paddingTop: '8px', paddingBottom: '8px', paddingRight: '16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', width: '100%', boxSizing: 'border-box', backgroundColor: '#374151', color: 'white' }} />
                </div>
                <button onClick={handleNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#4f46e5', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500', whiteSpace: 'nowrap' }}>
                  <Plus size={20} />Nuevo Artículo
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                  <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <tr>
                      {['ID', 'Nombre', 'Cantidad', 'DTO (%)', 'Precio (€)', 'Acciones'].map(h => (
                        <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProductos.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                          {searchTerm ? 'No se encontraron artículos' : 'No hay artículos'}
                        </td>
                      </tr>
                    ) : (
                      filteredProductos.map((producto) => (
                        <tr key={producto.id} onClick={() => handleViewArticulo(producto)}
                          style={{ borderBottom: '1px solid #e5e7eb', cursor: 'pointer', transition: 'background-color 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <td style={{ padding: '16px 24px', fontSize: '14px' }}>{producto.id}</td>
                          <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500' }}>{producto.nombre}</td>
                          <td style={{ padding: '16px 24px', fontSize: '14px' }}>{producto.cantidad}</td>
                          <td style={{ padding: '16px 24px', fontSize: '14px' }}>{producto.dto}%</td>
                          <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600' }}>{producto.precio.toFixed(2)}€</td>
                          <td style={{ padding: '16px 24px' }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => handleViewArticulo(producto)} style={{ padding: '8px', color: '#059669', background: 'transparent', border: 'none', cursor: 'pointer' }} title="Ver">
                                <Eye size={16} />
                              </button>
                              <button onClick={() => handleEdit(producto)} style={{ padding: '8px', color: '#4f46e5', background: 'transparent', border: 'none', cursor: 'pointer' }} title="Editar">
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => handleDelete(producto)} style={{ padding: '8px', color: '#dc2626', background: 'transparent', border: 'none', cursor: 'pointer' }} title="Eliminar">
                                <Trash2 size={16} />
                              </button>
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
                    <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>{selectedProduct?.nombre}</h2>
                    <span style={{
                      padding: '6px 12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      borderRadius: '9999px',
                      backgroundColor: '#dbeafe',
                      color: '#2563eb'
                    }}>
                      Artículo
                    </span>
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
                        <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</h3>
                        <p style={{ fontSize: '16px', margin: 0 }}>{value || '-'}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                    <button onClick={handleCancel} style={{ padding: '8px 24px', border: '1px solid #d1d5db', borderRadius: '8px', color: '#374151', backgroundColor: 'white', cursor: 'pointer', fontWeight: '500' }}>
                      Volver
                    </button>
                    <button onClick={() => handleEdit(selectedProduct)} style={{ padding: '8px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
                      Editar Artículo
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : renderForm()}
        </div>
      </div>
    </div>
  );
};

export default Articulos;