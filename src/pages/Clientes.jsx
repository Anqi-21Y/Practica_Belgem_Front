import React, { useState } from 'react';
import { Home, Users, Menu, Bell, User, Search, Edit2, Trash2, Plus, X, Eye } from 'lucide-react';

const ClientesPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [clientes, setClientes] = useState([
    {
      id: 1,
      ciudad: 'Barcelona',
      codigo_postal: '08001',
      direccion: 'Calle Mayor 5',
      email: 'juan@example.com',
      nif: '12345678A',
      nombre: 'Juan Pérez',
      observaciones: 'Cliente de prueba desde Postman',
      representante: 'Ana Gómez',
      telefono: '600123456',
      tipo_cliente: 'Premium',
      zona: 'Cataluña'
    },
    {
      id: 2,
      ciudad: 'Madrid',
      codigo_postal: '28001',
      direccion: 'Gran Vía 45',
      email: 'maria@example.com',
      nif: '87654321B',
      nombre: 'María López',
      observaciones: 'Cliente corporativo',
      representante: 'Carlos Ruiz',
      telefono: '600987654',
      tipo_cliente: 'Corporativo',
      zona: 'Madrid'
    },
    {
      id: 3,
      ciudad: 'Valencia',
      codigo_postal: '46001',
      direccion: 'Avenida del Puerto 12',
      email: 'pedro@example.com',
      nif: '11223344C',
      nombre: 'Pedro Martínez',
      observaciones: 'Nuevo cliente',
      representante: 'Laura Sánchez',
      telefono: '600555444',
      tipo_cliente: 'Estándar',
      zona: 'Valencia'
    }
  ]);

  const [formData, setFormData] = useState({
    id: '',
    ciudad: '',
    codigo_postal: '',
    direccion: '',
    email: '',
    nif: '',
    nombre: '',
    observaciones: '',
    representante: '',
    telefono: '',
    tipo_cliente: '',
    zona: ''
  });

  const handleViewClient = (cliente) => {
    setSelectedClient(cliente);
    setViewMode('view');
  };

  const handleEdit = (cliente) => {
    setSelectedClient(cliente);
    setFormData(cliente);
    setViewMode('edit');
  };

  const handleDelete = (cliente) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar el cliente "${cliente.nombre}"?\n\nEsta acción no se puede deshacer.`
    );
    
    if (confirmDelete) {
      setClientes(clientes.filter(c => c.id !== cliente.id));
      alert(`Cliente "${cliente.nombre}" eliminado correctamente`);
    }
  };

  const handleNew = () => {
    setSelectedClient(null);
    setFormData({
      id: clientes.length + 1,
      ciudad: '',
      codigo_postal: '',
      direccion: '',
      email: '',
      nif: '',
      nombre: '',
      observaciones: '',
      representante: '',
      telefono: '',
      tipo_cliente: '',
      zona: ''
    });
    setViewMode('create');
  };

  const handleSave = () => {
    if (!formData.nombre || !formData.nif) {
      alert('Por favor completa los campos obligatorios (Nombre y NIF)');
      return;
    }

    if (viewMode === 'edit') {
      setClientes(clientes.map(c => 
        c.id === selectedClient.id ? formData : c
      ));
      alert('Cliente actualizado correctamente');
    } else {
      setClientes([...clientes, formData]);
      alert('Cliente creado correctamente');
    }
    setViewMode('list');
    setSelectedClient(null);
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedClient(null);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.nif.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTitle = () => {
    switch(viewMode) {
      case 'view': return `Detalles del Cliente`;
      case 'edit': return 'Editar Cliente';
      case 'create': return 'Nuevo Cliente';
      default: return 'Clientes';
    }
  };

  const renderForm = () => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '24px',
      maxWidth: '896px'
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {[
          { label: 'ID Cliente *', field: 'id', disabled: viewMode === 'edit', placeholder: '1' },
          { label: 'Nombre *', field: 'nombre', placeholder: 'Juan Pérez' },
          { label: 'NIF *', field: 'nif', placeholder: '12345678A' },
          { label: 'Teléfono', field: 'telefono', type: 'tel', placeholder: '+34 600 123 456' },
          { label: 'Email', field: 'email', type: 'email', placeholder: 'cliente@example.com' },
          { label: 'Dirección', field: 'direccion', placeholder: 'Calle Mayor 5' },
          { label: 'Ciudad', field: 'ciudad', placeholder: 'Barcelona' },
          { label: 'Código Postal', field: 'codigo_postal', placeholder: '08001' },
          { label: 'Zona', field: 'zona', placeholder: 'Cataluña' },
          { label: 'Representante', field: 'representante', placeholder: 'Ana Gómez' }
        ].map(({ label, field, disabled, type = 'text', placeholder }) => (
          <div key={field}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              {label}
            </label>
            <input
              type={type}
              value={formData[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
              disabled={disabled}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: disabled ? '#f3f4f6' : 'white'
              }}
              placeholder={placeholder}
            />
          </div>
        ))}
        
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Tipo Cliente
          </label>
          <select
            value={formData.tipo_cliente}
            onChange={(e) => handleInputChange('tipo_cliente', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          >
            <option value="">Seleccionar...</option>
            <option value="Estándar">Estándar</option>
            <option value="Premium">Premium</option>
            <option value="Corporativo">Corporativo</option>
          </select>
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Observaciones
          </label>
          <textarea
            value={formData.observaciones}
            onChange={(e) => handleInputChange('observaciones', e.target.value)}
            rows="3"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
            placeholder="Notas adicionales sobre el cliente..."
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
        <button
          onClick={handleCancel}
          style={{
            padding: '8px 24px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            color: '#374151',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          style={{
            padding: '8px 24px',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Guardar Cambios
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
          <a href="#home" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none', color: 'white' }}>
            <Home size={20} />
            {sidebarOpen && <span>Home</span>}
          </a>
          <a href="#clientes" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', backgroundColor: '#4338ca', textDecoration: 'none', color: 'white' }}>
            <Users size={20} />
            {sidebarOpen && <span>Clientes</span>}
          </a>
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
            <button style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer' }}><User size={20} /></button>
          </div>
        </header>

        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {viewMode === 'list' ? (
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input type="text" placeholder="Buscar clientes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: '40px', padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', width: '300px' }} />
                </div>
                <button onClick={handleNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#4f46e5', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500' }}>
                  <Plus size={20} />Nuevo Cliente
                </button>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <tr>
                    {['ID', 'Nombre', 'NIF', 'Email', 'Teléfono', 'Ciudad', 'Tipo', 'Acciones'].map(h => (
                      <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredClientes.map((cliente) => (
                    <tr key={cliente.id} onClick={() => handleViewClient(cliente)}
                      style={{ borderBottom: '1px solid #e5e7eb', cursor: 'pointer' }}>
                      <td style={{ padding: '16px 24px', fontSize: '14px' }}>{cliente.id}</td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500' }}>{cliente.nombre}</td>
                      <td style={{ padding: '16px 24px', fontSize: '14px' }}>{cliente.nif}</td>
                      <td style={{ padding: '16px 24px', fontSize: '14px' }}>{cliente.email}</td>
                      <td style={{ padding: '16px 24px', fontSize: '14px' }}>{cliente.telefono}</td>
                      <td style={{ padding: '16px 24px', fontSize: '14px' }}>{cliente.ciudad}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ padding: '4px 8px', fontSize: '12px', fontWeight: '600', borderRadius: '9999px',
                          backgroundColor: cliente.tipo_cliente === 'Premium' ? '#f3e8ff' : cliente.tipo_cliente === 'Corporativo' ? '#dbeafe' : '#f3f4f6',
                          color: cliente.tipo_cliente === 'Premium' ? '#7c3aed' : cliente.tipo_cliente === 'Corporativo' ? '#2563eb' : '#4b5563' }}>
                          {cliente.tipo_cliente}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleViewClient(cliente)} style={{ padding: '8px', color: '#059669', background: 'transparent', border: 'none', cursor: 'pointer' }} title="Ver"><Eye size={16} /></button>
                          <button onClick={() => handleEdit(cliente)} style={{ padding: '8px', color: '#4f46e5', background: 'transparent', border: 'none', cursor: 'pointer' }} title="Editar"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(cliente)} style={{ padding: '8px', color: '#dc2626', background: 'transparent', border: 'none', cursor: 'pointer' }} title="Eliminar"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : viewMode === 'view' ? (
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '32px', maxWidth: '896px' }}>
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '2px solid #e5e7eb' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>{selectedClient?.nombre}</h2>
                <span style={{ padding: '6px 12px', fontSize: '14px', fontWeight: '600', borderRadius: '9999px',
                  backgroundColor: selectedClient?.tipo_cliente === 'Premium' ? '#f3e8ff' : selectedClient?.tipo_cliente === 'Corporativo' ? '#dbeafe' : '#f3f4f6',
                  color: selectedClient?.tipo_cliente === 'Premium' ? '#7c3aed' : selectedClient?.tipo_cliente === 'Corporativo' ? '#2563eb' : '#4b5563' }}>
                  {selectedClient?.tipo_cliente}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                {[
                  { label: 'ID Cliente', value: selectedClient?.id },
                  { label: 'NIF', value: selectedClient?.nif },
                  { label: 'Email', value: selectedClient?.email },
                  { label: 'Teléfono', value: selectedClient?.telefono },
                  { label: 'Dirección', value: selectedClient?.direccion },
                  { label: 'Ciudad', value: selectedClient?.ciudad },
                  { label: 'Código Postal', value: selectedClient?.codigo_postal },
                  { label: 'Zona', value: selectedClient?.zona },
                  { label: 'Representante', value: selectedClient?.representante }
                ].map(({ label, value }) => (
                  <div key={label}>
                    <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</h3>
                    <p style={{ fontSize: '16px', margin: 0 }}>{value}</p>
                  </div>
                ))}
                <div style={{ gridColumn: '1 / -1' }}>
                  <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>Observaciones</h3>
                  <p style={{ fontSize: '16px', margin: 0, lineHeight: '1.6' }}>{selectedClient?.observaciones || 'Sin observaciones'}</p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                <button onClick={handleCancel} style={{ padding: '8px 24px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#6b7280', cursor: 'pointer', fontWeight: '500' }}>Volver</button>
                <button onClick={() => handleEdit(selectedClient)} style={{ padding: '8px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Editar Cliente</button>
              </div>
            </div>
          ) : renderForm()}
        </div>
      </div>
    </div>
  );
};

export default ClientesPage;