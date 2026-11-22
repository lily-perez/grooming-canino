import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function obtenerCredenciales() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey =
    process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Faltan FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL o FIREBASE_ADMIN_PRIVATE_KEY.",
    );
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  };
}

const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert(obtenerCredenciales()),
      });

const db = getFirestore(app);
const auth = getAuth(app);

function textoNormalizado(valor) {
  return String(valor ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

async function obtenerColeccion(nombre) {
  const snapshot = await db.collection(nombre).get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

async function asegurarServicios() {
  const serviciosBase = [
    {
      id: "servicio-bano-y-corte",
      nombre: "Baño y corte",
      descripcion: "Servicio completo de baño y corte.",
      duracionEstimadaMinutos: 60,
      activo: true,
    },
    {
      id: "servicio-corte",
      nombre: "Corte",
      descripcion: "Servicio de corte y arreglo del pelaje.",
      duracionEstimadaMinutos: 45,
      activo: true,
    },
    {
      id: "servicio-bano",
      nombre: "Baño",
      descripcion: "Servicio de baño y limpieza.",
      duracionEstimadaMinutos: 30,
      activo: true,
    },
  ];

  for (const servicio of serviciosBase) {
    const { id, ...datos } = servicio;

    await db
      .collection("servicios")
      .doc(id)
      .set(datos, { merge: true });

    console.log(`✓ Servicio: ${servicio.nombre}`);
  }
}

async function asegurarUsuarios() {
  const resultado = await auth.listUsers(1000);

  for (const usuarioAuth of resultado.users) {
    const referencia = db.collection("usuarios").doc(usuarioAuth.uid);
    const snapshot = await referencia.get();
    const actual = snapshot.exists ? snapshot.data() : {};

    let rol = actual?.rol;

    if (!rol) {
      rol = String(usuarioAuth.email ?? "")
        .toLowerCase()
        .startsWith("administrador")
        ? "administrador"
        : "groomer";
    }

    const datos = {
      correo: actual?.correo || usuarioAuth.email || "",
      nombre:
        actual?.nombre ||
        usuarioAuth.displayName ||
        usuarioAuth.email?.split("@")[0] ||
        "Usuario",
      rol,
      activo:
        typeof actual?.activo === "boolean"
          ? actual.activo
          : true,
    };

    await referencia.set(datos, { merge: true });

    console.log(`✓ Usuario: ${datos.correo} (${datos.rol})`);
  }
}

async function asegurarCliente(datosCliente) {
  const clientes = await obtenerColeccion("clientes");

  const encontrado = clientes.find(
    (cliente) =>
      textoNormalizado(cliente.nombre) ===
      textoNormalizado(datosCliente.nombre),
  );

  if (encontrado) {
    await db
      .collection("clientes")
      .doc(encontrado.id)
      .set(
        {
          telefono: encontrado.telefono || datosCliente.telefono || "",
          correo: encontrado.correo || datosCliente.correo || "",
          observaciones: encontrado.observaciones || "",
          activo:
            typeof encontrado.activo === "boolean"
              ? encontrado.activo
              : true,
        },
        { merge: true },
      );

    return encontrado.id;
  }

  const referencia = await db.collection("clientes").add({
    nombre: datosCliente.nombre,
    telefono: datosCliente.telefono || "",
    correo: datosCliente.correo || "",
    observaciones: "",
    activo: true,
  });

  console.log(`✓ Cliente creado: ${datosCliente.nombre}`);

  return referencia.id;
}

async function asegurarPerro(datosPerro) {
  const perros = await obtenerColeccion("perros");

  const encontrado = perros.find(
    (perro) =>
      String(perro.clienteId) === String(datosPerro.clienteId) &&
      textoNormalizado(perro.nombre) ===
        textoNormalizado(datosPerro.nombre),
  );

  if (encontrado) {
    await db
      .collection("perros")
      .doc(encontrado.id)
      .set(
        {
          raza: encontrado.raza || datosPerro.raza || "",
          sexo: encontrado.sexo || datosPerro.sexo || "",
          fechaNacimiento:
            encontrado.fechaNacimiento ||
            datosPerro.fechaNacimiento ||
            "",
          notas: encontrado.notas || "",
          observaciones:
            encontrado.observaciones ||
            encontrado.notas ||
            "",
          activo:
            typeof encontrado.activo === "boolean"
              ? encontrado.activo
              : true,
        },
        { merge: true },
      );

    return encontrado.id;
  }

  const referencia = await db.collection("perros").add({
    clienteId: datosPerro.clienteId,
    nombre: datosPerro.nombre,
    raza: datosPerro.raza || "",
    sexo: datosPerro.sexo || "",
    fechaNacimiento: datosPerro.fechaNacimiento || "",
    notas: "",
    observaciones: "",
    activo: true,
  });

  console.log(`✓ Perro creado: ${datosPerro.nombre}`);

  return referencia.id;
}

async function asegurarDatosDemo() {
  const anaId = await asegurarCliente({
    nombre: "Ana Martinez",
    telefono: "",
    correo: "",
  });

  await asegurarPerro({
    clienteId: anaId,
    nombre: "Luna",
    raza: "Poodle",
    sexo: "",
    fechaNacimiento: "",
  });

  await asegurarPerro({
    clienteId: anaId,
    nombre: "Max",
    raza: "Golden Retriever",
    sexo: "",
    fechaNacimiento: "",
  });

  const carlosId = await asegurarCliente({
    nombre: "Carlos Hernández",
    telefono: "",
    correo: "",
  });

  await asegurarPerro({
    clienteId: carlosId,
    nombre: "Rocky",
    raza: "Schnauzer",
    sexo: "",
    fechaNacimiento: "",
  });
}

function buscarPorNombre(lista, nombre) {
  const objetivo = textoNormalizado(nombre);

  return lista.find(
    (elemento) =>
      textoNormalizado(elemento.nombre) === objetivo,
  );
}

async function normalizarCitas() {
  const [citas, perros, servicios] = await Promise.all([
    obtenerColeccion("citas"),
    obtenerColeccion("perros"),
    obtenerColeccion("servicios"),
  ]);

  for (const cita of citas) {
    const cambios = {};

    if (!cita.perroId && cita.perro) {
      const perro = buscarPorNombre(perros, cita.perro);

      if (perro) {
        cambios.perroId = perro.id;
      }
    }

    if (
      (!Array.isArray(cita.servicioIds) ||
        cita.servicioIds.length === 0) &&
      cita.servicio
    ) {
      const servicio = buscarPorNombre(
        servicios,
        cita.servicio,
      );

      if (servicio) {
        cambios.servicioIds = [servicio.id];
      } else {
        const partes = String(cita.servicio)
          .split(/\s+y\s+/i)
          .map((parte) => parte.trim())
          .filter(Boolean);

        const ids = partes
          .map((parte) => buscarPorNombre(servicios, parte)?.id)
          .filter(Boolean);

        if (ids.length > 0) {
          cambios.servicioIds = ids;
        }
      }
    }

    if (!cita.horaFinEstimada && cita.horaFin) {
      cambios.horaFinEstimada = cita.horaFin;
    }

    if (Object.keys(cambios).length > 0) {
      await db
        .collection("citas")
        .doc(cita.id)
        .set(cambios, { merge: true });

      console.log(`✓ Cita normalizada: ${cita.id}`);
    }
  }
}

async function normalizarTareas() {
  const [tareas, servicios] = await Promise.all([
    obtenerColeccion("tareas"),
    obtenerColeccion("servicios"),
  ]);

  for (const tarea of tareas) {
    const cambios = {};

    if (!tarea.groomerId && tarea.groomerUid) {
      cambios.groomerId = tarea.groomerUid;
    }

    if (!tarea.servicioId && tarea.servicio) {
      const servicio = buscarPorNombre(
        servicios,
        tarea.servicio,
      );

      if (servicio) {
        cambios.servicioId = servicio.id;
      }
    }

    if (Object.keys(cambios).length > 0) {
      await db
        .collection("tareas")
        .doc(tarea.id)
        .set(cambios, { merge: true });

      console.log(`✓ Tarea normalizada: ${tarea.id}`);
    }
  }
}

async function ejecutar() {
  console.log("");
  console.log("=== Normalización Firestore Grooming Canino ===");
  console.log("");

  await asegurarServicios();
  await asegurarUsuarios();
  await asegurarDatosDemo();
  await normalizarCitas();
  await normalizarTareas();

  console.log("");
  console.log("=== NORMALIZACIÓN COMPLETADA ===");
  console.log("");
}

ejecutar().catch((error) => {
  console.error("");
  console.error("ERROR:", error);
  process.exit(1);
});