"use client";

import { useCallback, useEffect, useState } from "react";
import { clientesRepository } from "@/repositories/clientesRepository";

export function useClientes(filtrosIniciales) {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState(null);

  const cargarClientes = useCallback(async (filtros = filtrosIniciales) => {
    setCargando(true);
    setError(null);

    try {
      const datos = await clientesRepository.listar(filtros);
      setClientes(datos);
      return datos;
    } catch (errorPeticion) {
      setError(errorPeticion);
      throw errorPeticion;
    } finally {
      setCargando(false);
    }
  }, [filtrosIniciales]);

  useEffect(() => {
    let activo = true;

    clientesRepository
      .listar(filtrosIniciales)
      .then((datos) => {
        if (activo) {
          setClientes(datos);
        }
      })
      .catch((errorPeticion) => {
        if (activo) {
          setError(errorPeticion);
        }
      })
      .finally(() => {
        if (activo) {
          setCargando(false);
        }
      });

    return () => {
      activo = false;
    };
  }, [filtrosIniciales]);

  const crearCliente = useCallback(async (datos) => {
    setProcesando(true);
    setError(null);

    try {
      const nuevoCliente = await clientesRepository.crear(datos);

      if (!nuevoCliente?.id) {
        throw Object.assign(new Error("La API no devolvió el cliente creado."), {
          codigo: "ERROR_RESPUESTA",
        });
      }

      setClientes((actuales) => [...actuales, nuevoCliente]);
      return nuevoCliente;
    } catch (errorPeticion) {
      setError(errorPeticion);
      throw errorPeticion;
    } finally {
      setProcesando(false);
    }
  }, []);

  const actualizarCliente = useCallback(async (id, datos) => {
    setProcesando(true);
    setError(null);

    try {
      const clienteActualizado = await clientesRepository.actualizar(id, datos);
      setClientes((actuales) =>
        actuales.map((cliente) =>
          String(cliente.id) === String(id) ? clienteActualizado : cliente,
        ),
      );
      return clienteActualizado;
    } catch (errorPeticion) {
      setError(errorPeticion);
      throw errorPeticion;
    } finally {
      setProcesando(false);
    }
  }, []);

  const cambiarEstadoCliente = useCallback(async (id, activo) => {
    setProcesando(true);
    setError(null);

    try {
      const clienteActualizado = await clientesRepository.cambiarEstado(
        id,
        activo,
      );
      setClientes((actuales) =>
        actuales.map((cliente) =>
          String(cliente.id) === String(id) ? clienteActualizado : cliente,
        ),
      );
      return clienteActualizado;
    } catch (errorPeticion) {
      setError(errorPeticion);
      throw errorPeticion;
    } finally {
      setProcesando(false);
    }
  }, []);

  return {
    clientes,
    cargando,
    procesando,
    error,
    cargarClientes,
    crearCliente,
    actualizarCliente,
    cambiarEstadoCliente,
  };
}
