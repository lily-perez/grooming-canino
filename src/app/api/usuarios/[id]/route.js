import { requerirRol } from "@/server/autenticacion/autorizacion";
import {
  actualizarUsuarioPersistido,
  buscarUsuarioPorCorreo,
  obtenerUsuarioPersistido,
  sanitizarUsuario,
} from "@/server/persistencia/usuariosAdapter";
import {
  crearErrorServidor,
  leerJson,
  respuestaError,
} from "@/server/respuestas";
import {
  tieneErrores,
  validarActualizacionUsuario,
} from "@/utils/validacionesAutenticacion";

export async function GET(request, { params }) {
  try {
    await requerirRol("administrador");
    const { id } = await params;
    const usuario = await obtenerUsuarioPersistido(id);

    if (!usuario) {
      throw crearErrorServidor(
        "USUARIO_NO_ENCONTRADO",
        "El usuario solicitado no existe.",
        404,
      );
    }

    return Response.json({ data: sanitizarUsuario(usuario) });
  } catch (error) {
    return respuestaError(error);
  }
}

export async function PUT(request, { params }) {
  try {
    await requerirRol("administrador");
    const { id } = await params;
    const usuarioActual = await obtenerUsuarioPersistido(id);

    if (!usuarioActual) {
      throw crearErrorServidor(
        "USUARIO_NO_ENCONTRADO",
        "El usuario solicitado no existe.",
        404,
      );
    }

    const body = await leerJson(request);
    const { datos, erroresCampos } = validarActualizacionUsuario(body);

    if (tieneErrores(erroresCampos)) {
      throw crearErrorServidor(
        "DATOS_INVALIDOS",
        "Revisa los datos ingresados.",
        400,
        erroresCampos,
      );
    }

    const usuarioConCorreo = await buscarUsuarioPorCorreo(datos.correo);

    if (
      usuarioConCorreo &&
      String(usuarioConCorreo.id) !== String(usuarioActual.id)
    ) {
      throw crearErrorServidor(
        "CORREO_EN_USO",
        "Ya existe una cuenta con ese correo.",
        409,
      );
    }

    const usuario = await actualizarUsuarioPersistido(id, datos);

    return Response.json({
      data: sanitizarUsuario(usuario),
      mensaje: "Usuario actualizado correctamente.",
    });
  } catch (error) {
    return respuestaError(error);
  }
}
