import { crearHashContrasena } from "@/server/autenticacion/contrasenas";
import {
  buscarUsuarioPorCorreo,
  crearUsuarioPersistido,
  sanitizarUsuario,
} from "@/server/persistencia/usuariosAdapter";
import {
  crearErrorServidor,
  leerJson,
  respuestaError,
} from "@/server/respuestas";
import {
  tieneErrores,
  validarRegistro,
} from "@/utils/validacionesAutenticacion";

export async function POST(request) {
  try {
    const body = await leerJson(request);
    const { datos, erroresCampos } = validarRegistro(body);

    if (tieneErrores(erroresCampos)) {
      throw crearErrorServidor(
        "DATOS_INVALIDOS",
        "Revisa los datos ingresados.",
        400,
        erroresCampos,
      );
    }

    if (await buscarUsuarioPorCorreo(datos.correo)) {
      throw crearErrorServidor(
        "CORREO_EN_USO",
        "Ya existe una cuenta con ese correo.",
        409,
      );
    }

    const usuario = await crearUsuarioPersistido({
      nombre: datos.nombre,
      correo: datos.correo,
      rol: "groomer",
      activo: true,
      hashContrasena: await crearHashContrasena(datos.contrasena),
    });

    return Response.json(
      {
        data: { usuario: sanitizarUsuario(usuario) },
        mensaje: "Cuenta creada correctamente.",
      },
      { status: 201 },
    );
  } catch (error) {
    return respuestaError(error);
  }
}
