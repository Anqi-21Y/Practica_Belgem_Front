import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Contexto para gestionar el usuario activo en la aplicación
 * Proporciona funciones para iniciar sesión, cerrar sesión y persistir el usuario
 */
const UserContext = createContext();

/**
 * Hook personalizado para usar el contexto de usuario
 * @returns {Object} Contexto con usuarioActivo, iniciarSesion, cerrarSesion
 */
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser debe usarse dentro de un UserProvider');
    }
    return context;
};

/**
 * Proveedor del contexto de usuario
 * Maneja la persistencia en localStorage y proporciona el estado global del usuario
 */
export const UserProvider = ({ children }) => {
    const [usuarioActivo, setUsuarioActivo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Cargar usuario desde localStorage al iniciar la aplicación
    useEffect(() => {
        try {
            const usuarioGuardado = localStorage.getItem('usuarioActivo');
            if (usuarioGuardado) {
                const usuario = JSON.parse(usuarioGuardado);
                setUsuarioActivo(usuario);
            }
        } catch (error) {
            console.error('Error al cargar usuario desde localStorage:', error);
            localStorage.removeItem('usuarioActivo');
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Iniciar sesión con un usuario
     * @param {Object} usuario - Objeto con datos del usuario (id, nombre, rol, email, telefono)
     */
    const iniciarSesion = (usuario) => {
        if (!usuario || !usuario.id) {
            console.error('Usuario inválido:', usuario);
            return;
        }

        const usuarioFormateado = {
            id: usuario.id,
            nombre: usuario.nombre,
            rol: usuario.rol,
            email: usuario.email || null,
            telefono: usuario.telefono || null
        };

        setUsuarioActivo(usuarioFormateado);
        localStorage.setItem('usuarioActivo', JSON.stringify(usuarioFormateado));
    };

    /**
     * Cerrar sesión del usuario actual
     */
    const cerrarSesion = () => {
        setUsuarioActivo(null);
        localStorage.removeItem('usuarioActivo');
    };

    /**
     * Actualizar datos del usuario activo
     * @param {Object} datosActualizados - Nuevos datos del usuario
     */
    const actualizarUsuario = (datosActualizados) => {
        if (!usuarioActivo) return;

        const usuarioActualizado = {
            ...usuarioActivo,
            ...datosActualizados
        };

        setUsuarioActivo(usuarioActualizado);
        localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActualizado));
    };

    const value = {
        usuarioActivo,
        isLoading,
        iniciarSesion,
        cerrarSesion,
        actualizarUsuario,
        isAuthenticated: !!usuarioActivo
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;