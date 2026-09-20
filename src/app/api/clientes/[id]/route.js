import {
  requerirRol,
  requerirUsuarioAutenticado,
} from "@/server/autenticacion/autorizacion";
import {
  actualizarClientePersistido,
  obtenerClientePersistido,
} from "@/server/persistencia/clientesAdapter";
import { listarPerrosPersistidos } from "@/server/persistencia/perrosAdapter";
import {
  cargarContextoGroomer,
  clienteRelacionadoConGroomer,
} from "@/server/reglas/validarClientePerro";
import {
  crearErrorServidor,
  leerJson,
  respuestaError,
} from "@/server/respuestas";
import {
  tieneErroresCliente,
  validarCliente,
} from "@/utils/validacionesClientes";

async function obtenerClienteAutorizado(id, usuario) {
  const cliente = await obtenerClientePersistido(id);

  if (!cliente) {
    throw crearErrorServidor(
      "CLIENTE_NO_ENCONTRADO",
      "El cliente solicitado no existe.",
      404,
    );
  }

  if (usuario.rol === "administrador") {
    return cliente;
  }

  if (usuario.rol === "groomer") {
    const [perros, contexto] = await Promise.all([
      listarPerrosPersistidos(),
      cargarContextoGroomer(),
    ]);

    if (
      !clienteRelacionadoConGroomer(
        cliente,
        perros,
        contexto.citas,
        contexto.tareas,
        usuario.id,
      )
    ) {
      throw crearErrorServidor(
        "CLIENTE_NO_ENCONTRADO",
        "El cliente solicitado no existe.",
        404,
      );
    }

    return cliente;
  }

  throw crearErrorServidor(
    "ACCESO_DENEGADO",
    "No tienes permiso para consultar este cliente.",
    403,
  );
}

export async function GET(request, { params }) {
  try {
    const usuario = await requerirUsuarioAutenticado();
    const { id } = await params;
    const cliente = await obtenerClienteAutorizado(id, usuario);

    return Response.json({ data: cliente });
  } catch (error) {
    return respuestaError(error);
  }
}

export async function PUT(request, { params }) {
  try {
    await requerirRol("administrador");
    const { id } = await params;

    if (!(await obtenerClientePersistido(id))) {
      throw crearErrorServidor(
        "CLIENTE_NO_ENCONTRADO",
        "El cliente solicitado no existe.",
        404,
      );
    }

    const body = await leerJson(request);
    const { datos, erroresCampos } = validarCliente(body);

    if (tieneErroresCliente(erroresCampos)) {
      throw crearErrorServidor(
        "DATOS_INVALIDOS",
        "Revisa los datos ingresados.",
        400,
        erroresCampos,
      );
    }

    const cliente = await actualizarClientePersistido(id, datos);

    return Response.json({
      data: cliente,
      mensaje: "Cliente actualizado correctamente.",
    });
  } catch (error) {
    return respuestaError(error);
  }
}
