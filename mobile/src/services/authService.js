import { ErrorApi, apiGet, apiPost } from './apiClient';

export async function iniciarSesionApi(correo, contrasena) {
  const data = await apiPost('/api/autenticacion/login', {
    correo,
    contrasena,
  });
  return data?.usuario ?? null;
}

export async function obtenerUsuarioActual() {
  try {
    const data = await apiGet('/api/autenticacion/usuario-actual');
    return data?.usuario ?? data ?? null;
  } catch (error) {
    if (error instanceof ErrorApi && error.status === 401) {
      return null;
    }
    throw error;
  }
}

export async function cerrarSesionApi() {
  try {
    await apiPost('/api/autenticacion/cerrar-sesion');
  } catch {
    // si falla, igual se limpia la sesión local
  }
}