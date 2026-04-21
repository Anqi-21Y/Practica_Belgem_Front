import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { UsuarioService } from '../services/UsuarioService';
import { LogIn, RefreshCw, AlertCircle, Users } from 'lucide-react';

const rolConfig = {
    'ADMIN':         { color: '#1d4ed8', bg: '#eff6ff', label: 'Administrador' },
    'REPRESENTANTE': { color: '#7c3aed', bg: '#f5f3ff', label: 'Representante' },
    'CLIENTE':       { color: '#059669', bg: '#f0fdf4', label: 'Cliente' },
    'default':       { color: '#475569', bg: '#f8fafc', label: 'Usuario' },
};

const getRol = (rol) => rolConfig[rol] || rolConfig.default;

export default function SeleccionUsuario() {
    const [usuarios, setUsuarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);
    const { iniciarSesion } = useUser();
    const navigate = useNavigate();

    useEffect(() => { cargarUsuarios(); }, []);

    const cargarUsuarios = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await UsuarioService.getAll();
            setUsuarios(data || []);
        } catch (err) {
            setError('No se pudieron cargar los usuarios. Verifica que el backend esté activo.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSeleccionar = (usuario) => {
        iniciarSesion(usuario);
        navigate('/');
    };

    if (isLoading) return (
        <div style={s.fullCenter}>
            <div style={s.spinnerWrap}>
                <div style={s.spinner} />
            </div>
            <p style={s.loadingText}>Cargando usuarios...</p>
            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    if (error) return (
        <div style={s.fullCenter}>
            <div style={s.errorBox}>
                <div style={s.errorIcon}><AlertCircle size={28} color="#dc2626" /></div>
                <h2 style={s.errorTitle}>Error de conexión</h2>
                <p style={s.errorMsg}>{error}</p>
                <button onClick={cargarUsuarios} style={s.retryBtn}>
                    <RefreshCw size={15} /> Reintentar
                </button>
            </div>
        </div>
    );

    return (
        <div style={s.page}>
            {/* Left panel */}
            <div style={s.leftPanel}>
                <div style={s.brand}>
                    <div style={s.brandIcon}>B</div>
                    <div>
                        <div style={s.brandName}>Belgem ERP</div>
                        <div style={s.brandSub}>Sistema de gestión empresarial</div>
                    </div>
                </div>
                <div style={s.leftContent}>
                    <h1 style={s.leftTitle}>Gestión centralizada para tu empresa</h1>
                    <p style={s.leftDesc}>Accede al panel de administración para gestionar clientes, pedidos, inventario y mucho más.</p>
                    <div style={s.features}>
                        {['Gestión de clientes y pedidos', 'Control de inventario y stock', 'Administración de proveedores', 'Reportes y movimientos'].map(f => (
                            <div key={f} style={s.feature}>
                                <div style={s.featureDot} />
                                <span>{f}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={s.leftFooter}>© 2026 Belgem ERP</div>
            </div>

            {/* Right panel */}
            <div style={s.rightPanel}>
                <div style={s.formWrap}>
                    <div style={s.formHeader}>
                        <div style={s.formIcon}><Users size={20} color="#1d4ed8" /></div>
                        <div>
                            <h2 style={s.formTitle}>Seleccionar usuario</h2>
                            <p style={s.formSub}>Elige con qué cuenta deseas acceder</p>
                        </div>
                    </div>

                    {usuarios.length === 0 ? (
                        <div style={s.empty}>
                            <Users size={40} color="#cbd5e1" />
                            <p style={s.emptyText}>No hay usuarios disponibles</p>
                        </div>
                    ) : (
                        <div style={s.list}>
                            {usuarios.map((u) => {
                                const rc = getRol(u.rol);
                                const isHovered = hoveredId === u.id;
                                return (
                                    <button
                                        key={u.id}
                                        onClick={() => handleSeleccionar(u)}
                                        onMouseEnter={() => setHoveredId(u.id)}
                                        onMouseLeave={() => setHoveredId(null)}
                                        style={{ ...s.userCard, ...(isHovered ? s.userCardHover : {}) }}
                                    >
                                        <div style={{ ...s.avatar, backgroundColor: rc.color }}>
                                            {u.nombre.charAt(0).toUpperCase()}
                                        </div>
                                        <div style={s.userInfo}>
                                            <span style={s.userName}>{u.nombre}</span>
                                            <div style={s.userMeta}>
                                                <span style={{ ...s.rolBadge, backgroundColor: rc.bg, color: rc.color }}>{rc.label}</span>
                                                {u.email && <span style={s.userEmail}>{u.email}</span>}
                                            </div>
                                        </div>
                                        <div style={{ ...s.loginIcon, opacity: isHovered ? 1 : 0 }}>
                                            <LogIn size={16} color="#1d4ed8" />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const s = {
    page: { display: 'flex', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif" },
    fullCenter: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Inter', system-ui, sans-serif", gap: '12px' },

    // Left
    leftPanel: { width: '420px', flexShrink: 0, background: 'linear-gradient(160deg, #0c1e3e 0%, #1d4ed8 100%)', color: 'white', display: 'flex', flexDirection: 'column', padding: '40px', position: 'relative', overflow: 'hidden' },
    brand: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '60px' },
    brandIcon: { width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '800', color: '#1d4ed8', flexShrink: 0 },
    brandName: { fontSize: '17px', fontWeight: '700', lineHeight: 1.2 },
    brandSub: { fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' },
    leftContent: { flex: 1 },
    leftTitle: { fontSize: '26px', fontWeight: '700', lineHeight: 1.3, marginBottom: '16px', color: 'white' },
    leftDesc: { fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '32px' },
    features: { display: 'flex', flexDirection: 'column', gap: '12px' },
    feature: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'rgba(255,255,255,0.75)' },
    featureDot: { width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#60a5fa', flexShrink: 0 },
    leftFooter: { fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '40px' },

    // Right
    rightPanel: { flex: 1, backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' },
    formWrap: { width: '100%', maxWidth: '460px' },
    formHeader: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' },
    formIcon: { width: '44px', height: '44px', backgroundColor: '#eff6ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    formTitle: { fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 },
    formSub: { fontSize: '13px', color: '#94a3b8', margin: '3px 0 0' },

    // User list
    list: { display: 'flex', flexDirection: 'column', gap: '8px' },
    userCard: { display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', width: '100%' },
    userCardHover: { borderColor: '#bfdbfe', backgroundColor: '#f8fbff', boxShadow: '0 2px 8px rgba(29,78,216,0.08)' },
    avatar: { width: '42px', height: '42px', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', fontWeight: '700', flexShrink: 0 },
    userInfo: { flex: 1 },
    userName: { display: 'block', fontSize: '14.5px', fontWeight: '600', color: '#0f172a', marginBottom: '5px' },
    userMeta: { display: 'flex', alignItems: 'center', gap: '8px' },
    rolBadge: { padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
    userEmail: { fontSize: '12px', color: '#94a3b8' },
    loginIcon: { transition: 'opacity 0.15s', flexShrink: 0 },

    // Loading / Error
    spinnerWrap: { width: '40px', height: '40px' },
    spinner: { width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTop: '3px solid #1d4ed8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
    loadingText: { fontSize: '14px', color: '#94a3b8' },
    errorBox: { backgroundColor: 'white', border: '1px solid #fecaca', borderRadius: '8px', padding: '36px', maxWidth: '400px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    errorIcon: { marginBottom: '12px' },
    errorTitle: { fontSize: '17px', fontWeight: '700', color: '#dc2626', margin: '0 0 8px' },
    errorMsg: { fontSize: '13.5px', color: '#64748b', lineHeight: 1.6, margin: '0 0 20px' },
    retryBtn: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#1d4ed8', color: 'white', border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
    empty: { textAlign: 'center', padding: '48px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' },
    emptyText: { fontSize: '14px', color: '#94a3b8' },
};
