import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Home, Bell, User, Menu, Layers } from 'lucide-react';

const App = () => {
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
      background-color: #f3f4f6; /* gray-100 */
      color: #1f2937; /* gray-800 */
    }

    /* --- Sidebar --- */
    .sidebar {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      width: 16rem; /* w-64 */
      background-color: #3730a3; /* indigo-900 */
      color: #e0e7ff; /* indigo-100 */
      padding: 1rem; /* p-4 */
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
        margin-left: 16rem; /* md:ml-64 */
      }
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 0.75rem; /* space-x-3 */
      margin-bottom: 2rem; /* mb-8 */
    }

    .sidebar-logo {
      width: 2.5rem; /* w-10 */
      height: 2.5rem; /* h-10 */
      background-color: #4f46e5; /* indigo-600 */
      border-radius: 9999px; /* rounded-full */
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem; /* text-xl */
      font-weight: bold;
    }

    .sidebar nav ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .sidebar nav li {
      margin-bottom: 0.5rem; /* mb-2 */
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem; /* space-x-3 */
      padding: 0.75rem; /* p-3 */
      border-radius: 0.375rem; /* rounded-md */
      color: #e0e7ff;
      text-decoration: none;
      transition: background-color 0.15s;
    }

    .nav-item:hover {
      background-color: #4338ca; /* hover:bg-indigo-700 */
    }

    .nav-item.active {
      background-color: #4338ca; /* bg-indigo-700 */
      color: white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06); /* shadow-lg */
    }
    
    .sidebar-close {
        padding: 0.25rem;
        border-radius: 0.375rem;
        color: #c7d2fe; /* indigo-200 */
        background: transparent;
        border: none;
        cursor: pointer;
        margin-left: auto;
    }
    .sidebar-close:hover {
        background-color: #4338ca;
    }

    /* --- Header --- */
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem; /* p-4 */
      background-color: white;
      border-bottom: 1px solid #e5e7eb; /* border-b border-gray-200 */
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
      position: sticky;
      top: 0;
      z-index: 40;
    }

    .header-left {
      display: flex;
      align-items: center;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem; /* space-x-4 */
    }

    .header-title {
      font-size: 1.5rem; /* text-2xl */
      font-weight: 700; /* font-bold */
      color: #111827; /* gray-900 */
    }
    
    .menu-button {
      padding: 0.5rem;
      border-radius: 0.375rem;
      color: #4b5563; /* gray-600 */
      background: none;
      border: none;
      cursor: pointer;
      margin-right: 1rem;
    }
    .menu-button:hover {
        background-color: #f3f4f6; /* hover:bg-gray-100 */
    }

    /* Ocultar botón de menú en desktop */
    @media (min-width: 768px) {
        .menu-button { display: none; }
    }


    /* --- Main Content --- */
    .main-content-wrapper {
      flex: 1; /* flex-1 */
      display: flex;
      flex-direction: column;
    }
    
    .main-content {
      padding: 1rem; /* p-4 */
    }

    @media (min-width: 640px) {
      .main-content {
        /* Reducido el padding de 2rem a 1.5rem para acercar el contenido al borde izquierdo y derecho */
        padding: 1.5rem; 
      }
    }

    /* --- Mensajes (Notificaciones) --- */
    .message-box {
      padding: 0.75rem; /* p-3 */
      margin-bottom: 1.5rem; /* mb-6 */
      border-radius: 0.5rem; /* rounded-lg */
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); /* shadow-md */
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .message-success {
      background-color: #d1fae5; /* green-100 */
      color: #065f46; /* green-800 */
    }

    .message-error {
      background-color: #fee2e2; /* red-100 */
      color: #991b1b; /* red-800 */
    }
    
    .message-close-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: inherit;
        opacity: 0.8;
    }
    .message-close-btn:hover {
        opacity: 1;
    }

    /* --- Búsqueda y Botón Nuevo --- */
    .toolbar {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem; /* mb-6 */
      gap: 1rem; /* gap-4 */
    }
    
    @media (min-width: 640px) {
        .toolbar {
            flex-direction: row;
        }
    }

    .search-container {
      position: relative;
      width: 100%;
    }
    
    @media (min-width: 640px) {
        .search-container {
            width: 50%; /* sm:w-1/2 */
        }
    }
    @media (min-width: 1024px) {
        .search-container {
            width: 33.333333%; /* lg:w-1/3 */
        }
    }

    .search-icon {
      position: absolute;
      left: 0.75rem; /* left-3 */
      top: 50%;
      transform: translateY(-50%);
      color: #9ca3af; /* gray-400 */
    }

    .search-input {
      width: 100%;
      padding: 0.5rem 1rem 0.5rem 2.5rem; /* pl-10 pr-4 py-2 */
      border: 1px solid #d1d5db; /* border border-gray-300 */
      border-radius: 0.5rem; /* rounded-lg */
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .search-input:focus {
        border-color: #4f46e5; /* focus:border-indigo-500 */
        outline: none;
    }
    
    .btn-new {
      width: 100%;
      padding: 0.5rem 1.5rem; /* px-6 py-2 */
      background-color: #4f46e5; /* bg-indigo-600 */
      color: white;
      font-weight: 600; /* font-semibold */
      border-radius: 0.5rem; /* rounded-lg */
      border: none;
      cursor: pointer;
      transition: background-color 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem; /* gap-2 */
    }
    .btn-new:hover {
        background-color: #4338ca; /* hover:bg-indigo-700 */
    }

    @media (min-width: 640px) {
        .btn-new {
            width: auto; /* sm:w-auto */
        }
    }

    /* --- Tabla de Datos --- */
    .table-container {
      background-color: white;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); /* shadow-xl */
      border-radius: 0.5rem; /* rounded-lg */
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      border-top: 1px solid #e5e7eb; /* divide-y divide-gray-200 */
    }

    .data-table thead {
      background-color: #f9fafb; /* bg-gray-50 */
    }

    .data-table th {
      padding: 0.75rem 1.5rem; /* px-6 py-3 */
      text-align: left;
      font-size: 0.75rem; /* text-xs */
      font-weight: 500;
      color: #6b7280; /* text-gray-500 */
      text-transform: uppercase;
      letter-spacing: 0.05em; /* tracking-wider */
    }
    
    .data-table th:nth-child(3),
    .data-table th:nth-child(4),
    .data-table th:nth-child(5) {
        text-align: right;
    }
    .data-table th:last-child {
        text-align: center;
    }

    .data-table td {
      padding: 1rem 1.5rem; /* px-6 py-4 */
      white-space: nowrap;
      font-size: 0.875rem; /* text-sm */
      border-bottom: 1px solid #e5e7eb; /* divide-y */
    }
    
    .data-table tbody tr:hover {
        background-color: #eef2ff; /* hover:bg-indigo-50 */
        transition: background-color 0.1s;
    }
    .data-table tbody tr:last-child td {
        border-bottom: none;
    }

    .cell-id {
      font-family: monospace;
      color: #6b7280;
    }
    .cell-name {
      font-weight: 500;
      color: #111827;
    }
    .cell-dto {
      color: #059669; /* text-green-600 */
      font-weight: 600;
      text-align: right;
    }
    .cell-price {
      font-weight: 700;
      color: #374151; /* text-gray-700 */
      text-align: right;
    }
    .cell-actions {
      text-align: center;
    }
    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 0.75rem; /* gap-3 */
    }
    
    .btn-edit, .btn-delete {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 9999px;
      transition: background-color 0.15s;
    }
    .btn-edit {
      color: #4f46e5; /* text-indigo-600 */
    }
    .btn-edit:hover {
      color: #3730a3; /* hover:text-indigo-900 */
      background-color: #eef2ff; /* hover:bg-indigo-100 */
    }
    .btn-delete {
      color: #dc2626; /* text-red-600 */
    }
    .btn-delete:hover {
      color: #991b1b; /* hover:text-red-900 */
      background-color: #fee2e2; /* hover:bg-red-100 */
    }
    
    .no-results {
        text-align: center;
        color: #6b7280;
    }

    /* --- Formulario --- */
    .form-container {
      background-color: white;
      padding: 1.5rem; /* p-6 */
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); /* shadow-xl */
      border-radius: 0.5rem; /* rounded-lg */
      max-width: 32rem; /* max-w-lg */
      margin-left: auto;
      margin-right: auto;
    }

    .form-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      color: #111827;
    }

    .form-group {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .form-label {
        display: block;
    }

    .form-label span {
      display: block;
      color: #374151; /* gray-700 */
      font-weight: 500;
      margin-bottom: 0.25rem;
    }

    .form-input {
      display: block;
      width: 100%;
      padding: 0.5rem;
      border-radius: 0.375rem; /* rounded-md */
      border: 1px solid #d1d5db; /* border-gray-300 */
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
      font-size: 0.875rem; /* text-sm */
      transition: border-color 0.15s, box-shadow 0.15s;
    }

    .form-input:focus {
        border-color: #4f46e5;
        outline: none;
        box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
    
    .form-input[disabled] {
        background-color: #f3f4f6; /* bg-gray-100 */
        cursor: not-allowed;
    }

    .form-actions {
      display: flex;
      gap: 1rem; /* gap-4 */
      margin-top: 1.5rem; /* mt-6 */
    }
    
    .btn-cancel, .btn-save {
      flex: 1;
      padding: 0.5rem 1rem;
      font-weight: 600;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: background-color 0.15s;
    }
    
    .btn-cancel {
      background-color: white;
      border: 1px solid #d1d5db;
      color: #374151;
    }
    .btn-cancel:hover {
        background-color: #f3f4f6;
    }
    
    .btn-save {
      background-color: #4f46e5;
      color: white;
      border: none;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .btn-save:hover {
        background-color: #4338ca;
    }

    /* --- Modal --- */
    .modal-overlay {
      position: fixed;
      inset: 0; /* top: 0, left: 0, right: 0, bottom: 0 */
      background-color: rgba(17, 24, 39, 0.5); /* bg-gray-900 bg-opacity-50 */
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1rem; /* p-4 */
      z-index: 50;
    }

    .modal-content {
      background-color: white;
      padding: 1.5rem; /* p-6 */
      border-radius: 0.5rem; /* rounded-lg */
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* shadow-2xl */
      max-width: 24rem; /* max-w-sm */
      width: 100%;
    }

    .modal-title {
      font-size: 1.125rem; /* text-lg */
      font-weight: 600;
      color: #111827;
      margin-bottom: 1rem; /* mb-4 */
    }
    
    .modal-body {
        color: #4b5563; /* text-gray-600 */
        margin-bottom: 1.5rem; /* mb-6 */
    }

    .modal-body strong {
      color: #dc2626; /* text-red-600 */
      display: block;
      margin-top: 0.25rem; /* mt-1 */
      font-weight: 700;
    }
    
    .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem; /* gap-3 */
    }

    .btn-modal-cancel {
      padding: 0.5rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      color: #374151;
      background: white;
      cursor: pointer;
      transition: background-color 0.15s;
    }
    .btn-modal-cancel:hover {
        background-color: #f3f4f6;
    }

    .btn-modal-delete {
      padding: 0.5rem 1rem;
      background-color: #dc2626; /* bg-red-600 */
      color: white;
      font-weight: 600;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: background-color 0.15s;
    }
    .btn-modal-delete:hover {
        background-color: #b91c1c; /* hover:bg-red-700 */
    }
  `;

  return (
    <div className="app-container">
      {/* Estilos CSS inyectados */}
      <style>{styles}</style>
      
      {/* Sidebar */}
      <aside 
        className={`sidebar ${isSidebarOpen ? 'open' : ''}`}
      >
        <div className="sidebar-header">
          <div className="sidebar-logo">A</div>
          <span className="text-xl font-semibold">Admin Portal</span>
          <button 
            className="sidebar-close md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
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
            <button 
              className="menu-button"
              onClick={() => setIsSidebarOpen(true)}
            >
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

        {/* Contenido de la página de productos (CRUD) */}
        <main className="main-content">
          {/* Eliminado el div innecesario de alineación */}
            
            {/* Mensaje de la aplicación (éxito/error) */}
            {message && (
                <div 
                    className={`message-box ${message.type === 'error' ? 'message-error' : 'message-success'}`}
                    role="alert"
                >
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
                  <button 
                    onClick={handleNew} 
                    className="btn-new"
                  >
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
                            <tr key={p.id}>
                              <td className="cell-id">{p.id}</td>
                              <td className="cell-name">{p.nombre}</td>
                              <td style={{ textAlign: 'right', color: '#4b5563' }}>{p.cantidad}</td>
                              <td className="cell-dto">{p.dto}%</td>
                              <td className="cell-price">{p.precio.toFixed(2)}€</td>
                              <td className="cell-actions">
                                <div className="action-buttons">
                                  <button 
                                    onClick={() => handleEdit(p)} 
                                    className="btn-edit"
                                    title="Editar"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteClick(p)} 
                                    className="btn-delete"
                                    title="Eliminar"
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
              <div className="form-container">
                <h2 className="form-title">
                  {selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <div className="form-group">
                  
                  <label className="form-label">
                    <span>ID</span>
                    <input 
                      type="text" 
                      value={formData.id} 
                      disabled 
                      className="form-input" 
                    />
                  </label>

                  <label className="form-label">
                    <span>Nombre *</span>
                    <input 
                      type="text" 
                      value={formData.nombre} 
                      onChange={e => setFormData({ ...formData, nombre: e.target.value })} 
                      className="form-input" 
                    />
                  </label>

                  <label className="form-label">
                    <span>Cantidad</span>
                    <input 
                      type="number" 
                      value={formData.cantidad} 
                      onChange={e => setFormData({ ...formData, cantidad: e.target.value })} 
                      className="form-input" 
                    />
                  </label>

                  <label className="form-label">
                    <span>DTO (%)</span>
                    <input 
                      type="number" 
                      value={formData.dto} 
                      onChange={e => setFormData({ ...formData, dto: e.target.value })} 
                      className="form-input" 
                    />
                  </label>

                  <label className="form-label">
                    <span>Precio (€) *</span>
                    <input 
                      type="number" 
                      value={formData.precio} 
                      onChange={e => setFormData({ ...formData, precio: e.target.value })} 
                      className="form-input" 
                    />
                  </label>

                  <div className="form-actions">
                    <button 
                      onClick={handleCancel} 
                      className="btn-cancel"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleSave} 
                      className="btn-save"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal de confirmación de eliminación */}
            {showDeleteModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3 className="modal-title">Confirmar Eliminación</h3>
                  <p className="modal-body">
                    ¿Estás seguro de que quieres eliminar el producto 
                    <strong>"{productToDelete?.nombre}"</strong>? Esta acción es irreversible.
                  </p>
                  <div className="modal-actions">
                    <button 
                      onClick={() => setShowDeleteModal(false)}
                      className="btn-modal-cancel"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleConfirmDelete} 
                      className="btn-modal-delete"
                    >
                      Eliminar
                    </button>
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