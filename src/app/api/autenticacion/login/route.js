import { adminAuth } from "@/config/firebaseAdmin";
import { crearSesion } from "@/server/autenticacion/sesion";
import {
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
  validarLogin,
} from "@/utils/validacionesAutenticacion";

async function autenticarConFirebase(correo, contrasena) {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!apiKey) {
    throw crearErrorServidor(
      "CONFIGURACION_INCOMPLETA",
      "Firebase Authentication no está configurado.",
      500,
    );
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: correo,
        password: contrasena,
        returnSecureToken: true,
      }),
    },
  );

  if (!response.ok) {
    throw crearErrorServidor(
      "CREDENCIALES_INVALIDAS",
      "Correo o contraseña incorrectos.",
      401,
    );
  }

  return response.json();
}

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

    const autenticacion = await autenticarConFirebase(
      datos.correo,
      datos.contrasena,
    );

    const tokenDecodificado = await adminAuth.verifyIdToken(
      autenticacion.idToken,
    );

    const usuario = await obtenerUsuarioPersistido(tokenDecodificado.uid);

    if (!usuario) {
      throw crearErrorServidor(
        "PERFIL_NO_ENCONTRADO",
        "No existe un perfil asociado a esta cuenta.",
        403,
      );
    }

    if (usuario.activo !== true) {
      throw crearErrorServidor(
        "USUARIO_INACTIVO",
        "La cuenta se encuentra inactiva.",
        403,
      );
    }

    await crearSesion(tokenDecodificado.uid);

    return Response.json({
      data: {
        usuario: sanitizarUsuario(usuario),
      },
    });
  } catch (error) {
    return respuestaError(error);
  }
}