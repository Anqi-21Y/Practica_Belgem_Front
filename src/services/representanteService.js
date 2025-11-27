/**
 * Servicio para gestionar las operaciones CRUD de representantes
 * mediante comunicación con el backend REST API.
 */

const API_BASE_URL = 'http://localhost:8080/representantes';

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

  if (response.status === 204) return null;
  return response.json();
};

/**
 * Convierte datos de FRONT → BACKEND
 */
const mapToBackend = (data) => ({
  name: data.nombre,
  phone: data.telefono || '',
  email: data.email || '',
  zone: data.zona || '',
  internalCode: data.codigoInterno || data.codigo_interno,
  commission: parseFloat(data.comision) || 0
});

/**
 * Convierte datos del BACKEND → FRONT
 */
const mapRepresentanteFromBackend = (rep) => ({
  id: rep.id,
  codigo_interno: rep.internalCode,
  nombre: rep.name,
  telefono: rep.phone,
  email: rep.email,
  zona: rep.zone,
  comision: rep.commission
});

/**
 * Servicio de Representante - Operaciones CRUD
 */
const RepresentanteService = {

  /** GET /representantes */
  listarRepresentantes: async () => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders()
      });

      const data = await handleResponse(response);
      return data.map(mapRepresentanteFromBackend);

    } catch (error) {
      console.error('Error al listar representantes:', error);
      throw error;
    }
  },

  /** GET /representantes/{id} */
  obtenerRepresentantePorId: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'GET',
        headers: getHeaders()
      });

      const data = await handleResponse(response);
      return mapRepresentanteFromBackend(data);

    } catch (error) {
      console.error(`Error al obtener representante ${id}:`, error);
      throw error;
    }
  },

  /** POST /representantes */
  crearRepresentante: async (representanteData) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(mapToBackend(representanteData))
      });

      const data = await handleResponse(response);
      return mapRepresentanteFromBackend(data);

    } catch (error) {
      console.error('Error al crear representante:', error);
      throw error;
    }
  },

  /** PUT /representantes/{id} */
  actualizarRepresentante: async (id, representanteData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(mapToBackend(representanteData))
      });

      const data = await handleResponse(response);
      return mapRepresentanteFromBackend(data);

    } catch (error) {
      console.error(`Error al actualizar representante ${id}:`, error);
      throw error;
    }
  },

  /** DELETE /representantes/{id} */
  eliminarRepresentante: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      return await handleResponse(response);

    } catch (error) {
      console.error(`Error al eliminar representante ${id}:`, error);
      throw error;
    }
  }
};

export default RepresentanteService;
