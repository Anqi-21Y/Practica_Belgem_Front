import React, { useState } from 'react';
import { Home, DollarSign, Menu, Bell, User, Search, Edit2, Trash2, Plus, X, Eye } from 'lucide-react';

const DivisasPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDivisa, setSelectedDivisa] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [divisas, setDivisas] = useState([
    {
      id: 1,
      code: 'EUR',
      name: 'EURO'
    },
    {
      id: 2,
      code: 'USD',
      name: 'DÓLAR USA'
    },
    {
      id: 6,
      code: 'USX',
      name: 'DÓLAR BELGEM +10%'
    }
  ]);

  const [formData, setFormData] = useState({
    id: '',
    code: '',
    name: ''
  });

  const handleViewDivisa = (divisa) => {
    setSelectedDivisa(divisa);
    setViewMode('view');
  };

  const handleEdit = (divisa) => {
    setSelectedDivisa(divisa);
    setFormData(divisa);
    setViewMode('edit');
  };

  const handleDelete = (divisa) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar la divisa "${divisa.name}"?\n\nEsta acción no se puede deshacer.`
    );
    
    if (confirmDelete) {
      setDivisas(divisas.filter(d => d.id !== divisa.id));
      alert(`Divisa "${divisa.name}" eliminada correctamente`);
    }
  };

  const handleNew = () => {
    setSelectedDivisa(null);
    setFormData({
      id: divisas.length > 0 ? Math.max(...divisas.map(d => d.id)) + 1 : 1,
      code: '',
      name: ''
    });
    setViewMode('create');
  };

  const handleSave = () => {
    if (!formData.code || !formData.name) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    if (viewMode === 'edit') {
      setDivisas(divisas.map(d => 
        d.id === selectedDivisa.id ? formData : d
      ));
      alert('Divisa actualizada correctamente');
    } else {
      setDivisas([...divisas, formData]);
      alert('Divisa creada correctamente');
    }
    setViewMode('list');
    setSelectedDivisa(null);
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedDivisa(null);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const filteredDivisas = divisas.filter(divisa =>
    divisa.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    divisa.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTitle = () => {
    switch(viewMode) {
      case 'view': return `Detalles de la Divisa`;
      case 'edit': return 'Editar Divisa';
      case 'create': return 'Nueva Divisa';
      default: return 'Divisas';
    }
  };

  const renderForm = () => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '24px',
      maxWidth: '600px'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            ID *
          </label>
          <input
            type="number"
            value={formData.id}
            onChange={(e) => handleInputChange('id', parseInt(e.target.value))}
            disabled={viewMode === 'edit'}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              outline: 'none',
              boxSizing: 'border-box',
              backgroundColor: viewMode === 'edit' ? '#f3f4f6' : 'white'
            }}
            placeholder="1"
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Código *
          </label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
            maxLength={10}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            placeholder="EUR"
          />
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', marginBottom: 0 }}>
            Máximo 10 caracteres
          </p>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Nombre *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            placeholder="EURO"
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
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
          <a href="#divisas" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', backgroundColor: '#4338ca', textDecoration: 'none', color: 'white' }}>
            <DollarSign size={20} />
            {sidebarOpen && <span>Divisas</span>}
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
                    <input type="text" placeholder="Buscar divisas..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: '40px', padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', width: '300px' }} />
                </div>
                <button onClick={handleNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#4f46e5', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500' }}>
                    <Plus size={20} />Nueva Divisa
                </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <tr>
                    {['ID', 'Código', 'Nombre', 'Acciones'].map(h => (
                        <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredDivisas.map((divisa) => (
                    <tr key={divisa.id} onClick={() => handleViewDivisa(divisa)}
                        style={{ borderBottom: '1px solid #e5e7eb', cursor: 'pointer' }}>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1f2937' }}>{divisa.id}</td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                        <span style={{ 
                            padding: '4px 12px', 
                            backgroundColor: '#dbeafe', 
                            color: '#1e40af', 
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '600'
                        }}>
                            {divisa.code}
                        </span>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#4b5563' }}>{divisa.name}</td>
                    <td style={{ padding: '16px 24px' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleViewDivisa(divisa)} style={{ padding: '8px', color: '#059669', background: 'transparent', border: 'none', cursor: 'pointer' }} title="Ver"><Eye size={16} /></button>
                            <button onClick={() => handleEdit(divisa)} style={{ padding: '8px', color: '#4f46e5', background: 'transparent', border: 'none', cursor: 'pointer' }} title="Editar"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(divisa)} style={{ padding: '8px', color: '#dc2626', background: 'transparent', border: 'none', cursor: 'pointer' }} title="Eliminar"><Trash2 size={16} /></button>
                        </div>
                    </td>
                    </tr>
                    ))}
                </tbody>
            </table>
            </div>
            ) : viewMode === 'view' ? (
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '32px', maxWidth: '600px' }}>
                <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '2px solid #e5e7eb' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>{selectedDivisa?.name}</h2>
                <span style={{ 
                    padding: '6px 16px', 
                    backgroundColor: '#dbeafe', 
                    color: '#1e40af', 
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600'
                }}>
                    {selectedDivisa?.code}
                </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div>
                    <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>ID</h3>
                    <p style={{ fontSize: '18px', margin: 0, color: '#1f2937' }}>{selectedDivisa?.id}</p>
                </div>
                <div>
                    <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>Código</h3>
                    <p style={{ fontSize: '18px', margin: 0, color: '#1f2937' }}>{selectedDivisa?.code}</p>
                </div>
                <div>
                <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>Nombre</h3>
                <p style={{ fontSize: '18px', margin: 0, color: '#1f2937' }}>{selectedDivisa?.name}</p>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                <button onClick={handleCancel} style={{ padding: '8px 24px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#6b7280', cursor: 'pointer', fontWeight: '500' }}>Volver</button>
                <button onClick={() => handleEdit(selectedDivisa)} style={{ padding: '8px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Editar Divisa</button>
            </div>
            </div>
        ) : renderForm()}
        </div>
      </div>
    </div>
  );
};

export default DivisasPage;