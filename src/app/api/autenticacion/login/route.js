import { verificarContrasena } from "@/server/autenticacion/contrasenas";
import { crearSesion } from "@/server/autenticacion/sesion";
import {
  buscarUsuarioPorCorreo,
  sanitizarUsuario,
} from "@/server/persistencia/usuariosAdapter";
import {
  crearErrorServidor,
  leerJson,
  respuestaError,
} from "@/server/respuestas";
import {
  tieneErrores,
  validarLogin,
} from "@/utils/validacionesAutenticacion";

export async function POST(request) {
  try {
    const body = await leerJson(request);
    const { datos, erroresCampos } = validarLogin(body);

    if (tieneErrores(erroresCampos)) {
      throw crearErrorServidor(
        "DATOS_INVALIDOS",
        "Revisa los datos ingresados.",
        400,
        erroresCampos,
      );
    }

    const usuario = await buscarUsuarioPorCorreo(datos.correo);
    const credencialesValidas =
      usuario &&
      (await verificarContrasena(
        datos.contrasena,
        usuario.hashContrasena,
      ));

    if (!credencialesValidas) {
      throw crearErrorServidor(
        "CREDENCIALES_INVALIDAS",
        "Correo o contraseña incorrectos.",
        401,
      );
    }

    if (usuario.activo !== true) {
      throw crearErrorServidor(
        "USUARIO_INACTIVO",
        "La cuenta se encuentra inactiva.",
        403,
      );
    }

    await crearSesion(usuario.id);

    return Response.json({
      data: { usuario: sanitizarUsuario(usuario) },
    });
  } catch (error) {
    return respuestaError(error);
  }
}
