/**
 * Servicio para gestionar los movimientos de stock
 * Basado en la entidad MovimientoStock.java
 */

const API_BASE_URL = '/api/v1/movimientos-stock';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json'
});

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
  }
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

export const MovimientoStockService = {

  /**
   * Obtener historial de movimientos
   */
  listarMovimientos: async () => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al listar movimientos:', error);
      throw error;
    }
  },

  /**
   * Obtener un movimiento por su ID
   */
  obtenerMovimientoPorId: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'GET',
        headers: getHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error al obtener movimiento ${id}:`, error);
      throw error;
    }
  },

  /**
   * Registrar un nuevo movimiento
   * Formatea los datos para que coincidan con el constructor de Java
   */
  crearMovimiento: async (data) => {
    try {
      const requestBody = {
        articuloId: parseInt(data.articuloId),
        almacenId: parseInt(data.almacenId),
        tipoMovimientoId: parseInt(data.tipoMovimientoId),
        cantidad: parseInt(data.cantidad),
        // Convertimos la fecha del input (YYYY-MM-DD) a ISO para LocalDateTime
        fecha: data.fecha.includes('T') ? data.fecha : `${data.fecha}T00:00:00`,
        motivo: data.motivo,
        observaciones: data.observaciones || ""
      };

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(requestBody)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al crear movimiento:', error);
      throw error;
    }
  },

  /**
   * Actualizar un movimiento
   */
  actualizarMovimiento: async (id, data) => {
    try {
      const requestBody = {
        articuloId: parseInt(data.articuloId),
        almacenId: parseInt(data.almacenId),
        tipoMovimientoId: parseInt(data.tipoMovimientoId),
        cantidad: parseInt(data.cantidad),
        fecha: data.fecha.includes('T') ? data.fecha : `${data.fecha}T00:00:00`,
        motivo: data.motivo,
        observaciones: data.observaciones || ""
      };

      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(requestBody)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error al actualizar movimiento ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar movimiento
   */
  eliminarMovimiento: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error al eliminar movimiento ${id}:`, error);
      throw error;
    }
  },

  /**
   * Consulta agregada para ver el stock actual consolidado
   * (Asegúrate de que este endpoint exista en tu StockController)
   */
  obtenerStockActual: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stock-actual`, {
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