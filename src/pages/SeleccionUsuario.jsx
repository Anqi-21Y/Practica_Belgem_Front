import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { UsuarioService } from '../services/UsuarioService';
import { User, LogIn, Loader } from 'lucide-react';

/**
 * Página de selección de usuario
 * Permite al usuario seleccionar con qué cuenta desea trabajar
 */
export default function SeleccionUsuario() {
    const [usuarios, setUsuarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { iniciarSesion } = useUser();
    const navigate = useNavigate();

    // Cargar lista de usuarios al montar el componente
    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await UsuarioService.getAll();
            setUsuarios(data || []);
        } catch (err) {
            console.error('Error al cargar usuarios:', err);
            setError('No se pudieron cargar los usuarios. Por favor, verifica que el backend esté activo.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSeleccionarUsuario = (usuario) => {
        iniciarSesion(usuario);
        navigate('/');
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

    if (isLoading) {
        return (
            <div style={styles.loadingContainer}>
                <Loader size={48} style={{ animation: 'spin 1s linear infinite' }} />
                <p style={styles.loadingText}>Cargando usuarios...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <div style={styles.errorCard}>
                    <h2 style={styles.errorTitle}>Error</h2>
                    <p style={styles.errorMessage}>{error}</p>
                    <button onClick={cargarUsuarios} style={styles.retryButton}>
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Selecciona tu usuario</h1>
                <p style={styles.subtitle}>
                    Elige con qué cuenta deseas acceder al sistema
                </p>
            </div>

            <div style={styles.grid}>
                {usuarios.map((usuario) => (
                    <button
                        key={usuario.id}
                        onClick={() => handleSeleccionarUsuario(usuario)}
                        style={styles.card}
                    >
                        <div style={{
                            ...styles.avatar,
                            backgroundColor: getRolColor(usuario.rol)
                        }}>
                            {usuario.nombre.charAt(0).toUpperCase()}
                        </div>

                        <div style={styles.info}>
                            <h3 style={styles.nombre}>{usuario.nombre}</h3>
                            <span style={{
                                ...styles.rol,
                                color: getRolColor(usuario.rol)
                            }}>
                                {usuario.rol}
                            </span>
                            {usuario.email && (
                                <span style={styles.email}>{usuario.email}</span>
                            )}
                        </div>

                        <LogIn size={20} style={styles.icon} />
                    </button>
                ))}
            </div>

            {usuarios.length === 0 && (
                <div style={styles.emptyState}>
                    <User size={64} color="#9ca3af" />
                    <p style={styles.emptyText}>No hay usuarios disponibles</p>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        padding: '40px 20px',
        backgroundColor: '#f9fafb'
    },
    header: {
        textAlign: 'center',
        marginBottom: '48px'
    },
    title: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '8px'
    },
    subtitle: {
        fontSize: '16px',
        color: '#6b7280'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
    },
    card: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        padding: '24px',
        backgroundColor: 'white',
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textAlign: 'left'
    },
    avatar: {
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        flexShrink: 0
    },
    info: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    nombre: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#1f2937',
        margin: 0
    },
    rol: {
        fontSize: '14px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    email: {
        fontSize: '13px',
        color: '#6b7280'
    },
    icon: {
        color: '#9ca3af',
        flexShrink: 0
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '16px'
    },
    loadingText: {
        fontSize: '16px',
        color: '#6b7280'
    },
    errorContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px'
    },
    errorCard: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        border: '2px solid #fecaca',
        maxWidth: '500px',
        textAlign: 'center'
    },
    errorTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#dc2626',
        marginBottom: '12px'
    },
    errorMessage: {
        fontSize: '16px',
        color: '#6b7280',
        marginBottom: '24px'
    },
    retryButton: {
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
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '60px 20px'
    },
    emptyText: {
        fontSize: '18px',
        color: '#6b7280'
    }
};