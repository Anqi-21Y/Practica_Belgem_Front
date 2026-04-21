/**
 * Servicio para gestionar las operaciones CRUD de proveedores
 * mediante comunicación con el backend REST API.
 *
 * Base URL: /api/v1/proveedores
 */

const API_BASE_URL = '/api/v1/proveedores';

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
 * Servicio de Proveedor - Operaciones CRUD
 */
const ProveedoresService = {

    /**
     * Obtener todos los proveedores
     * GET /proveedores
     * @returns {Promise<Array>} Lista de proveedores
     */
    listarProveedores: async () => {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'GET',
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al listar proveedores:', error);
            throw error;
        }
    },

    /**
     * Obtener un proveedor por ID
     * GET /proveedores/{id}
     * @param {number} id - ID del proveedor
     * @returns {Promise<Object>} Datos del proveedor
     */
    obtenerProveedorPorId: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'GET',
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Error al obtener proveedor con ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Crear un nuevo proveedor
     * POST /proveedores
     * @param {Object} proveedorData - Datos del proveedor a crear
     * @returns {Promise<Object>} Proveedor creado
     */
    crearProveedor: async (proveedorData) => {
        try {
            const requestBody = {
                nombre: proveedorData.nombre,
                cif: proveedorData.cif,
                email: proveedorData.email || null,
                telefono: proveedorData.telefono || null,
                direccion: proveedorData.direccion || null,
                ciudad: proveedorData.ciudad || null,
                pais: proveedorData.pais || null,
                estado: proveedorData.estado || 'ACTIVO'
            };

            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(requestBody)
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('Error al crear proveedor:', error);
            throw error;
        }
    },

    /**
     * Actualizar un proveedor existente
     * PUT /proveedores/{id}
     * @param {number} id - ID del proveedor a actualizar
     * @param {Object} proveedorData - Datos actualizados del proveedor
     * @returns {Promise<Object>} Proveedor actualizado
     */
    actualizarProveedor: async (id, proveedorData) => {
        try {
            const requestBody = {
                nombre: proveedorData.nombre,
                email: proveedorData.email || null,
                telefono: proveedorData.telefono || null,
                direccion: proveedorData.direccion || null,
                ciudad: proveedorData.ciudad || null,
                pais: proveedorData.pais || null,
                estado: proveedorData.estado || 'ACTIVO'
            };

            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(requestBody)
            });

            return await handleResponse(response);
        } catch (error) {
            console.error(`Error al actualizar proveedor con ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Eliminar un proveedor
     * DELETE /proveedores/{id}
     * @param {number} id - ID del proveedor a eliminar
     * @returns {Promise<void>}
     */
    eliminarProveedor: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });

            return await handleResponse(response);
        } catch (error) {
            console.error(`Error al eliminar proveedor con ID ${id}:`, error);
            throw error;
        }
    }
};

export default ProveedoresService;