import mockUsuarios from './mockUsuarios';

const API_BASE_URL = '/api/v1/usuarios';
const USE_MOCK = true; // Cambia a false cuando el backend esté listo

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
});

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
    }
    if (response.status === 204) {
        return null;
    }
    const text = await response.text();
    return text ? JSON.parse(text) : null;
};

/**
 * Servicio para gestionar usuarios
 * Soporta tanto datos mock como backend real
 */
export const UsuarioService = {
    /**
     * Obtener todos los usuarios
     * @returns {Promise<Array>} Lista de usuarios
     */
    getAll: async () => {
        // Si USE_MOCK está activado, devolver datos mock
        if (USE_MOCK) {
            console.log('📦 Usando datos mock de usuarios');
            return new Promise((resolve) => {
                setTimeout(() => resolve([...mockUsuarios]), 300); // Simula latencia de red
            });
        }

        // Intentar cargar desde el backend
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'GET',
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.warn('⚠️ Backend no disponible, usando datos mock:', error.message);
            // Fallback a mock si el backend falla
            return [...mockUsuarios];
        }
    },

    /**
     * Obtener usuario por ID
     * @param {number} id - ID del usuario
     * @returns {Promise<Object>} Usuario encontrado
     */
    getById: async (id) => {
        if (USE_MOCK) {
            console.log(`📦 Buscando usuario ${id} en datos mock`);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const usuario = mockUsuarios.find(u => u.id === parseInt(id));
                    if (usuario) {
                        resolve({ ...usuario });
                    } else {
                        reject(new Error('Usuario no encontrado'));
                    }
                }, 200);
            });
        }

        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'GET',
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.warn('⚠️ Backend no disponible, buscando en mock');
            const usuario = mockUsuarios.find(u => u.id === parseInt(id));
            if (usuario) {
                return { ...usuario };
            }
            throw error;
        }
    },

    /**
     * Crear nuevo usuario
     * @param {Object} usuarioData - Datos del usuario
     * @returns {Promise<Object>} Usuario creado
     */
    create: async (usuarioData) => {
        if (USE_MOCK) {
            console.log('📦 Simulando creación de usuario en mock');
            return new Promise((resolve) => {
                const nuevoUsuario = {
                    id: Math.max(...mockUsuarios.map(u => u.id), 0) + 1,
                    ...usuarioData,
                    fechaCreacion: new Date().toISOString().split('T')[0]
                };
                mockUsuarios.push(nuevoUsuario);
                setTimeout(() => resolve({ ...nuevoUsuario }), 300);
            });
        }

        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(usuarioData)
        });
        return await handleResponse(response);
    },

    /**
     * Actualizar usuario existente
     * @param {number} id - ID del usuario
     * @param {Object} usuarioData - Datos actualizados
     * @returns {Promise<Object>} Usuario actualizado
     */
    update: async (id, usuarioData) => {
        if (USE_MOCK) {
            console.log(`📦 Simulando actualización de usuario ${id} en mock`);
            return new Promise((resolve, reject) => {
                const index = mockUsuarios.findIndex(u => u.id === parseInt(id));
                if (index !== -1) {
                    mockUsuarios[index] = { ...mockUsuarios[index], ...usuarioData };
                    setTimeout(() => resolve({ ...mockUsuarios[index] }), 300);
                } else {
                    reject(new Error('Usuario no encontrado'));
                }
            });
        }

        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(usuarioData)
        });
        return await handleResponse(response);
    },

    /**
     * Eliminar usuario
     * @param {number} id - ID del usuario
     * @returns {Promise<void>}
     */
    delete: async (id) => {
        if (USE_MOCK) {
            console.log(`📦 Simulando eliminación de usuario ${id} en mock`);
            return new Promise((resolve, reject) => {
                const index = mockUsuarios.findIndex(u => u.id === parseInt(id));
                if (index !== -1) {
                    mockUsuarios.splice(index, 1);
                    setTimeout(() => resolve(), 300);
                } else {
                    reject(new Error('Usuario no encontrado'));
                }
            });
        }

        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return await handleResponse(response);
    }
};

// También exportar como default para mayor compatibilidad
export default UsuarioService;