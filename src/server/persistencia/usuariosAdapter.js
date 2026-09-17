import { solicitarMockApi } from "@/server/persistencia/mockApiClient";
import { normalizarCorreo } from "@/utils/validacionesAutenticacion";

export function sanitizarUsuario(usuario) {
  if (!usuario) {
    return null;
  }

  const { id, nombre, correo, rol, activo } = usuario;
  return { id, nombre, correo, rol, activo };
}

export async function listarUsuariosPersistidos() {
  const usuarios = await solicitarMockApi("/usuarios");
  return Array.isArray(usuarios) ? usuarios : [];
}

export async function obtenerUsuarioPersistido(id) {
  return solicitarMockApi(`/usuarios/${encodeURIComponent(id)}`);
}

export async function buscarUsuarioPorCorreo(correo) {
  const correoNormalizado = normalizarCorreo(correo);
  const usuarios = await listarUsuariosPersistidos();

  return (
    usuarios.find(
      (usuario) => normalizarCorreo(usuario.correo) === correoNormalizado,
    ) || null
  );
}

export function crearUsuarioPersistido(usuario) {
  return solicitarMockApi("/usuarios", {
    method: "POST",
    body: JSON.stringify(usuario),
  });
}

export async function actualizarUsuarioPersistido(id, cambios) {
  const usuario = await obtenerUsuarioPersistido(id);

  if (!usuario) {
    return null;
  }

  return solicitarMockApi(`/usuarios/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify({ ...usuario, ...cambios, id: usuario.id }),
  });
}
