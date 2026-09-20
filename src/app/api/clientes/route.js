import {
  requerirRol,
} from "@/server/autenticacion/autorizacion";
import {
  crearClientePersistido,
  listarClientesPersistidos,
} from "@/server/persistencia/clientesAdapter";
import {
  crearErrorServidor,
  leerJson,
  respuestaError,
} from "@/server/respuestas";
import {
  tieneErroresCliente,
  validarCliente,
} from "@/utils/validacionesClientes";

export async function GET(request) {
  try {
    await requerirRol("administrador");
    const { searchParams } = new URL(request.url);
    const filtroActivo = searchParams.get("activo");
    let clientes = await listarClientesPersistidos();

    if (filtroActivo === "true") {
      clientes = clientes.filter((cliente) => cliente.activo);
    } else if (filtroActivo === "false") {
      clientes = clientes.filter((cliente) => !cliente.activo);
    }

    return Response.json({ data: clientes });
  } catch (error) {
    return respuestaError(error);
  }
}

export async function POST(request) {
  try {
    await requerirRol("administrador");
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

    const cliente = await crearClientePersistido({
      ...datos,
      activo: true,
    });

    return Response.json(
      {
        data: cliente,
        mensaje: "Cliente creado correctamente.",
      },
      { status: 201 },
    );
  } catch (error) {
    return respuestaError(error);
  }
}
