/**
 * Servicio para gestionar las operaciones CRUD de artículos
 * mediante comunicación con el backend REST API.
 */

const API_BASE_URL = 'http://localhost:8080/articulos';

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

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

/**
 * Servicio de Artículo - Operaciones CRUD
 */
export const ArticulosService = {

  /**
   * Obtener todos los artículos
   * GET /articulos
   * @returns {Promise<Array>} Lista de artículos
   */
  getAll: async () => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al listar artículos:', error);
      throw error;
    }
  },

  /**
   * Obtener un artículo por ID
   * GET /articulos/{id}
   * @param {number} id - ID del artículo
   * @returns {Promise<Object>} Datos del artículo
   */
  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'GET',
        headers: getHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error al obtener artículo con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Buscar artículos por nombre
   * GET /articulos/buscar?nombre={nombre}
   * @param {string} nombre - Nombre a buscar
   * @returns {Promise<Array>} Lista de artículos que coinciden
   */
  searchByName: async (nombre) => {
    try {
      const response = await fetch(`${API_BASE_URL}/buscar?nombre=${encodeURIComponent(nombre)}`, {
        method: 'GET',
        headers: getHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al buscar artículos:', error);
      throw error;
    }
  },

  /**
   * Crear un nuevo artículo
   * POST /articulos
   * @param {Object} articuloData - Datos del artículo a crear
   * @returns {Promise<Object>} Artículo creado
   */
  create: async (articuloData) => {
    try {
      const requestBody = {
        nombre: articuloData.nombre,
        cantidad: parseInt(articuloData.cantidad) || 0,
        dto: parseFloat(articuloData.dto) || 0,
        precio: parseFloat(articuloData.precio) || 0
      };

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(requestBody)
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error al crear artículo:', error);
      throw error;
    }
  },

  /**
   * Actualizar un artículo existente
   * PUT /articulos/{id}
   * @param {number} id - ID del artículo a actualizar
   * @param {Object} articuloData - Datos actualizados del artículo
   * @returns {Promise<Object>} Artículo actualizado
   */
  update: async (id, articuloData) => {
    try {
      const requestBody = {
        nombre: articuloData.nombre,
        cantidad: parseInt(articuloData.cantidad) || 0,
        dto: parseFloat(articuloData.dto) || 0,
        precio: parseFloat(articuloData.precio) || 0
      };

      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(requestBody)
      });

      return await handleResponse(response);
    } catch (error) {
      console.error(`Error al actualizar artículo con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar un artículo
   * DELETE /articulos/{id}
   * @param {number} id - ID del artículo a eliminar
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      return await handleResponse(response);
    } catch (error) {
      console.error(`Error al eliminar artículo con ID ${id}:`, error);
      throw error;
    }
  }
};

/**
 * Función auxiliar para mapear la respuesta del backend al formato del frontend
 */
export const mapArticuloFromBackend = (articulo) => {
  if (!articulo) return null;

  return {
    id: articulo.id,
    nombre: articulo.nombre,
    cantidad: articulo.cantidad,
    dto: articulo.dto,
    precio: articulo.precio
  };
};

export default ArticulosService;