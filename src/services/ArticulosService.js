/**
 * Servicio para gestionar las operaciones CRUD de artículos
 * mediante comunicación con el backend REST API.
 */

const API_BASE_URL = '/api/v1/articulos';

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
   * Crear un nuevo artículo
   * Alineado con el constructor de Articulo.java
   */
  create: async (articuloData) => {
    try {
      const requestBody = {
        nombre: articuloData.nombre,
        situacion: articuloData.situacion || 'ACTIVO',
        pvpMinimo: parseFloat(articuloData.pvpMinimo) || 0,
        pesoKg: parseFloat(articuloData.pesoKg) || 0,
        altoCm: parseFloat(articuloData.altoCm) || 0,
        anchoCm: parseFloat(articuloData.anchoCm) || 0,
        largoCm: parseFloat(articuloData.largoCm) || 0,
        vendible: articuloData.vendible ?? true
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
   */
  update: async (id, articuloData) => {
    try {
      const requestBody = {
        nombre: articuloData.nombre,
        situacion: articuloData.situacion,
        pvpMinimo: parseFloat(articuloData.pvpMinimo),
        pesoKg: parseFloat(articuloData.pesoKg),
        altoCm: parseFloat(articuloData.altoCm),
        anchoCm: parseFloat(articuloData.anchoCm),
        largoCm: parseFloat(articuloData.largoCm),
        vendible: articuloData.vendible
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
 * Mapeo exacto basado en Articulo.java
 * Aquí es donde conviertes lo que viene del back a lo que usa el front
 */
export const mapArticuloFromBackend = (articulo) => {
  if (!articulo) return null;

  return {
    id: articulo.id,
    nombre: articulo.nombre,
    situacion: articulo.situacion,
    pvpMinimo: articulo.pvpMinimo || 0,
    pesoKg: articulo.pesoKg || 0,
    altoCm: articulo.altoCm || 0,
    anchoCm: articulo.anchoCm || 0,
    largoCm: articulo.largoCm || 0,
    vendible: articulo.vendible ?? true
  };
};

export default ArticulosService;