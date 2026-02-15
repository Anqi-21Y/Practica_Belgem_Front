import React, { useState } from 'react';
import { Eye, Edit2, Trash2, Search, Home, Package, Warehouse, TrendingUp, FileText, Menu, Plus, X, AlertCircle, Users, DollarSign, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const TiposMovimientoPage = () => {
  // --- Estados de la interfaz ---
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTipo, setSelectedTipo] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Datos iniciales (Tu lógica original) ---
  const [tipos, setTipos] = useState([
    { id: 1, nombre: 'Entrada por compra', descripcion: 'Incremento de stock por compra a proveedor' },
    { id: 2, nombre: 'Salida por venta', descripcion: 'Disminución de stock por venta al cliente' },
    { id: 3, nombre: 'Ajuste de inventario', descripcion: 'Corrección de diferencias en el stock físico' },
    { id: 4, nombre: 'Transferencia entre almacenes', descripcion: 'Movimiento de productos entre ubicaciones' },
    { id: 5, nombre: 'Devolución de cliente', descripcion: 'Reingreso de productos devueltos por clientes' },
    { id: 6, nombre: 'Merma', descripcion: 'Pérdida de productos por deterioro o vencimiento' }
  ]);

  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    descripcion: ''
  });

  // --- Manejadores de eventos (Tu lógica original) ---
  const handleViewTipo = (tipo) => {
    setSelectedTipo(tipo);
    setViewMode('view');
  };

  const handleEdit = (tipo) => {
    setSelectedTipo(tipo);
    setFormData({
      id: tipo.id,
      nombre: tipo.nombre || '',
      descripcion: tipo.descripcion || ''
    });
    setViewMode('edit');
  };

  const handleDelete = (tipo) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar el tipo de movimiento "${tipo.nombre}"?\n\nEsta acción no se puede deshacer.`
    );
    if (confirmDelete) {
      setTipos(tipos.filter(t => t.id !== tipo.id));
      alert(`Tipo de movimiento "${tipo.nombre}" eliminado correctamente`);
    }
  };

  const handleNew = () => {
    setSelectedTipo(null);
    setFormData({ id: '', nombre: '', descripcion: '' });
    setViewMode('create');
  };

  const handleSave = () => {
    if (!formData.nombre || !formData.descripcion) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    if (viewMode === 'edit') {
      setTipos(tipos.map(t =>
        t.id === selectedTipo.id
          ? { ...t, nombre: formData.nombre, descripcion: formData.descripcion }
          : t
      ));
      alert('Tipo de movimiento actualizado correctamente');
    } else {
      const newTipo = {
        id: Math.max(...tipos.map(t => t.id), 0) + 1,
        nombre: formData.nombre,
        descripcion: formData.descripcion
      };
      setTipos([...tipos, newTipo]);
      alert('Tipo de movimiento creado correctamente');
    }
    setViewMode('list');
    setSelectedTipo(null);
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedTipo(null);
    setError(null);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const filteredTipos = tipos.filter(tipo =>
    tipo.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tipo.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTitle = () => {
    switch (viewMode) {
      case 'view': return 'Detalles del Tipo de Movimiento';
      case 'edit': return 'Editar Tipo de Movimiento';
      case 'create': return 'Nuevo Tipo de Movimiento';
      default: return 'Tipos de Movimiento';
    }
  };

  // --- Renderizado de Formulario (Mantenido igual, con corrección de ancho) ---
  const renderForm = () => (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gap: '24px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Nombre *</label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => handleInputChange('nombre', e.target.value)}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Descripción *</label>
          <textarea
            value={formData.descripcion}
            onChange={(e) => handleInputChange('descripcion', e.target.value)}
            rows="4"
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box', resize: 'vertical' }}
          />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
        <button onClick={handleCancel} style={{ padding: '8px 24px', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', backgroundColor: 'white' }}>Cancelar</button>
        <button onClick={handleSave} style={{ padding: '8px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Guardar Cambios</button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#f9fafb', fontFamily: 'system-ui', overflow: 'hidden' }}>
      
      {/* Sidebar */}
      <div style={{ 
        width: sidebarOpen ? '260px' : '80px', 
        minWidth: sidebarOpen ? '260px' : '80px',
        backgroundColor: '#312e81', 
        color: 'white', 
        transition: 'width 0.3s ease', 
        display: 'flex', 
        flexDirection: 'column',
        zIndex: 10
      }}>
        <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
            <div style={{ minWidth: '32px', width: '32px', height: '32px', backgroundColor: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#312e81', fontWeight: 'bold' }}>A</span>
            </div>
            {sidebarOpen && <span style={{ fontWeight: '600', fontSize: '18px', whiteSpace: 'nowrap' }}>Admin Portal</span>}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <Menu size={20} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
          
          <NavItem to="/" icon={<Home size={20} />} label="Home" open={sidebarOpen} />
          <NavItem to="/clientes" icon={<Users size={20} />} label="Clientes" open={sidebarOpen} />
          <NavItem to="/articulos" icon={<Package size={20} />} label="Artículos" open={sidebarOpen} />
          <NavItem to="/representantes" icon={<Users size={20} />} label="Representantes" open={sidebarOpen} />
          <NavItem to="/divisas" icon={<DollarSign size={20} />} label="Divisas" open={sidebarOpen} />
          
          {/* Tipos de Movimiento - Item Activo */}
          <Link to="/tipos-movimiento" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            padding: '12px', 
            borderRadius: '12px', 
            backgroundColor: '#4338ca', 
            color: 'white', 
            textDecoration: 'none', 
            marginBottom: '8px' 
          }}>
            <FileText size={20} />
            {sidebarOpen && <span style={{ whiteSpace: 'nowrap' }}>Tipos de Movimiento</span>}
          </Link>

          <NavItem to="/reportes" icon={<FileText size={20} />} label="Reportes" open={sidebarOpen} />
        </nav>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <header style={{ 
          height: '64px',
          backgroundColor: 'white', 
          borderBottom: '1px solid #e5e7eb', 
          padding: '0 24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexShrink: 0 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {viewMode !== 'list' && (
              <button onClick={handleCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <X size={20} color="#6b7280" />
              </button>
            )}
            <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: 0 }}>{getTitle()}</h1>
          </div>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <div style={{ 
            width: '100%', 
            maxWidth: '1000px',
            backgroundColor: 'white', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
            transition: 'all 0.3s ease'
          }}>
            
            {viewMode === 'list' ? (
              <>
                <div style={{ padding: '24px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                  <div style={{ position: 'relative', flexGrow: 1, maxWidth: '400px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input 
                      type="text" 
                      placeholder="Buscar..." 
                      style={{ paddingLeft: '40px', paddingRight: '16px', height: '40px', border: '1px solid #e5e7eb', borderRadius: '8px', width: '100%', boxSizing: 'border-box' }} 
                    />
                  </div>
                  <button onClick={handleNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#4f46e5', color: 'white', padding: '0 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500' }}>
                    <Plus size={18} /> Nuevo Tipo
                  </button>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>Nombre</th>
                        <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>Descripción</th>
                        <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTipos.map((tipo) => (
                        <tr key={tipo.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '20px 24px', fontSize: '14px', fontWeight: '600', color: '#111827' }}>{tipo.nombre}</td>
                          <td style={{ padding: '20px 24px', fontSize: '14px', color: '#4b5563' }}>{tipo.descripcion}</td>
                          <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                              <Eye size={18} onClick={() => handleViewTipo(tipo)} style={{ cursor: 'pointer', color: '#9ca3af' }} />
                              <Edit2 size={18} onClick={() => handleEdit(tipo)} style={{ cursor: 'pointer', color: '#9ca3af' }} />
                              <Trash2 size={18} onClick={() => handleDelete(tipo)} style={{ cursor: 'pointer', color: '#9ca3af' }} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : viewMode === 'view' ? (
              <div style={{ padding: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#111827' }}>{selectedTipo?.nombre}</h2>
                <p style={{ color: '#4b5563', lineHeight: '1.7', fontSize: '16px', marginBottom: '32px' }}>{selectedTipo?.descripcion}</p>
                <button onClick={handleCancel} style={{ padding: '10px 24px', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', backgroundColor: 'white' }}>Volver</button>
              </div>
            ) : (
              <div style={{ padding: '40px' }}>
                {renderForm()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  function NavItem({ to, icon, label, open }) {
    return (
      <Link to={to} style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        padding: '12px', 
        borderRadius: '8px', 
        color: 'white', 
        textDecoration: 'none', 
        marginBottom: '8px' 
      }}>
        {icon}
        {open && <span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
      </Link>
    );
  }
};

export default TiposMovimientoPage;