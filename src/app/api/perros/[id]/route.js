import {
  requerirRol,
  requerirUsuarioAutenticado,
} from "@/server/autenticacion/autorizacion";
import { obtenerClientePersistido } from "@/server/persistencia/clientesAdapter";
import {
  actualizarPerroPersistido,
  obtenerPerroPersistido,
} from "@/server/persistencia/perrosAdapter";
import {
  cargarContextoGroomer,
  perroRelacionadoConGroomer,
  validarClienteParaNuevoPerro,
} from "@/server/reglas/validarClientePerro";
import {
  crearErrorServidor,
  leerJson,
  respuestaError,
} from "@/server/respuestas";
import { tieneErroresPerro, validarPerro } from "@/utils/validacionesPerros";

async function obtenerPerroAutorizado(id, usuario) {
  const perro = await obtenerPerroPersistido(id);

  if (!perro) {
    throw crearErrorServidor(
      "PERRO_NO_ENCONTRADO",
      "El perro solicitado no existe.",
      404,
    );
  }

  if (usuario.rol === "administrador") {
    return perro;
  }

  if (usuario.rol === "groomer") {
    const contexto = await cargarContextoGroomer();

    if (
      !perroRelacionadoConGroomer(
        perro,
        contexto.citas,
        contexto.tareas,
        usuario.id,
      )
    ) {
      throw crearErrorServidor(
        "PERRO_NO_ENCONTRADO",
        "El perro solicitado no existe.",
        404,
      );
    }

    return perro;
  }

  throw crearErrorServidor(
    "ACCESO_DENEGADO",
    "No tienes permiso para consultar este perro.",
    403,
  );
}

export async function GET(request, { params }) {
  try {
    const usuario = await requerirUsuarioAutenticado();
    const { id } = await params;
    const perro = await obtenerPerroAutorizado(id, usuario);

    return Response.json({ data: perro });
  } catch (error) {
    return respuestaError(error);
  }
}

export async function PUT(request, { params }) {
  try {
    await requerirRol("administrador");
    const { id } = await params;
    const perroActual = await obtenerPerroPersistido(id);

    if (!perroActual) {
      throw crearErrorServidor(
        "PERRO_NO_ENCONTRADO",
        "El perro solicitado no existe.",
        404,
      );
    }

    const body = await leerJson(request);
    const { datos, erroresCampos } = validarPerro(body);

    if (tieneErroresPerro(erroresCampos)) {
      throw crearErrorServidor(
        "DATOS_INVALIDOS",
        "Revisa los datos ingresados.",
        400,
        erroresCampos,
      );
    }

    if (String(datos.clienteId) !== String(perroActual.clienteId)) {
      await validarClienteParaNuevoPerro(datos.clienteId);
    } else if (!(await obtenerClientePersistido(datos.clienteId))) {
      throw crearErrorServidor(
        "CLIENTE_NO_ENCONTRADO",
        "El cliente asociado no existe.",
        404,
        { clienteId: "El cliente no existe." },
      );
    }

    const perro = await actualizarPerroPersistido(id, datos);

    return Response.json({
      data: perro,
      mensaje: "Perro actualizado correctamente.",
    });
  } catch (error) {
    return respuestaError(error);
  }
}
