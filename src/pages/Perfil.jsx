import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { UsuarioService } from '../services/UsuarioService';
import { User, Mail, Phone, Shield, Save, X, Edit2 } from 'lucide-react';

/**
 * Página de perfil del usuario
 * Permite ver y editar la información del usuario activo
 */
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
            <div style={styles.errorContainer}>
                <h2>No hay usuario activo</h2>
                <button onClick={() => navigate('/seleccion-usuario')} style={styles.button}>
                    Seleccionar usuario
                </button>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const usuarioActualizado = await UsuarioService.update(usuarioActivo.id, formData);
            actualizarUsuario(usuarioActualizado);
            setSuccess(true);
            setIsEditing(false);

            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Error al actualizar perfil:', err);
            setError(err.message || 'Error al actualizar el perfil');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            nombre: usuarioActivo.nombre,
            email: usuarioActivo.email || '',
            telefono: usuarioActivo.telefono || ''
        });
        setIsEditing(false);
        setError(null);
    };

    const getRolColor = (rol) => {
        const colores = {
            'ADMIN': '#dc2626',
            'REPRESENTANTE': '#2563eb',
            'CLIENTE': '#16a34a',
            'default': '#6b7280'
        };
        return colores[rol] || colores.default;
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={{
                        ...styles.avatar,
                        backgroundColor: getRolColor(usuarioActivo.rol)
                    }}>
                        {usuarioActivo.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 style={styles.title}>{usuarioActivo.nombre}</h1>
                        <span style={{
                            ...styles.rol,
                            color: getRolColor(usuarioActivo.rol)
                        }}>
                            {usuarioActivo.rol}
                        </span>
                    </div>
                </div>

                {success && (
                    <div style={styles.successMessage}>
                        ✓ Perfil actualizado correctamente
                    </div>
                )}

                {error && (
                    <div style={styles.errorMessage}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.field}>
                        <label style={styles.label}>
                            <User size={18} />
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            disabled={!isEditing}
                            style={{
                                ...styles.input,
                                ...(isEditing ? {} : styles.inputDisabled)
                            }}
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>
                            <Mail size={18} />
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            style={{
                                ...styles.input,
                                ...(isEditing ? {} : styles.inputDisabled)
                            }}
                            placeholder="correo@ejemplo.com"
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>
                            <Phone size={18} />
                            Teléfono
                        </label>
                        <input
                            type="tel"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            disabled={!isEditing}
                            style={{
                                ...styles.input,
                                ...(isEditing ? {} : styles.inputDisabled)
                            }}
                            placeholder="+34 600 000 000"
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>
                            <Shield size={18} />
                            Rol (solo lectura)
                        </label>
                        <input
                            type="text"
                            value={usuarioActivo.rol}
                            disabled
                            style={{ ...styles.input, ...styles.inputDisabled }}
                        />
                    </div>

                    <div style={styles.actions}>
                        {!isEditing ? (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                style={styles.editButton}
                            >
                                <Edit2 size={18} />
                                Editar perfil
                            </button>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    style={styles.cancelButton}
                                    disabled={isSaving}
                                >
                                    <X size={18} />
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    style={styles.saveButton}
                                    disabled={isSaving}
                                >
                                    <Save size={18} />
                                    {isSaving ? 'Guardando...' : 'Guardar cambios'}
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        padding: '40px 20px',
        backgroundColor: '#f9fafb',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        marginBottom: '32px',
        paddingBottom: '24px',
        borderBottom: '2px solid #e5e7eb'
    },
    avatar: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        fontWeight: 'bold',
        flexShrink: 0
    },
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#1f2937',
        margin: '0 0 4px 0'
    },
    rol: {
        fontSize: '14px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    label: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151'
    },
    input: {
        padding: '12px 16px',
        fontSize: '16px',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        transition: 'border-color 0.2s'
    },
    inputDisabled: {
        backgroundColor: '#f3f4f6',
        color: '#6b7280',
        cursor: 'not-allowed'
    },
    actions: {
        display: 'flex',
        gap: '12px',
        marginTop: '16px'
    },
    editButton: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px 24px',
        backgroundColor: '#4f46e5',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    },
    saveButton: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px 24px',
        backgroundColor: '#16a34a',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    },
    cancelButton: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px 24px',
        backgroundColor: '#e5e7eb',
        color: '#374151',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    },
    successMessage: {
        padding: '12px 16px',
        backgroundColor: '#d1fae5',
        color: '#065f46',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '14px',
        fontWeight: '500'
    },
    errorMessage: {
        padding: '12px 16px',
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '14px',
        fontWeight: '500'
    },
    errorContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '16px'
    },
    button: {
        padding: '12px 24px',
        backgroundColor: '#4f46e5',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer'
    }
};