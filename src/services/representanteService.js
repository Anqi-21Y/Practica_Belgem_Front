import axios from 'axios';

const API_URL = 'http://localhost:8080/representantes';

/**
 * Servicio para gestionar las operaciones relacionadas con Representantes.
 * Se comunica con el backend a través de la API REST.
 */
class RepresentanteService {

  /**
   * Obtiene la lista completa de representantes.
   * GET /representantes
   * @returns {Promise<Array>} Lista de representantes
   */
  async listarRepresentantes() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error al listar representantes:', error);
      throw error;
    }
  }

  /**
   * Obtiene un representante específico por su ID.
   * GET /representantes/{id}
   * @param {number} id - ID del representante
   * @returns {Promise<Object>} Datos del representante
   */
  async obtenerRepresentantePorId(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener representante con ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crea un nuevo representante.
   * POST /representantes
   * @param {Object} representanteData - Datos del representante a crear
   * @param {string} representanteData.name - Nombre del representante
   * @param {string} representanteData.phone - Teléfono del representante
   * @param {string} representanteData.email - Email del representante
   * @param {string} representanteData.zone - Zona del representante
   * @param {string} representanteData.internalCode - Código interno único
   * @param {number} representanteData.commission - Comisión del representante
   * @returns {Promise<Object>} Representante creado
   */
  async crearRepresentante(representanteData) {
    try {
      const response = await axios.post(API_URL, representanteData);
      return response.data;
    } catch (error) {
      console.error('Error al crear representante:', error);
      throw error;
    }
  }

  /**
   * Actualiza un representante existente.
   * PUT /representantes/{id}
   * @param {number} id - ID del representante a actualizar
   * @param {Object} representanteData - Datos actualizados del representante
   * @param {string} representanteData.name - Nombre del representante
   * @param {string} representanteData.phone - Teléfono del representante
   * @param {string} representanteData.email - Email del representante
   * @param {string} representanteData.zone - Zona del representante
   * @param {string} representanteData.internalCode - Código interno único
   * @param {number} representanteData.commission - Comisión del representante
   * @returns {Promise<Object>} Representante actualizado
   */
  async actualizarRepresentante(id, representanteData) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, representanteData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar representante con ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Elimina un representante por su ID.
   * DELETE /representantes/{id}
   * @param {number} id - ID del representante a eliminar
   * @returns {Promise<void>}
   */
  async eliminarRepresentante(id) {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error(`Error al eliminar representante con ID ${id}:`, error);
      throw error;
    }
  }
}

export default new RepresentanteService();