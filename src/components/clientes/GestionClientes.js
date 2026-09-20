"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ClienteForm from "@/components/clientes/ClienteForm";
import TablaClientes from "@/components/clientes/TablaClientes";
import EmptyState from "@/components/shared/EmptyState";
import { useClientes } from "@/hooks/useClientes";
import { usePerros } from "@/hooks/usePerros";
import { obtenerMensajeError } from "@/utils/errores";

export default function GestionClientes() {
  const {
    clientes,
    cargando,
    procesando,
    error,
    crearCliente,
    actualizarCliente,
    cambiarEstadoCliente,
  } = useClientes();
  const { perros, crearPerro } = usePerros();
  const [clienteEditar, setClienteEditar] = useState(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [nuevoPerroNombre, setNuevoPerroNombre] = useState("");

  const perrosDelCliente = useMemo(() => {
    if (!clienteSeleccionado) {
      return [];
    }

    return perros.filter(
      (perro) => String(perro.clienteId) === String(clienteSeleccionado.id),
    );
  }, [perros, clienteSeleccionado]);

  async function guardarCliente(formData) {
    setMensaje(null);

    if (clienteEditar) {
      await actualizarCliente(clienteEditar.id, formData);
      setMensaje({ tipo: "exito", texto: "Cliente actualizado correctamente." });
      setClienteEditar(null);
      return;
    }

    await crearCliente(formData);
    setMensaje({ tipo: "exito", texto: "Cliente registrado exitosamente." });
  }

  async function cambiarEstado(cliente) {
    if (
      cliente.activo &&
      !window.confirm("¿Deseas desactivar este cliente?")
    ) {
      return;
    }

    try {
      const actualizado = await cambiarEstadoCliente(cliente.id, !cliente.activo);
      setMensaje({
        tipo: "exito",
        texto: actualizado.activo
          ? "Cliente activado correctamente."
          : "Cliente desactivado correctamente.",
      });

      if (
        clienteSeleccionado &&
        String(clienteSeleccionado.id) === String(cliente.id)
      ) {
        setClienteSeleccionado(actualizado);
      }
    } catch (errorPeticion) {
      setMensaje({
        tipo: "error",
        texto: obtenerMensajeError(errorPeticion),
      });
    }
  }

  async function agregarPerro(event) {
    event.preventDefault();

    if (!clienteSeleccionado?.activo) {
      setMensaje({
        tipo: "error",
        texto: "Solo un cliente activo puede recibir un perro nuevo.",
      });
      return;
    }

    const nombre = nuevoPerroNombre.trim();

    if (!nombre) {
      setMensaje({
        tipo: "error",
        texto: "El nombre de la mascota es obligatorio.",
      });
      return;
    }

    try {
      await crearPerro({
        clienteId: clienteSeleccionado.id,
        nombre,
        raza: "",
        sexo: "",
        fechaNacimiento: "",
        observaciones: "",
      });
      setNuevoPerroNombre("");
      setMensaje({ tipo: "exito", texto: "Mascota agregada con éxito." });
    } catch (errorPeticion) {
      setMensaje({
        tipo: "error",
        texto: obtenerMensajeError(errorPeticion),
      });
    }
  }

  return (
    <div className="space-y-6">
      {mensaje ? (
        <div
          className={`rounded-md p-4 ${
            mensaje.tipo === "exito"
              ? "border border-green-400 bg-green-100 text-green-700"
              : "border border-red-400 bg-red-100 text-red-700"
          }`}
        >
          {mensaje.texto}
        </div>
      ) : null}

      {error && !mensaje ? (
        <div className="rounded-md border border-red-400 bg-red-100 p-4 text-red-700">
          {obtenerMensajeError(error)}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ClienteForm
            key={clienteEditar?.id || "nuevo"}
            clienteEditar={clienteEditar}
            onSubmitSuccess={guardarCliente}
            onCancelar={
              clienteEditar
                ? () => setClienteEditar(null)
                : undefined
            }
          />
        </div>

        <div className="space-y-6 lg:col-span-2">
          {cargando ? (
            <div className="py-10 text-center text-gray-500">
              Cargando clientes...
            </div>
          ) : (
            <TablaClientes
              clientes={clientes}
              clienteSeleccionadoId={clienteSeleccionado?.id}
              onSelectCliente={setClienteSeleccionado}
              onEditCliente={setClienteEditar}
              onCambiarEstado={cambiarEstado}
            />
          )}

          {clienteSeleccionado ? (
            <section className="space-y-4 rounded-lg bg-white p-6 shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Mascotas de {clienteSeleccionado.nombre}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {clienteSeleccionado.activo
                      ? "Puedes registrar un perro asociado a este cliente."
                      : "Activa el cliente para registrar un perro nuevo."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setClienteSeleccionado(null)}
                  className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700"
                >
                  Cerrar
                </button>
              </div>

              {perrosDelCliente.length === 0 ? (
                <EmptyState mensaje="Este cliente todavía no tiene perros registrados." />
              ) : (
                <ul className="space-y-2">
                  {perrosDelCliente.map((perro) => (
                    <li
                      key={perro.id}
                      className="flex items-center justify-between rounded-md border border-gray-200 px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{perro.nombre}</p>
                        <p className="text-sm text-gray-600">
                          {perro.raza || "Sin raza"} ·{" "}
                          {perro.activo ? "Activo" : "Inactivo"}
                        </p>
                      </div>
                      <Link
                        href={`/admin/perros/${perro.id}`}
                        className="text-sm font-medium text-blue-700 hover:text-blue-900"
                      >
                        Ver perro
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {clienteSeleccionado.activo ? (
                <form className="flex flex-col gap-3 sm:flex-row" onSubmit={agregarPerro}>
                  <input
                    type="text"
                    value={nuevoPerroNombre}
                    onChange={(event) => setNuevoPerroNombre(event.target.value)}
                    placeholder="Nombre de la mascota"
                    className="w-full rounded-md border border-gray-300 p-2 text-gray-900"
                  />
                  <button
                    type="submit"
                    disabled={procesando}
                    className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    Agregar mascota
                  </button>
                </form>
              ) : null}
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
