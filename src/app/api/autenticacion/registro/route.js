import { adminAuth } from "@/config/firebaseAdmin";
import { crearUsuarioPersistido } from "@/server/persistencia/usuariosAdapter";
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
  let usuarioFirebase = null;

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

    try {
      usuarioFirebase = await adminAuth.createUser({
        email: datos.correo,
        password: datos.contrasena,
        displayName: datos.nombre,
      });
    } catch (errorFirebase) {
      if (errorFirebase?.code === "auth/email-already-exists") {
        throw crearErrorServidor(
          "CORREO_EN_USO",
          "Ya existe una cuenta con ese correo.",
          409,
        );
      }

      throw errorFirebase;
    }

    const usuario = await crearUsuarioPersistido({
      id: usuarioFirebase.uid,
      nombre: datos.nombre,
      correo: datos.correo,
      rol: "groomer",
      activo: true,
    });

    return Response.json(
      {
        data: { usuario },
        mensaje: "Cuenta creada correctamente.",
      },
      { status: 201 },
    );
  } catch (error) {
    if (usuarioFirebase?.uid) {
      try {
        await adminAuth.deleteUser(usuarioFirebase.uid);
      } catch (errorRollback) {
        console.error(
          "No fue posible revertir el usuario de Firebase Auth:",
          errorRollback,
        );
      }
    }

    return respuestaError(error);
  }
}