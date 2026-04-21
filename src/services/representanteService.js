/**
 * Servicio para gestionar las operaciones CRUD de representantes
 * mediante comunicación con el backend REST API.
 * 
 * Base URL: /api/v1/representantes
 */

const API_BASE_URL = '/api/v1/representantes';

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
 * Servicio de Representante - Operaciones CRUD
 */
const RepresentanteService = {

  /**
   * Obtener todos los representantes
   * GET /representantes
   * @returns {Promise<Array>} Lista de representantes
   */
  listarRepresentantes: async () => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al listar representantes:', error);
      throw error;
    }
  },

  /**
   * Obtener un representante por ID
   * GET /representantes/{id}
   * @param {number} id - ID del representante
   * @returns {Promise<Object>} Datos del representante
   */
  obtenerRepresentantePorId: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'GET',
        headers: getHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error al obtener representante con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear un nuevo representante
   * POST /representantes
   * @param {Object} representanteData - Datos del representante a crear
   * @returns {Promise<Object>} Representante creado
   */
  crearRepresentante: async (representanteData) => {
    try {
      const requestBody = {
        name: representanteData.name,
        phone: representanteData.phone,
        email: representanteData.email || null,
        zone: representanteData.zone,
        internalCode: representanteData.internalCode,
        commission: representanteData.commission ? Number(representanteData.commission) : null
      };

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(requestBody)
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error al crear representante:', error);
      throw error;
    }
  },

  /**
   * Actualizar un representante existente
   * PUT /representantes/{id}
   * @param {number} id - ID del representante a actualizar
   * @param {Object} representanteData - Datos actualizados del representante
   * @returns {Promise<Object>} Representante actualizado
   */
  actualizarRepresentante: async (id, representanteData) => {
    try {
      const requestBody = {
        name: representanteData.name,
        phone: representanteData.phone,
        email: representanteData.email || null,
        zone: representanteData.zone,
        internalCode: representanteData.internalCode,
        commission: representanteData.commission ? Number(representanteData.commission) : null
      };

      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(requestBody)
      });

      return await handleResponse(response);
    } catch (error) {
      console.error(`Error al actualizar representante con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar un representante
   * DELETE /representantes/{id}
   * @param {number} id - ID del representante a eliminar
   * @returns {Promise<void>}
   */
  eliminarRepresentante: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      return await handleResponse(response);
    } catch (error) {
      console.error(`Error al eliminar representante con ID ${id}:`, error);
      throw error;
    }
  }
};

export default RepresentanteService;