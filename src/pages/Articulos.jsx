import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Home, Bell, User, Menu, Layers, Eye } from 'lucide-react';

const Articulos = () => {
  const [productos, setProductos] = useState([
    { id: '1', nombre: 'Producto A', cantidad: 10, dto: 5, precio: 100 },
    { id: '2', nombre: 'Producto B', cantidad: 5, dto: 0, precio: 50 },
    { id: '3', nombre: 'Producto C', cantidad: 20, dto: 10, precio: 200 }
  ]);

  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    cantidad: 0,
    dto: 0,
    precio: 0
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [message, setMessage] = useState(null); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleNew = () => {
    const maxId = productos.length > 0 
        ? Math.max(...productos.map(p => parseInt(p.id) || 0)) 
        : 0;
    const newId = (maxId + 1).toString();

    setFormData({ id: newId, nombre: '', cantidad: 0, dto: 0, precio: 0 });
    setSelectedProduct(null);
    setIsEditing(true);
  };

  const handleEdit = (producto) => {
    setSelectedProduct(producto);
    setFormData(producto);
    setIsEditing(true);
  };

  const handleView = (producto) => {
    alert(`Ver producto:\nID: ${producto.id}\nNombre: ${producto.nombre}\nPrecio: ${producto.precio.toFixed(2)}€`);
  };

  const handleSave = () => {
    if (!formData.nombre || !formData.precio || parseFloat(formData.precio) <= 0) {
      showMessage('El nombre y el precio deben ser válidos y obligatorios.', 'error');
      return;
    }

    const dataToSave = {
        ...formData,
        cantidad: parseInt(formData.cantidad) || 0,
        dto: parseInt(formData.dto) || 0,
        precio: parseFloat(formData.precio) || 0,
    };

    if (selectedProduct) {
      setProductos(productos.map(p => p.id === selectedProduct.id ? dataToSave : p));
      showMessage(`Producto "${formData.nombre}" actualizado.`, 'success');
    } else {
      setProductos([...productos, dataToSave]);
      showMessage(`Nuevo producto "${formData.nombre}" creado.`, 'success');
    }

    setIsEditing(false);
    setSelectedProduct(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedProduct(null);
  };

  const handleDeleteClick = (producto) => {
    setProductToDelete(producto);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setProductos(productos.filter(p => p.id !== productToDelete.id));
    showMessage(`Producto "${productToDelete.nombre}" eliminado.`, 'success');
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const filteredProductos = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.includes(searchTerm)
  );
  
  //Estilos CSS 
  const styles = `
    /* Fuente Inter, fallback a sans-serif */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
    
    body, html, #root {
      margin: 0;
      padding: 0;
      font-family: 'Inter', sans-serif;
    }

    .app-container {
      display: flex;
      min-height: 100vh;
      background-color: #f3f4f6; 
      color: #1f2937; 
    }

    /* --- Sidebar --- */
    .sidebar {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      width: 16rem; 
      background-color: #3730a3; 
      color: #e0e7ff; 
      padding: 1rem;
      z-index: 50;
      transform: translateX(-100%);
      transition: transform 0.2s ease-in-out;
    }
    
    .sidebar.open {
      transform: translateX(0);
    }

    /* Desktop View */
    @media (min-width: 768px) {
      .sidebar {
        transform: translateX(0);
      }
      .main-content-wrapper {
        margin-left: 16rem; 
      }
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 0.75rem; 
      margin-bottom: 2rem; 
    }

    .sidebar-logo {
      width: 2.5rem; 
      height: 2.5rem; 
      background-color: #4f46e5; 
      border-radius: 9999px; 
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      font-weight: bold;
    }

     .sidebar nav ul { list-style: none; padding: 0; margin: 0; }
  .sidebar nav li { margin-bottom: 0.5rem; }

   .nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: 0.375rem;
    color: #e0e7ff;
    text-decoration: none;
    transition: background-color 0.15s;
  }
  .nav-item:hover { background-color: #4338ca; }
  .nav-item.active {
    background-color: #4338ca;
    color: white;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.06);
  }

.sidebar-close {
    padding: 0.25rem;
    border-radius: 0.375rem;
    color: #c7d2fe;
    background: transparent;
    border: none;
    cursor: pointer;
    margin-left: auto;
  }
  .sidebar-close:hover { background-color: #4338ca; }


    /* --- Header --- */
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem; 
      background-color: white;
      border-bottom: 1px solid #e5e7eb; 
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      position: sticky;
      top: 0;
      z-index: 40;
    }

    .header-left { display:flex; align-items:center; }
  .header-right { display:flex; align-items:center; gap:1rem; }

  .header-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
  }

  .menu-button {
    padding: 0.5rem;
    border-radius: 0.375rem;
    color: #4b5563;
    background: none;
    border: none;
    cursor: pointer;
    margin-right: 1rem;
  }

    .menu-button:hover {
        background-color: #f3f4f6; 
    }
    @media (min-width: 768px) {
    .menu-button { display: none; }
    }

    /* --- Main Content --- */
    .main-content-wrapper { flex: 1; display: flex; flex-direction: column; }
  .main-content { padding: 1rem; }

  @media (min-width: 640px) {
    .main-content { padding: 1.5rem; }
  }

    @media (min-width: 640px) {
      .main-content {
        /* Reducido el padding de 2rem a 1.5rem para acercar el contenido al borde izquierdo y derecho */
        padding: 1.5rem; 
      }
    }

    /* --- Mensajes (Notificaciones) --- */
  .message-box {
    padding: 0.75rem;
    margin-bottom: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .message-success { background-color: #d1fae5; color: #065f46; }
  .message-error { background-color: #fee2e2; color: #991b1b; }
  .message-close-btn { background: none; border: none; cursor: pointer; color: inherit; opacity: 0.8; }
  .message-close-btn:hover { opacity: 1; }

  /* --- Búsqueda y Botón Nuevo --- */
  .toolbar {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    gap: 1rem;
  }
  @media (min-width: 640px) { .toolbar { flex-direction: row; } }

  .search-container { position: relative; width: 100%; }
  @media (min-width: 640px) { .search-container { width: 50%; } }
  @media (min-width: 1024px) { .search-container { width: 33.3333%; } }

  .search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    padding: 0.5rem 1rem 0.5rem 2.5rem; /* pl-10 pr-4 py-2 */
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
    transition: border-color 0.15s, box-shadow 0.15s;
    background: #ffffff;
    color: #374151;
    height: 40px;
    box-sizing: border-box;
    -webkit-appearance: none;
  }

  /* Cambiar color de autofill para que no quede negro en Chrome */
  input.search-input:-webkit-autofill,
  input.search-input:-webkit-autofill:hover,
  input.search-input:-webkit-autofill:focus,
  input.search-input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
    -webkit-text-fill-color: #374151 !important;
  }

  .search-input:focus {
    border-color: #4f46e5;
    outline: none;
    box-shadow: 0 0 0 4px rgba(79,70,229,0.06);
  }

  .btn-new {
    width: 100%;
    padding: 0.5rem 1.5rem;
    background-color: #4f46e5;
    color: white;
    font-weight: 600;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    display:flex;
    align-items:center;
    justify-content:center;
    gap:0.5rem;
  }
  .btn-new:hover { background-color: #4338ca; }
  @media (min-width: 640px) { .btn-new { width: auto; } }

  /* --- Tabla de Datos --- */
  .table-container {
    background-color: white;
    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
    border-radius: 0.5rem;
    overflow-x: auto;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    border-top: 1px solid #e5e7eb;
  }

  .data-table thead { background-color: #f9fafb; }
  .data-table th {
    padding: 0.75rem 1.5rem;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .data-table th:nth-child(3),
  .data-table th:nth-child(4),
  .data-table th:nth-child(5) { text-align: right; }
  .data-table th:last-child { text-align: center; }

  .data-table td {
    padding: 1rem 1.5rem;
    white-space: nowrap;
    font-size: 0.875rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .data-table tbody tr:hover {
    background-color: #eef2ff;
    transition: background-color 0.1s;
  }
  .data-table tbody tr:last-child td { border-bottom: none; }

  .cell-id { font-family: monospace; color: #6b7280; }
  .cell-name { font-weight: 500; color: #111827; }
  .cell-dto { color: #059669; font-weight: 600; text-align: right; }
  .cell-price { font-weight: 700; color: #374151; text-align: right; }
  .cell-actions { text-align: center; }

  /* ---------- AÑADIDO: estilos para los botones de acción (ver/editar/eliminar) ---------- */
  .action-buttons {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    align-items: center;
  }
  .btn-view, .btn-edit, .btn-delete {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 9999px;
    transition: background-color 0.15s, color 0.15s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .btn-view { color: #059669; } /* verde */
  .btn-view:hover { background: rgba(5,150,105,0.08); }
  .btn-edit { color: #4f46e5; }
  .btn-edit:hover { background: rgba(79,70,229,0.06); }
  .btn-delete { color: #dc2626; }
  .btn-delete:hover { background: rgba(220,38,38,0.06); }
  /* ------------------------------------------------------------------------------------- */

  .no-results { text-align: center; color: #6b7280; }

  /* --- Formulario --- */
  .form-container {
    background-color: white;
    padding: 1.5rem;
    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
    border-radius: 0.5rem;
    max-width: 32rem;
    margin-left: auto;
    margin-right: auto;
  }

  .form-title { font-size: 1.5rem; font-weight: 600; margin-bottom: 1.5rem; color: #111827; }
  .form-group { display: grid; grid-template-columns: 1fr; gap: 1rem; }
  .form-label { display:block; }
  .form-label span { display:block; color:#374151; font-weight:500; margin-bottom:0.25rem; }
  .form-input {
    display:block; width:100%; padding:0.5rem; border-radius:0.375rem; border:1px solid #d1d5db;
    box-shadow:0 1px 2px 0 rgba(0,0,0,0.05); font-size:0.875rem;
  }
  .form-input:focus { border-color:#4f46e5; outline:none; box-shadow:0 0 0 3px rgba(79,70,229,0.1); }
  .form-input[disabled] { background-color:#f3f4f6; cursor:not-allowed; }

  .form-actions { display:flex; gap:1rem; margin-top:1.5rem; }
  .btn-cancel, .btn-save { flex:1; padding:0.5rem 1rem; font-weight:600; border-radius:0.5rem; cursor:pointer; }
  .btn-cancel { background-color:white; border:1px solid #d1d5db; color:#374151; }
  .btn-cancel:hover { background-color:#f3f4f6; }
  .btn-save { background-color:#4f46e5; color:white; border:none; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1); }
  .btn-save:hover { background-color:#4338ca; }

  /* --- Modal --- */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(17,24,39,0.5);
    display:flex;
    justify-content:center;
    align-items:center;
    padding:1rem;
    z-index:50;
  }
  .modal-content {
    background-color:white; padding:1.5rem; border-radius:0.5rem; box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);
    max-width:24rem; width:100%;
  }
  .modal-title { font-size:1.125rem; font-weight:600; color:#111827; margin-bottom:1rem; }
  .modal-body { color:#4b5563; margin-bottom:1.5rem; }
  .modal-body strong { color:#dc2626; display:block; margin-top:0.25rem; font-weight:700; }
  .modal-actions { display:flex; justify-content:flex-end; gap:0.75rem; }

  .btn-modal-cancel { padding:0.5rem 1rem; border:1px solid #d1d5db; border-radius:0.5rem; color:#374151; background:white; cursor:pointer; }
  .btn-modal-cancel:hover { background-color:#f3f4f6; }
  .btn-modal-delete { padding:0.5rem 1rem; background-color:#dc2626; color:white; font-weight:600; border:none; border-radius:0.5rem; cursor:pointer; }
  .btn-modal-delete:hover { background-color:#b91c1c; }
`;


  return (
    <div className="app-container">
      <style>{styles}</style>

      
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">A</div>
          <span className="text-xl font-semibold">Admin Portal</span>
          <button className="sidebar-close md:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav>
          <ul>
            <li className="mb-2">
              <a href="#" className="nav-item">
                <Home size={20} />
                <span>Home</span>
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="nav-item">
                <User size={20} />
                <span>Clientes</span>
              </a>
            </li>
            <li className="mb-2">
              {/* Artículos (Productos) - Destacado como página activa */}
              <a href="#" className="nav-item active">
                <Layers size={20} />
                <span>Artículos</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Contenido principal */}
      <div className="main-content-wrapper main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button className="menu-button" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="header-title">Productos (Artículos)</h1>
          </div>
          <div className="header-right">
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <Bell size={20} />
              <span style={{ position: 'absolute', top: '0.25rem', right: '0.25rem', height: '0.5rem', width: '0.5rem', backgroundColor: '#ef4444', borderRadius: '9999px' }}></span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '2rem', height: '2rem', backgroundColor: '#d1d5db', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: '600' }}>A</div>
              <span style={{ color: '#374151', display: 'none' }} className="sm:inline">Usuario Admin</span>
            </div>
          </div>
        </header>

        <main className="main-content">
          {message && (
            <div className={`message-box ${message.type === 'error' ? 'message-error' : 'message-success'}`} role="alert">
              <p>{message.text}</p>
              <button onClick={() => setMessage(null)} className="message-close-btn"><X size={16} /></button>
            </div>
          )}

            {!isEditing ? (
              /* Vista principal: Búsqueda y Tabla */
              <>
                <div className="toolbar">
                <div className="search-container">
              
                  <Search size={20} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                  <button onClick={handleNew} className="btn-new">
                  <Plus size={18} /> Nuevo Producto
                </button>
              </div>

                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Cantidad</th>
                        <th>DTO (%)</th>
                        <th>Precio (€)</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProductos.length === 0 ? (
                          <tr>
                              <td colSpan="6" className="no-results">
                                  {searchTerm ? 'No se encontraron resultados.' : 'Aún no hay productos. ¡Crea uno nuevo!'}
                              </td>
                          </tr>
                      ) : (
                          filteredProductos.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                              <td style={{ padding: '16px' }}>{p.id}</td>
                          <td style={{ padding: '16px', fontWeight: 600 }}>{p.nombre}</td>
                          <td style={{ padding: '16px', textAlign: 'right' }}>{p.cantidad}</td>
                          <td style={{ padding: '16px', textAlign: 'right', color: '#059669', fontWeight: 600 }}>{p.dto}%</td>
                          <td style={{ padding: '16px', textAlign: 'right', fontWeight: 700 }}>{p.precio.toFixed(2)}€</td>

                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            <div className="action-buttons">
                               <button
                                className="btn-view"
                                onClick={() => handleView(p)}
                                title="Ver"
                                style={{ background: 'transparent', border: 'none', padding: 6, cursor: 'pointer' }}
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                className="btn-edit"
                                onClick={() => handleEdit(p)}
                                title="Editar"
                                style={{ background: 'transparent', border: 'none', padding: 6, cursor: 'pointer' }}
                              >
                                <Edit2 size={16} />
                              </button>

                              <button
                                className="btn-delete"
                                onClick={() => handleDeleteClick(p)}
                                title="Eliminar"
                                style={{ background: 'transparent', border: 'none', padding: 6, cursor: 'pointer' }}
                              >
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
              </>
            ) : (
              /* Formulario de Edición/Creación */
              <div style={{ maxWidth: 640, background: 'white', padding: 24, borderRadius: 8 }}>
              <h2 style={{ marginTop: 0 }}>{selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#374151' }}>ID</label>
                  <input value={formData.id} disabled style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #d1d5db' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#374151' }}>Nombre *</label>
                  <input value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #d1d5db' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#374151' }}>Cantidad</label>
                  <input type="number" value={formData.cantidad} onChange={e => setFormData({ ...formData, cantidad: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #d1d5db' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#374151' }}>DTO (%)</label>
                  <input type="number" value={formData.dto} onChange={e => setFormData({ ...formData, dto: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #d1d5db' }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: 12, color: '#374151' }}>Precio (€) *</label>
                  <input type="number" value={formData.precio} onChange={e => setFormData({ ...formData, precio: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #d1d5db' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <button onClick={handleCancel} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #d1d5db', background: 'white' }}>Cancelar</button>
                <button onClick={handleSave} style={{ padding: '8px 16px', borderRadius: 8, background: '#4f46e5', color: 'white' }}>Guardar</button>
              </div>
            </div>
          )}

          {/* Modal de confirmación de eliminación */}
          {showDeleteModal && (
            <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', zIndex: 50 }}>
              <div style={{ background: 'white', padding: 24, borderRadius: 8, width: 480 }}>
                <h3>Confirmar Eliminación</h3>
                <p>¿Estás seguro de que quieres eliminar el producto <strong>"{productToDelete?.nombre}"</strong>? Esta acción es irreversible.</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <button onClick={() => setShowDeleteModal(false)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}>Cancelar</button>
                  <button onClick={handleConfirmDelete} style={{ padding: '8px 12px', borderRadius: 8, background: '#dc2626', color: 'white' }}>Eliminar</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Articulos;