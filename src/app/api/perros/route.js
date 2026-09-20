import {
  requerirRol,
  requerirUsuarioAutenticado,
} from "@/server/autenticacion/autorizacion";
import {
  crearPerroPersistido,
  listarPerrosPersistidos,
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

export async function GET(request) {
  try {
    const usuario = await requerirUsuarioAutenticado();
    const { searchParams } = new URL(request.url);
    const clienteId = searchParams.get("clienteId");
    const filtroActivo = searchParams.get("activo");
    let perros = await listarPerrosPersistidos();

    if (usuario.rol === "groomer") {
      const contexto = await cargarContextoGroomer();
      perros = perros.filter((perro) =>
        perroRelacionadoConGroomer(
          perro,
          contexto.citas,
          contexto.tareas,
          usuario.id,
        ),
      );
    } else if (usuario.rol !== "administrador") {
      throw crearErrorServidor(
        "ACCESO_DENEGADO",
        "No tienes permiso para consultar perros.",
        403,
      );
    }

    if (clienteId) {
      perros = perros.filter(
        (perro) => String(perro.clienteId) === String(clienteId),
      );
    }

    if (filtroActivo === "true") {
      perros = perros.filter((perro) => perro.activo);
    } else if (filtroActivo === "false") {
      perros = perros.filter((perro) => !perro.activo);
    }

    return Response.json({ data: perros });
  } catch (error) {
    return respuestaError(error);
  }
}

export async function POST(request) {
  try {
    await requerirRol("administrador");
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

    await validarClienteParaNuevoPerro(datos.clienteId);

    const perro = await crearPerroPersistido({
      ...datos,
      activo: true,
    });

    return Response.json(
      {
        data: perro,
        mensaje: "Perro creado correctamente.",
      },
      { status: 201 },
    );
  } catch (error) {
    return respuestaError(error);
  }
}
