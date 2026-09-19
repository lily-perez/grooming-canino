"use client";

import { useState } from "react";

export default function ClienteForm({ onSubmitSuccess, clienteEditar = null }) {
  const [formData, setFormData] = useState({
    nombre: clienteEditar?.nombre || "",
    telefono: clienteEditar?.telefono || "",
    email: clienteEditar?.email || "",
    direccion: clienteEditar?.direccion || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.nombre || !formData.telefono) {
      setError("El nombre y el teléfono son campos obligatorios.");
      return;
    }

    try {
      setLoading(true);
      if (onSubmitSuccess) {
        await onSubmitSuccess(formData);
      }
      setFormData({ nombre: "", telefono: "", email: "", direccion: "" });
    } catch (err) {
      setError(err.mensaje || "Ocurrió un error al guardar el cliente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-bold text-gray-800">
        {clienteEditar ? "Editar Cliente" : "Registrar Nuevo Cliente"}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre Completo *</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          placeholder="Ej. Carlos Mendoza"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Teléfono *</label>
        <input
          type="text"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          placeholder="Ej. 7788-9900"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          placeholder="correo@ejemplo.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Dirección</label>
        <textarea
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          rows="2"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          placeholder="Dirección de residencia"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
      >
        {loading ? "Guardando..." : clienteEditar ? "Actualizar Cliente" : "Guardar Cliente"}
      </button>
    </form>
  );
}