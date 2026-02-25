/**
 * Servicio para gestionar las operaciones CRUD de representantes
 * mediante comunicación con el backend REST API.
 */

const API_BASE_URL = 'http://localhost:8080/api/representantes'; // ⬅️ RUTA CORRECTA

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
 * Servicio de Representante - Operaciones CRUD
 */
const RepresentanteService = {
  
  /**
   * Obtener todos los representantes
   * GET /representantes
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
   */
  crearRepresentante: async (representanteData) => {
    try {
      const requestBody = {
        name: representanteData.nombre,
        phone: representanteData.telefono || '',
        email: representanteData.email || '',
        zone: representanteData.zona || '',
        internalCode: representanteData.codigo_interno,
        commission: parseFloat(representanteData.comision) || 0
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
   */
  actualizarRepresentante: async (id, representanteData) => {
    try {
      const requestBody = {
        name: representanteData.nombre,
        phone: representanteData.telefono || '',
        email: representanteData.email || '',
        zone: representanteData.zona || '',
        internalCode: representanteData.codigo_interno,
        commission: parseFloat(representanteData.comision) || 0
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

/**
 * Función auxiliar para mapear la respuesta del backend al formato del frontend
 */
export const mapRepresentanteFromBackend = (representante) => {
  if (!representante) return null;
  
  return {
    id: representante.id, // ID de la base de datos
    nombre: representante.name,
    telefono: representante.phone,
    email: representante.email,
    zona: representante.zone,
    codigo_interno: representante.internalCode,
    comision: representante.commission?.toString() || '0'
  };
};

export default RepresentanteService;