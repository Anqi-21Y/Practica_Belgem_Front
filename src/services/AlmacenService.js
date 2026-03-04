/**
 * Servicio para gestionar las operaciones CRUD de almacenes
 * mediante comunicación con el backend REST API.
 *
 * Base URL: http://localhost:8080/almacenes
 */

const API_BASE_URL = 'http://localhost:8080/almacenes';

/**
 * Configuración común para las peticiones fetch
 */
const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
});

/**
 * Manejo centralizado de errores HTTP
 */
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
    }

    // Si la respuesta es 204 No Content (típico en DELETE), no hay JSON
    if (response.status === 204) {
        return null;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
};

/**
 * Servicio de Almacén - Operaciones CRUD
 */
const AlmacenService = {

    /**
     * Obtener todos los almacenes
     * GET /almacenes
     * @returns {Promise<Array>} Lista de almacenes
     */
    listarAlmacenes: async () => {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'GET',
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al listar almacenes:', error);
            throw error;
        }
    },

    /**
     * Obtener un almacén por ID
     * GET /almacenes/{id}
     * @param {number} id - ID del almacén
     * @returns {Promise<Object>} Datos del almacén
     */
    obtenerAlmacenPorId: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'GET',
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Error al obtener almacén con ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Crear un nuevo almacén
     * POST /almacenes
     * @param {Object} almacenData - Datos del almacén a crear
     * @returns {Promise<Object>} Almacén creado
     */
    crearAlmacen: async (almacenData) => {
        try {
            const requestBody = {
                nombre: almacenData.nombre,
                direccion: almacenData.direccion || null,
                telefono: almacenData.telefono || null,
                responsable: almacenData.responsable || null,
                activo: almacenData.activo !== undefined ? almacenData.activo : true
            };

            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(requestBody)
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('Error al crear almacén:', error);
            throw error;
        }
    },

    /**
     * Actualizar un almacén existente
     * PUT /almacenes/{id}
     * @param {number} id - ID del almacén a actualizar
     * @param {Object} almacenData - Datos actualizados del almacén
     * @returns {Promise<Object>} Almacén actualizado
     */
    actualizarAlmacen: async (id, almacenData) => {
        try {
            const requestBody = {
                nombre: almacenData.nombre,
                direccion: almacenData.direccion || null,
                telefono: almacenData.telefono || null,
                responsable: almacenData.responsable || null,
                activo: almacenData.activo !== undefined ? almacenData.activo : true
            };

            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(requestBody)
            });

            return await handleResponse(response);
        } catch (error) {
            console.error(`Error al actualizar almacén con ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Eliminar un almacén
     * DELETE /almacenes/{id}
     * @param {number} id - ID del almacén a eliminar
     * @returns {Promise<void>}
     */
    eliminarAlmacen: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });

            return await handleResponse(response);
        } catch (error) {
            console.error(`Error al eliminar almacén con ID ${id}:`, error);
            throw error;
        }
    }
};

export default AlmacenService;