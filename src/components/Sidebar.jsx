import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Home, Package, Users, DollarSign, FileText,
    ChevronLeft, ChevronRight, Truck, Warehouse,
    ArrowLeftRight, ShoppingCart, Settings
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

    const s = {
        sidebar: {
            width: open ? '240px' : '64px',
            background: 'linear-gradient(180deg, #0c1e3e 0%, #1a3160 100%)',
            color: 'white',
            transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            height: '100vh',
            position: 'sticky',
            top: 0,
            overflow: 'hidden',
            borderRight: '1px solid rgba(255,255,255,0.06)'
        },
        header: {
            padding: open ? '0 16px' : '0 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: open ? 'space-between' : 'center',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            height: '60px',
            flexShrink: 0
        },
        logo: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            overflow: 'hidden'
        },
        logoIcon: {
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: '14px',
            fontWeight: '700',
            letterSpacing: '-0.5px'
        },
        logoText: {
            fontWeight: '700',
            fontSize: '15px',
            whiteSpace: 'nowrap',
            letterSpacing: '-0.3px'
        },
        logoSub: {
            fontSize: '10px',
            color: 'rgba(255,255,255,0.45)',
            fontWeight: '500',
            letterSpacing: '1px',
            textTransform: 'uppercase'
        },
        toggleBtn: {
            padding: '6px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.7)',
            cursor: 'pointer',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.15s'
        },
        nav: {
            flex: 1,
            padding: '12px 8px',
            overflowY: 'auto',
            overflowX: 'hidden'
        },
        sectionLabel: {
            fontSize: '10px',
            fontWeight: '600',
            color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            padding: open ? '12px 12px 6px' : '12px 0 6px',
            textAlign: open ? 'left' : 'center',
            display: 'block',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
        },
        footer: {
            padding: '12px 8px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            flexShrink: 0
        },
        version: {
            fontSize: '10px',
            color: 'rgba(255,255,255,0.25)',
            textAlign: 'center',
            padding: '8px',
            whiteSpace: 'nowrap'
        }
    };

    const getLinkStyle = (isActive) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: open ? '9px 12px' : '9px',
        justifyContent: open ? 'flex-start' : 'center',
        borderRadius: '6px',
        textDecoration: 'none',
        color: isActive ? 'white' : 'rgba(255,255,255,0.55)',
        marginBottom: '2px',
        backgroundColor: isActive ? 'rgba(59,130,246,0.25)' : 'transparent',
        borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        cursor: 'pointer'
    });

    return (
        <div style={s.sidebar}>
            {/* Header */}
            <div style={s.header}>
                {open && (
                    <div style={s.logo}>
                        <div style={s.logoIcon}>B</div>
                        <div>
                            <div style={s.logoText}>Belgem</div>
                            <div style={s.logoSub}>ERP Sistema</div>
                        </div>
                    </div>
                )}
                {!open && <div style={s.logoIcon}>B</div>}
                {open && (
                    <button style={s.toggleBtn} onClick={() => setOpen(false)} title="Colapsar">
                        <ChevronLeft size={16} />
                    </button>
                )}
                {!open && (
                    <button style={{ ...s.toggleBtn, marginTop: '8px', position: 'absolute', bottom: '80px', left: '50%', transform: 'translateX(-50%)' }} onClick={() => setOpen(true)} title="Expandir">
                        <ChevronRight size={16} />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav style={s.nav}>
                {open && <span style={s.sectionLabel}>Navegación</span>}
                {navLinks.map(({ to, icon: Icon, label }) => {
                    const isActive = to === '/'
                        ? location.pathname === '/'
                        : location.pathname === to || location.pathname.startsWith(to + '/');

                    return (
                        <Link
                            key={to}
                            to={to}
                            title={!open ? label : undefined}
                            style={getLinkStyle(isActive)}
                            onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'white'; }}
                            onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
                        >
                            <Icon size={17} style={{ flexShrink: 0 }} />
                            {open && <span style={{ fontSize: '13.5px', fontWeight: isActive ? '600' : '400' }}>{label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            {open && <div style={s.footer}><div style={s.version}>Belgem ERP v1.0</div></div>}
        </div>
    );
}
