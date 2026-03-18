import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { UsuarioService } from '../services/UsuarioService';
import { ArrowLeft, Edit2, Save, X, User, Mail, Phone, Shield, CheckCircle } from 'lucide-react';

const rolConfig = {
    'ADMIN':         { color: '#1d4ed8', bg: '#eff6ff', label: 'Administrador' },
    'REPRESENTANTE': { color: '#7c3aed', bg: '#f5f3ff', label: 'Representante' },
    'CLIENTE':       { color: '#059669', bg: '#f0fdf4', label: 'Cliente' },
    'default':       { color: '#475569', bg: '#f8fafc', label: 'Usuario' },
};
const getRol = (rol) => rolConfig[rol] || rolConfig.default;

export default function Perfil() {
    const { usuarioActivo, actualizarUsuario } = useUser();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        nombre: usuarioActivo?.nombre || '',
        email: usuarioActivo?.email || '',
        telefono: usuarioActivo?.telefono || ''
    });

    if (!usuarioActivo) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100%', gap: '16px', fontFamily: "'Inter', system-ui, sans-serif" }}>
                <p style={{ color: '#64748b', fontSize: '14px' }}>No hay usuario activo.</p>
                <button onClick={() => navigate('/seleccion-usuario')} style={s.btnPrimary}>
                    Seleccionar usuario
                </button>
            </div>
        );
    }

    const rc = getRol(usuarioActivo.rol);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true); setError(null); setSuccess(false);
        try {
            const updated = await UsuarioService.update(usuarioActivo.id, formData);
            actualizarUsuario(updated);
            setSuccess(true);
            setIsEditing(false);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.message || 'Error al actualizar el perfil');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({ nombre: usuarioActivo.nombre, email: usuarioActivo.email || '', telefono: usuarioActivo.telefono || '' });
        setIsEditing(false);
        setError(null);
    };

    return (
        <div style={s.page}>
            {/* Header */}
            <header style={s.header}>
                <div style={s.headerLeft}>
                    <button onClick={() => navigate(-1)} style={s.backBtn} title="Volver">
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 style={s.headerTitle}>Mi perfil</h1>
                        <p style={s.headerSub}>Gestiona tu información personal</p>
                    </div>
                </div>
                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} style={s.btnOutline}>
                        <Edit2 size={15} /> Editar
                    </button>
                ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={handleCancel} disabled={isSaving} style={s.btnCancel}>
                            <X size={15} /> Cancelar
                        </button>
                        <button onClick={handleSubmit} disabled={isSaving} style={s.btnPrimary}>
                            <Save size={15} /> {isSaving ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                )}
            </header>

            {/* Content */}
            <div style={s.content}>
                {success && (
                    <div style={s.successAlert}>
                        <CheckCircle size={16} /> Perfil actualizado correctamente
                    </div>
                )}
                {error && (
                    <div style={s.errorAlert}>
                        {error}
                    </div>
                )}

                <div style={s.card}>
                    {/* Avatar section */}
                    <div style={s.avatarSection}>
                        <div style={{ ...s.avatar, backgroundColor: rc.color }}>
                            {usuarioActivo.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 style={s.userName}>{usuarioActivo.nombre}</h2>
                            <span style={{ ...s.rolBadge, backgroundColor: rc.bg, color: rc.color }}>{rc.label}</span>
                        </div>
                    </div>

                    <div style={s.divider} />

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={s.form}>
                        <div style={s.grid}>
                            {[
                                { name: 'nombre', label: 'Nombre completo', icon: User, type: 'text', required: true },
                                { name: 'email', label: 'Correo electrónico', icon: Mail, type: 'email', placeholder: 'correo@ejemplo.com' },
                                { name: 'telefono', label: 'Teléfono', icon: Phone, type: 'tel', placeholder: '+34 600 000 000' },
                            ].map(({ name, label, icon: Icon, type, placeholder, required }) => (
                                <div key={name} style={s.field}>
                                    <label style={s.label}>
                                        <Icon size={14} color="#94a3b8" />
                                        {label}
                                    </label>
                                    <input
                                        type={type}
                                        name={name}
                                        value={formData[name]}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder={placeholder || ''}
                                        required={required}
                                        style={{ ...s.input, ...(isEditing ? s.inputActive : s.inputDisabled) }}
                                        onFocus={e => { if (isEditing) e.target.style.borderColor = '#1d4ed8'; }}
                                        onBlur={e => { e.target.style.borderColor = isEditing ? '#e2e8f0' : '#f1f5f9'; }}
                                    />
                                </div>
                            ))}

                            {/* Rol - readonly always */}
                            <div style={s.field}>
                                <label style={s.label}>
                                    <Shield size={14} color="#94a3b8" />
                                    Rol del sistema
                                </label>
                                <input type="text" value={usuarioActivo.rol} disabled style={{ ...s.input, ...s.inputDisabled }} />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Info card */}
                <div style={s.infoCard}>
                    <p style={s.infoText}>
                        <strong style={{ color: '#475569' }}>ID de usuario:</strong> #{usuarioActivo.id}
                    </p>
                    <p style={s.infoText}>El rol del sistema no puede modificarse desde este panel.</p>
                </div>
            </div>
        </div>
    );
}

const s = {
    page: { display: 'flex', flexDirection: 'column', height: '100%', fontFamily: "'Inter', system-ui, sans-serif", fontSize: '14px' },
    header: { backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', flexShrink: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '14px' },
    headerTitle: { fontSize: '17px', fontWeight: '700', color: '#0f172a', margin: 0 },
    headerSub: { fontSize: '12px', color: '#94a3b8', margin: '2px 0 0' },
    backBtn: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: 'white', cursor: 'pointer', color: '#475569', flexShrink: 0, transition: 'all 0.15s' },
    content: { flex: 1, overflow: 'auto', padding: '24px', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' },

    // Alerts
    successAlert: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderLeft: '4px solid #16a34a', borderRadius: '6px', color: '#15803d', fontSize: '13.5px', fontWeight: '500', width: '100%', maxWidth: '640px', boxSizing: 'border-box' },
    errorAlert: { padding: '10px 14px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderLeft: '4px solid #dc2626', borderRadius: '6px', color: '#dc2626', fontSize: '13.5px', width: '100%', maxWidth: '640px', boxSizing: 'border-box' },

    // Card
    card: { backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '28px', width: '100%', maxWidth: '640px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
    avatarSection: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
    avatar: { width: '56px', height: '56px', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '700', flexShrink: 0 },
    userName: { fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px' },
    rolBadge: { padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
    divider: { height: '1px', backgroundColor: '#f1f5f9', margin: '0 0 24px' },

    // Form
    form: {},
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    field: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: '#475569', letterSpacing: '0.1px' },
    input: { padding: '8px 12px', fontSize: '13.5px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none', transition: 'border-color 0.15s', boxSizing: 'border-box' },
    inputActive: { backgroundColor: 'white', color: '#0f172a', cursor: 'text' },
    inputDisabled: { backgroundColor: '#f8fafc', color: '#64748b', cursor: 'default' },

    // Info card
    infoCard: { backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px 20px', width: '100%', maxWidth: '640px', boxSizing: 'border-box' },
    infoText: { fontSize: '12.5px', color: '#94a3b8', margin: '0 0 4px', lineHeight: 1.6 },

    // Buttons
    btnPrimary: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', backgroundColor: '#1d4ed8', color: 'white', border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
    btnOutline: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', backgroundColor: 'transparent', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
    btnCancel: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', backgroundColor: 'transparent', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
};
