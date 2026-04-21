import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { User, LogOut, Settings, ChevronDown, ChevronUp } from 'lucide-react';

const rolConfig = {
    'ADMIN':         { color: '#1d4ed8', bg: '#eff6ff' },
    'REPRESENTANTE': { color: '#7c3aed', bg: '#f5f3ff' },
    'CLIENTE':       { color: '#059669', bg: '#f0fdf4' },
    'default':       { color: '#475569', bg: '#f8fafc' },
};
const getRol = (rol) => rolConfig[rol] || rolConfig.default;

export default function ProfileButton() {
    const { usuarioActivo, cerrarSesion } = useUser();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    // Cerrar al click fuera
    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const usuario = usuarioActivo || { nombre: 'Invitado', rol: 'Sin sesión', email: null };
    const rc = getRol(usuario.rol);
    const initial = usuario.nombre.charAt(0).toUpperCase();

    const close = (fn) => { setIsOpen(false); fn && fn(); };

    return (
        <div style={{ position: 'relative', fontFamily: "'Inter', system-ui, sans-serif" }} ref={ref}>
            {/* Trigger button */}
            <button
                onClick={() => setIsOpen(o => !o)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '5px 10px 5px 5px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', transition: 'border-color 0.15s', ...(isOpen ? { borderColor: '#bfdbfe' } : {}) }}
            >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: usuarioActivo ? rc.color : '#94a3b8', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>
                    {initial}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: '90px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', lineHeight: 1.3 }}>{usuario.nombre}</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{usuario.rol}</span>
                </div>
                <span style={{ color: '#94a3b8', display: 'flex', marginLeft: '2px' }}>
                    {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </span>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, minWidth: '240px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: '6px', zIndex: 1000, animation: 'fadeIn 0.1s ease' }}>
                    <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}`}</style>

                    {/* User info */}
                    <div style={{ padding: '10px 12px', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: usuarioActivo ? rc.color : '#94a3b8', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: '700', flexShrink: 0 }}>
                                {initial}
                            </div>
                            <div>
                                <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#0f172a' }}>{usuario.nombre}</div>
                                <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>{usuario.email || usuario.rol}</div>
                            </div>
                        </div>
                        {usuarioActivo && (
                            <div style={{ marginTop: '8px' }}>
                                <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', backgroundColor: rc.bg, color: rc.color }}>{usuario.rol}</span>
                            </div>
                        )}
                    </div>

                    <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '4px 0' }} />

                    {/* Menu items */}
                    {usuarioActivo ? (
                        <>
                            <MenuItem icon={User} label="Ver perfil" onClick={() => close(() => navigate('/perfil'))} />
                            <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '4px 0' }} />
                            <MenuItem icon={LogOut} label="Cambiar usuario" onClick={() => close(() => { cerrarSesion(); navigate('/seleccion-usuario'); })} danger />
                        </>
                    ) : (
                        <MenuItem icon={User} label="Iniciar sesión" onClick={() => close(() => navigate('/seleccion-usuario'))} primary />
                    )}
                </div>
            )}
        </div>
    );
}

function MenuItem({ icon: Icon, label, onClick, danger, primary }) {
    const [hovered, setHovered] = useState(false);
    const color = danger ? '#dc2626' : primary ? '#1d4ed8' : '#334155';
    const bg = hovered ? (danger ? '#fef2f2' : primary ? '#eff6ff' : '#f8fafc') : 'transparent';

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', backgroundColor: bg, border: 'none', borderRadius: '6px', color, cursor: 'pointer', fontSize: '13px', fontWeight: '500', textAlign: 'left', transition: 'background-color 0.12s' }}
        >
            <Icon size={15} />
            <span>{label}</span>
        </button>
    );
}
