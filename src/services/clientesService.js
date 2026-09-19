import { apiClient } from "@/services/apiClient";

// --- SERVICIOS DE CLIENTES ---

// Obtener la lista completa de clientes
export const getClientes = async () => {
  return await apiClient.get("/api/clientes");
};

// Crear un nuevo cliente
export const createCliente = async (clienteData) => {
  return await apiClient.post("/api/clientes", clienteData);
};

// Actualizar información de un cliente existente
export const updateCliente = async (id, clienteData) => {
  return await apiClient.put(`/api/clientes/${id}`, clienteData);
};

// Eliminar un cliente
export const deleteCliente = async (id) => {
  return await apiClient.delete(`/api/clientes/${id}`);
};

// --- SERVICIOS DE PERROS / MASCOTAS ---

// Obtener todos los perros asociados a un cliente específico
export const getPerrosByCliente = async (clienteId) => {
  return await apiClient.get(`/api/clientes/${clienteId}/perros`);
};

// Registrar una nueva mascota a un cliente
export const createPerro = async (clienteId, perroData) => {
  return await apiClient.post(`/api/clientes/${clienteId}/perros`, perroData);
};

// Actualizar datos de una mascota
export const updatePerro = async (clienteId, perroId, perroData) => {
  return await apiClient.put(`/api/clientes/${clienteId}/perros/${perroId}`, perroData);
};

// Eliminar una mascota
export const deletePerro = async (clienteId, perroId) => {
  return await apiClient.delete(`/api/clientes/${clienteId}/perros/${perroId}`);
};