/**
 * Servicio para gestionar las operaciones CRUD de Movimientos de Stock
 * mediante comunicación con el backend REST API.
 *
 * Base URL: http://localhost:8080/movimientos-stock
 */
const API_BASE_URL = 'http://localhost:8080/movimientos-stock';
const STOCK_ACTUAL_URL = 'http://localhost:8080/stock-actual';

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
  if (response.status === 204) {
    return null;
  }
  return response.json();
};

/**
 * Servicio de MovimientoStock - Operaciones CRUD
 */
const MovimientoStockService = {

  /**
   * Obtener todos los movimientos de stock
   * GET /movimientos-stock
   * @returns {Promise<Array>} Lista de movimientos
   */
  listarMovimientos: async () => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al listar movimientos de stock:', error);
      throw error;
    }
  },

  /**
   * Obtener un movimiento por ID
   * GET /movimientos-stock/{id}
   * @param {number} id - ID del movimiento
   * @returns {Promise<Object>} Datos del movimiento
   */
  obtenerMovimientoPorId: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'GET',
        headers: getHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error al obtener movimiento con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear un nuevo movimiento de stock
   * POST /movimientos-stock
   * @param {Object} movimientoData - Datos del movimiento a crear
   * @returns {Promise<Object>} Movimiento creado
   */
  crearMovimiento: async (movimientoData) => {
    try {
      const requestBody = {
        articuloId: movimientoData.articuloId,
        almacenId: movimientoData.almacenId,
        tipoMovimientoId: movimientoData.tipoMovimientoId,
        cantidad: movimientoData.cantidad,
        fecha: movimientoData.fecha,
        motivo: movimientoData.motivo,
        observaciones: movimientoData.observaciones
      };
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(requestBody)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al crear movimiento de stock:', error);
      throw error;
    }
  },

  /**
   * Actualizar un movimiento de stock existente
   * PUT /movimientos-stock/{id}
   * @param {number} id - ID del movimiento
   * @param {Object} movimientoData - Datos actualizados
   * @returns {Promise<Object>} Movimiento actualizado
   */
  actualizarMovimiento: async (id, movimientoData) => {
    try {
      const requestBody = {
        articuloId: movimientoData.articuloId,
        almacenId: movimientoData.almacenId,
        tipoMovimientoId: movimientoData.tipoMovimientoId,
        cantidad: movimientoData.cantidad,
        fecha: movimientoData.fecha,
        motivo: movimientoData.motivo,
        observaciones: movimientoData.observaciones
      };
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(requestBody)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error al actualizar movimiento con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar un movimiento de stock
   * DELETE /movimientos-stock/{id}
   * @param {number} id - ID del movimiento
   * @returns {Promise<void>}
   */
  eliminarMovimiento: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error al eliminar movimiento con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtener el stock actual agrupado por artículo
   * GET /stock-actual
   * @returns {Promise<Array>} Stock actual por artículo
   */
  obtenerStockActual: async () => {
    try {
      const response = await fetch(STOCK_ACTUAL_URL, {
        method: 'GET',
        headers: getHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al obtener stock actual:', error);
      throw error;
    }
  }
};

export default MovimientoStockService;