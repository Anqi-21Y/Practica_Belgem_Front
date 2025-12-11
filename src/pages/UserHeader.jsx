import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

/**
 * Componente de header con información del usuario activo
 * Muestra el nombre, rol y opciones de usuario
 */
export default function UserHeader() {
    const { usuarioActivo, cerrarSesion } = useUser();
    const navigate = useNavigate();

    const handleCambiarUsuario = () => {
        cerrarSesion();
        navigate('/seleccion-usuario');
    };

    const handleVerPerfil = () => {
        navigate('/perfil');
    };

    if (!usuarioActivo) {
        return null;
    }

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <div style={styles.userInfo}>
                    <div style={styles.avatar}>
                        {usuarioActivo.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div style={styles.textInfo}>
                        <span style={styles.greeting}>Hola, {usuarioActivo.nombre}</span>
                        <span style={styles.role}>Rol: {usuarioActivo.rol}</span>
                    </div>
                </div>

                <div style={styles.actions}>
                    <button
                        onClick={handleVerPerfil}
                        style={styles.profileButton}
                        title="Ver perfil"
                    >
                        Mi Perfil
                    </button>
                    <button
                        onClick={handleCambiarUsuario}
                        style={styles.logoutButton}
                        title="Cambiar de usuario"
                    >
                        Cambiar Usuario
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #e0e0e0',
        padding: '12px 20px'
    },
    content: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#4CAF50',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        fontWeight: 'bold'
    },
    textInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
    },
    greeting: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#333'
    },
    role: {
        fontSize: '13px',
        color: '#666'
    },
    actions: {
        display: 'flex',
        gap: '10px'
    },
    profileButton: {
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: '500',
        backgroundColor: 'white',
        color: '#4CAF50',
        border: '1px solid #4CAF50',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    logoutButton: {
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: '500',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    }
};