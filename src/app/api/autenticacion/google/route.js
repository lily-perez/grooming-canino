import { adminAuth, adminDb } from "@/config/firebaseAdmin";
import { crearSesion } from "@/server/autenticacion/sesion";
import { crearErrorServidor, leerJson, respuestaError } from "@/server/respuestas";

export async function POST(request) {
  try {
    const body = await leerJson(request);
    const idToken = String(body?.idToken ?? "").trim();

    if (!idToken) {
      throw crearErrorServidor(
        "TOKEN_REQUERIDO",
        "No se recibió el token de Google.",
        400,
      );
    }

    const token = await adminAuth.verifyIdToken(idToken);
    const uid = token.uid;

    const usuarioAuth = await adminAuth.getUser(uid);
    const referencia = adminDb.collection("usuarios").doc(uid);
    const snapshot = await referencia.get();

    let usuario;

    if (snapshot.exists) {
      const actual = snapshot.data();

      usuario = {
        id: uid,
        nombre:
          actual.nombre ||
          usuarioAuth.displayName ||
          usuarioAuth.email?.split("@")[0] ||
          "Usuario",
        correo: actual.correo || usuarioAuth.email || "",
        rol: actual.rol || "groomer",
        activo:
          typeof actual.activo === "boolean"
            ? actual.activo
            : true,
      };

      await referencia.set(
        {
          nombre: usuario.nombre,
          correo: usuario.correo,
          rol: usuario.rol,
          activo: usuario.activo,
        },
        { merge: true },
      );
    } else {
      usuario = {
        id: uid,
        nombre:
          usuarioAuth.displayName ||
          usuarioAuth.email?.split("@")[0] ||
          "Usuario",
        correo: usuarioAuth.email || "",
        rol: "groomer",
        activo: true,
      };

      await referencia.set({
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        activo: usuario.activo,
      });
    }

    if (usuario.activo !== true) {
      throw crearErrorServidor(
        "USUARIO_INACTIVO",
        "La cuenta se encuentra inactiva.",
        403,
      );
    }

    await crearSesion(uid);

    return Response.json({
      data: { usuario },
    });
  } catch (error) {
    return respuestaError(error);
  }
}