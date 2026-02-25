/**
 * Servicio para gestionar las operaciones CRUD de Tipos de Movimiento
 * mediante comunicación con el backend REST API.
 *
 * Base URL: http://localhost:8080/api/v1/tipos-movimiento
 */

const API_BASE_URL = 'http://localhost:8080/api/v1/tipos-movimiento';

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

  // Si la respuesta es 204 No Content (típico en DELETE)
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

/**
 * Servicio de TipoMovimiento - Operaciones CRUD
 */
const TipoMovimientoService = {

  /**
   * Obtener todos los tipos de movimiento
   * GET /tipos-movimiento
   * @returns {Promise<Array>} Lista de tipos
   */
  listarTipos: async () => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders()
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error al listar tipos de movimiento:', error);
      throw error;
    }
  },

  /**
   * Obtener un tipo de movimiento por ID
   * GET /tipos-movimiento/{id}
   * @param {number} id - ID del tipo
   * @returns {Promise<Object>} Datos del tipo
   */
  obtenerTipoPorId: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'GET',
        headers: getHeaders()
      });

      return await handleResponse(response);
    } catch (error) {
      console.error(`Error al obtener tipo con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear un nuevo tipo de movimiento
   * POST /tipos-movimiento
   * @param {Object} tipoData - Datos del tipo a crear
   * @returns {Promise<Object>} Tipo creado
   */
  crearTipo: async (tipoData) => {
    try {
      const requestBody = {
        nombre: tipoData.nombre,
        descripcion: tipoData.descripcion
      };

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(requestBody)
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error al crear tipo de movimiento:', error);
      throw error;
    }
  },

  /**
   * Actualizar un tipo de movimiento existente
   * PUT /tipos-movimiento/{id}
   * @param {number} id - ID del tipo
   * @param {Object} tipoData - Datos actualizados
   * @returns {Promise<Object>} Tipo actualizado
   */
  actualizarTipo: async (id, tipoData) => {
    try {
      const requestBody = {
        nombre: tipoData.nombre,
        descripcion: tipoData.descripcion
      };

      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(requestBody)
      });

      return await handleResponse(response);
    } catch (error) {
      console.error(`Error al actualizar tipo con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar un tipo de movimiento
   * DELETE /tipos-movimiento/{id}
   * @param {number} id - ID del tipo
   * @returns {Promise<void>}
   */
  eliminarTipo: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      return await handleResponse(response);
    } catch (error) {
      console.error(`Error al eliminar tipo con ID ${id}:`, error);
      throw error;
    }
  }

};

export default TipoMovimientoService;