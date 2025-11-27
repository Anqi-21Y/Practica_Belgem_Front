// services/DivisasService.js

const API_BASE_URL = 'http://localhost:8080/divisas';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json'
});

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

const DivisasService = {
  listarDivisas: async () => {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: getHeaders()
    });
    return await handleResponse(response);
  },

  obtenerDivisaPorId: async (id) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return await handleResponse(response);
  },

  crearDivisa: async (divisaData) => {
    const requestBody = {
      code: divisaData.code,
      name: divisaData.name
    };

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(requestBody)
    });
    
    return await handleResponse(response);
  },

  actualizarDivisa: async (id, divisaData) => {
    const requestBody = {
      code: divisaData.code,
      name: divisaData.name
    };

    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(requestBody)
    });
    
    return await handleResponse(response);
  },

  eliminarDivisa: async (id) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    return await handleResponse(response);
  }
};

// Mapeo de respuesta del backend a formato frontend
export const mapDivisaFromBackend = (divisa) => {
  if (!divisa) return null;
  
  return {
    id: divisa.id,
    code: divisa.code,
    name: divisa.name
  };
};

export default DivisasService;