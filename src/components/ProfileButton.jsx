import React from 'react';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

/**
 * Botón de perfil reutilizable para añadir en cualquier página
 * Muestra un dropdown con opciones del usuario
 */
export default function ProfileButton() {
    const { usuarioActivo, cerrarSesion } = useUser();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef(null);

    // Cerrar dropdown al hacer click fuera
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Usuario por defecto si no hay usuario activo (para desarrollo)
    const usuario = usuarioActivo || {
        nombre: 'Invitado',
        rol: 'Sin sesión',
        email: null
    };

    const handleVerPerfil = () => {
        setIsOpen(false);
        if (usuarioActivo) {
            navigate('/perfil');
        } else {
            navigate('/seleccion-usuario');
        }
    };

    const handleCambiarUsuario = () => {
        setIsOpen(false);
        cerrarSesion();
        navigate('/seleccion-usuario');
    };

    const handleIniciarSesion = () => {
        setIsOpen(false);
        navigate('/seleccion-usuario');
    };

    return (
        <div style={styles.container} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    ...styles.button,
                    ...(usuarioActivo ? {} : styles.buttonInactive)
                }}
                title="Mi perfil"
            >
                <div style={{
                    ...styles.avatar,
                    backgroundColor: usuarioActivo ? '#4f46e5' : '#9ca3af'
                }}>
                    {usuario.nombre.charAt(0).toUpperCase()}
                </div>
                <div style={styles.info}>
                    <span style={styles.name}>{usuario.nombre}</span>
                    <span style={styles.role}>{usuario.rol}</span>
                </div>
            </button>

            {isOpen && (
                <div style={styles.dropdown}>
                    <div style={styles.dropdownHeader}>
                        <div style={{
                            ...styles.dropdownAvatar,
                            backgroundColor: usuarioActivo ? '#4f46e5' : '#9ca3af'
                        }}>
                            {usuario.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div style={styles.dropdownName}>{usuario.nombre}</div>
                            <div style={styles.dropdownEmail}>
                                {usuario.email || 'Sin email'}
                            </div>
                        </div>
                    </div>

                    <div style={styles.divider} />

                    {usuarioActivo ? (
                        <>
                            <button onClick={handleVerPerfil} style={styles.menuItem}>
                                <User size={16} />
                                <span>Ver perfil</span>
                            </button>

                            <div style={styles.divider} />

                            <button onClick={handleCambiarUsuario} style={styles.menuItemDanger}>
                                <span>Cambiar usuario</span>
                            </button>
                        </>
                    ) : (
                        <button onClick={handleIniciarSesion} style={styles.menuItemPrimary}>
                            <span>Iniciar sesión</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        position: 'relative'
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 12px',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    buttonInactive: {
        opacity: 0.7
    },
    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        fontWeight: 'bold',
        flexShrink: 0
    },
    info: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '2px',
        minWidth: '120px'
    },
    name: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#1f2937'
    },
    role: {
        fontSize: '12px',
        color: '#6b7280'
    },
    dropdown: {
        position: 'absolute',
        top: 'calc(100% + 8px)',
        right: 0,
        minWidth: '280px',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        padding: '8px',
        zIndex: 1000
    },
    dropdownHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px'
    },
    dropdownAvatar: {
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        fontWeight: 'bold',
        flexShrink: 0
    },
    dropdownName: {
        fontSize: '15px',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '2px'
    },
    dropdownEmail: {
        fontSize: '13px',
        color: '#6b7280'
    },
    divider: {
        height: '1px',
        backgroundColor: '#e5e7eb',
        margin: '8px 0'
    },
    menuItem: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '6px',
        color: '#374151',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        textAlign: 'left',
        transition: 'background-color 0.2s'
    },
    menuItemPrimary: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '12px',
        backgroundColor: '#4f46e5',
        border: 'none',
        borderRadius: '6px',
        color: 'white',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        textAlign: 'center',
        transition: 'background-color 0.2s'
    },
    menuItemDanger: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '6px',
        color: '#dc2626',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        textAlign: 'left',
        transition: 'background-color 0.2s'
    }
};