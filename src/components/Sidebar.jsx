import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Home, Package, Users, DollarSign, FileText,
    Menu, Truck, Warehouse, ArrowLeftRight, ShoppingCart, RefreshCw
} from 'lucide-react';

const navLinks = [
    { to: '/', icon: Home, label: 'Inicio' },
    { to: '/clientes', icon: Users, label: 'Clientes' },
    { to: '/articulos', icon: Package, label: 'Artículos' },
    { to: '/representantes', icon: Users, label: 'Representantes' },
    { to: '/proveedores', icon: Truck, label: 'Proveedores' },
    { to: '/divisas', icon: DollarSign, label: 'Divisas' },
    { to: '/almacenes', icon: Warehouse, label: 'Almacenes' },
    { to: '/movimientos', icon: ArrowLeftRight, label: 'Movimientos' },
    { to: '/pedidos', icon: ShoppingCart, label: 'Pedidos' },
    { to: '/tipos-movimiento', icon: FileText, label: 'Tipos Movimiento' },
];

export default function Sidebar() {
    const [open, setOpen] = useState(true);
    const location = useLocation();

    return (
        <div style={{
            width: open ? '256px' : '72px',
            backgroundColor: '#312e81',
            color: 'white',
            transition: 'width 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            height: '100vh',
            position: 'sticky',
            top: 0,
            overflow: 'hidden'
        }}>
            {/* Logo / Header */}
            <div style={{
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #4338ca',
                minHeight: '64px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                    <div style={{
                        width: '34px',
                        height: '34px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <span style={{ color: '#312e81', fontWeight: 'bold', fontSize: '15px' }}>B</span>
                    </div>
                    {open && (
                        <span style={{ fontWeight: '700', whiteSpace: 'nowrap', fontSize: '15px' }}>
                            Belgem ERP
                        </span>
                    )}
                </div>
                <button
                    onClick={() => setOpen(!open)}
                    style={{
                        padding: '6px',
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <Menu size={20} />
                </button>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
                {navLinks.map(({ to, icon: Icon, label }) => {
                    const isActive = to === '/'
                        ? location.pathname === '/'
                        : location.pathname === to || location.pathname.startsWith(to + '/');

                    return (
                        <Link
                            key={to}
                            to={to}
                            title={!open ? label : undefined}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                color: 'white',
                                marginBottom: '4px',
                                backgroundColor: isActive ? '#4338ca' : 'transparent',
                                transition: 'background-color 0.15s',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden'
                            }}
                            onMouseEnter={e => {
                                if (!isActive) e.currentTarget.style.backgroundColor = '#3730a3';
                            }}
                            onMouseLeave={e => {
                                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            <Icon size={20} style={{ flexShrink: 0 }} />
                            {open && (
                                <span style={{ fontSize: '14px', fontWeight: isActive ? '600' : '400' }}>
                                    {label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}