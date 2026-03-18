import { Link } from 'react-router-dom';
import { Users, Package, Truck, DollarSign, Warehouse, ArrowLeftRight, ShoppingCart, FileText } from 'lucide-react';
import ProfileButton from '../components/ProfileButton';

const modules = [
  { to: '/clientes', icon: Users, label: 'Clientes', desc: 'Gestión de clientes y cuentas', color: '#1d4ed8', bg: '#eff6ff' },
  { to: '/articulos', icon: Package, label: 'Artículos', desc: 'Catálogo de productos y artículos', color: '#7c3aed', bg: '#f5f3ff' },
  { to: '/representantes', icon: Users, label: 'Representantes', desc: 'Equipo comercial y zonas', color: '#0891b2', bg: '#ecfeff' },
  { to: '/proveedores', icon: Truck, label: 'Proveedores', desc: 'Gestión de proveedores', color: '#059669', bg: '#f0fdf4' },
  { to: '/divisas', icon: DollarSign, label: 'Divisas', desc: 'Monedas y tipos de cambio', color: '#d97706', bg: '#fffbeb' },
  { to: '/almacenes', icon: Warehouse, label: 'Almacenes', desc: 'Control de ubicaciones de stock', color: '#dc2626', bg: '#fef2f2' },
  { to: '/movimientos', icon: ArrowLeftRight, label: 'Movimientos', desc: 'Entradas y salidas de stock', color: '#7c3aed', bg: '#f5f3ff' },
  { to: '/pedidos', icon: ShoppingCart, label: 'Pedidos', desc: 'Gestión de pedidos de venta', color: '#1d4ed8', bg: '#eff6ff' },
  { to: '/tipos-movimiento', icon: FileText, label: 'Tipos Movimiento', desc: 'Configuración de tipos', color: '#475569', bg: '#f8fafc' },
];

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', flexShrink: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
        <div>
          <h1 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Panel de control</h1>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0' }}>Belgem ERP — Sistema de gestión empresarial</p>
        </div>
        <ProfileButton />
      </header>

      <div style={{ flex: 1, overflow: 'auto', padding: '28px', backgroundColor: '#f8fafc' }}>
        {/* Banner */}
        <div style={{ background: 'linear-gradient(135deg, #0c1e3e 0%, #1d4ed8 100%)', borderRadius: '10px', padding: '28px 32px', marginBottom: '28px', color: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-20px', top: '-30px', width: '180px', height: '180px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', right: '60px', bottom: '-40px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
          <h2 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 6px', position: 'relative' }}>Bienvenido a Belgem ERP</h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', margin: 0, position: 'relative' }}>Sistema de gestión centralizada. Selecciona un módulo para comenzar.</p>
        </div>

        {/* Modules grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {modules.map(({ to, icon: Icon, label, desc, color, bg }) => (
            <Link key={to} to={to} style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '20px', cursor: 'pointer', transition: 'all 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <Icon size={20} color={color} />
                </div>
                <h3 style={{ fontSize: '14.5px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px' }}>{label}</h3>
                <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
