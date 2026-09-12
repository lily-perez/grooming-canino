"use client";

import { useState } from "react";
import Button from "@/components/shared/Button";
import EmptyState from "@/components/shared/EmptyState";
import ErrorMessage from "@/components/shared/ErrorMessage";
import Input from "@/components/shared/Input";
import Loading from "@/components/shared/Loading";
import { useUsuarios } from "@/hooks/useUsuarios";
import {
  tieneErrores,
  validarActualizacionUsuario,
} from "@/utils/validacionesAutenticacion";

export default function GestionUsuarios() {
  const {
    usuarios,
    cargando,
    error: errorCarga,
    cargarUsuarios,
    actualizarUsuario,
    cambiarEstado,
  } = useUsuarios();
  const [editando, setEditando] = useState(null);
  const [formulario, setFormulario] = useState(null);
  const [erroresCampos, setErroresCampos] = useState({});
  const [errorOperacion, setErrorOperacion] = useState(null);
  const [guardando, setGuardando] = useState(false);

  function iniciarEdicion(usuario) {
    setEditando(usuario.id);
    setFormulario({
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
    });
    setErroresCampos({});
    setErrorOperacion(null);
  }

  function actualizarCampo(event) {
    const { name, value } = event.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
  }

  async function guardar(event) {
    event.preventDefault();
    const validacion = validarActualizacionUsuario(formulario);
    setErroresCampos(validacion.erroresCampos);
    setErrorOperacion(null);

    if (tieneErrores(validacion.erroresCampos)) {
      return;
    }

    setGuardando(true);

    try {
      await actualizarUsuario(editando, validacion.datos);
      setEditando(null);
      setFormulario(null);
    } catch (errorPeticion) {
      setErroresCampos(errorPeticion.erroresCampos || {});
      setErrorOperacion(errorPeticion);
    } finally {
      setGuardando(false);
    }
  }

  async function alternarEstado(usuario) {
    if (
      usuario.activo &&
      !window.confirm("¿Deseas desactivar este usuario?")
    ) {
      return;
    }

    setErrorOperacion(null);
    setGuardando(true);

    try {
      await cambiarEstado(usuario.id, !usuario.activo);
    } catch (errorPeticion) {
      setErrorOperacion(errorPeticion);
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return <Loading mensaje="Cargando usuarios..." />;
  }

  if (errorCarga) {
    return (
      <div className="space-y-4">
        <ErrorMessage mensaje={errorCarga.mensaje} />
        <Button onClick={cargarUsuarios}>Intentar nuevamente</Button>
      </div>
    );
  }

  if (usuarios.length === 0) {
    return <EmptyState mensaje="No hay usuarios registrados." />;
  }

  return (
    <div className="space-y-6">
      <ErrorMessage mensaje={errorOperacion?.mensaje} />

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3 font-semibold">Nombre</th>
              <th className="px-4 py-3 font-semibold">Correo</th>
              <th className="px-4 py-3 font-semibold">Rol</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
              <th className="px-4 py-3 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="border-t border-slate-200">
                <td className="px-4 py-3">{usuario.nombre}</td>
                <td className="px-4 py-3">{usuario.correo}</td>
                <td className="px-4 py-3">{usuario.rol}</td>
                <td className="px-4 py-3">
                  {usuario.activo ? "Activo" : "Inactivo"}
                </td>
                <td className="space-x-3 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => iniciarEdicion(usuario)}
                    className="font-medium text-sky-700 hover:text-sky-900"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => alternarEstado(usuario)}
                    disabled={guardando}
                    className="font-medium text-slate-700 hover:text-slate-900 disabled:text-slate-400"
                  >
                    {usuario.activo ? "Desactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editando && formulario ? (
        <form
          onSubmit={guardar}
          className="max-w-xl space-y-4 rounded-xl border border-slate-200 bg-white p-5"
        >
          <h2 className="text-xl font-semibold text-slate-900">
            Editar usuario
          </h2>
          <Input
            label="Nombre"
            name="nombre"
            value={formulario.nombre}
            onChange={actualizarCampo}
            error={erroresCampos.nombre}
          />
          <Input
            label="Correo"
            name="correo"
            type="email"
            value={formulario.correo}
            onChange={actualizarCampo}
            error={erroresCampos.correo}
          />
          <div className="space-y-1">
            <label
              htmlFor="rol"
              className="block text-sm font-medium text-slate-700"
            >
              Rol
            </label>
            <select
              id="rol"
              name="rol"
              value={formulario.rol}
              onChange={actualizarCampo}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="administrador">Administrador</option>
              <option value="groomer">Groomer</option>
            </select>
            {erroresCampos.rol ? (
              <p className="text-sm text-red-700">{erroresCampos.rol}</p>
            ) : null}
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar"}
            </Button>
            <button
              type="button"
              onClick={() => setEditando(null)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
