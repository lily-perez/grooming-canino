"use client";

import { useState, useEffect } from "react";
import ClienteForm from "@/components/clientes/ClienteForm";
import TablaClientes from "@/components/clientes/TablaClientes";
import GestionPerros from "@/components/perros/GestionPerros";
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
  getPerrosByCliente,
  createPerro,
} from "@/services/clientesService";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [clienteEditar, setClienteEditar] = useState(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [perros, setPerros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  // Cargar lista de clientes al montar la página
  const cargarClientes = async () => {
    try {
      setLoading(true);
      const data = await getClientes();
      setClientes(data || []);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
      setMensaje({
        tipo: "error",
        texto: "No se pudieron obtener los clientes.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  // Cargar perros cuando se selecciona un cliente
  const handleSelectCliente = async (cliente) => {
    setClienteSeleccionado(cliente);
    try {
      const dataPerros = await getPerrosByCliente(cliente.id);
      setPerros(dataPerros || []);
    } catch (error) {
      console.error("Error al obtener perros:", error);
      setPerros([]);
    }
  };

  // Crear o actualizar cliente
  const handleSaveCliente = async (formData) => {
    try {
      if (clienteEditar) {
        await updateCliente(clienteEditar.id, formData);
        setMensaje({ tipo: "exito", texto: "Cliente actualizado correctamente." });
        setClienteEditar(null);
      } else {
        await createCliente(formData);
        setMensaje({ tipo: "exito", texto: "Cliente registrado exitosamente." });
      }
      await cargarClientes();
    } catch (error) {
      console.error("Error al guardar cliente:", error);
      setMensaje({
        tipo: "error",
        texto: error.mensaje || "Error al procesar la solicitud.",
      });
    }
  };

  // Eliminar cliente
  const handleDeleteCliente = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este cliente?")) return;
    try {
      await deleteCliente(id);
      setMensaje({ tipo: "exito", texto: "Cliente eliminado." });
      if (clienteSeleccionado?.id === id) {
        setClienteSeleccionado(null);
      }
      await cargarClientes();
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      setMensaje({ tipo: "error", texto: "Error al eliminar el cliente." });
    }
  };

  // Agregar perro a cliente
  const handleAddPerro = async (clienteId, perroData) => {
    try {
      await createPerro(clienteId, perroData);
      setMensaje({ tipo: "exito", texto: "Mascota agregada con éxito." });
      const dataPerros = await getPerrosByCliente(clienteId);
      setPerros(dataPerros || []);
    } catch (error) {
      console.error("Error al registrar perro:", error);
      setMensaje({ tipo: "error", texto: "Error al guardar la mascota." });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="border-b pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Clientes y Mascotas
          </h1>
          <p className="text-sm text-gray-600">
            Administra los dueños y la información de sus mascotas.
          </p>
        </div>
      </div>

      {mensaje && (
        <div
          className={`p-4 rounded-md ${
            mensaje.tipo === "exito"
              ? "bg-green-100 border border-green-400 text-green-700"
              : "bg-red-100 border border-red-400 text-red-700"
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario lateral de Cliente */}
        <div className="lg:col-span-1">
          <ClienteForm
            onSubmitSuccess={handleSaveCliente}
            clienteEditar={clienteEditar}
          />
        </div>

        {/* Tabla y panel de mascotas */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="text-center py-10 text-gray-500">
              Cargando clientes...
            </div>
          ) : (
            <TablaClientes
              clientes={clientes}
              onSelectCliente={handleSelectCliente}
              onEditCliente={(cliente) => setClienteEditar(cliente)}
              onDeleteCliente={handleDeleteCliente}
            />
          )}

          {/* Panel modal/inferior de mascotas asignadas */}
          {clienteSeleccionado && (
            <GestionPerros
              cliente={clienteSeleccionado}
              perros={perros}
              onAddPerro={handleAddPerro}
              onClose={() => setClienteSeleccionado(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}