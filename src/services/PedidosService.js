/**
 * Servicio para gestionar las operaciones CRUD de pedidos
 * mediante comunicación con el backend REST API.
 * 
 * Base URL: Asegúrate de configurar la URL correcta de tu backend
 */

const API_BASE_URL = '/api/v1/pedidos';

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

    return response.json();
};

/**
 * Servicio de Pedido - Operaciones CRUD
 */
const PedidosService = {

    /**
     * Obtener todos los pedidos
     * GET /pedidos
     * @returns {Promise<Array>} Lista de pedidos
     */
    listarPedidos: async () => {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'GET',
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al listar pedidos:', error);
            throw error;
        }
    },

    /**
     * Obtener un pedido por ID
     * GET /pedidos/{id}
     * @param {number} id - ID del pedido
     * @returns {Promise<Object>} Datos del pedido
     */
    obtenerPedidoPorId: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'GET',
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Error al obtener pedido con ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Crear un nuevo pedido
     * POST /pedidos
     * @param {Object} pedidoData - Datos del pedido a crear
     * @returns {Promise<Object>} Pedido creado
     */
    crearPedido: async (pedidoData) => {
        try {
            // Mapear campos del frontend al formato esperado por el backend
            const requestBody = {
                clienteId: pedidoData.cliente_id,
                representanteId: pedidoData.representante_id,
                estado: pedidoData.estado || 'CREADO',
                observaciones: pedidoData.observaciones || ''
            };

            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(requestBody)
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('Error al crear pedido:', error);
            throw error;
        }
    },

    /**
     * Actualizar un pedido existente
     * PUT /pedidos/{id}
     * @param {number} id - ID del pedido a actualizar
     * @param {Object} pedidoData - Datos actualizados del pedido
     * @returns {Promise<Object>} Pedido actualizado
     */
    actualizarPedido: async (id, pedidoData) => {
        try {
            const requestBody = {
                clienteId: pedidoData.cliente_id,
                representanteId: pedidoData.representante_id,
                estado: pedidoData.estado,
                observaciones: pedidoData.observaciones || ''
            };

            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(requestBody)
            });

            return await handleResponse(response);
        } catch (error) {
            console.error(`Error al actualizar pedido con ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Eliminar un pedido
     * DELETE /pedidos/{id}
     * @param {number} id - ID del pedido a eliminar
     * @returns {Promise<void>}
     */
    eliminarPedido: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });

            return await handleResponse(response);
        } catch (error) {
            console.error(`Error al eliminar pedido con ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Obtener detalles de un pedido
     * GET /pedidos/{pedidoId}/detalles
     * @param {number} pedidoId - ID del pedido
     * @returns {Promise<Array>} Lista de detalles del pedido
     */
    obtenerDetalles: async (pedidoId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${pedidoId}/detalles`, {
                method: 'GET',
                headers: getHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Error al obtener detalles del pedido ${pedidoId}:`, error);
            throw error;
        }
    },

    /**
     * Crear detalle de pedido
     * POST /pedidos/{pedidoId}/detalles
     * @param {number} pedidoId - ID del pedido
     * @param {Object} detalleData - Datos del detalle a crear
     * @returns {Promise<Object>} Detalle creado
     */
    crearDetalle: async (pedidoId, detalleData) => {
        try {
            const requestBody = {
                articuloId: detalleData.articulo_id,
                cantidad: detalleData.cantidad,
                precioUnitario: detalleData.precio_unitario
            };

            const response = await fetch(`${API_BASE_URL}/${pedidoId}/detalles`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(requestBody)
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('Error al crear detalle de pedido:', error);
            throw error;
        }
    },

    /**
     * Eliminar detalle de pedido
     * DELETE /pedidos/detalles/{detalleId}
     * @param {number} detalleId - ID del detalle a eliminar
     * @returns {Promise<void>}
     */
    eliminarDetalle: async (detalleId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/detalles/${detalleId}`, {
                method: 'DELETE',
                headers: getHeaders()
            });

            return await handleResponse(response);
        } catch (error) {
            console.error(`Error al eliminar detalle ${detalleId}:`, error);
            throw error;
        }
    }
};

/**
 * Función auxiliar para mapear la respuesta del backend al formato del frontend
 * El backend devuelve camelCase, el frontend usa snake_case
 */
export const mapPedidoFromBackend = (pedido) => {
    if (!pedido) return null;

    return {
        id: pedido.id,
        cliente_id: pedido.clienteId,
        representante_id: pedido.representanteId,
        fecha: pedido.fecha ? new Date(pedido.fecha) : null,
        estado: pedido.estado,
        total: parseFloat(pedido.total) || 0,
        observaciones: pedido.observaciones
    };
};

/**
 * Función auxiliar para mapear detalle del backend al formato del frontend
 */
export const mapDetalleFromBackend = (detalle) => {
    if (!detalle) return null;

    return {
        id: detalle.id,
        pedido_id: detalle.pedidoId,
        articulo_id: detalle.articuloId,
        cantidad: detalle.cantidad,
        precio_unitario: parseFloat(detalle.precioUnitario) || 0,
        subtotal: parseFloat(detalle.subtotal) || 0
    };
};

export default PedidosService;