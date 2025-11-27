/**
 * Servicio para gestionar las operaciones CRUD de clientes
 * mediante comunicación con el backend REST API.
 * 
 * Base URL: Asegúrate de configurar la URL correcta de tu backend
 */

const API_BASE_URL = 'http://localhost:8080/clientes';

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
 * Servicio de Cliente - Operaciones CRUD
 */
const ClienteService = {
  
  /**
   * Obtener todos los clientes
   * GET /clientes
   * @returns {Promise<Array>} Lista de clientes
   */
  listarClientes: async () => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al listar clientes:', error);
      throw error;
    }
  },

  /**
   * Obtener un cliente por ID
   * GET /clientes/{id}
   * @param {number} id - ID del cliente
   * @returns {Promise<Object>} Datos del cliente
   */
  obtenerClientePorId: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'GET',
        headers: getHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error al obtener cliente con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear un nuevo cliente
   * POST /clientes
   * @param {Object} clienteData - Datos del cliente a crear
   * @returns {Promise<Object>} Cliente creado
   */
  crearCliente: async (clienteData) => {
    try {
      // Mapear campos del frontend al formato esperado por el backend
      const requestBody = {
        nombre: clienteData.nombre,
        nif: clienteData.nif,
        direccion: clienteData.direccion || '',
        ciudad: clienteData.ciudad || '',
        codigoPostal: clienteData.codigo_postal || '',
        telefono: clienteData.telefono || '',
        email: clienteData.email || '',
        tipoCliente: clienteData.tipo_cliente || '',
        zona: clienteData.zona || '',
        representante: clienteData.representante || '',
        observaciones: clienteData.observaciones || ''
      };

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(requestBody)
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error al crear cliente:', error);
      throw error;
    }
  },

  /**
   * Actualizar un cliente existente
   * PUT /clientes/{id}
   * @param {number} id - ID del cliente a actualizar
   * @param {Object} clienteData - Datos actualizados del cliente
   * @returns {Promise<Object>} Cliente actualizado
   */
  actualizarCliente: async (id, clienteData) => {
    try {
      // Mapear campos (sin incluir 'nif' ya que no se actualiza según el backend)
      const requestBody = {
        nombre: clienteData.nombre,
        direccion: clienteData.direccion || '',
        ciudad: clienteData.ciudad || '',
        codigoPostal: clienteData.codigo_postal || '',
        telefono: clienteData.telefono || '',
        email: clienteData.email || '',
        tipoCliente: clienteData.tipo_cliente || '',
        zona: clienteData.zona || '',
        representante: clienteData.representante || '',
        observaciones: clienteData.observaciones || ''
      };

      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(requestBody)
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error al actualizar cliente con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar un cliente
   * DELETE /clientes/{id}
   * @param {number} id - ID del cliente a eliminar
   * @returns {Promise<void>}
   */
  eliminarCliente: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error al eliminar cliente con ID ${id}:`, error);
      throw error;
    }
  }
};

/**
 * Función auxiliar para mapear la respuesta del backend al formato del frontend
 * El backend devuelve camelCase, el frontend usa snake_case
 */
export const mapClienteFromBackend = (cliente) => {
  if (!cliente) return null;
  
  return {
    id: cliente.idCliente,
    nombre: cliente.nombre,
    nif: cliente.nif,
    direccion: cliente.direccion,
    ciudad: cliente.ciudad,
    codigo_postal: cliente.codigoPostal,
    telefono: cliente.telefono,
    email: cliente.email,
    tipo_cliente: cliente.tipoCliente,
    zona: cliente.zona,
    representante: cliente.representante,
    observaciones: cliente.observaciones
  };
};

export default ClienteService;